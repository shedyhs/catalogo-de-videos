import { Category } from 'category/domain/entities/category';
import { CategoryMapper } from '../category.mapper';

describe('CategoryMapper Unit Test', () => {
  test('should return mapped category', () => {
    const category = new Category({ name: 'test' });
    const mapped = CategoryMapper.toOutput(category);
    expect(mapped).toStrictEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
      updated_at: category.updated_at,
    });
  });
});
