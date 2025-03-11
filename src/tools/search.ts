import { z } from 'zod';
import { GleanClient } from 'glean-client';

export const PersonSchema = z.object({
  obfuscatedId: z.string(),
  email: z.string().optional(),
  name: z.string().optional(),
});

export const SearchSchema = z.object({
  query: z.string().optional().describe('The search terms'),
  cursor: z
    .string()
    .optional()
    .describe('Pagination cursor for position in overall results'),
  disableSpellcheck: z
    .boolean()
    .optional()
    .describe('Whether to disable spellcheck'),
  maxSnippetSize: z
    .number()
    .optional()
    .describe('Maximum characters for snippets'),
  pageSize: z.number().optional().describe('Number of results to return'),
  people: z
    .array(PersonSchema)
    .optional()
    .describe('People associated with the search request'),
  resultTabIds: z
    .array(z.string())
    .optional()
    .describe('Unique IDs of result tabs to fetch'),
  timeoutMillis: z
    .number()
    .optional()
    .describe('Request timeout in milliseconds'),
  timestamp: z
    .string()
    .optional()
    .describe('ISO 8601 timestamp of client request'),
  trackingToken: z
    .string()
    .optional()
    .describe('Previous tracking token for same query'),
});

export async function search(params: z.infer<typeof SearchSchema>) {
  const client = new GleanClient();
  const response = await client.search.perform(params);

  return {
    content: [{ type: 'text', text: JSON.stringify(response) }],
  };
}
