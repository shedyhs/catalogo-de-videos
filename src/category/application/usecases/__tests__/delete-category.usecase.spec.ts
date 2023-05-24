import { NotFoundError } from '../../../../@seedwork/domain/errors/not-found.error';
import { Category } from '../../../domain/entities/category';
import { CategoryInMemoryRepository } from '../../../infra/category.in-memory.repository';
import { DeleteCategoryUseCase } from '../delete-category.usecase';

describe('DeleteCategoryUseCase Unit Test', () => {
  let sut: DeleteCategoryUseCase;
  let categoryRepository: CategoryInMemoryRepository;
  let spySut: jest.SpyInstance;
  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    categoryRepository.insert(new Category({ name: 'category' }));
    sut = new DeleteCategoryUseCase(categoryRepository);
    spySut = jest.spyOn(sut, 'execute');
  });

  it('should not delete a nonexistent category', async () => {
    const spyDelete = jest.spyOn(categoryRepository, 'delete');
    const arrange = {
      id: 'nonexistent-id',
    };

    expect(() => sut.execute(arrange)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID: ${arrange.id}`),
    );
    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith(arrange);
    expect(spyDelete).toBeCalledTimes(1);
  });

  it('should delete a category', async () => {
    const spyDelete = jest.spyOn(categoryRepository, 'delete');
    const arrange = {
      id: categoryRepository.items[0].id,
    };
    const result = await sut.execute(arrange);
    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith(arrange);
    expect(spyDelete).toBeCalledTimes(1);
    expect(result).toStrictEqual(undefined);
    expect(categoryRepository.items).toHaveLength(0);
  });
});
