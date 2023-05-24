import { UniqueEntityId } from '@seedwork/domain/value-objects/unique-entity-id.vo';
import { Entity } from '../entity';

type Props = {
  propNumber: number;
  propString: string;
  propObject: object;
};

class StubEntity extends Entity<Props> {}

describe('Entity Unit Tests', () => {
  it('Should set props and id', () => {
    const arrange = {
      propNumber: 1,
      propString: 'text',
      propObject: {
        a: true,
      },
    };
    const entity = new StubEntity(arrange);
    expect(entity.props).toStrictEqual(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).toBeTruthy();
  });

  it('Should accept a valid uuid', () => {
    const arrange = {
      propNumber: 1,
      propString: 'text',
      propObject: {
        a: true,
      },
    };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.id).toBe(uniqueEntityId.value);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
  });

  it('Should convert a entity to JSON', () => {
    const arrange = {
      propNumber: 1,
      propString: 'text',
      propObject: {
        a: true,
      },
    };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);

    expect(entity.toJSON()).toStrictEqual({
      id: uniqueEntityId.value,
      ...arrange,
    });
  });
});
