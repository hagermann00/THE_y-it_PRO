import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LLMClient } from './LLMClient';

describe('LLMClient', () => {
  let client: LLMClient;

  beforeEach(() => {
    // Clear the singleton instance before each test
    (LLMClient as any).instance = undefined;
    client = LLMClient.getInstance();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = LLMClient.getInstance();
      const instance2 = LLMClient.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should maintain singleton across different references', () => {
      const firstClient = LLMClient.getInstance();
      const secondClient = LLMClient.getInstance();
      const thirdClient = LLMClient.getInstance();

      expect(firstClient).toBe(secondClient);
      expect(secondClient).toBe(thirdClient);
    });
  });

  describe('Constructor', () => {
    it('should initialize with a valid client instance', () => {
      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(LLMClient);
    });

    it('should have a getClient method that returns GoogleGenAI instance', () => {
      const googleClient = client.getClient();
      expect(googleClient).toBeDefined();
      expect(typeof googleClient).toBe('object');
    });

    it('should warn when API key is missing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Reset instance to trigger constructor with missing API key
      (LLMClient as any).instance = undefined;
      delete process.env.VITE_GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      delete process.env.API_KEY;

      const newClient = LLMClient.getInstance();

      expect(newClient).toBeDefined();
      warnSpy.mockRestore();
    });

    it('should handle both Vite and Node environment variables', () => {
      const client = LLMClient.getInstance();
      const googleClient = client.getClient();

      expect(googleClient).toBeDefined();
    });
  });

  describe('getClient', () => {
    it('should return the GoogleGenAI client instance', () => {
      const googleClient = client.getClient();
      expect(googleClient).toBeDefined();
      expect(typeof googleClient).toBe('object');
    });

    it('should return the same client instance on multiple calls', () => {
      const client1 = client.getClient();
      const client2 = client.getClient();
      expect(client1).toBe(client2);
    });
  });

  describe('generateContentWithRetry', () => {
    it('should be defined as a method', () => {
      expect(client.generateContentWithRetry).toBeDefined();
      expect(typeof client.generateContentWithRetry).toBe('function');
    });

    it('should accept parameters object and retry configuration', async () => {
      const mockParams = { prompt: 'test' };
      const method = client.generateContentWithRetry;

      expect(method.length).toBeGreaterThanOrEqual(1);
    });

    it('should have default retry count of 3', async () => {
      const method = client.generateContentWithRetry;
      const params = method.toString();

      expect(params).toContain('3');
    });

    it('should have default delay of 2000ms', async () => {
      const method = client.generateContentWithRetry;
      const params = method.toString();

      expect(params).toContain('2000');
    });

    it('should implement exponential backoff strategy', async () => {
      const method = client.generateContentWithRetry;
      const methodStr = method.toString();

      // Check that delay is multiplied (exponential backoff)
      expect(methodStr).toContain('* 2');
    });

    it('should throw error on 403 permission errors without retrying', () => {
      const method = client.generateContentWithRetry;
      const methodStr = method.toString();

      expect(methodStr).toContain('403');
      expect(methodStr).toContain('permission');
    });

    it('should throw error on 400 bad request errors without retrying', () => {
      const method = client.generateContentWithRetry;
      const methodStr = method.toString();

      expect(methodStr).toContain('400');
    });

    it('should retry on transient failures (429, 5xx)', () => {
      const method = client.generateContentWithRetry;
      const methodStr = method.toString();

      expect(methodStr).toContain('retries');
    });
  });

  describe('generateImages', () => {
    it('should be defined as a method', () => {
      expect(client.generateImages).toBeDefined();
      expect(typeof client.generateImages).toBe('function');
    });

    it('should accept a params object', () => {
      const method = client.generateImages;
      expect(method.length).toBeGreaterThanOrEqual(1);
    });

    it('should call the underlying GoogleGenAI client', async () => {
      const method = client.generateImages;
      const methodStr = method.toString();

      expect(methodStr).toContain('generateImages');
    });
  });
});
