/**
 * @fileoverview Error handling utilities for the Glean MCP server.
 * 
 * This module provides custom error types and type guards for handling
 * Glean-specific errors in a consistent way across the codebase.
 * 
 * @module common/errors
 */

/**
 * Custom error class for Glean-specific errors.
 * Includes additional context about the error such as HTTP status and response data.
 * 
 * @extends {Error}
 */
export class GleanError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response: unknown,
  ) {
    super(message);
    this.name = 'GleanError';
  }
}

/**
 * Type guard to check if an error is a GleanError.
 * 
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a GleanError
 */
export function isGleanError(error: unknown): error is GleanError {
  return error instanceof GleanError;
}
