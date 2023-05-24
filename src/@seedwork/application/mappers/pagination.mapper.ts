import { SearchResult } from '@seedwork/domain/repositories/searchable-repository.contract';
import { Legible } from '@seedwork/domain/utils/legible-interface';
import { PaginationOutput } from '../dto/pagination-output.dto';

export class PaginationMapper {
  static toOutput(
    result: SearchResult,
  ): Legible<Omit<PaginationOutput, 'items'>> {
    return {
      total: result.total,
      current_page: result.current_page,
      per_page: result.per_page,
      last_page: result.last_page,
    };
  }
}
