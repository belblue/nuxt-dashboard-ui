import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Pagination from "./Pagination.vue";

describe("Pagination", () => {
  // ── Rendering ──────────────────────────────────────────────

  it("renders pagination nav", () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, perPage: 10 },
    });
    expect(wrapper.find("nav").exists()).toBe(true);
    expect(wrapper.find("nav").attributes("aria-label")).toBe("Pagination");
  });

  it("shows info text by default", () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, perPage: 10, page: 1 },
    });
    expect(wrapper.find(".pagination__info").text()).toBe("1-10 of 100");
  });

  it("shows 'No items' when total is 0", () => {
    const wrapper = mount(Pagination, {
      props: { total: 0, perPage: 10 },
    });
    expect(wrapper.find(".pagination__info").text()).toBe("No items");
  });

  it("hides info when showInfo is false", () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, perPage: 10, showInfo: false },
    });
    expect(wrapper.find(".pagination__info").exists()).toBe(false);
  });

  it("does not render page list when only 1 page", () => {
    const wrapper = mount(Pagination, {
      props: { total: 5, perPage: 10 },
    });
    expect(wrapper.find(".pagination__list").exists()).toBe(false);
  });

  it("renders page buttons for multiple pages", () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10 },
    });
    const buttons = wrapper.findAll(".pagination__btn--page");
    expect(buttons.length).toBe(5);
  });

  it("renders ellipsis for many pages", () => {
    const wrapper = mount(Pagination, {
      props: { total: 200, perPage: 10, page: 1 },
    });
    expect(wrapper.findAll(".pagination__ellipsis").length).toBeGreaterThan(0);
  });

  // ── Active state ──────────────────────────────────────────

  it("marks current page as active", () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, page: 3 },
    });
    const active = wrapper.find(".pagination__btn--active");
    expect(active.text()).toBe("3");
    expect(active.attributes("aria-current")).toBe("page");
  });

  // ── Navigation ──────────────────────────────────────────

  it("emits update:page when clicking a page button", async () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, page: 1 },
    });
    const page3 = wrapper
      .findAll(".pagination__btn--page")
      .find((b) => b.text() === "3");
    await page3!.trigger("click");
    expect(wrapper.emitted("update:page")).toEqual([[3]]);
  });

  it("emits update:page on prev click", async () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, page: 3 },
    });
    await wrapper.find(".pagination__btn--prev").trigger("click");
    expect(wrapper.emitted("update:page")).toEqual([[2]]);
  });

  it("emits update:page on next click", async () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, page: 3 },
    });
    await wrapper.find(".pagination__btn--next").trigger("click");
    expect(wrapper.emitted("update:page")).toEqual([[4]]);
  });

  // ── Disabled state ──────────────────────────────────────

  it("disables prev button on first page", () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, page: 1 },
    });
    const prev = wrapper.find(".pagination__btn--prev");
    expect(prev.attributes("disabled")).toBeDefined();
    expect(prev.attributes("aria-disabled")).toBe("true");
  });

  it("disables next button on last page", () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, page: 5 },
    });
    const next = wrapper.find(".pagination__btn--next");
    expect(next.attributes("disabled")).toBeDefined();
    expect(next.attributes("aria-disabled")).toBe("true");
  });

  it("does not emit on prev click when disabled", async () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, page: 1 },
    });
    await wrapper.find(".pagination__btn--prev").trigger("click");
    expect(wrapper.emitted("update:page")).toBeUndefined();
  });

  it("does not emit on next click when disabled", async () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, page: 5 },
    });
    await wrapper.find(".pagination__btn--next").trigger("click");
    expect(wrapper.emitted("update:page")).toBeUndefined();
  });

  // ── Accessibility ──────────────────────────────────────

  it("prev button has aria-label", () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10 },
    });
    expect(wrapper.find(".pagination__btn--prev").attributes("aria-label")).toBe(
      "Previous page"
    );
  });

  it("next button has aria-label", () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10 },
    });
    expect(wrapper.find(".pagination__btn--next").attributes("aria-label")).toBe(
      "Next page"
    );
  });

  it("page buttons have aria-label", () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10 },
    });
    const page1 = wrapper
      .findAll(".pagination__btn--page")
      .find((b) => b.text() === "1");
    expect(page1!.attributes("aria-label")).toBe("Page 1");
  });

  // ── Info slot ──────────────────────────────────────────

  it("renders custom info via slot", () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, perPage: 10, page: 2 },
      slots: {
        info: `<template #info="{ from, to, total }">Showing {{ from }} to {{ to }} ({{ total }} total)</template>`,
      },
    });
    expect(wrapper.find(".pagination__info").text()).toBe(
      "Showing 11 to 20 (100 total)"
    );
  });
});
