import { randomUUID } from 'crypto';
import { InvalidUuidError } from '../errors/invalid-uuid.error';

export class UniqueEntityId {
  constructor(public readonly value?: string) {
    this.value = value || randomUUID();
  }

  validate() {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const isValidUUID = uuidRegex.test(this.value);

    if (!isValidUUID) {
      throw new InvalidUuidError();
    }
  }
}
