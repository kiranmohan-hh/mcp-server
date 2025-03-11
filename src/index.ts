#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import * as search from './tools/search.js';
import * as chat from './tools/chat.js';
import { GleanError, isGleanError } from './common/errors.js';

const server = new Server(
  {
    name: 'glean-mcp-server',
    version: '0.0.1',
  },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search',
        description: 'Search Glean',
        inputSchema: zodToJsonSchema(search.SearchSchema),
      },
      {
        name: 'chat',
        description: 'Chat with Glean',
        inputSchema: zodToJsonSchema(chat.ChatSchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error('Arguments are required');
    }

    switch (request.params.name) {
      case 'search': {
        const args = search.SearchSchema.parse(request.params.arguments);
        const result = await search.search(args);

        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'chat': {
        const args = chat.ChatSchema.parse(request.params.arguments);
        const response = await chat.chat(args);

        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
    }

    if (isGleanError(error)) {
      throw new Error(formatGleanError(error));
    }

    throw error;
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub MCP Server running on stdio');
}

runServer().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

function formatGleanError(error: GleanError): string | undefined {
  return `Error: ${error.message}`;
}
