#!/usr/bin/env node
/**
 * @fileoverview Glean Model Context Protocol (MCP) Server Implementation
 *
 * This server implements the Model Context Protocol, providing a standardized interface
 * for AI models to interact with Glean's search and chat capabilities. It uses stdio
 * for communication and implements the MCP specification for tool discovery and execution.
 *
 * The server provides two main tools:
 * 1. search - Allows searching through Glean's indexed content
 * 2. chat - Enables conversation with Glean's AI assistant
 *
 * @module @gleanwork/server-glean
 */

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

/**
 * MCP server instance configured for Glean's implementation.
 * Supports tool discovery and execution through the MCP protocol.
 */
const server = new Server(
  {
    name: 'Glean Tools MCP',
    version: '0.0.1',
  },
  { capabilities: { tools: {} } },
);

/**
 * Handles tool discovery requests by providing a list of available tools.
 * Each tool includes its name, description, and input schema in JSON Schema format.
 *
 * @returns {Promise<{tools: Array<{name: string, description: string, inputSchema: object}>}>}
 */
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

/**
 * Handles tool execution requests by validating input and dispatching to the appropriate tool.
 * Supports the following tools:
 * - search: Executes a search query against Glean's index
 * - chat: Initiates or continues a conversation with Glean's AI
 *
 * @param {object} request - The tool execution request
 * @param {string} request.params.name - The name of the tool to execute
 * @param {object} request.params.arguments - The arguments to pass to the tool
 * @returns {Promise<{content: Array<{type: string, text: string}>}>}
 * @throws {Error} If arguments are missing, tool is unknown, or validation fails
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error('Arguments are required');
    }

    switch (request.params.name) {
      case 'search': {
        const args = search.SearchSchema.parse(request.params.arguments);
        const result = await search.search(args);
        const formattedResults = search.formatResponse(result);

        return {
          content: [{ type: 'text', text: formattedResults }],
          isError: false,
        };
      }

      case 'chat': {
        const args = chat.ChatSchema.parse(request.params.arguments);
        const response = await chat.chat(args);
        const formattedResponse = chat.formatResponse(response);

        return {
          content: [{ type: 'text', text: formattedResponse }],
          isError: false,
        };
      }

      default:
        return {
          content: [
            { type: 'text', text: `Unknown tool: ${request.params.name}` },
          ],
          isError: true,
        };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: 'text',
            text: `Invalid input: ${JSON.stringify(error.errors)}`,
          },
        ],
        isError: true,
      };
    }

    if (isGleanError(error)) {
      return {
        content: [{ type: 'text', text: formatGleanError(error) }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Initializes and starts the MCP server using stdio transport.
 * This is the main entry point for the server process.
 *
 * @async
 * @throws {Error} If server initialization or connection fails
 */
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Glean MCP Server running on stdio');
}

/**
 * Bootstrap the server and handle any fatal errors.
 * Exits the process with code 1 if an unrecoverable error occurs.
 */
runServer().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

/**
 * Formats a Glean-specific error into a user-friendly message.
 *
 * @param {GleanError} error - The Glean error to format
 * @returns {string} A formatted error message
 */
function formatGleanError(error: GleanError): string {
  return `Error: ${error.message}`;
}
