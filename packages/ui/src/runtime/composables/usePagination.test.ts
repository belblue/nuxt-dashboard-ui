import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  function create(opts: { page?: number; total?: number; perPage?: number; maxVisible?: number } = {}) {
    const page = ref(opts.page ?? 1);
    const total = ref(opts.total ?? 100);
    const perPage = ref(opts.perPage ?? 10);
    return {
      page,
      total,
      perPage,
      ...usePagination({ page, total, perPage, maxVisible: opts.maxVisible }),
    };
  }

  // ── totalPages ──────────────────────────────────────────

  it("calculates totalPages correctly", () => {
    const { totalPages } = create({ total: 100, perPage: 10 });
    expect(totalPages.value).toBe(10);
  });

  it("rounds up totalPages for partial last page", () => {
    const { totalPages } = create({ total: 101, perPage: 10 });
    expect(totalPages.value).toBe(11);
  });

  it("returns 1 totalPages when total is 0", () => {
    const { totalPages } = create({ total: 0, perPage: 10 });
    expect(totalPages.value).toBe(1);
  });

  // ── from / to ──────────────────────────────────────────

  it("calculates from and to for first page", () => {
    const { from, to } = create({ page: 1, total: 50, perPage: 10 });
    expect(from.value).toBe(1);
    expect(to.value).toBe(10);
  });

  it("calculates from and to for middle page", () => {
    const { from, to } = create({ page: 3, total: 50, perPage: 10 });
    expect(from.value).toBe(21);
    expect(to.value).toBe(30);
  });

  it("clamps to on last page", () => {
    const { from, to } = create({ page: 5, total: 43, perPage: 10 });
    expect(from.value).toBe(41);
    expect(to.value).toBe(43);
  });

  it("returns from 0 when total is 0", () => {
    const { from, to } = create({ page: 1, total: 0, perPage: 10 });
    expect(from.value).toBe(0);
    expect(to.value).toBe(0);
  });

  // ── hasPrev / hasNext ──────────────────────────────────

  it("hasPrev is false on first page", () => {
    const { hasPrev } = create({ page: 1 });
    expect(hasPrev.value).toBe(false);
  });

  it("hasPrev is true on page > 1", () => {
    const { hasPrev } = create({ page: 2 });
    expect(hasPrev.value).toBe(true);
  });

  it("hasNext is false on last page", () => {
    const { hasNext } = create({ page: 10, total: 100, perPage: 10 });
    expect(hasNext.value).toBe(false);
  });

  it("hasNext is true when not on last page", () => {
    const { hasNext } = create({ page: 9, total: 100, perPage: 10 });
    expect(hasNext.value).toBe(true);
  });

  // ── navigation ──────────────────────────────────────────

  it("prevPage decrements page", () => {
    const { page, prevPage } = create({ page: 3 });
    prevPage();
    expect(page.value).toBe(2);
  });

  it("prevPage does nothing on page 1", () => {
    const { page, prevPage } = create({ page: 1 });
    prevPage();
    expect(page.value).toBe(1);
  });

  it("nextPage increments page", () => {
    const { page, nextPage } = create({ page: 3, total: 100, perPage: 10 });
    nextPage();
    expect(page.value).toBe(4);
  });

  it("nextPage does nothing on last page", () => {
    const { page, nextPage } = create({ page: 10, total: 100, perPage: 10 });
    nextPage();
    expect(page.value).toBe(10);
  });

  it("goToPage clamps to valid range", () => {
    const { page, goToPage } = create({ total: 50, perPage: 10 });
    goToPage(0);
    expect(page.value).toBe(1);
    goToPage(100);
    expect(page.value).toBe(5);
  });

  // ── visiblePages ──────────────────────────────────────────

  it("shows all pages when total fits in maxVisible", () => {
    const { visiblePages } = create({ total: 50, perPage: 10, maxVisible: 7 });
    expect(visiblePages.value).toEqual([1, 2, 3, 4, 5]);
  });

  it("shows ellipsis at end when on first page of many", () => {
    const { visiblePages } = create({ page: 1, total: 200, perPage: 10, maxVisible: 7 });
    const pages = visiblePages.value;
    expect(pages[0]).toBe(1);
    expect(pages[pages.length - 1]).toBe(20);
    expect(pages).toContain("...");
  });

  it("shows ellipsis at start when on last page of many", () => {
    const { visiblePages } = create({ page: 20, total: 200, perPage: 10, maxVisible: 7 });
    const pages = visiblePages.value;
    expect(pages[0]).toBe(1);
    expect(pages[pages.length - 1]).toBe(20);
    expect(pages).toContain("...");
  });

  it("shows ellipsis on both sides when in the middle", () => {
    const { visiblePages } = create({ page: 10, total: 200, perPage: 10, maxVisible: 7 });
    const pages = visiblePages.value;
    expect(pages[0]).toBe(1);
    expect(pages[1]).toBe("...");
    expect(pages[pages.length - 1]).toBe(20);
    expect(pages[pages.length - 2]).toBe("...");
    expect(pages).toContain(10);
  });

  // ── reactivity ──────────────────────────────────────────

  it("reacts to total changes", () => {
    const { total, totalPages } = create({ total: 100, perPage: 10 });
    expect(totalPages.value).toBe(10);
    total.value = 200;
    expect(totalPages.value).toBe(20);
  });

  it("reacts to perPage changes", () => {
    const { perPage, totalPages } = create({ total: 100, perPage: 10 });
    expect(totalPages.value).toBe(10);
    perPage.value = 20;
    expect(totalPages.value).toBe(5);
  });
});
