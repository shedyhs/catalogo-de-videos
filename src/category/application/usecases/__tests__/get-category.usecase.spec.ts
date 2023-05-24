import { NotFoundError } from '@seedwork/domain/errors/not-found.error';
import { Category } from 'category/domain/entities/category';
import { CategoryInMemoryRepository } from 'category/infra/category.in-memory.repository';
import { GetCategoryUseCase } from '../get-category.usecase';

describe('GetCategoryUseCase Unit Test', () => {
  let sut: GetCategoryUseCase;
  let categoryRepository: CategoryInMemoryRepository;
  let spySut: jest.SpyInstance;
  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    categoryRepository.insert(new Category({ name: 'category' }));
    sut = new GetCategoryUseCase(categoryRepository);
    spySut = jest.spyOn(sut, 'execute');
  });

  it('should not get a nonexistent category', async () => {
    const spyFindById = jest.spyOn(categoryRepository, 'findById');
    const arrange = {
      id: 'nonexistent-id',
    };

    expect(() => sut.execute(arrange)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID: ${arrange.id}`),
    );
    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith(arrange);
    expect(spyFindById).toBeCalledTimes(1);
  });

  it('should get a category', async () => {
    const spyFindById = jest.spyOn(categoryRepository, 'findById');
    const arrange = {
      id: categoryRepository.items[0].id,
    };

    const result = await sut.execute(arrange);

    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith(arrange);
    expect(spyFindById).toBeCalledTimes(1);
    expect(result).toStrictEqual({
      id: categoryRepository.items[0].id,
      name: categoryRepository.items[0].name,
      description: categoryRepository.items[0].description,
      is_active: categoryRepository.items[0].is_active,
      created_at: categoryRepository.items[0].created_at,
      updated_at: categoryRepository.items[0].updated_at,
    });
  });
});
