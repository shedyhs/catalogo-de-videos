import { PaginationOutput } from '../../../@seedwork/application/dto/pagination-output.dto';
import { UseCase } from '../../../@seedwork/application/usecase';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryOutput } from '../dto/category-output';
import { SearchInputDto } from '../../../@seedwork/application/dto/search-input.dto';
import { CategoryMapper } from '../mappers/category.mapper';
import { PaginationMapper } from '../../../@seedwork/application/mappers/pagination.mapper';

type Input = SearchInputDto;

type Output = PaginationOutput<CategoryOutput>;

export class ListCategoriesUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const params = new CategoryRepository.SearchParams(input);
    const searchResult = await this.categoryRepository.search(params);
    return {
      items: searchResult.items.map((item) => CategoryMapper.toOutput(item)),
      ...PaginationMapper.toOutput(searchResult),
    };
  }
}
