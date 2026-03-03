import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Dropdown from "./Dropdown.vue";
import type { DropdownItem } from "./types";

const items: DropdownItem[] = [
  { key: "edit", label: "Edit" },
  { key: "duplicate", label: "Duplicate" },
  { key: "delete", label: "Delete" },
];

const itemsWithDisabled: DropdownItem[] = [
  { key: "edit", label: "Edit" },
  { key: "archive", label: "Archive", disabled: true },
  { key: "delete", label: "Delete" },
];

const itemsWithDivider: DropdownItem[] = [
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete", divider: true },
];

function mountDropdown(
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {}
) {
  return mount(Dropdown, {
    props: { items, ...props },
    slots: {
      default: '<button class="trigger-btn">Actions</button>',
      ...slots,
    },
    attachTo: document.body,
  });
}

describe("Dropdown", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  // ── Rendering ──────────────────────────────────────────────

  it("renders trigger slot content", () => {
    const wrapper = mountDropdown();
    expect(wrapper.text()).toContain("Actions");
  });

  it("does not render menu when closed", () => {
    const wrapper = mountDropdown();
    expect(wrapper.find(".dropdown__menu").exists()).toBe(false);
  });

  it("renders menu with items when opened", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.find(".dropdown__menu").exists()).toBe(true);
    const menuItems = wrapper.findAll(".dropdown__item");
    expect(menuItems).toHaveLength(3);
    expect(menuItems[0].text()).toBe("Edit");
    expect(menuItems[1].text()).toBe("Duplicate");
    expect(menuItems[2].text()).toBe("Delete");
  });

  it("renders divider before item when divider is true", async () => {
    const wrapper = mountDropdown({ items: itemsWithDivider });
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.find(".dropdown__divider").exists()).toBe(true);
  });

  it("applies bottom placement by default", () => {
    const wrapper = mountDropdown();
    expect(wrapper.classes()).toContain("dropdown--bottom");
  });

  it("applies top placement", () => {
    const wrapper = mountDropdown({ placement: "top" });
    expect(wrapper.classes()).toContain("dropdown--top");
  });

  it("applies start alignment by default", () => {
    const wrapper = mountDropdown();
    expect(wrapper.classes()).toContain("dropdown--align-start");
  });

  it("applies end alignment", () => {
    const wrapper = mountDropdown({ align: "end" });
    expect(wrapper.classes()).toContain("dropdown--align-end");
  });

  // ── Open/close ────────────────────────────────────────────

  it("opens on trigger click", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.classes()).toContain("dropdown--open");
    expect(wrapper.find(".dropdown__menu").exists()).toBe(true);
  });

  it("closes on second trigger click", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.classes()).toContain("dropdown--open");
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.classes()).not.toContain("dropdown--open");
  });

  it("does not open when disabled", async () => {
    const wrapper = mountDropdown({ disabled: true });
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.find(".dropdown__menu").exists()).toBe(false);
  });

  it("applies disabled class when disabled", () => {
    const wrapper = mountDropdown({ disabled: true });
    expect(wrapper.classes()).toContain("dropdown--disabled");
  });

  it("emits open event when opened", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.emitted("open")).toHaveLength(1);
  });

  it("emits close event when closed", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  // ── Item selection ────────────────────────────────────────

  it("emits select with item on item click", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    await wrapper.findAll(".dropdown__item")[0].trigger("click");
    expect(wrapper.emitted("select")).toHaveLength(1);
    expect(wrapper.emitted("select")![0]).toEqual([items[0]]);
  });

  it("closes after item selection", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    await wrapper.findAll(".dropdown__item")[0].trigger("click");
    expect(wrapper.find(".dropdown__menu").exists()).toBe(false);
  });

  it("does not emit select for disabled items", async () => {
    const wrapper = mountDropdown({ items: itemsWithDisabled });
    await wrapper.find(".dropdown__trigger").trigger("click");
    await wrapper.findAll(".dropdown__item")[1].trigger("click");
    expect(wrapper.emitted("select")).toBeUndefined();
  });

  it("disabled items have aria-disabled", async () => {
    const wrapper = mountDropdown({ items: itemsWithDisabled });
    await wrapper.find(".dropdown__trigger").trigger("click");
    const disabledItem = wrapper.findAll(".dropdown__item")[1];
    expect(disabledItem.attributes("aria-disabled")).toBe("true");
  });

  // ── Keyboard ──────────────────────────────────────────────

  it("opens on Enter key on trigger", async () => {
    const wrapper = mountDropdown();
    await wrapper
      .find(".dropdown__trigger")
      .trigger("keydown", { key: "Enter" });
    await nextTick();
    expect(wrapper.find(".dropdown__menu").exists()).toBe(true);
  });

  it("opens on Space key on trigger", async () => {
    const wrapper = mountDropdown();
    await wrapper
      .find(".dropdown__trigger")
      .trigger("keydown", { key: " " });
    await nextTick();
    expect(wrapper.find(".dropdown__menu").exists()).toBe(true);
  });

  it("opens on ArrowDown key on trigger", async () => {
    const wrapper = mountDropdown();
    await wrapper
      .find(".dropdown__trigger")
      .trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(wrapper.find(".dropdown__menu").exists()).toBe(true);
  });

  it("closes on Escape key", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.find(".dropdown__menu").exists()).toBe(true);
    await wrapper
      .find(".dropdown__menu")
      .trigger("keydown", { key: "Escape" });
    expect(wrapper.find(".dropdown__menu").exists()).toBe(false);
  });

  it("closes on Tab key", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    await wrapper
      .find(".dropdown__menu")
      .trigger("keydown", { key: "Tab" });
    expect(wrapper.find(".dropdown__menu").exists()).toBe(false);
  });

  it("navigates items with ArrowDown", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    await nextTick();
    await nextTick();
    // First item should be focused initially
    const menuItems = wrapper.findAll(".dropdown__item");
    expect(menuItems[0].classes()).toContain("dropdown__item--focused");
    // Press ArrowDown
    await wrapper
      .find(".dropdown__menu")
      .trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    const updatedItems = wrapper.findAll(".dropdown__item");
    expect(updatedItems[1].classes()).toContain("dropdown__item--focused");
  });

  it("wraps around with ArrowDown on last item", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    await nextTick();
    await nextTick();
    // Navigate to last item
    await wrapper
      .find(".dropdown__menu")
      .trigger("keydown", { key: "ArrowDown" });
    await wrapper
      .find(".dropdown__menu")
      .trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    // Now press ArrowDown again — should wrap to first
    await wrapper
      .find(".dropdown__menu")
      .trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    const menuItems = wrapper.findAll(".dropdown__item");
    expect(menuItems[0].classes()).toContain("dropdown__item--focused");
  });

  it("selects focused item with Enter", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    await nextTick();
    await nextTick();
    await wrapper
      .find(".dropdown__menu")
      .trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("select")).toHaveLength(1);
    expect(wrapper.emitted("select")![0]).toEqual([items[0]]);
  });

  it("skips disabled items during keyboard navigation", async () => {
    const wrapper = mountDropdown({ items: itemsWithDisabled });
    await wrapper.find(".dropdown__trigger").trigger("click");
    await nextTick();
    await nextTick();
    // First enabled item (edit) should be focused
    expect(wrapper.findAll(".dropdown__item")[0].classes()).toContain(
      "dropdown__item--focused"
    );
    // ArrowDown should skip disabled "archive" and go to "delete"
    await wrapper
      .find(".dropdown__menu")
      .trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(wrapper.findAll(".dropdown__item")[2].classes()).toContain(
      "dropdown__item--focused"
    );
  });

  // ── Accessibility ─────────────────────────────────────────

  it("trigger has aria-haspopup", () => {
    const wrapper = mountDropdown();
    expect(
      wrapper.find(".dropdown__trigger").attributes("aria-haspopup")
    ).toBe("true");
  });

  it("trigger has aria-expanded reflecting state", async () => {
    const wrapper = mountDropdown();
    expect(
      wrapper.find(".dropdown__trigger").attributes("aria-expanded")
    ).toBe("false");
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(
      wrapper.find(".dropdown__trigger").attributes("aria-expanded")
    ).toBe("true");
  });

  it("trigger has aria-controls matching menu id when open", async () => {
    const wrapper = mountDropdown();
    expect(
      wrapper.find(".dropdown__trigger").attributes("aria-controls")
    ).toBeUndefined();
    await wrapper.find(".dropdown__trigger").trigger("click");
    const menuId = wrapper.find(".dropdown__menu").attributes("id");
    expect(
      wrapper.find(".dropdown__trigger").attributes("aria-controls")
    ).toBe(menuId);
  });

  it("menu has role=menu", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.find(".dropdown__menu").attributes("role")).toBe("menu");
  });

  it("items have role=menuitem and tabindex=-1", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    const item = wrapper.findAll(".dropdown__item")[0];
    expect(item.attributes("role")).toBe("menuitem");
    expect(item.attributes("tabindex")).toBe("-1");
  });

  it("menu has unique id", async () => {
    const wrapper = mountDropdown();
    await wrapper.find(".dropdown__trigger").trigger("click");
    const id = wrapper.find(".dropdown__menu").attributes("id");
    expect(id).toBeTruthy();
  });

  it("divider has role=separator", async () => {
    const wrapper = mountDropdown({ items: itemsWithDivider });
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.find(".dropdown__divider").attributes("role")).toBe(
      "separator"
    );
  });

  // ── Content slot ──────────────────────────────────────────

  it("renders content slot instead of items", async () => {
    const wrapper = mountDropdown(
      {},
      { content: "<p>Custom content</p>" }
    );
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.find(".dropdown__menu").text()).toContain("Custom content");
    expect(wrapper.find(".dropdown__item").exists()).toBe(false);
  });

  it("menu omits role=menu when content slot is used", async () => {
    const wrapper = mountDropdown(
      {},
      { content: "<p>Custom</p>" }
    );
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(
      wrapper.find(".dropdown__menu").attributes("role")
    ).toBeUndefined();
  });

  // ── Width ─────────────────────────────────────────────────

  it("applies width-trigger class when width is trigger", () => {
    const wrapper = mountDropdown({ width: "trigger" });
    expect(wrapper.classes()).toContain("dropdown--width-trigger");
  });

  it("applies inline width style for number width", async () => {
    const wrapper = mountDropdown({ width: 200 });
    await wrapper.find(".dropdown__trigger").trigger("click");
    expect(wrapper.find(".dropdown__menu").attributes("style")).toContain(
      "width: 200px"
    );
  });
});
