/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
import { Entity as AbstractEntity } from '../entities/entity';
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo';

export interface IRepository<Entity extends AbstractEntity> {
  insert(entity: Entity): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<Entity>;
  findAll(): Promise<Entity[]>;
  update(entity: Entity): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}
