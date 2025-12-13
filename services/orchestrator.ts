import { LLMClient } from "./core/LLMClient";
import { ResearchDataSchema, ValidatedResearchData } from "./core/SchemaValidator";
import { DetectiveAgent, AuditorAgent, InsiderAgent, StatAgent } from "./agents/SpecializedAgents";
import { RESEARCH_SYSTEM_PROMPT } from "../constants";
import { Type } from "@google/genai";

export type AgentStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AgentState {
  name: string;
  status: AgentStatus;
  message?: string;
}

/**
 * Orchestrates parallel execution of specialized research agents to gather and synthesize
 * comprehensive intelligence on a given topic. Coordinates four specialized agents
 * (Detective, Auditor, Insider, Statistician) to provide multi-perspective analysis.
 *
 * The coordinator collects reports from all agents, synthesizes conflicting data,
 * and produces a validated, structured ResearchData object using the Gemini API
 * for intelligent synthesis and the Zod schema for validation.
 *
 * @example
 * ```typescript
 * const coordinator = new ResearchCoordinator();
 * const research = await coordinator.execute('cryptocurrency', (states) => {
 *   console.log('Agent progress:', states);
 *   // Update UI with current agent statuses
 * });
 * console.log('Summary:', research.summary);
 * console.log('Market stats:', research.marketStats);
 * ```
 */
export class ResearchCoordinator {
  private llm: LLMClient;
  private agents: any[];

  /**
   * Creates a new ResearchCoordinator instance.
   * Initializes the LLM client singleton and instantiates the four specialized agents
   * (Detective, Auditor, Insider, Statistician) that will be used for research gathering.
   *
   * @example
   * ```typescript
   * const coordinator = new ResearchCoordinator();
   * ```
   */
  constructor() {
    this.llm = LLMClient.getInstance();
    this.agents = [
      new DetectiveAgent(),
      new AuditorAgent(),
      new InsiderAgent(),
      new StatAgent()
    ];
  }

  /**
   * Executes parallel research gathering from specialized agents and synthesizes results.
   *
   * Flow:
   * 1. Initializes all agents with PENDING status
   * 2. Executes agents in parallel with Promise.allSettled for robustness
   * 3. Reports progress via onProgress callback as agents change status
   * 4. Collects all agent reports (handles failures gracefully)
   * 5. Synthesizes conflicting reports using Gemini API with structured output
   * 6. Validates final result against ResearchData schema
   *
   * @param {string} topic - The research topic to investigate (e.g., "cryptocurrency", "AI safety")
   * @param {Function} onProgress - Callback function invoked with updated agent states during execution.
   *   Receives array of AgentState objects with current status of each agent.
   *   Called when: agents start, agents complete, agents fail, or synthesis completes.
   *
   * @returns {Promise<ValidatedResearchData>} Synthesized research data object containing:
   *   - summary: Overall summary of the topic
   *   - ethicalRating: Ethical assessment (0-10 scale)
   *   - profitPotential: Market opportunity assessment
   *   - marketStats: Array of key market statistics with context
   *   - hiddenCosts: Array of hidden or indirect costs
   *   - caseStudies: Detailed case studies of successes and failures
   *   - affiliates: Affiliate program opportunities with commission info
   *
   * @throws {Error} Throws if final validation fails or Gemini API returns invalid data
   *
   * @example
   * ```typescript
   * const coordinator = new ResearchCoordinator();
   * try {
   *   const research = await coordinator.execute('nft-gaming', (states) => {
   *     states.forEach(state => {
   *       console.log(`${state.name}: ${state.status}`);
   *     });
   *   });
   *   console.log('Research complete:', research.summary);
   * } catch (error) {
   *   console.error('Research failed:', error.message);
   * }
   * ```
   */
  async execute(topic: string, onProgress: (state: AgentState[]) => void): Promise<ValidatedResearchData> {
    const agentStates: AgentState[] = this.agents.map(a => ({ name: a.name, status: 'PENDING' }));
    onProgress([...agentStates]);

    // 1. Parallel Execution with Settled Results (Robustness)
    const promises = this.agents.map(async (agent, index) => {
      agentStates[index].status = 'RUNNING';
      onProgress([...agentStates]);
      
      try {
        const result = await agent.run(topic);
        agentStates[index].status = 'COMPLETED';
        onProgress([...agentStates]);
        return result;
      } catch (e) {
        console.error(`${agent.name} failed:`, e);
        agentStates[index].status = 'FAILED';
        onProgress([...agentStates]);
        return `[${agent.name} Error] Failed to retrieve data. Proceed with caution.`;
      }
    });

    const results = await Promise.allSettled(promises);
    
    // 2. Synthesize Reports
    // Extract fulfilled values or fallback to error messages
    const reports = results.map((r, i) => 
        r.status === 'fulfilled' ? r.value : `[System Error] Agent ${this.agents[i].name} crashed.`
    );

    const [detectiveReport, auditorReport, insiderReport, statReport] = reports;

    const rawForensicData = `
      DETECTIVE REPORT: ${detectiveReport}
      AUDITOR REPORT: ${auditorReport}
      INSIDER REPORT: ${insiderReport}
      STATISTICIAN REPORT: ${statReport}
    `;

    // 3. Structured Synthesis
    const synthesisResponse = await this.llm.generateContentWithRetry({
      model: 'gemini-2.5-flash',
      contents: `
        Analyze the following FORENSIC DOSSIER on "${topic}".
        Synthesize the conflicting reports into a single, cohesive ResearchData object.
        If reports are missing or contain errors, estimate conservatively based on the topic context.
        
        FORENSIC DOSSIER:
        ${rawForensicData}
      `,
      config: {
        systemInstruction: RESEARCH_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            ethicalRating: { type: Type.NUMBER },
            profitPotential: { type: Type.STRING },
            marketStats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  context: { type: Type.STRING }
                }
              }
            },
            hiddenCosts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  context: { type: Type.STRING }
                }
              }
            },
            caseStudies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['WINNER', 'LOSER'] },
                  background: { type: Type.STRING },
                  strategy: { type: Type.STRING },
                  outcome: { type: Type.STRING },
                  revenue: { type: Type.STRING }
                }
              }
            },
            affiliates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  program: { type: Type.STRING },
                  potential: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['PARTICIPANT', 'WRITER'] },
                  commission: { type: Type.STRING },
                  notes: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = synthesisResponse.text || "{}";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '');
    
    try {
      const parsed = JSON.parse(cleanText);
      // Validate with Zod
      return ResearchDataSchema.parse(parsed);
    } catch (e) {
      console.error("Validation error:", e);
      throw new Error("Failed to validate research data structure.");
    }
  }
}