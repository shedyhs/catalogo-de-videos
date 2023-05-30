import { UseCase } from '@seedwork/application/usecase/usecase';
import { CategoryRepository } from 'category/domain/repositories/category.repository';
import { CategoryOutput } from '../dto/category-output';
import { CategoryMapper } from '../mappers/category.mapper';

type Input = {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

type Output = CategoryOutput;

export class UpdateCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const category = await this.categoryRepository.findById(input.id);
    category.update(input.name, input.description);
    if (input.is_active === true) {
      category.activate();
    }
    if (input.is_active === false) {
      category.deactivate();
    }
    await this.categoryRepository.update(category);
    return CategoryMapper.toOutput(category);
  }
}
