import { UseCase } from '@seedwork/application/usecase';
import { CategoryRepository } from 'category/domain/repositories/category.repository';
import { CategoryOutput } from '../dto/category-output';

type Input = {
  id: string;
};

type Output = CategoryOutput;

export class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const category = await this.categoryRepository.findById(input.id);
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
