import { Legible } from '../utils/legible-interface';
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo';

export abstract class Entity<Props> {
  public readonly uniqueEntityId: UniqueEntityId;

  constructor(public readonly props: Props, id?: UniqueEntityId) {
    this.uniqueEntityId = id || new UniqueEntityId();
  }

  get id(): string {
    return this.uniqueEntityId.value;
  }

  toJSON(): Legible<Required<{ id: string } & Props>> {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
