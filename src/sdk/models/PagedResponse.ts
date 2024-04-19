export class PagedResponse<T> {
  Items: T[];
  PageCount: number;
  CurrentPage: number;
  ItemCount: number;
  MaxCountPerPage: number;
  ContinuationToken: string;
}
