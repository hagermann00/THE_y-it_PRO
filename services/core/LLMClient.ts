import { GoogleGenAI } from "@google/genai";

/**
 * Singleton client wrapper for Google Gemini API with retry logic and error handling.
 * Manages API authentication and provides resilient content generation methods.
 * Implements exponential backoff strategy for transient failures and distinguishes
 * between fatal errors (400, 403) and retriable errors (429, 5xx).
 *
 * @example
 * ```typescript
 * const client = LLMClient.getInstance();
 * const response = await client.generateContentWithRetry({
 *   model: 'gemini-2.5-flash',
 *   contents: 'Hello world'
 * });
 * ```
 */
export class LLMClient {
  private static instance: LLMClient;
  private client: GoogleGenAI;

  private constructor() {
    // Support both Vite (import.meta.env) and Node (process.env) environments
    const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY)
      ? (import.meta as any).env.VITE_GEMINI_API_KEY
      : (process.env.GEMINI_API_KEY || process.env.API_KEY);

    if (!apiKey) {
      console.warn("API Key not found. Set VITE_GEMINI_API_KEY, GEMINI_API_KEY, or API_KEY in your environment.");
    }

    this.client = new GoogleGenAI({ apiKey: apiKey || "" });
  }

  /**
   * Gets the singleton instance of LLMClient.
   * Creates a new instance on first call, returns existing instance on subsequent calls.
   * Supports both Vite (browser) and Node.js environments with environment-specific API key detection.
   *
   * @returns {LLMClient} The singleton LLMClient instance
   *
   * @example
   * ```typescript
   * const client = LLMClient.getInstance();
   * // On first call: creates new instance
   * // On subsequent calls: returns same instance
   * const sameClient = LLMClient.getInstance();
   * console.assert(client === sameClient); // true
   * ```
   */
  public static getInstance(): LLMClient {
    if (!LLMClient.instance) {
      LLMClient.instance = new LLMClient();
    }
    return LLMClient.instance;
  }

  /**
   * Retrieves the underlying Google Gemini API client instance.
   * Provides direct access to the GoogleGenAI client for advanced use cases or direct API calls.
   *
   * @returns {GoogleGenAI} The initialized Google Gemini API client
   *
   * @example
   * ```typescript
   * const client = LLMClient.getInstance();
   * const geminiClient = client.getClient();
   * // Can now use geminiClient directly for API operations
   * ```
   */
  public getClient(): GoogleGenAI {
    return this.client;
  }

  /**
   * Generates content from the Gemini LLM with automatic retry on transient failures.
   * Implements exponential backoff strategy: delays double with each retry attempt.
   * Distinguishes between fatal errors (400 Bad Request, 403 Forbidden) which throw immediately,
   * and retriable errors (429 Rate Limit, 5xx Server Errors) which trigger retries.
   *
   * @param {any} params - Gemini API generation parameters object containing:
   *   - model: string (e.g., 'gemini-2.5-flash', 'gemini-1.5-pro')
   *   - contents: string | array of content to generate from
   *   - config?: object (optional generation config with systemInstruction, responseMimeType, etc.)
   * @param {number} [retries=3] - Maximum number of retry attempts for transient failures
   * @param {number} [delay=2000] - Initial delay in milliseconds before first retry; doubles exponentially
   *
   * @returns {Promise<any>} Generated content response object from Gemini API with text, images, etc.
   *
   * @throws {Error} Throws on fatal errors (400, 403) or after exhausting all retries on transient errors
   *
   * @example
   * ```typescript
   * const client = LLMClient.getInstance();
   *
   * // Simple text generation
   * const response = await client.generateContentWithRetry({
   *   model: 'gemini-2.5-flash',
   *   contents: 'Explain TypeScript'
   * });
   * console.log(response.text);
   *
   * // With system instruction and structured response
   * const response = await client.generateContentWithRetry({
   *   model: 'gemini-2.5-flash',
   *   contents: 'Generate a JSON object',
   *   config: {
   *     systemInstruction: 'You are a helpful assistant',
   *     responseMimeType: 'application/json'
   *   }
   * }, 5, 1000);
   * ```
   */
  public async generateContentWithRetry(
    params: any,
    retries = 3,
    delay = 2000
  ): Promise<any> {
    try {
      return await this.client.models.generateContent(params);
    } catch (error: any) {
      const status = error.status || (error.response ? error.response.status : null);
      const message = error.message || "";

      const isPermissionError = status === 403 || message.includes("403") || message.includes("permission");
      
      // Fatal errors: Permissions or Invalid Argument
      if (isPermissionError || status === 400) {
        console.error("Fatal LLM Error:", message);
        throw error;
      }

      // Retry on Rate Limits (429) or Server Errors (5xx)
      if (retries > 0) {
        console.warn(`API call failed (${status || 'Unknown'}), retrying in ${delay}ms...`, message);
        await new Promise((resolve) => setTimeout(resolve, delay));
        // Exponential backoff
        return this.generateContentWithRetry(params, retries - 1, delay * 2);
      }
      
      throw error;
    }
  }

  /**
   * Generates images using the Gemini API's image generation capabilities.
   * Provides a wrapper around the GoogleGenAI client's image generation functionality.
   * Can be used with image generation models like Imagen or Gemini's image capabilities.
   *
   * @param {any} params - Image generation parameters object containing:
   *   - model: string (e.g., 'imagen-3', or model with image generation support)
   *   - prompt: string (description of the image to generate)
   *   - config?: object (optional configuration for image generation)
   *
   * @returns {Promise<any>} Generated images response object containing image data/URLs
   *
   * @throws {Error} Throws on API errors or invalid parameters
   *
   * @example
   * ```typescript
   * const client = LLMClient.getInstance();
   * const response = await client.generateImages({
   *   model: 'imagen-3',
   *   prompt: 'A vibrant yellow and black book cover about technology'
   * });
   * ```
   */
  public async generateImages(params: any): Promise<any> {
      // Wrapper for generateImages if using Imagen model directly via SDK
      return this.client.models.generateImages(params);
  }
}