/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity as AbstractEntity } from '../entities/entity';
import { NotFoundError } from '../errors/not-found.error';
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo';
import {
  RepositoryInterface,
  SearchParams,
  SearchResult,
  SearchableRepositoryInterface,
  SortDirection,
} from './repository.contract';

export abstract class InMemoryRepository<Entity extends AbstractEntity>
  implements RepositoryInterface<Entity>
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

export abstract class InMemorySearchableRepository<
    Entity extends AbstractEntity,
  >
  extends InMemoryRepository<Entity>
  implements SearchableRepositoryInterface<Entity>
{
  sortableFields: string[] = [];
  async search(props: SearchParams): Promise<SearchResult<Entity>> {
    const filteredItems = await this.applyFilter(this.items, props.filter);
    const sortedItems = await this.applySort(
      filteredItems,
      props.sort,
      props.sort_dir,
    );
    const paginatedItems = await this.applyPaginate(
      sortedItems,
      props.page,
      props.per_page,
    );

    return new SearchResult({
      current_page: props.page,
      per_page: props.per_page,
      filter: props.filter,
      sort: props.sort,
      sort_dir: props.sort_dir,
      total: filteredItems.length,
      items: paginatedItems,
    });
  }

  protected abstract applyFilter(
    items: Entity[],
    filter: string | null,
  ): Promise<Entity[]>;

  protected async applySort(
    items: Entity[],
    sort: string | null,
    sort_dir: SortDirection,
  ): Promise<Entity[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }
    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sort_dir === 'asc' ? -1 : 1;
      }
      if (a.props[sort] > b.props[sort]) {
        return sort_dir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  protected async applyPaginate(
    items: Entity[],
    page: SearchParams['page'],
    per_page: SearchParams['per_page'],
  ): Promise<Entity[]> {
    const start = (page - 1) * per_page;
    const end = start + per_page;
    return items.slice(start, end);
  }
}
