import { InMemorySearchableRepository } from '@seedwork/domain/repositories/in-memory.repository';
import { Category } from 'category/domain/entities/category';
import { CategoryRepository } from 'category/domain/repositories/category.repository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields: string[] = ['name'];

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
