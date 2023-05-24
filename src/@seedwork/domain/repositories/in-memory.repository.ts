/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity as AbstractEntity } from '../entities/entity';
import { NotFoundError } from '../errors/not-found.error';
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo';
import { IRepository } from './repository.contract';

export abstract class InMemoryRepository<Entity extends AbstractEntity>
  implements IRepository<Entity>
{
  items: Entity[] = [];

  async insert(entity: Entity): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string | UniqueEntityId): Promise<Entity> {
    const _id = `${id}`;
    return this._get(_id);
  }

  async findAll(): Promise<Entity[]> {
    return this.items;
  }

  async update(entity: Entity): Promise<void> {
    await this._get(entity.id);
    const indexFound = this.items.findIndex((item) => item.id === entity.id);
    this.items[indexFound] = entity;
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`;
    await this._get(_id);
    const indexFound = this.items.findIndex((item) => item.id === _id);
    this.items.splice(indexFound, 1);
  }

  protected async _get(id: string): Promise<Entity> {
    const foundItem = this.items.find((item) => item.id === id);
    if (!foundItem) {
      throw new NotFoundError(`Entity not found using ID: ${id}`);
    }
    return foundItem;
  }
}
