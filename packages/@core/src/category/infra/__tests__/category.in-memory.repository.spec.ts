/* eslint-disable dot-notation */

import { Category } from 'category/domain';
import { CategoryInMemoryRepository } from '../category.in-memory.repository';

describe('CategoryInMemoryRepository Unit Test', () => {
  let categoryRepository: CategoryInMemoryRepository;
  let items: Category[];
  beforeEach(() => {
    const dataRef = new Date().getTime();
    items = [
      new Category({
        name: 'categoria 1',
        created_at: new Date(dataRef - 1000),
      }),
      new Category({
        name: 'categoria 2',
        created_at: new Date(dataRef - 1300),
      }),
      new Category({
        name: 'categoria 3',
        created_at: new Date(dataRef - 1400),
      }),
      new Category({
        name: 'categoria 4',
        created_at: new Date(dataRef - 1100),
      }),
      new Category({
        name: 'categoria 5',
        created_at: new Date(dataRef - 1000),
      }),
    ];

    categoryRepository = new CategoryInMemoryRepository();
    categoryRepository.items = items;
  });

  it('should sort by created_at field if no sort was provided', async () => {
    const result = await categoryRepository['applySort'](items, null, null);
    expect(result).toStrictEqual([
      items[0],
      items[4],
      items[3],
      items[1],
      items[2],
    ]);
  });
});
