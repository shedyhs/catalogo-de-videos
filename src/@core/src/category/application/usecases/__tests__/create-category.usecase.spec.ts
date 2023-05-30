import { CategoryInMemoryRepository } from 'category/infra/category.in-memory.repository';
import { CreateCategoryUseCase } from '../create-category.usecase';

describe('CreateCategoryUseCase Unit Test', () => {
  let sut: CreateCategoryUseCase;
  let categoryRepository: CategoryInMemoryRepository;
  let spySut: jest.SpyInstance;
  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    sut = new CreateCategoryUseCase(categoryRepository);
    spySut = jest.spyOn(sut, 'execute');
  });

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(categoryRepository, 'insert');
    const arrange = {
      name: 'test',
      description: 'some description',
      is_active: false,
    };

    const result = await sut.execute(arrange);

    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith(arrange);
    expect(spyInsert).toBeCalledTimes(1);
    expect(result).toStrictEqual({
      id: categoryRepository.items[0].id,
      name: 'test',
      description: 'some description',
      is_active: false,
      created_at: categoryRepository.items[0].created_at,
      updated_at: categoryRepository.items[0].updated_at,
    });
  });
});
