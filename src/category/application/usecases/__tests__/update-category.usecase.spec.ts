import { NotFoundError } from '@seedwork/domain/errors/not-found.error';
import { Category } from 'category/domain/entities/category';
import { CategoryInMemoryRepository } from 'category/infra/category.in-memory.repository';
import { UpdateCategoryUseCase } from '../update-category.usecase';

describe('UpdateCategoryUseCase Unit Test', () => {
  let sut: UpdateCategoryUseCase;
  let categoryRepository: CategoryInMemoryRepository;
  let spySut: jest.SpyInstance;
  let category: Category;
  let categoryUpdatedAt: Date;
  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    sut = new UpdateCategoryUseCase(categoryRepository);
    spySut = jest.spyOn(sut, 'execute');
    const dateRef = new Date().getTime();
    category = new Category({
      name: 'Action',
      description: 'Action films',
      is_active: true,
      created_at: new Date(dateRef - 2000),
      updated_at: new Date(dateRef - 1000),
    });
    categoryUpdatedAt = category.updated_at;
    categoryRepository.items = [category];
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update');
    const arrange = {
      id: category.id,
      name: 'Horror',
      description: 'Its a BuUuU films',
      is_active: false,
    };
    const result = await sut.execute(arrange);
    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith(arrange);
    expect(spyUpdate).toBeCalledTimes(1);
    expect(result).toStrictEqual({
      id: category.id,
      name: 'Horror',
      description: 'Its a BuUuU films',
      is_active: false,
      created_at: category.created_at,
      updated_at: result.updated_at,
    });
    expect(result.updated_at.getTime()).toBeGreaterThan(
      categoryUpdatedAt.getTime(),
    );
  });

  it('should throw an error when update a nonexistent category', async () => {
    const spyFindById = jest.spyOn(categoryRepository, 'findById');
    const arrange = {
      id: 'nonexistent-id',
      name: 'Horror',
      description: 'Its a BuUuU films',
      is_active: false,
    };
    expect(() => sut.execute(arrange)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID: ${arrange.id}`),
    );
    expect(spyFindById).toBeCalledWith(arrange.id);
    expect(spyFindById).toBeCalledTimes(1);
  });
});
