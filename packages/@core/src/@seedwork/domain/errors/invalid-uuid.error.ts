export class InvalidUuidError extends Error {
  constructor(message?: string) {
    super(message || 'id must be a valid UUID');
    this.name = 'InvalidUuidError';
  }
}
