import { describe, it, expect } from 'vitest';
import { formatChatResponse } from '../../index';

describe('Chat Formatter', () => {
  it('should format chat responses correctly', () => {
    const mockChatResponse = {
      messages: [
        {
          author: 'USER',
          fragments: [
            {
              text: 'What is Glean?',
            },
          ],
        },
        {
          author: 'ASSISTANT',
          fragments: [
            {
              text: 'Glean is an AI platform for work that helps organizations find and understand information. It provides enterprise search, AI assistants, and agent capabilities.',
            },
          ],
          citations: [
            {
              title: 'Glean Website',
              url: 'https://www.glean.com/',
            },
            {
              title: 'Glean Documentation',
              url: 'https://docs.glean.com/',
            },
          ],
        },
      ],
      conversationId: 'mock-conversation-id',
    };

    const formattedChat = formatChatResponse(mockChatResponse);

    expect(formattedChat).toContain('USER: What is Glean?');
    expect(formattedChat).toContain(
      'ASSISTANT: Glean is an AI platform for work that helps organizations find and understand information.',
    );
    expect(formattedChat).toContain('Sources:');
    expect(formattedChat).toContain(
      '[1] Glean Website - https://www.glean.com/',
    );
    expect(formattedChat).toContain(
      '[2] Glean Documentation - https://docs.glean.com/',
    );
  });

  it('should handle empty messages', () => {
    const emptyMessages = {
      messages: [],
      conversationId: 'empty-conversation',
    };

    const formattedChat = formatChatResponse(emptyMessages);
    expect(formattedChat).toBe('No response received.');
  });

  it('should handle missing messages', () => {
    const noMessages = {};
    const formattedChat = formatChatResponse(noMessages);
    expect(formattedChat).toBe('No response received.');
  });

  it('should handle messages without fragments', () => {
    const messagesWithoutFragments = {
      messages: [
        {
          author: 'USER',
        },
        {
          author: 'ASSISTANT',
          citations: [
            {
              title: 'Test Source',
              url: 'https://example.com',
            },
          ],
        },
      ],
    };

    const formattedChat = formatChatResponse(messagesWithoutFragments);
    expect(formattedChat).toContain('USER:');
    expect(formattedChat).toContain('ASSISTANT:');
    expect(formattedChat).toContain('[1] Test Source - https://example.com');
  });

  it('should handle messages without citations', () => {
    const messagesWithoutCitations = {
      messages: [
        {
          author: 'USER',
          fragments: [
            {
              text: 'Hello',
            },
          ],
        },
        {
          author: 'ASSISTANT',
          fragments: [
            {
              text: 'Hi there! How can I help you today?',
            },
          ],
        },
      ],
    };

    const formattedChat = formatChatResponse(messagesWithoutCitations);
    expect(formattedChat).toContain('USER: Hello');
    expect(formattedChat).toContain(
      'ASSISTANT: Hi there! How can I help you today?',
    );
    expect(formattedChat).not.toContain('Sources:');
  });
});
