import { LLMClient } from "../core/LLMClient";

/**
 * Abstract base class for specialized research agents in the intelligence gathering system.
 * Provides common functionality and interface for agents that research specific aspects of a topic.
 *
 * Each agent specializes in a particular research perspective (e.g., financial, legal, competitive).
 * Subclasses must implement the {@link BaseAgent#run} method to define their specific research behavior.
 *
 * Agents inherit access to the LLM client with retry logic and built-in search capabilities via
 * the protected {@link BaseAgent#executeSearch} method.
 *
 * @abstract
 *
 * @example
 * ```typescript
 * export class CustomAgent extends BaseAgent {
 *   constructor() {
 *     super('CustomAgent');
 *   }
 *
 *   async run(topic: string): Promise<string> {
 *     return this.executeSearch(
 *       'You are a custom research analyst',
 *       `Research ${topic} from custom perspective`
 *     );
 *   }
 * }
 * ```
 */
export abstract class BaseAgent {
  protected llm: LLMClient;
  protected name: string;

  /**
   * Creates a new BaseAgent instance.
   * Initializes the agent with a name and retrieves the singleton LLMClient instance.
   * This is called by subclass constructors to set up common functionality.
   *
   * @param {string} name - The name identifier for this agent (e.g., 'DetectiveAgent', 'AuditorAgent')
   *
   * @example
   * ```typescript
   * class MyAgent extends BaseAgent {
   *   constructor() {
   *     super('MyAgent'); // Sets this.name = 'MyAgent'
   *   }
   * }
   * ```
   */
  constructor(name: string) {
    this.name = name;
    this.llm = LLMClient.getInstance();
  }

  /**
   * Abstract method that must be implemented by subclasses to define research behavior.
   * Each agent specializes in gathering intelligence on a topic from its unique perspective.
   * Typically uses {@link BaseAgent#executeSearch} to leverage LLM with search capabilities.
   *
   * @abstract
   * @param {string} topic - The research topic to investigate
   * @returns {Promise<string>} Research findings as a formatted string/report from this agent's perspective
   *
   * @example
   * ```typescript
   * class DetectiveAgent extends BaseAgent {
   *   async run(topic: string): Promise<string> {
   *     // Investigate topic as a detective would...
   *     return this.executeSearch(
   *       'You investigate corporate misconduct and financial crime',
   *       `Investigate potential fraud in: ${topic}`
   *     );
   *   }
   * }
   * ```
   */
  abstract run(topic: string): Promise<string>;

  /**
   * Protected helper method that executes a search query using the Gemini LLM with integrated Google Search.
   * Combines a system prompt (role/context) with a user prompt (query) to perform specialized research.
   * Automatically retries on transient failures via LLMClient's retry logic.
   *
   * @protected
   * @param {string} systemPrompt - System instruction defining the agent's role and expertise.
   *   Used to shape how the LLM approaches the research task.
   * @param {string} userPrompt - The actual research query or task to perform
   *
   * @returns {Promise<string>} The research findings/response text from the LLM.
   *   Returns default error message if LLM returns no text.
   *
   * @throws {Error} Propagates errors from LLMClient if retry exhaustion or fatal errors occur
   *
   * @example
   * ```typescript
   * const findings = await this.executeSearch(
   *   'You are a financial analyst specializing in valuation',
   *   'What is the market cap of Company X and how does it compare to peers?'
   * );
   * ```
   */
  protected async executeSearch(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.llm.generateContentWithRetry({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
      }
    });
    return response.text || `[${this.name}] No data found.`;
  }
}
