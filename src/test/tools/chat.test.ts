import { describe, it, expect, vi } from 'vitest';
import { ChatSchema } from '../../tools/chat';
import { chat } from '../../tools/chat';

vi.mock('../../common/client', () => ({
  getClient: vi.fn().mockReturnValue({
    chat: vi.fn().mockResolvedValue({
      messages: [
        {
          author: 'GLEAN_AI',
          fragments: [
            {
              text: 'Hello! How can I help you today?',
            },
          ],
        },
      ],
    }),
  }),
}));

describe('Chat Tool', () => {
  describe('Schema Validation', () => {
    it('should validate a valid chat request', () => {
      const validRequest = {
        messages: [
          {
            author: 'USER',
            fragments: [
              {
                text: 'Hello',
              },
            ],
          },
        ],
      };

      const result = ChatSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should validate complex message structure', () => {
      const validRequest = {
        messages: [
          {
            author: 'USER',
            fragments: [
              {
                text: 'Hello',
                action: {
                  parameters: {
                    param1: {
                      type: 'STRING',
                      value: 'test',
                      description: 'Test parameter',
                    },
                  },
                },
              },
            ],
            messageType: 'CONTENT',
          },
        ],
        agentConfig: {
          agent: 'GPT',
          mode: 'DEFAULT',
        },
      };

      const result = ChatSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject invalid message structure', () => {
      const invalidRequest = {
        messages: [
          {
            author: 'INVALID_AUTHOR', // Should be USER or GLEAN_AI
            fragments: 'not an array', // Should be an array
          },
        ],
      };

      const result = ChatSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('Tool Implementation', () => {
    it('should call Glean client with validated params', async () => {
      const params = {
        messages: [
          {
            author: 'USER',
            fragments: [
              {
                text: 'Hello',
              },
            ],
          },
        ],
      };

      const response = await chat(params as any);

      // Verify response structure for raw response from Glean API
      // Add type assertion to fix the 'response is of type unknown' error
      const typedResponse = response as { messages: any[] };
      expect(typedResponse).toHaveProperty('messages');
      expect(typedResponse.messages).toBeInstanceOf(Array);

      // Verify client was called
      const { getClient } = await import('../../common/client');
      expect(getClient).toHaveBeenCalled();
    });
  });
});
