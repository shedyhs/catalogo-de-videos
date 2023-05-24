/* eslint-disable dot-notation */
import { faker } from '@faker-js/faker';
import { Category } from '../../domain/entities/category';
import { CategoryInMemoryRepository } from '../category.in-memory.repository';

describe('CategoryInMemoryRepository Unit Test', () => {
  let categoryRepository: CategoryInMemoryRepository;
  let items: Category[];
  beforeEach(() => {
    let oldDates = Array(5).fill(faker.date.recent());
    oldDates = oldDates.sort();
    items = [
      new Category({
        name: 'categoria 1',
        created_at: oldDates[0],
      }),
      new Category({
        name: 'categoria 2',
        created_at: oldDates[3],
      }),
      new Category({
        name: 'categoria 3',
        created_at: oldDates[4],
      }),
      new Category({
        name: 'categoria 4',
        created_at: oldDates[1],
      }),
      new Category({
        name: 'categoria 5',
        created_at: oldDates[0],
      }),
    ];

    categoryRepository = new CategoryInMemoryRepository();
    categoryRepository.items = items;
  });
  it('should sort by created_at field if no sort was provided', async () => {
    const result = await categoryRepository['applySort'](items, null, null);
    expect(result).toStrictEqual([
      items[0],
      items[1],
      items[2],
      items[3],
      items[4],
    ]);
  });
});
