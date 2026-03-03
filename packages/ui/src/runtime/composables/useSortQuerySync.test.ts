import { describe, it, expect, vi, beforeEach } from "vitest";
import { reactive, nextTick } from "vue";
import { useSortQuerySync } from "./useSortQuerySync";

const mockQuery = reactive<Record<string, string | undefined>>({});
const mockReplace = vi.fn();

vi.mock("#imports", () => ({
  useRoute: () => ({ query: mockQuery }),
  useRouter: () => ({ replace: mockReplace }),
}));

describe("useSortQuerySync", () => {
  beforeEach(() => {
    Object.keys(mockQuery).forEach((k) => delete mockQuery[k]);
    mockReplace.mockClear();
  });

  // ── Reading sort from query ──────────────────────────────────

  it("returns null when no query params are present", () => {
    const { sort } = useSortQuerySync();
    expect(sort.value).toBeNull();
  });

  it("reads sort state from default query params", () => {
    mockQuery.sort = "name";
    mockQuery.dir = "asc";
    const { sort } = useSortQuerySync();
    expect(sort.value).toEqual({ key: "name", direction: "asc" });
  });

  it("reads desc direction", () => {
    mockQuery.sort = "price";
    mockQuery.dir = "desc";
    const { sort } = useSortQuerySync();
    expect(sort.value).toEqual({ key: "price", direction: "desc" });
  });

  it("returns null when sort key present but direction missing", () => {
    mockQuery.sort = "name";
    const { sort } = useSortQuerySync();
    expect(sort.value).toBeNull();
  });

  it("returns null when direction present but sort key missing", () => {
    mockQuery.dir = "asc";
    const { sort } = useSortQuerySync();
    expect(sort.value).toBeNull();
  });

  it("returns null for invalid direction values", () => {
    mockQuery.sort = "name";
    mockQuery.dir = "invalid";
    const { sort } = useSortQuerySync();
    expect(sort.value).toBeNull();
  });

  // ── Default sort ─────────────────────────────────────────────

  it("returns defaultSort when no query params are present", () => {
    const { sort } = useSortQuerySync({
      defaultSort: { key: "id", direction: "asc" },
    });
    expect(sort.value).toEqual({ key: "id", direction: "asc" });
  });

  it("query params override defaultSort", () => {
    mockQuery.sort = "name";
    mockQuery.dir = "desc";
    const { sort } = useSortQuerySync({
      defaultSort: { key: "id", direction: "asc" },
    });
    expect(sort.value).toEqual({ key: "name", direction: "desc" });
  });

  // ── Custom param names ───────────────────────────────────────

  it("uses custom sortParam name", () => {
    mockQuery.orderBy = "email";
    mockQuery.dir = "asc";
    const { sort } = useSortQuerySync({ sortParam: "orderBy" });
    expect(sort.value).toEqual({ key: "email", direction: "asc" });
  });

  it("uses custom directionParam name", () => {
    mockQuery.sort = "email";
    mockQuery.order = "desc";
    const { sort } = useSortQuerySync({ directionParam: "order" });
    expect(sort.value).toEqual({ key: "email", direction: "desc" });
  });

  it("uses both custom param names together", () => {
    mockQuery.col = "date";
    mockQuery.order = "asc";
    const { sort } = useSortQuerySync({ sortParam: "col", directionParam: "order" });
    expect(sort.value).toEqual({ key: "date", direction: "asc" });
  });

  // ── setSort ──────────────────────────────────────────────────

  it("sets sort query params via router.replace", () => {
    const { setSort } = useSortQuerySync();
    setSort({ key: "name", direction: "asc" });
    expect(mockReplace).toHaveBeenCalledWith({
      query: { sort: "name", dir: "asc" },
    });
  });

  it("sets desc direction", () => {
    const { setSort } = useSortQuerySync();
    setSort({ key: "price", direction: "desc" });
    expect(mockReplace).toHaveBeenCalledWith({
      query: { sort: "price", dir: "desc" },
    });
  });

  it("removes sort params when direction is null", () => {
    mockQuery.sort = "name";
    mockQuery.dir = "asc";
    const { setSort } = useSortQuerySync();
    setSort({ key: "name", direction: null });
    expect(mockReplace).toHaveBeenCalledWith({
      query: {},
    });
  });

  it("preserves existing query params when setting sort", () => {
    mockQuery.page = "2";
    mockQuery.filter = "active";
    const { setSort } = useSortQuerySync();
    setSort({ key: "name", direction: "asc" });
    expect(mockReplace).toHaveBeenCalledWith({
      query: { page: "2", filter: "active", sort: "name", dir: "asc" },
    });
  });

  it("preserves existing query params when clearing sort", () => {
    mockQuery.page = "2";
    mockQuery.sort = "name";
    mockQuery.dir = "asc";
    const { setSort } = useSortQuerySync();
    setSort({ key: "name", direction: null });
    expect(mockReplace).toHaveBeenCalledWith({
      query: { page: "2" },
    });
  });

  it("uses custom param names in setSort", () => {
    const { setSort } = useSortQuerySync({ sortParam: "col", directionParam: "order" });
    setSort({ key: "date", direction: "desc" });
    expect(mockReplace).toHaveBeenCalledWith({
      query: { col: "date", order: "desc" },
    });
  });

  // ── Reactivity ───────────────────────────────────────────────

  it("sort reacts to query param changes", async () => {
    const { sort } = useSortQuerySync();
    expect(sort.value).toBeNull();

    mockQuery.sort = "name";
    mockQuery.dir = "asc";
    await nextTick();
    expect(sort.value).toEqual({ key: "name", direction: "asc" });

    mockQuery.dir = "desc";
    await nextTick();
    expect(sort.value).toEqual({ key: "name", direction: "desc" });

    delete mockQuery.sort;
    delete mockQuery.dir;
    await nextTick();
    expect(sort.value).toBeNull();
  });
});
