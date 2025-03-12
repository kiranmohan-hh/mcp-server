import { describe, it, expect } from 'vitest';
import {
  GleanError,
  GleanInvalidRequestError,
  GleanAuthenticationError,
  GleanPermissionError,
  GleanRequestTimeoutError,
  GleanValidationError,
  GleanRateLimitError,
  isGleanError,
  formatGleanError,
} from '../../common/errors';

describe('Glean Errors', () => {
  describe('formatGleanError', () => {
    it('should format GleanInvalidRequestError correctly', () => {
      const error = new GleanInvalidRequestError('Bad request', {
        details: 'Invalid parameter',
      });
      const formatted = formatGleanError(error);
      expect(formatted).toContain('Invalid Request: Bad request');
      expect(formatted).toContain('Details: {"details":"Invalid parameter"}');
    });

    it('should format GleanAuthenticationError correctly', () => {
      const error = new GleanAuthenticationError('Invalid credentials');
      const formatted = formatGleanError(error);
      expect(formatted).toBe('Authentication Failed: Invalid credentials');
    });

    it('should format GleanPermissionError correctly', () => {
      const error = new GleanPermissionError('Access denied');
      const formatted = formatGleanError(error);
      expect(formatted).toBe('Permission Denied: Access denied');
    });

    it('should format GleanRequestTimeoutError correctly', () => {
      const error = new GleanRequestTimeoutError('Request timed out');
      const formatted = formatGleanError(error);
      expect(formatted).toBe('Request Timeout: Request timed out');
    });

    it('should format GleanValidationError correctly', () => {
      const error = new GleanValidationError('Invalid query format', {
        field: 'query',
      });
      const formatted = formatGleanError(error);
      expect(formatted).toContain('Invalid Query: Invalid query format');
      expect(formatted).toContain('Details: {"field":"query"}');
    });

    it('should format GleanRateLimitError correctly', () => {
      const resetDate = new Date('2023-01-01T00:00:00Z');
      const error = new GleanRateLimitError('Too many requests', resetDate);
      const formatted = formatGleanError(error);
      expect(formatted).toContain('Rate Limit Exceeded: Too many requests');
      expect(formatted).toContain('Resets at: 2023-01-01T00:00:00.000Z');
    });

    it('should format generic GleanError correctly', () => {
      const error = new GleanError('Unknown error', 500, {
        message: 'Server error',
      });
      const formatted = formatGleanError(error);
      expect(formatted).toBe('Glean API Error: Unknown error');
    });
  });

  it('should create a base GleanError', () => {
    const error = new GleanError('Test error', 500, {
      detail: 'Error details',
    });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(GleanError);
    expect(error.name).toBe('GleanError');
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(500);
    expect(error.response).toEqual({ detail: 'Error details' });
  });

  it('should create a GleanInvalidRequestError', () => {
    const error = new GleanInvalidRequestError('Invalid request test');
    expect(error).toBeInstanceOf(GleanError);
    expect(error).toBeInstanceOf(GleanInvalidRequestError);
    expect(error.name).toBe('GleanInvalidRequestError');
    expect(error.status).toBe(400);
    expect(error.message).toBe('Invalid request test');
  });

  it('should create a GleanAuthenticationError', () => {
    const error = new GleanAuthenticationError();
    expect(error).toBeInstanceOf(GleanError);
    expect(error).toBeInstanceOf(GleanAuthenticationError);
    expect(error.name).toBe('GleanAuthenticationError');
    expect(error.status).toBe(401);
    expect(error.message).toBe('Authentication failed');
  });

  it('should create a GleanPermissionError', () => {
    const error = new GleanPermissionError('Custom forbidden message');
    expect(error).toBeInstanceOf(GleanError);
    expect(error).toBeInstanceOf(GleanPermissionError);
    expect(error.name).toBe('GleanPermissionError');
    expect(error.status).toBe(403);
    expect(error.message).toBe('Custom forbidden message');
  });

  it('should create a GleanRequestTimeoutError', () => {
    const error = new GleanRequestTimeoutError();
    expect(error).toBeInstanceOf(GleanError);
    expect(error).toBeInstanceOf(GleanRequestTimeoutError);
    expect(error.name).toBe('GleanRequestTimeoutError');
    expect(error.status).toBe(408);
    expect(error.message).toBe('Request timeout');
  });

  it('should create a GleanValidationError', () => {
    const error = new GleanValidationError('Invalid query format');
    expect(error).toBeInstanceOf(GleanError);
    expect(error).toBeInstanceOf(GleanValidationError);
    expect(error.name).toBe('GleanValidationError');
    expect(error.status).toBe(422);
    expect(error.message).toBe('Invalid query format');
  });

  it('should create a GleanRateLimitError with resetAt', () => {
    const resetDate = new Date();
    const error = new GleanRateLimitError('Rate limit exceeded', resetDate);
    expect(error).toBeInstanceOf(GleanError);
    expect(error).toBeInstanceOf(GleanRateLimitError);
    expect(error.name).toBe('GleanRateLimitError');
    expect(error.status).toBe(429);
    expect(error.message).toBe('Rate limit exceeded');
    expect(error.resetAt).toBe(resetDate);
  });

  it('should correctly identify GleanError instances', () => {
    const gleanError = new GleanError('Test', 500, {});
    const regularError = new Error('Regular error');

    expect(isGleanError(gleanError)).toBe(true);
    expect(isGleanError(regularError)).toBe(false);
    expect(isGleanError(null)).toBe(false);
    expect(isGleanError(undefined)).toBe(false);
    expect(isGleanError('string')).toBe(false);
  });
});
