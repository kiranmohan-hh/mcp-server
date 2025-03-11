import { GleanClient } from 'glean-client';
import { z } from 'zod';

const AgentConfigSchema = z.object({
  agent: z.enum(['DEFAULT', 'GPT']).optional().describe('Name of the agent'),
  mode: z
    .enum(['DEFAULT', 'QUICK'])
    .optional()
    .describe('Top level modes to run GleanChat in'),
});

const ParameterSchema = z.object({
  description: z.string().optional(),
  displayName: z.string().optional(),
  isRequired: z.boolean().optional(),
  label: z.string().optional(),
  type: z.enum(['UNKNOWN', 'INTEGER', 'STRING', 'BOOLEAN']).optional(),
  value: z.string().optional(),
});

const ActionSchema = z.object({
  parameters: z.record(z.string(), ParameterSchema).optional(),
});

const ChatMessageFragmentSchema = z.object({
  text: z.string().optional(),
  action: ActionSchema.optional(),
  file: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});

const ChatMessageSchema = z.object({
  agentConfig: AgentConfigSchema.optional(),
  author: z.enum(['USER', 'GLEAN_AI']).optional(),
  fragments: z.array(ChatMessageFragmentSchema).optional(),
  messageId: z.string().optional(),
  messageType: z
    .enum([
      'UPDATE',
      'CONTENT',
      'CONTEXT',
      'DEBUG',
      'DEBUG_EXTERNAL',
      'ERROR',
      'HEADING',
      'WARNING',
    ])
    .optional(),
  ts: z.string().optional(),
  uploadedFileIds: z.array(z.string()).optional(),
});

export const ChatSchema = z.object({
  messages: z.array(ChatMessageSchema),
  timezoneOffset: z.number().optional(),
  agentConfig: AgentConfigSchema.optional(),
  applicationId: z.string().optional(),
  chatId: z.string().optional(),
  saveChat: z.boolean().optional(),
  stream: z.boolean().optional(),
  timeoutMillis: z.number().optional(),
});

export async function chat(params: z.infer<typeof ChatSchema>) {
  const client = new GleanClient();
  const response = await client.chat.startConversation(params);

  return {
    content: [{ type: 'text', text: JSON.stringify(response) }],
  };
}
