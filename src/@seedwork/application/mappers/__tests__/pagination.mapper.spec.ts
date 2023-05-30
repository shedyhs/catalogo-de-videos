import { SearchResult } from '@seedwork/domain';
import { PaginationMapper } from '../pagination.mapper';

describe('PaginationMapper Unit Test', () => {
  test('should return mapped category', () => {
    const searchResult = new SearchResult({
      current_page: 1,
      per_page: 2,
      total: 0,
      sort: null,
      filter: null,
      sort_dir: null,
      items: [],
    });

    const mapped = PaginationMapper.toOutput(searchResult);

    expect(mapped).toStrictEqual({
      current_page: 1,
      per_page: 2,
      last_page: 0,
      total: 0,
    });
  });
});
