export interface PaginatedMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface PaginatedPage<T> {
  data?: T[] | null;
  meta?: PaginatedMeta | null;
}

export interface PaginateAllOptions {
  /** Rows requested per call — the server caps this (100 for bootcamp admin APIs). */
  pageSize?: number;
  /** Safety guard so a moving dataset can never spin the loop forever. */
  maxPages?: number;
  /** Called right before each page request, useful for progress toasts. */
  onProgress?: (progress: { page: number; totalPages: number; rowsSoFar: number }) => void;
}

export interface PaginateAllResult<T> {
  rows: T[];
  pagesFetched: number;
}

/**
 * Walks a paginated API **one page at a time** and returns every row.
 *
 * Each page is awaited before the next request starts, so exports are a series
 * of small sequential requests instead of one huge one. `meta.totalPages` is
 * re-read from every response, which keeps rows added mid-export included while
 * stopping as soon as the last page is reached.
 */
export const paginateAll = async <
  T,
  TArgs extends { page?: number; limit?: number } = { page?: number; limit?: number },
>(
  fetchPage: (args: TArgs) => Promise<PaginatedPage<T>>,
  baseArgs: TArgs,
  options: PaginateAllOptions = {}
): Promise<PaginateAllResult<T>> => {
  const pageSize = Math.max(1, options.pageSize ?? 100);
  const maxPages = Math.max(1, options.maxPages ?? 500);

  const rows: T[] = [];
  let currentPage = 1;
  let totalPages = 1;
  let pagesFetched = 0;

  do {
    options.onProgress?.({ page: currentPage, totalPages, rowsSoFar: rows.length });

    const response = await fetchPage({ ...baseArgs, page: currentPage, limit: pageSize });
    const pageRows = response?.data ?? [];
    rows.push(...pageRows);
    pagesFetched += 1;

    // `Math.max` keeps the loop moving forward even if the dataset shrank.
    totalPages = Math.max(currentPage, response?.meta?.totalPages ?? currentPage);

    if (pageRows.length === 0) break;

    currentPage += 1;
  } while (currentPage <= totalPages && currentPage <= maxPages);

  return { rows, pagesFetched };
};
