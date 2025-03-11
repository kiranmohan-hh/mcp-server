# @gleanwork/server-glean

A Model Context Protocol (MCP) server implementation for Glean's search and chat capabilities. This server provides a standardized interface for AI models to interact with Glean's content search and conversational AI features through stdio communication.

## Features

- 🔍 **Search Integration**: Access Glean's powerful content search capabilities
- 💬 **Chat Interface**: Interact with Glean's AI assistant
- 🔄 **MCP Compliant**: Implements the Model Context Protocol specification

## Prerequisites

- Node.js v18 or higher
- Glean API credentials

## Installation

```bash
npm install @gleanwork/server-glean
```

## Configuration

1. Set up your Glean API credentials:

```bash
export GLEAN_SUBDOMAIN=your_subdomain
export GLEAN_API_TOKEN=your_api_token
```

1. (Optional) For global tokens that support impersonation:

```bash
export GLEAN_ACT_AS=user@example.com
```

## Tools

### search

Search Glean's content index

- **query** (string): Search query terms
- **cursor** (string, optional): Pagination cursor for fetching next page
- **disableSpellcheck** (boolean, optional): Disable spellcheck suggestions
- **maxSnippetSize** (number, optional): Maximum size of content snippets
- **pageSize** (number, optional): Number of results to return
- **people** (array, optional): People to filter results by
  - **name** (string): Person's name
  - **obfuscatedId** (string): Person's unique identifier
  - **email** (string, optional): Person's email
  - **metadata** (any, optional): Additional person metadata
- **resultTabIds** (array of string, optional): IDs of result tabs to include
- **timeoutMillis** (number, optional): Search timeout in milliseconds
- **timestamp** (string, optional): ISO 8601 timestamp of client request
- **trackingToken** (string, optional): Previous tracking token for same query

For complete parameter details, see [Search API Documentation](https://developers.glean.com/client/operation/search/)

### chat

Interact with Glean's AI assistant

- **messages** (array): Array of chat messages
  - **agentConfig** (object, optional)
    - **agent** (string, optional): Name of the agent ('DEFAULT' or 'GPT')
    - **mode** (string, optional): Chat mode ('DEFAULT' or 'QUICK')
  - **author** (string): Message author ('USER' or 'GLEAN_AI')
  - **fragments** (array): Message content fragments
    - **text** (string, optional): Fragment text content
    - **action** (object, optional): Action parameters
    - **file** (object, optional): File reference
      - **id** (string): File ID
      - **name** (string): File name
  - **messageId** (string, optional): Unique message identifier
  - **messageType** (string, optional): Type of message ('UPDATE', 'CONTENT', 'CONTEXT', etc.)
  - **ts** (string, optional): Timestamp
  - **uploadedFileIds** (array of string, optional): IDs of uploaded files
- **timezoneOffset** (number, optional): Client timezone offset
- **agentConfig** (object, optional): Same structure as message agentConfig
- **applicationId** (string, optional): Client application identifier
- **chatId** (string, optional): Existing conversation ID
- **saveChat** (boolean, optional): Save conversation history
- **stream** (boolean, optional): Enable streaming response
- **timeoutMillis** (number, optional): Chat timeout in milliseconds

For complete parameter details, see [Chat API Documentation](https://developers.glean.com/client/operation/chat/)

## Usage

The server implements the Model Context Protocol (MCP) and communicates through stdio. All requests use the JSON-RPC 2.0 format with the `mcp.call_tool` method:

```json
{
  "jsonrpc": "2.0",
  "method": "mcp.call_tool",
  "params": {
    "name": "<tool_name>",
    "arguments": { ... }
  }
}
```

## API Reference

For detailed information about the available parameters and their usage:

- Search API: [Glean Search Documentation](https://developers.glean.com/client/operation/search/)
- Chat API: [Glean Chat Documentation](https://developers.glean.com/client/operation/chat/)

The MCP server implements these APIs following the JSON-RPC 2.0 protocol for communication.

## Error Handling

The server returns standardized error responses following the JSON-RPC 2.0 specification:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "error": {
    "code": -32603,
    "message": "Error: Invalid authentication token"
  }
}
```

Common error scenarios:

- Missing or invalid environment variables
- Invalid tool parameters
- Authentication failures
- API timeout or connection issues

## Running the Server

The server communicates via stdio, making it ideal for integration with AI models and other tools:

```bash
node build/index.js
```

Input and output follow the JSON-RPC 2.0 protocol, with each message on a new line.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Support

- Documentation: [docs.glean.com](https://docs.glean.com)
- Issues: [GitHub Issues](https://github.com/gleanwork/server-glean/issues)
- Email: [support@glean.com](mailto:support@glean.com)
