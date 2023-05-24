/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable no-shadow */
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  ISearchableRepository,
} from '@seedwork/domain/repositories/searchable-repository.contract';
import { Category } from '../entities/category';

export namespace CategoryRepository {
  export type Filter = string;
  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<Category, Filter> {}
  export interface Repository
    extends ISearchableRepository<
      Category,
      Filter,
      SearchParams,
      SearchResult
    > {}
}
