import { describe, it, expect, vi } from "vitest";
import { paginateAll } from "./paginate-all";

interface Row {
  _id: string;
}

/** Builds a fake API with `total` rows that pages like the real endpoints do. */
const makeApi = (total: number, pageSizeFromServer = Infinity) => {
  const all: Row[] = Array.from({ length: total }, (_, i) => ({ _id: `row-${i + 1}` }));
  const calls: { page?: number; limit?: number }[] = [];

  const fetchPage = vi.fn(
    async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
      calls.push({ page, limit });
      const size = Math.min(limit, pageSizeFromServer);
      const start = (page - 1) * size;
      return {
        data: all.slice(start, start + size),
        meta: { total, page, limit: size, totalPages: Math.max(1, Math.ceil(total / size)) },
      };
    }
  );

  return { fetchPage, calls };
};

describe("paginateAll", () => {
  it("fetches every page sequentially, one request at a time", async () => {
    const { fetchPage, calls } = makeApi(5);

    const result = await paginateAll<Row>((args) => fetchPage(args), {}, { pageSize: 2 });

    expect(result.rows.map((r) => r._id)).toEqual([
      "row-1",
      "row-2",
      "row-3",
      "row-4",
      "row-5",
    ]);
    expect(result.pagesFetched).toBe(3);
    expect(calls).toEqual([
      { page: 1, limit: 2 },
      { page: 2, limit: 2 },
      { page: 3, limit: 2 },
    ]);
  });

  it("never runs two page requests in parallel", async () => {
    let inFlight = 0;
    const maxInFlight: number[] = [];
    const { fetchPage } = makeApi(6);

    await paginateAll<Row>(
      async (args) => {
        inFlight += 1;
        maxInFlight.push(inFlight);
        const page = await fetchPage(args);
        inFlight -= 1;
        return page;
      },
      {},
      { pageSize: 2 }
    );

    expect(Math.max(...maxInFlight)).toBe(1);
  });

  it("stops after a single page when the API reports one page", async () => {
    const { fetchPage, calls } = makeApi(3);

    const result = await paginateAll<Row>((args) => fetchPage(args), {}, { pageSize: 100 });

    expect(result.rows).toHaveLength(3);
    expect(result.pagesFetched).toBe(1);
    expect(calls).toHaveLength(1);
  });

  it("keeps passing the caller's filters to every page", async () => {
    const { fetchPage } = makeApi(4);
    const seen: { search?: string; page?: number }[] = [];

    await paginateAll<Row, { search?: string; page?: number; limit?: number }>(
      async (args) => {
        seen.push({ search: args.search, page: args.page });
        return fetchPage(args);
      },
      { search: "paid buyers" },
      { pageSize: 2 }
    );

    expect(seen).toEqual([
      { search: "paid buyers", page: 1 },
      { search: "paid buyers", page: 2 },
    ]);
  });

  it("picks up rows added while the export is running", async () => {
    const all: Row[] = Array.from({ length: 3 }, (_, i) => ({ _id: `row-${i + 1}` }));

    const result = await paginateAll<Row>(
      async ({ page = 1, limit = 2 } = {}) => {
        // A buyer lands on page 2 between the first and second request.
        if (page === 1) all.push({ _id: "row-4" });
        const start = (page - 1) * limit;
        return {
          data: all.slice(start, start + limit),
          meta: { total: all.length, page, limit, totalPages: Math.ceil(all.length / limit) },
        };
      },
      {},
      { pageSize: 2 }
    );

    expect(result.rows.map((r) => r._id)).toEqual(["row-1", "row-2", "row-3", "row-4"]);
    expect(result.pagesFetched).toBe(2);
  });

  it("stops when a page comes back empty", async () => {
    const { fetchPage, calls } = makeApi(2);

    const result = await paginateAll<Row>((args) => fetchPage(args), {}, { pageSize: 2 });

    expect(result.pagesFetched).toBe(1);
    expect(calls).toHaveLength(1);
  });

  it("never exceeds maxPages even if the API reports more pages", async () => {
    const fetchPage = vi.fn(async ({ page = 1, limit = 2 } = {}) => ({
      data: [{ _id: `row-${page}` }],
      meta: { total: 10_000, page, limit, totalPages: 5_000 },
    }));

    const result = await paginateAll<Row>((args) => fetchPage(args), {}, { pageSize: 2, maxPages: 4 });

    expect(result.pagesFetched).toBe(4);
    expect(result.rows).toHaveLength(4);
    expect(fetchPage).toHaveBeenCalledTimes(4);
  });

  it("reports progress before each page request", async () => {
    const { fetchPage } = makeApi(5);
    const progress: { page: number; totalPages: number; rowsSoFar: number }[] = [];

    await paginateAll<Row>((args) => fetchPage(args), {}, {
      pageSize: 2,
      onProgress: (info) => progress.push(info),
    });

    expect(progress).toEqual([
      { page: 1, totalPages: 1, rowsSoFar: 0 },
      { page: 2, totalPages: 3, rowsSoFar: 2 },
      { page: 3, totalPages: 3, rowsSoFar: 4 },
    ]);
  });

  it("returns no rows when the filtered list is empty", async () => {
    const { fetchPage } = makeApi(0);

    const result = await paginateAll<Row>((args) => fetchPage(args), {}, { pageSize: 10 });

    expect(result.rows).toEqual([]);
    expect(result.pagesFetched).toBe(1);
  });
});
