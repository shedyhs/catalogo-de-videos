import { NotFoundError } from '../../errors/not-found.error';
import { Entity } from '../../entities/entity';
import { InMemoryRepository } from '../in-memory.repository';
import { UniqueEntityId } from '../../value-objects/unique-entity-id.vo';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository Unit Test', () => {
  let repository: StubInMemoryRepository;
  let entity: StubEntity;
  beforeEach(() => {
    repository = new StubInMemoryRepository();
    entity = new StubEntity({ name: 'name', price: 123 });
  });

  it('should insert a new entity', async () => {
    await repository.insert(entity);
    expect(repository.items).toHaveLength(1);
    expect(repository.items[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throw error when not found entity', async () => {
    expect(() => repository.findById('nonexistent-id')).rejects.toThrow(
      new NotFoundError(`Entity not found using ID: nonexistent-id`),
    );
    const uniqueEntityId = new UniqueEntityId();
    expect(() => repository.findById(uniqueEntityId)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID: ${uniqueEntityId.value}`),
    );
  });

  it('should finds a entity by id', async () => {
    await repository.insert(entity);

    let foundEntity = await repository.findById(entity.id);
    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());

    foundEntity = await repository.findById(entity.uniqueEntityId);
    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should returns all entities', async () => {
    await repository.insert(entity);
    const allFoundEntities = await repository.findAll();
    expect(allFoundEntities).toHaveLength(1);
    expect(allFoundEntities).toStrictEqual([entity]);
  });

  it('should throw error when update not found entity', async () => {
    expect(() => repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID: ${entity.id}`),
    );
  });

  it('should updates an entity', async () => {
    await repository.insert(entity);
    const updatedEntity = new StubEntity(
      { name: 'updated', price: 100 },
      entity.uniqueEntityId,
    );

    await repository.update(updatedEntity);
    expect(repository.items[0].toJSON()).toStrictEqual(updatedEntity.toJSON());
  });

  it('should throw error when delete not found entity', async () => {
    expect(() => repository.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID: ${entity.id}`),
    );

    expect(() => repository.delete(entity.uniqueEntityId)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID: ${entity.id}`),
    );
  });

  it('should deletes an entity', async () => {
    await repository.insert(entity);
    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);
    await repository.insert(entity);
    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});
