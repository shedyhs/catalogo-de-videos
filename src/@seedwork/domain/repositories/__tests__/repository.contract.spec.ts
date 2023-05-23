import { SearchParams, SearchResult } from '../repository.contract';

describe('SearchParams Unit Tests', () => {
  test('page property', () => {
    const defaultValue = new SearchParams();
    expect(defaultValue.page).toBe(1);
    const arranges = [
      { page: undefined, expected: 1 },
      { page: null, expected: 1 },
      { page: NaN, expected: 1 },
      { page: 0.99, expected: 1 },
      { page: 1.2, expected: 1 },
      { page: 'abc', expected: 1 },
      { page: '0', expected: 1 },
      { page: '-1', expected: 1 },
      { page: {}, expected: 1 },
      { page: 2, expected: 2 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
    ];
    arranges.forEach((arrange) => {
      const params = new SearchParams({ page: arrange.page as any });
      expect(params.page).toBe(arrange.expected);
    });
  });

  test('per_page property', () => {
    const defaultValue = new SearchParams();
    expect(defaultValue.per_page).toBe(15);
    const arranges = [
      { per_page: undefined, expected: 15 },
      { per_page: null, expected: 15 },
      { per_page: NaN, expected: 15 },
      { per_page: 0.99, expected: 15 },
      { per_page: 1.2, expected: 15 },
      { per_page: 'abc', expected: 15 },
      { per_page: '0', expected: 15 },
      { per_page: '-1', expected: 15 },
      { per_page: {}, expected: 15 },
      { per_page: 20, expected: 20 },
      { per_page: false, expected: 15 },
      { per_page: true, expected: 15 },
    ];
    arranges.forEach((arrange) => {
      const params = new SearchParams({ per_page: arrange.per_page as any });
      expect(params.per_page).toBe(arrange.expected);
    });
  });

  test('sort property', () => {
    const defaultValue = new SearchParams();
    expect(defaultValue.sort).toBeNull();

    const arranges = [
      { sort: undefined, expected: null },
      { sort: null, expected: null },
      { sort: '', expected: null },
      { sort: NaN, expected: 'NaN' },
      { sort: 0.99, expected: '0.99' },
      { sort: 'abc', expected: 'abc' },
      { sort: '0', expected: '0' },
      { sort: '-1', expected: '-1' },
      { sort: {}, expected: '[object Object]' },
      { sort: false, expected: 'false' },
      { sort: true, expected: 'true' },
      { sort: 'field', expected: 'field' },
    ];
    arranges.forEach((arrange) => {
      const params = new SearchParams({ sort: arrange.sort as any });
      expect(params.sort).toBe(arrange.expected);
    });
  });

  test('sort_dir property', () => {
    let defaultValue = new SearchParams();
    expect(defaultValue.sort_dir).toBeNull();
    defaultValue = new SearchParams({ sort: null });
    expect(defaultValue.sort_dir).toBeNull();
    defaultValue = new SearchParams({ sort: undefined });
    expect(defaultValue.sort_dir).toBeNull();
    defaultValue = new SearchParams({ sort: '' });
    expect(defaultValue.sort_dir).toBeNull();

    const arranges = [
      { sort_dir: undefined, expected: 'asc' },
      { sort_dir: null, expected: 'asc' },
      { sort_dir: '', expected: 'asc' },
      { sort_dir: NaN, expected: 'asc' },
      { sort_dir: 0.99, expected: 'asc' },
      { sort_dir: 'abc', expected: 'asc' },
      { sort_dir: '0', expected: 'asc' },
      { sort_dir: '-1', expected: 'asc' },
      { sort_dir: {}, expected: 'asc' },
      { sort_dir: false, expected: 'asc' },
      { sort_dir: true, expected: 'asc' },
      { sort_dir: 'field', expected: 'asc' },
      { sort_dir: 'ASC', expected: 'asc' },
      { sort_dir: 'DESC', expected: 'desc' },
      { sort_dir: 'desc', expected: 'desc' },
      { sort_dir: 'asc', expected: 'asc' },
    ];
    arranges.forEach((arrange) => {
      const params = new SearchParams({
        sort: 'field',
        sort_dir: arrange.sort_dir as any,
      });
      expect(params.sort_dir).toBe(arrange.expected);
    });
  });

  test('filter property', () => {
    const defaultValue = new SearchParams();
    expect(defaultValue.filter).toBeNull();
    const arranges = [
      { filter: undefined, expected: null },
      { filter: null, expected: null },
      { filter: '', expected: null },
      { filter: NaN, expected: 'NaN' },
      { filter: 0.99, expected: '0.99' },
      { filter: 'abc', expected: 'abc' },
      { filter: '0', expected: '0' },
      { filter: '-1', expected: '-1' },
      { filter: {}, expected: '[object Object]' },
      { filter: false, expected: 'false' },
      { filter: true, expected: 'true' },
      { filter: 'field', expected: 'field' },
    ];
    arranges.forEach((arrange) => {
      const params = new SearchParams({ filter: arrange.filter as any });
      expect(params.filter).toBe(arrange.expected);
    });
  });
});

describe('SearchResults Unit Test', () => {
  test('contructor props', () => {
    let result = new SearchResult({
      items: ['entity', 'another entity'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    expect(result.toJSON()).toStrictEqual({
      items: ['entity', 'another entity'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    result = new SearchResult({
      items: ['entity', 'another entity'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'entity',
    });
    expect(result.toJSON()).toStrictEqual({
      items: ['entity', 'another entity'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'entity',
    });
  });

  it('should set last_page to 1 when per_page field is greater than total field', () => {
    const result = new SearchResult({
      items: [],
      total: 5,
      current_page: 1,
      per_page: 15,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'entity',
    });
    expect(result.last_page).toBe(1);
  });

  test('last_page field when total is not multiple of per_page ', () => {
    const result = new SearchResult({
      items: [],
      total: 7,
      current_page: 1,
      per_page: 3,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'entity',
    });
    expect(result.last_page).toBe(3);
  });
});
