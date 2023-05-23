/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
import { Entity as AbstractEntity } from '../entities/entity';
import { Legible } from '../utils/legible-interface';
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo';

export interface RepositoryInterface<Entity extends AbstractEntity> {
  insert(entity: Entity): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<Entity>;
  findAll(): Promise<Entity[]>;
  update(entity: Entity): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> {
  protected _page = 1;
  protected _per_page = 15;
  protected _sort: string | null;
  protected _sort_dir: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }
  get page(): number {
    return this._page;
  }
  private set page(value: number) {
    let _page = +value; // Converte para number, se não for retorna NaN (Not a number)
    if (isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = this.page;
    }
    this._page = _page;
  }

  get per_page(): number {
    return this._per_page;
  }
  private set per_page(value: number) {
    let _per_page = (value as any) === true ? this._per_page : +value; // Converte para number, se não for retorna NaN (Not a number)
    if (
      isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(_per_page as any) !== _per_page
    ) {
      _per_page = this._per_page;
    }
    this._per_page = _per_page;
  }

  get sort(): string | null {
    return this._sort;
  }
  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sort_dir(): SortDirection | null {
    return this._sort_dir;
  }
  private set sort_dir(value: SortDirection | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }
    const direction = `${value}`.toLowerCase();
    this._sort_dir =
      direction !== 'asc' && direction !== 'desc' ? 'asc' : direction;
  }
  get filter(): Filter | null {
    return this._filter;
  }
  protected set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || (value as unknown) === ''
        ? null
        : (`${value}` as any);
  }
}

export type SearchResultProps<Entity extends AbstractEntity, Filter> = {
  items: Entity[];
  total: number;
  current_page: number;
  per_page: number;
  sort: string | null;
  sort_dir: SortDirection | null;
  filter: Filter | null;
};

export class SearchResult<Entity extends AbstractEntity, Filter = string> {
  readonly items: Entity[];
  readonly total: number;
  readonly current_page: number;
  readonly per_page: number;
  readonly last_page: number;
  readonly sort: string | null;
  readonly sort_dir: SortDirection | null;
  readonly filter: Filter;

  constructor(props: SearchResultProps<Entity, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(this.total / this.per_page);
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  toJSON(): Legible<SearchResultProps<Entity, Filter> & { last_page: number }> {
    return {
      items: this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter,
    };
  }
}
export interface SearchableRepositoryInterface<
  Entity extends AbstractEntity,
  Filter = string,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<Entity, Filter>,
> extends RepositoryInterface<Entity> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
