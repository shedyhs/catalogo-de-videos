/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
import { Entity } from '../entities/entity';
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo';

export interface IRepository<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<E>;
  findAll(): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}
