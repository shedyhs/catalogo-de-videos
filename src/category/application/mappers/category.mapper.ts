import { Category } from 'category/domain/entities/category';
import { CategoryOutput } from '../dto/category-output';

export class CategoryMapper {
  static toOutput(entity: Category): CategoryOutput {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
