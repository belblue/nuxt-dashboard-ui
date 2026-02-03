import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DataTable from "./DataTable.vue";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", sortable: true, width: "120px" },
];

const rows = [
  { id: 1, name: "Charlie", email: "charlie@test.com", role: "Admin" },
  { id: 2, name: "Alice", email: "alice@test.com", role: "User" },
  { id: 3, name: "Bob", email: "bob@test.com", role: "Editor" },
];

describe("DataTable", () => {
  // Rendering
  it("renders column headers", () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const headers = wrapper.findAll("th");
    expect(headers).toHaveLength(3);
    expect(headers[0].text()).toContain("Name");
    expect(headers[1].text()).toContain("Email");
    expect(headers[2].text()).toContain("Role");
  });

  it("renders row data in cells", () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const cells = wrapper.findAll("td");
    expect(cells[0].text()).toBe("Charlie");
    expect(cells[1].text()).toBe("charlie@test.com");
    expect(cells[2].text()).toBe("Admin");
  });

  it("renders correct number of rows", () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const dataRows = wrapper.findAll("tbody tr");
    expect(dataRows).toHaveLength(3);
  });

  it("shows empty message when rows is empty", () => {
    const wrapper = mount(DataTable, { props: { columns, rows: [] } });
    expect(wrapper.text()).toContain("No data available");
  });

  it("shows custom empty message", () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows: [], emptyMessage: "Nothing here" },
    });
    expect(wrapper.text()).toContain("Nothing here");
  });

  it("shows skeleton rows when loading", () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows, loading: true },
    });
    const skeletons = wrapper.findAll(".data-table__skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
    expect(wrapper.text()).not.toContain("Charlie");
  });

  // Sorting
  it("emits sort when clicking a sortable header", async () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const nameHeader = wrapper.findAll("th")[0];
    await nameHeader.trigger("click");
    expect(wrapper.emitted("sort")).toHaveLength(1);
    expect(wrapper.emitted("sort")![0]).toEqual([
      { key: "name", direction: "asc" },
    ]);
  });

  it("does not emit sort for non-sortable headers", async () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const emailHeader = wrapper.findAll("th")[1];
    await emailHeader.trigger("click");
    expect(wrapper.emitted("sort")).toBeUndefined();
  });

  it("sorts rows internally when sort prop is not provided", async () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const nameHeader = wrapper.findAll("th")[0];
    await nameHeader.trigger("click");

    const firstCell = wrapper.findAll("tbody tr")[0].findAll("td")[0];
    expect(firstCell.text()).toBe("Alice");
  });

  it("shows sort icon on sortable headers", () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const nameHeader = wrapper.findAll("th")[0];
    expect(nameHeader.find(".data-table__sort-icon").exists()).toBe(true);

    const emailHeader = wrapper.findAll("th")[1];
    expect(emailHeader.find(".data-table__sort-icon").exists()).toBe(false);
  });

  it("sets aria-sort on sorted column", async () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const nameHeader = wrapper.findAll("th")[0];
    await nameHeader.trigger("click");
    expect(nameHeader.attributes("aria-sort")).toBe("ascending");
  });

  // Slots
  it("cell slot receives correct scoped data", () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows },
      slots: {
        cell: `<template #cell="{ value, rowIndex }">
          <span class="custom">{{ value }}-{{ rowIndex }}</span>
        </template>`,
      },
    });
    const customs = wrapper.findAll(".custom");
    expect(customs[0].text()).toBe("Charlie-0");
  });

  it("empty slot replaces default message", () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows: [] },
      slots: {
        empty: '<div class="custom-empty">Custom empty</div>',
      },
    });
    expect(wrapper.find(".custom-empty").exists()).toBe(true);
    expect(wrapper.text()).toContain("Custom empty");
  });

  it("toolbar slot renders above the table", () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows },
      slots: {
        toolbar: '<div class="my-toolbar">Search</div>',
      },
    });
    expect(wrapper.find(".my-toolbar").exists()).toBe(true);
    expect(wrapper.find(".data-table__toolbar").exists()).toBe(true);
  });

  // Row click
  it("emits row-click when clickable row is clicked", async () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows, clickableRows: true },
    });
    const firstRow = wrapper.findAll("tbody tr")[0];
    await firstRow.trigger("click");
    expect(wrapper.emitted("row-click")).toHaveLength(1);
    expect(wrapper.emitted("row-click")![0][0]).toEqual(rows[0]);
    expect(wrapper.emitted("row-click")![0][1]).toBe(0);
  });

  it("does not emit row-click when clickableRows is false", async () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const firstRow = wrapper.findAll("tbody tr")[0];
    await firstRow.trigger("click");
    expect(wrapper.emitted("row-click")).toBeUndefined();
  });

  // Keyboard
  it("sorts on Enter key on sortable header", async () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const nameHeader = wrapper.findAll("th")[0];
    await nameHeader.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("sort")).toHaveLength(1);
  });

  it("sorts on Space key on sortable header", async () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const nameHeader = wrapper.findAll("th")[0];
    await nameHeader.trigger("keydown", { key: " " });
    expect(wrapper.emitted("sort")).toHaveLength(1);
  });

  it("emits row-click on Enter key on clickable row", async () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows, clickableRows: true },
    });
    const firstRow = wrapper.findAll("tbody tr")[0];
    await firstRow.trigger("keydown.enter");
    expect(wrapper.emitted("row-click")).toHaveLength(1);
  });

  // Accessibility
  it("has caption when caption prop is provided", () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows, caption: "Team members" },
    });
    const caption = wrapper.find("caption");
    expect(caption.exists()).toBe(true);
    expect(caption.text()).toBe("Team members");
  });

  it("has no caption when caption prop is not provided", () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    expect(wrapper.find("caption").exists()).toBe(false);
  });

  it("sortable headers have tabindex", () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const nameHeader = wrapper.findAll("th")[0];
    const emailHeader = wrapper.findAll("th")[1];
    expect(nameHeader.attributes("tabindex")).toBe("0");
    expect(emailHeader.attributes("tabindex")).toBeUndefined();
  });

  it("clickable rows have tabindex and role=button", () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows, clickableRows: true },
    });
    const firstRow = wrapper.findAll("tbody tr")[0];
    expect(firstRow.attributes("tabindex")).toBe("0");
    expect(firstRow.attributes("role")).toBe("button");
  });

  it("headers have scope=col", () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    wrapper.findAll("th").forEach((h) => {
      expect(h.attributes("scope")).toBe("col");
    });
  });

  // Variants
  it("applies striped class", () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows, striped: true },
    });
    expect(wrapper.find(".data-table--striped").exists()).toBe(true);
  });

  it("applies hoverable class by default", () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    expect(wrapper.find(".data-table--hoverable").exists()).toBe(true);
  });

  it("applies column width style", () => {
    const wrapper = mount(DataTable, { props: { columns, rows } });
    const roleHeader = wrapper.findAll("th")[2];
    expect(roleHeader.attributes("style")).toContain("width: 120px");
  });
});
