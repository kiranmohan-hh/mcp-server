import { describe, it, expect, vi } from 'vitest';
import { SearchSchema } from '../../tools/search';
import { search } from '../../tools/search';

vi.mock('../../common/client', () => ({
  getClient: vi.fn().mockReturnValue({
    search: vi.fn().mockResolvedValue({
      results: [
        {
          title: 'Test Result',
          url: 'https://example.com',
        },
      ],
    }),
  }),
}));

describe('Search Tool', () => {
  describe('Schema Validation', () => {
    it('should validate a valid search request', () => {
      const validRequest = {
        query: 'test query',
        pageSize: 10,
        disableSpellcheck: false,
      };

      const result = SearchSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should validate optional fields', () => {
      const validRequest = {
        query: 'test query',
        people: [
          {
            name: 'Test User',
            obfuscatedId: '123',
            email: 'test@example.com',
            metadata: {
              title: 'Software Engineer',
              department: 'Engineering',
            },
          },
        ],
      };

      const result = SearchSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject invalid types', () => {
      const invalidRequest = {
        query: 123, // Should be string
        pageSize: 'large', // Should be number
      };

      const result = SearchSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('Tool Implementation', () => {
    it('should call Glean client with validated params', async () => {
      const params = {
        query: 'test query',
        pageSize: 10,
      };

      const response = await search(params);

      // The response is now the raw response from the Glean API
      // We just verify it's returned as expected from the mock
      // Add type assertion to fix the 'response is of type unknown' error
      const typedResponse = response as { results: any[] };
      expect(typedResponse).toHaveProperty('results');
      expect(typedResponse.results).toBeInstanceOf(Array);

      const { getClient } = await import('../../common/client');
      expect(getClient).toHaveBeenCalled();
    });
  });
});
