export type PaginationOutput<Item = any> = {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  items: Item[];
};
