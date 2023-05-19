import { randomUUID } from 'crypto';
import { InvalidUuidError } from '../../errors/invalid-uuid.error';
import { ValueObject } from './value-object';

export class UniqueEntityId extends ValueObject<string> {
  constructor(readonly id?: string) {
    super(id || randomUUID());
    this.validate();
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
