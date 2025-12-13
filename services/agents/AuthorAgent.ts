import { LLMClient } from "../core/LLMClient";
import { parseJsonFromLLM } from "../../utils/jsonParser";
import { BookSchema, ValidatedBook } from "../core/SchemaValidator";
import { AUTHOR_SYSTEM_PROMPT } from "../../constants";
import { ResearchData, GenSettings } from "../../types";
import { Type } from "@google/genai";

/**
 * Agent responsible for generating book drafts from research data and user specifications.
 * Transforms structured research findings into creative book content with chapters, visuals,
 * and marketing copy. Uses the Gemini API with structured JSON responses and schema validation.
 *
 * Respects user constraints including word count, tone, visual style, and reading level.
 * Generates complete book structure including front/back cover descriptions, chapters with
 * formatted content, visual descriptions for each chapter, and special elements like PosiBot quotes.
 *
 * @example
 * ```typescript
 * const author = new AuthorAgent();
 * const book = await author.generateDraft(
 *   'AI Ethics in Business',
 *   researchData,
 *   {
 *     lengthLevel: 2,
 *     imageDensity: 2,
 *     targetWordCount: '50000',
 *     tone: 'Professional yet accessible',
 *     visualStyle: 'Modern infographics',
 *     techLevel: 3
 *   }
 * );
 * console.log(`Generated book: ${book.title}`);
 * ```
 */
export class AuthorAgent {
  private llm: LLMClient;

  /**
   * Creates a new AuthorAgent instance.
   * Initializes the agent with a reference to the singleton LLMClient for content generation.
   *
   * @example
   * ```typescript
   * const author = new AuthorAgent();
   * ```
   */
  constructor() {
    this.llm = LLMClient.getInstance();
  }

  /**
   * Generates a complete book draft based on research data and user generation settings.
   *
   * Process:
   * 1. Constructs detailed generation constraints from user settings
   * 2. Compiles research data (summary, statistics, case studies) into context for the LLM
   * 3. Calls Gemini API with structured JSON schema for book generation
   * 4. Parses JSON response and validates against BookSchema using Zod
   * 5. Returns validated book structure ready for rendering or further processing
   *
   * The generated book includes:
   * - Title and subtitle
   * - Front and back cover with visual descriptions
   * - Multiple chapters with:
   *   - Chapter title and numbered content
   *   - Visual descriptions (HERO, CHART, CALLOUT, PORTRAIT, DIAGRAM types)
   *   - PosiBot quote callouts positioned left/right
   *   - Full chapter text content respecting length constraints
   *
   * @param {string} topic - The main topic/subject of the book (e.g., "Cryptocurrency Scams")
   * @param {ResearchData} research - Validated research data from ResearchCoordinator including:
   *   - summary: Topic overview
   *   - ethicalRating: Ethical assessment score
   *   - profitPotential: Market opportunity
   *   - marketStats: Array of relevant statistics
   *   - hiddenCosts: Array of hidden/indirect costs
   *   - caseStudies: Array of detailed case study objects (WINNER/LOSER types)
   * @param {GenSettings} settings - User generation preferences:
   *   - lengthLevel: 1 (Nano), 2 (Standard), or 3 (Extensive)
   *   - imageDensity: 1 (Minimal), 2 (Standard), or 3 (Heavy with 3-4 per chapter)
   *   - targetWordCount: Desired total word count (e.g., "50000")
   *   - tone: Writing tone/style (e.g., "Y-It Satire", "Professional", "Casual")
   *   - visualStyle: Visual design direction (e.g., "Forensic/Gritty", "Modern", "Minimalist")
   *   - techLevel: Technical depth (0-5 scale)
   *   - customSpec: Optional custom specification text
   *   - frontCoverPrompt: Optional custom front cover generation instructions
   *   - backCoverPrompt: Optional custom back cover generation instructions
   *
   * @returns {Promise<ValidatedBook>} Validated book object with structure matching BookSchema:
   *   - title: Book title
   *   - subtitle: Book subtitle
   *   - frontCover: Front cover object with titleText, subtitleText, visualDescription
   *   - backCover: Back cover object with blurb and visualDescription
   *   - chapters: Array of chapter objects with content, visuals, and quotes
   *
   * @throws {Error} Throws if LLM fails to generate valid JSON, or if validation against
   *   BookSchema fails. The schema validation ensures all required fields are present.
   *
   * @example
   * ```typescript
   * const author = new AuthorAgent();
   * try {
   *   const book = await author.generateDraft(
   *     'NFT Gaming Schemes',
   *     researchData,
   *     {
   *       lengthLevel: 2,
   *       imageDensity: 2,
   *       targetWordCount: '40000',
   *       tone: 'Y-It Satire',
   *       visualStyle: 'Forensic/Gritty',
   *       techLevel: 2
   *     }
   *   );
   *   console.log(`${book.chapters.length} chapters generated`);
   *   console.log(book.chapters[0].title);
   * } catch (error) {
   *   console.error('Book generation failed:', error.message);
   * }
   * ```
   */
  public async generateDraft(topic: string, research: ResearchData, settings: GenSettings): Promise<ValidatedBook> {
    
    const lengthInstruction = settings.lengthLevel === 1 ? "Keep chapters short (Nano-sized)." 
                            : settings.lengthLevel === 3 ? "Write extensive, deep chapters." 
                            : "Standard chapter length.";
    
    const imageInstruction = settings.imageDensity === 3 ? "Include 3-4 visual descriptions per chapter." 
                           : settings.imageDensity === 1 ? "Minimal visuals, text focused." 
                           : "Include 1-2 visual descriptions per chapter.";

    const constraints = `
        Target Word Count: ${settings.targetWordCount || "Default"}
        Tone: ${settings.tone || "Default Y-It Satire"}
        Visual Style: ${settings.visualStyle || "Default Forensic/Gritty"}
        ${lengthInstruction}
        ${imageInstruction}
        Tech Level: ${settings.techLevel}
    `;

    const response = await this.llm.generateContentWithRetry({
        model: 'gemini-2.5-flash',
        contents: `
            Topic: ${topic}
            Research Summary: ${JSON.stringify(research.summary)}
            Market Stats: ${JSON.stringify(research.marketStats)}
            Case Studies: ${JSON.stringify(research.caseStudies)}
            User Constraints: ${constraints}
            Custom Spec: ${settings.customSpec || "Use Standard Spec"}
            Cover Art Instructions:
            Front: ${settings.frontCoverPrompt || "Auto-generate based on Y-It Brand (Yellow/Black/Bold)"}
            Back: ${settings.backCoverPrompt || "Auto-generate based on Y-It Brand"}
        `,
        config: {
            systemInstruction: AUTHOR_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    frontCover: {
                        type: Type.OBJECT,
                        properties: {
                            titleText: { type: Type.STRING },
                            subtitleText: { type: Type.STRING },
                            visualDescription: { type: Type.STRING }
                        }
                    },
                    backCover: {
                        type: Type.OBJECT,
                        properties: {
                            blurb: { type: Type.STRING },
                            visualDescription: { type: Type.STRING }
                        }
                    },
                    chapters: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                number: { type: Type.NUMBER },
                                title: { type: Type.STRING },
                                content: { type: Type.STRING },
                                posiBotQuotes: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            position: { type: Type.STRING, enum: ['LEFT', 'RIGHT'] },
                                            text: { type: Type.STRING }
                                        }
                                    }
                                },
                                visuals: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            type: { type: Type.STRING, enum: ['HERO', 'CHART', 'CALLOUT', 'PORTRAIT', 'DIAGRAM'] },
                                            description: { type: Type.STRING },
                                            caption: { type: Type.STRING }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const rawData = parseJsonFromLLM(response.text || "{}");
    
    // Validate Structure
    return BookSchema.parse(rawData);
  }
}