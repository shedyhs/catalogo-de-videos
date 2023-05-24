import { UseCase } from '@seedwork/application/usecase';
import { CategoryRepository } from 'category/domain/repositories/category.repository';

type Input = {
  id: string;
};

type Output = void;

export class DeleteCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository,
  ) {}

  async execute(input: Input): Promise<Output> {
    await this.categoryRepository.delete(input.id);
  }
}
