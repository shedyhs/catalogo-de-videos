import { UseCase } from '@seedwork/application/usecase';
import { Category } from 'category/domain/entities/category';
import { CategoryRepository } from 'category/domain/repositories/category.repository';
import { CategoryOutput } from '../dto/category-output';

type Input = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

type Output = CategoryOutput;

export class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const category = new Category(input);
    await this.categoryRepository.insert(category);
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }
}
