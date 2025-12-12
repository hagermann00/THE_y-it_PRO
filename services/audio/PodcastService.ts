import { LLMClient } from "../core/LLMClient";
import { Book, Chapter } from "../../types";
import { VoiceId, PodcastSettings, VOICES } from "./VoiceConfig";

export interface AudioSegment {
    type: 'intro' | 'chapter' | 'posibot' | 'transition' | 'outro';
    chapterNumber?: number;
    text: string;
    voice: VoiceId;
    audioData?: string; // base64
}

export interface PodcastResult {
    segments: AudioSegment[];
    totalDuration?: number;
    fullAudioData?: string; // Combined base64
}

export class PodcastService {
    private static llm = LLMClient.getInstance();

    /**
     * Generate full podcast from book
     */
    public static async generatePodcast(
        book: Book,
        settings: PodcastSettings,
        onProgress?: (progress: number, status: string) => void
    ): Promise<PodcastResult> {
        const segments: AudioSegment[] = [];

        // Build segment list based on tier
        if (settings.includeIntro) {
            segments.push({
                type: 'intro',
                text: this.generateIntroScript(book, settings),
                voice: settings.primaryVoice,
            });
        }

        // Add chapters
        for (let i = 0; i < book.chapters.length; i++) {
            const chapter = book.chapters[i];

            // Chapter transition
            if (settings.includeChapterBreaks && i > 0) {
                segments.push({
                    type: 'transition',
                    chapterNumber: chapter.number,
                    text: `Chapter ${chapter.number}: ${chapter.title}`,
                    voice: settings.primaryVoice,
                });
            }

            // Main chapter content
            segments.push({
                type: 'chapter',
                chapterNumber: chapter.number,
                text: this.cleanMarkdown(chapter.content),
                voice: settings.tier === 'BASIC' ? settings.primaryVoice :
                    (i % 2 === 0 ? settings.primaryVoice : settings.secondaryVoice || settings.primaryVoice),
            });

            // PosiBot quotes
            if (settings.includePosiBotQuotes && chapter.posiBotQuotes && settings.posiBotVoice) {
                for (const quote of chapter.posiBotQuotes) {
                    segments.push({
                        type: 'posibot',
                        chapterNumber: chapter.number,
                        text: `PosiBot says: ${quote.text}`,
                        voice: settings.posiBotVoice,
                    });
                }
            }
        }

        if (settings.includeOutro) {
            segments.push({
                type: 'outro',
                text: this.generateOutroScript(book),
                voice: settings.primaryVoice,
            });
        }

        // Generate audio for each segment
        const totalSegments = segments.length;
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            onProgress?.(Math.round((i / totalSegments) * 100), `Generating ${segment.type}...`);

            try {
                segment.audioData = await this.textToSpeech(segment.text, segment.voice, settings.speed);
            } catch (e) {
                console.error(`Failed to generate audio for segment ${i}:`, e);
                // Continue with other segments
            }
        }

        onProgress?.(100, 'Complete');

        return { segments };
    }

    /**
     * Generate single segment audio (for preview/testing)
     */
    public static async generatePreview(
        text: string,
        voice: VoiceId,
        speed: number = 1.0
    ): Promise<string> {
        return this.textToSpeech(text.slice(0, 500), voice, speed); // Limit preview length
    }

    /**
     * Core text-to-speech using Gemini
     */
    private static async textToSpeech(
        text: string,
        voice: VoiceId,
        speed: number
    ): Promise<string> {
        const client = this.llm.getClient();

        const response = await this.llm.generateContentWithRetry({
            model: 'gemini-2.5-flash',
            contents: text,
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: voice,
                        },
                    },
                },
            },
        });

        // Extract audio data from response
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/')) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }

        throw new Error('No audio data in response');
    }

    /**
     * Generate intro script
     */
    private static generateIntroScript(book: Book, settings: PodcastSettings): string {
        return `Welcome to the Y-It Podcast. Today we're diving into "${book.title}": ${book.subtitle}. 
    This is your no-BS guide to understanding the reality behind the hype. Let's get started.`;
    }

    /**
     * Generate outro script
     */
    private static generateOutroScript(book: Book): string {
        return `That wraps up "${book.title}". Remember: knowledge is power, but only if you use it. 
    Thanks for listening to the Y-It Podcast. Stay skeptical, stay smart.`;
    }

    /**
     * Clean markdown for speech
     */
    private static cleanMarkdown(text: string): string {
        return text
            .replace(/#{1,6}\s?/g, '')           // Remove headers
            .replace(/\*\*([^*]+)\*\*/g, '$1')   // Remove bold
            .replace(/\*([^*]+)\*/g, '$1')       // Remove italic
            .replace(/`([^`]+)`/g, '$1')         // Remove code
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
            .replace(/\n{3,}/g, '\n\n')          // Normalize line breaks
            .trim();
    }
}
