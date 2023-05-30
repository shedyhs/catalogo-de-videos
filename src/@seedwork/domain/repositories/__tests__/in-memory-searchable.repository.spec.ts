/* eslint-disable dot-notation */

import { Entity } from '@seedwork/domain/entities';
import { InMemorySearchableRepository } from '../in-memory-searchable.repository';
import { SearchParams, SearchResult } from '../searchable-repository.contract';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];
  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter(
      (item) =>
        item.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.props.price.toString() === filter,
    );
  }
}

describe('InMemorySearchableRepository Unit Test', () => {
  let repository: StubInMemorySearchableRepository;
  let items: StubEntity[];
  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
    items = [
      new StubEntity({ name: 'aaa', price: 200 }),
      new StubEntity({ name: 'bbb', price: 200 }),
      new StubEntity({ name: 'abc', price: 300 }),
    ];
  });
  describe('applyFilter method', () => {
    let spyFilterMethod: jest.SpyInstance;
    beforeEach(() => {
      spyFilterMethod = jest.spyOn(items, 'filter');
    });

    it('should no filter items when filter param is null', async () => {
      const filteredItems = await repository['applyFilter'](items, null);
      expect(spyFilterMethod).not.toBeCalled();
      expect(filteredItems).toStrictEqual(items);
    });

    it('should filter items using a filter param', async () => {
      let filteredItems = await repository['applyFilter'](items, 'a');
      expect(spyFilterMethod).toBeCalledTimes(1);
      expect(filteredItems).toStrictEqual([items[0], items[2]]);

      filteredItems = await repository['applyFilter'](items, '200');
      expect(spyFilterMethod).toBeCalledTimes(2);
      expect(filteredItems).toStrictEqual([items[0], items[1]]);

      filteredItems = await repository['applyFilter'](items, 'no-filter');
      expect(spyFilterMethod).toBeCalledTimes(3);
      expect(filteredItems).toHaveLength(0);
    });
  });

  describe('applySort method', () => {
    it('should not sort items', async () => {
      let sortedItems = await repository['applySort'](items, null, null);
      expect(sortedItems).toStrictEqual(items);
      sortedItems = await repository['applySort'](items, 'price', 'asc');
      expect(sortedItems).toStrictEqual(items);
    });

    it('should sort items', async () => {
      let sortedItems = await repository['applySort'](items, 'name', 'asc');
      expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);

      sortedItems = await repository['applySort'](items, 'name', 'desc');
      expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);
    });
  });

  describe('applyPaginate method', () => {
    it('should paginate items', async () => {
      let paginatedItems = await repository['applyPaginate'](items, 1, 2);
      expect(paginatedItems).toStrictEqual([items[0], items[1]]);
      paginatedItems = await repository['applyPaginate'](items, 2, 2);
      expect(paginatedItems).toStrictEqual([items[2]]);
      paginatedItems = await repository['applyPaginate'](items, 3, 2);
      expect(paginatedItems).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('should apply only paginate when other params are null', async () => {
      const entity = new StubEntity({ name: 'aaa', price: 200 });
      items = Array(16).fill(entity);
      repository.items = items;
      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          current_page: 1,
          per_page: 15,
          total: 16,
          filter: null,
          sort: null,
          sort_dir: null,
        }),
      );
    });

    it('should apply filter and paginate', async () => {
      items.push(new StubEntity({ name: 'AAA', price: 200 }));
      items.push(new StubEntity({ name: 'ZZZ', price: 200 }));
      items.push(new StubEntity({ name: 'AAA', price: 200 }));
      repository.items = items;

      let results = await repository.search(
        new SearchParams({ page: 1, per_page: 2, filter: 'aa' }),
      );
      expect(results).toStrictEqual(
        new SearchResult({
          items: [items[0], items[3]],
          current_page: 1,
          per_page: 2,
          total: 3,
          filter: 'aa',
          sort: null,
          sort_dir: null,
        }),
      );

      results = await repository.search(
        new SearchParams({ page: 2, per_page: 2, filter: 'aa' }),
      );
      expect(results).toStrictEqual(
        new SearchResult({
          items: [items[5]],
          current_page: 2,
          per_page: 2,
          total: 3,
          filter: 'aa',
          sort: null,
          sort_dir: null,
        }),
      );
    });

    it('should apply sort and paginate', async () => {
      items.push(new StubEntity({ name: 'ddd', price: 200 }));
      items.push(new StubEntity({ name: 'zzz', price: 200 }));
      items.push(new StubEntity({ name: 'bdc', price: 200 }));
      repository.items = items;

      const arranges = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
          }),
          result: new SearchResult({
            items: [items[0], items[2]],
            current_page: 1,
            per_page: 2,
            total: 6,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
          }),
          result: new SearchResult({
            items: [items[1], items[5]],
            current_page: 2,
            per_page: 2,
            total: 6,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new SearchResult({
            items: [items[4], items[3]],
            current_page: 1,
            per_page: 2,
            total: 6,
            sort: 'name',
            sort_dir: 'desc',
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new SearchResult({
            items: [items[5], items[1]],
            current_page: 2,
            per_page: 2,
            total: 6,
            sort: 'name',
            sort_dir: 'desc',
            filter: null,
          }),
        },
      ];

      arranges.forEach(async (item) => {
        const results = await repository.search(item.params);
        expect(results).toStrictEqual(item.result);
      });
    });

    it('should apply filter, sort and paginate respectively', async () => {
      items.push(new StubEntity({ name: 'ddd', price: 200 }));
      items.push(new StubEntity({ name: 'zzz', price: 200 }));
      items.push(new StubEntity({ name: 'bdc', price: 200 }));
      repository.items = items;

      const arranges = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'b',
          }),
          result: new SearchResult({
            items: [items[2], items[1]],
            current_page: 1,
            per_page: 2,
            total: 3,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'b',
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'b',
          }),
          result: new SearchResult({
            items: [items[5]],
            current_page: 2,
            per_page: 2,
            total: 3,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'b',
          }),
        },
      ];

      arranges.forEach(async (item) => {
        const results = await repository.search(item.params);
        expect(results).toStrictEqual(item.result);
      });
    });
  });
});
