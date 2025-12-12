// Available Gemini voices
export type VoiceId = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Aoede' | 'Leda' | 'Orus' | 'Zephyr';

export interface VoicePreset {
    id: VoiceId;
    name: string;
    gender: 'male' | 'female';
    style: string;
    recommended: string[];
}

export const VOICES: VoicePreset[] = [
    { id: 'Puck', name: 'Puck', gender: 'male', style: 'Warm, conversational', recommended: ['host', 'narrator'] },
    { id: 'Charon', name: 'Charon', gender: 'male', style: 'Deep, authoritative', recommended: ['serious', 'documentary'] },
    { id: 'Kore', name: 'Kore', gender: 'female', style: 'Clear, professional', recommended: ['host', 'narrator'] },
    { id: 'Fenrir', name: 'Fenrir', gender: 'male', style: 'Bold, dramatic', recommended: ['dramatic', 'emphasis'] },
    { id: 'Aoede', name: 'Aoede', gender: 'female', style: 'Warm, friendly', recommended: ['casual', 'approachable'] },
    { id: 'Leda', name: 'Leda', gender: 'female', style: 'Crisp, articulate', recommended: ['business', 'formal'] },
    { id: 'Orus', name: 'Orus', gender: 'male', style: 'Calm, measured', recommended: ['educational', 'explainer'] },
    { id: 'Zephyr', name: 'Zephyr', gender: 'male', style: 'Light, energetic', recommended: ['posibot', 'upbeat'] },
];

export const DEFAULT_MALE_VOICE: VoiceId = 'Puck';
export const DEFAULT_FEMALE_VOICE: VoiceId = 'Kore';
export const DEFAULT_POSIBOT_VOICE: VoiceId = 'Zephyr';

export type PodcastTier = 'BASIC' | 'NARRATIVE' | 'INTERACTIVE';

export interface PodcastSettings {
    tier: PodcastTier;
    primaryVoice: VoiceId;
    secondaryVoice?: VoiceId;      // For dual-narrator
    posiBotVoice?: VoiceId;        // For PosiBot quotes
    speed: number;                  // 0.5 - 2.0
    includeIntro: boolean;
    includeOutro: boolean;
    includeChapterBreaks: boolean;
    includePosiBotQuotes: boolean;
}

export const DEFAULT_PODCAST_SETTINGS: PodcastSettings = {
    tier: 'BASIC',
    primaryVoice: DEFAULT_MALE_VOICE,
    secondaryVoice: DEFAULT_FEMALE_VOICE,
    posiBotVoice: DEFAULT_POSIBOT_VOICE,
    speed: 1.0,
    includeIntro: true,
    includeOutro: true,
    includeChapterBreaks: true,
    includePosiBotQuotes: true,
};

export const TIER_FEATURES: Record<PodcastTier, string[]> = {
    BASIC: [
        'Single voice narration',
        'Full book audio',
        'MP3 export',
    ],
    NARRATIVE: [
        'Dual narrator (host + sidekick)',
        'PosiBot voice for quotes',
        'Intro/Outro segments',
        'Chapter transitions',
        'Enhanced pacing',
    ],
    INTERACTIVE: [
        'All Narrative features',
        'Chapter-synced playback',
        'Click-to-play sections',
        'Real-time dashboard sync',
        'Future: Conversational Q&A',
    ],
};
