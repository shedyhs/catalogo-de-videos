import { Category } from 'category/domain/entities/category';
import { CategoryRepository } from 'category/domain/repositories/category.repository';
import { InMemorySearchableRepository } from '../../@seedwork/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '../../@seedwork/domain/repositories/searchable-repository.contract';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields = ['name', 'created_at'];

  protected async applySort(
    items: Category[],
    sort: string,
    sort_dir: SortDirection,
  ): Promise<Category[]> {
    if (!sort) {
      return super.applySort(items, 'created_at', 'desc');
    }
    return super.applySort(items, sort, sort_dir);
  }

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter,
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}
