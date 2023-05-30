import { SearchParams } from '@seedwork/domain/repositories/searchable-repository.contract';
import { CategoryMapper } from 'category/application/mappers/category.mapper';
import { Category } from 'category/domain/entities/category';
import { CategoryInMemoryRepository } from 'category/infra/category.in-memory.repository';
import { ListCategoriesUseCase } from '../list-categories.usecase';

describe('ListCategoriesUseCase Unit Tests', () => {
  let categoryRepository: CategoryInMemoryRepository;
  let sut: ListCategoriesUseCase;
  let spySut: jest.SpyInstance;
  let spySearch: jest.SpyInstance;
  let items: Category[];

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    sut = new ListCategoriesUseCase(categoryRepository);
    spySut = jest.spyOn(sut, 'execute');
    spySearch = jest.spyOn(categoryRepository, 'search');
    const dataReference = new Date().getTime();
    items = [
      new Category({
        name: 'action',
        is_active: true,
        created_at: new Date(dataReference - 2000),
      }),
      new Category({
        name: 'adventure',
        is_active: false,
        created_at: new Date(dataReference - 1000),
      }),
      new Category({
        name: 'horror',
        is_active: true,
        created_at: new Date(dataReference - 3000),
      }),
    ];
  });

  it('should be able to list if not have entities registred', async () => {
    const result = await sut.execute({});
    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith({});
    expect(spySearch).toBeCalledTimes(1);
    expect(spySearch).toHaveBeenCalledWith(new SearchParams({}));
    expect(result).toStrictEqual({
      total: 0,
      current_page: 1,
      per_page: 15,
      last_page: 0,
      items: [],
    });
  });

  it('should be able to order categories by created_at if not receive a sort param', async () => {
    categoryRepository.items = items;
    const result = await sut.execute({});
    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith({});
    expect(spySearch).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      current_page: 1,
      per_page: 15,
      last_page: 1,
      total: 3,
      items: [items[1], items[0], items[2]].map((item) =>
        CategoryMapper.toOutput(item),
      ),
    });
  });

  it('should be able to order categories by name if received as a sort param', async () => {
    categoryRepository.items = items;
    const result = await sut.execute({ sort: 'name', sort_dir: 'asc' });
    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith({ sort: 'name', sort_dir: 'asc' });
    expect(spySearch).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      current_page: 1,
      per_page: 15,
      last_page: 1,
      total: 3,
      items: [items[0], items[1], items[2]].map((item) =>
        CategoryMapper.toOutput(item),
      ),
    });
  });

  it('should be able to paginate categories', async () => {
    categoryRepository.items = items;
    const result = await sut.execute({ page: 2, per_page: 2 });
    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith({ page: 2, per_page: 2 });
    expect(spySearch).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      current_page: 2,
      per_page: 2,
      last_page: 2,
      total: 3,
      items: [items[2]].map((item) => CategoryMapper.toOutput(item)),
    });
  });

  it('should be able to filter categories', async () => {
    categoryRepository.items = items;
    const result = await sut.execute({ filter: 'action' });
    expect(spySut).toBeCalledTimes(1);
    expect(spySut).toBeCalledWith({ filter: 'action' });
    expect(spySearch).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      current_page: 1,
      per_page: 15,
      last_page: 1,
      total: 1,
      items: [items[0]].map((item) => CategoryMapper.toOutput(item)),
    });
  });
});
