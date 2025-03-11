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

export function isGleanError(error: unknown): error is GleanError {
  return error instanceof GleanError;
}
