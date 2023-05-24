import { SortDirection } from '@seedwork/domain/repositories/searchable-repository.contract';

export type SearchInputDto<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};
