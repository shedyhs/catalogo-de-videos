import { Entity as AbstractEntity } from '../entities/entity';
import { InMemoryRepository } from './in-memory.repository';
import {
  ISearchableRepository,
  SearchParams,
  SearchResult,
  SortDirection,
} from './searchable-repository.contract';

export abstract class InMemorySearchableRepository<
    Entity extends AbstractEntity,
  >
  extends InMemoryRepository<Entity>
  implements ISearchableRepository<Entity>
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
