# Contributing to @gleanwork/server-glean

Thank you for your interest in contributing to the Glean MCP Server! This document provides guidelines and instructions for development.

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/gleanwork/server-glean.git
cd server-glean
```

1. Install dependencies:

```bash
npm install
```

1. Run tests:

```bash
npm test
```

1. Build the project:

```bash
npm run build
```

## Running the Server Locally

The server communicates via stdio, making it ideal for integration with AI models and other tools:

```bash
node build/index.js
```

Input and output follow the JSON-RPC 2.0 protocol, with each message on a new line.

## Making Changes

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## Code Style

- Use TypeScript for all new code
- Follow the existing code style (enforced by ESLint and Prettier)
- Include JSDoc comments for public APIs
- Write tests for new functionality

## Testing

- Add unit tests for new features
- Ensure all tests pass before submitting a pull request
- Use the provided test utilities and fixtures

## Documentation

- Update documentation for any changed functionality
- Include examples for new features
- Keep the README.md and API documentation up to date

## Need Help?

- Documentation: [docs.glean.com](https://docs.glean.com)
- Issues: [GitHub Issues](https://github.com/gleanwork/server-glean/issues)
- Email: [support@glean.com](mailto:support@glean.com)
