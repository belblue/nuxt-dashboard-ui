import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Tabs from "./Tabs.vue";
import type { TabItem } from "./types";

const items: TabItem[] = [
  { key: "general", label: "General" },
  { key: "security", label: "Security" },
  { key: "billing", label: "Billing" },
];

const itemsWithDisabled: TabItem[] = [
  { key: "general", label: "General" },
  { key: "security", label: "Security", disabled: true },
  { key: "billing", label: "Billing" },
];

function mountTabs(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(Tabs, {
    props: { items, ...props },
    slots: {
      "panel-general": "<p>General content</p>",
      "panel-security": "<p>Security content</p>",
      "panel-billing": "<p>Billing content</p>",
      ...slots,
    },
  });
}

describe("Tabs", () => {
  // ── Rendering ──────────────────────────────────────────────

  it("renders tab buttons for each item", () => {
    const wrapper = mountTabs();
    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs.length).toBe(3);
    expect(tabs[0].text()).toBe("General");
    expect(tabs[1].text()).toBe("Security");
    expect(tabs[2].text()).toBe("Billing");
  });

  it("renders tablist role", () => {
    const wrapper = mountTabs();
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true);
  });

  it("renders tabpanel for each item", () => {
    const wrapper = mountTabs();
    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels.length).toBe(3);
  });

  it("shows first tab panel by default", () => {
    const wrapper = mountTabs();
    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels[0].element.style.display).not.toBe("none");
    expect(panels[1].element.style.display).toBe("none");
    expect(panels[2].element.style.display).toBe("none");
  });

  it("shows the panel matching modelValue", () => {
    const wrapper = mountTabs({ modelValue: "billing" });
    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels[0].element.style.display).toBe("none");
    expect(panels[2].element.style.display).not.toBe("none");
  });

  // ── Tab switching ──────────────────────────────────────────

  it("switches panel on tab click", async () => {
    const wrapper = mountTabs();
    const tabs = wrapper.findAll('[role="tab"]');
    await tabs[1].trigger("click");
    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels[1].element.style.display).not.toBe("none");
    expect(panels[0].element.style.display).toBe("none");
  });

  it("emits update:modelValue on tab click", async () => {
    const wrapper = mountTabs();
    const tabs = wrapper.findAll('[role="tab"]');
    await tabs[2].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toEqual([["billing"]]);
  });

  it("does not switch to disabled tab on click", async () => {
    const wrapper = mountTabs({ items: itemsWithDisabled });
    const tabs = wrapper.findAll('[role="tab"]');
    await tabs[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels[0].element.style.display).not.toBe("none");
  });

  // ── Keyboard navigation ──────────────────────────────────

  it("navigates right with ArrowRight", async () => {
    const wrapper = mountTabs();
    const tablist = wrapper.find('[role="tablist"]');
    await tablist.trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")).toEqual([["security"]]);
  });

  it("navigates left with ArrowLeft (wraps around)", async () => {
    const wrapper = mountTabs();
    const tablist = wrapper.find('[role="tablist"]');
    await tablist.trigger("keydown", { key: "ArrowLeft" });
    expect(wrapper.emitted("update:modelValue")).toEqual([["billing"]]);
  });

  it("jumps to first tab on Home", async () => {
    const wrapper = mountTabs({ modelValue: "billing" });
    const tablist = wrapper.find('[role="tablist"]');
    await tablist.trigger("keydown", { key: "Home" });
    expect(wrapper.emitted("update:modelValue")).toEqual([["general"]]);
  });

  it("jumps to last tab on End", async () => {
    const wrapper = mountTabs();
    const tablist = wrapper.find('[role="tablist"]');
    await tablist.trigger("keydown", { key: "End" });
    expect(wrapper.emitted("update:modelValue")).toEqual([["billing"]]);
  });

  it("skips disabled tabs during keyboard navigation", async () => {
    const wrapper = mountTabs({ items: itemsWithDisabled });
    const tablist = wrapper.find('[role="tablist"]');
    await tablist.trigger("keydown", { key: "ArrowRight" });
    // Should skip "security" (disabled) and go to "billing"
    expect(wrapper.emitted("update:modelValue")).toEqual([["billing"]]);
  });

  // ── Accessibility ──────────────────────────────────────────

  it("sets aria-selected on active tab", () => {
    const wrapper = mountTabs();
    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0].attributes("aria-selected")).toBe("true");
    expect(tabs[1].attributes("aria-selected")).toBe("false");
  });

  it("sets tabindex 0 on active tab and -1 on others", () => {
    const wrapper = mountTabs();
    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0].attributes("tabindex")).toBe("0");
    expect(tabs[1].attributes("tabindex")).toBe("-1");
  });

  it("sets aria-controls linking tab to panel", () => {
    const wrapper = mountTabs();
    const tab = wrapper.findAll('[role="tab"]')[0];
    const panel = wrapper.findAll('[role="tabpanel"]')[0];
    expect(tab.attributes("aria-controls")).toBe(panel.attributes("id"));
  });

  it("sets aria-labelledby linking panel to tab", () => {
    const wrapper = mountTabs();
    const tab = wrapper.findAll('[role="tab"]')[0];
    const panel = wrapper.findAll('[role="tabpanel"]')[0];
    expect(panel.attributes("aria-labelledby")).toBe(tab.attributes("id"));
  });

  it("sets aria-disabled on disabled tabs", () => {
    const wrapper = mountTabs({ items: itemsWithDisabled });
    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[1].attributes("aria-disabled")).toBe("true");
  });

  // ── Variants ──────────────────────────────────────────────

  it("applies line variant class by default", () => {
    const wrapper = mountTabs();
    expect(wrapper.find(".tabs--line").exists()).toBe(true);
  });

  it("applies pill variant class", () => {
    const wrapper = mountTabs({ variant: "pill" });
    expect(wrapper.find(".tabs--pill").exists()).toBe(true);
  });

  // ── Badge ──────────────────────────────────────────────

  it("renders badge when provided", () => {
    const wrapper = mountTabs({
      items: [
        { key: "a", label: "Tab A" },
        { key: "b", label: "Tab B", badge: "3" },
      ],
    });
    expect(wrapper.find(".tabs__badge").text()).toBe("3");
  });

  it("does not render badge when not provided", () => {
    const wrapper = mountTabs();
    expect(wrapper.findAll(".tabs__badge").length).toBe(0);
  });

  // ── Lazy rendering ──────────────────────────────────────

  it("renders all panels by default (not lazy)", () => {
    const wrapper = mountTabs();
    const panels = wrapper.findAll('[role="tabpanel"]');
    // All panels exist in DOM, inactive ones are hidden with v-show
    expect(panels[0].text()).toContain("General content");
    expect(panels[1].text()).toContain("Security content");
  });

  it("only mounts active panel when lazy", async () => {
    const wrapper = mountTabs({ lazy: true });
    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels[0].text()).toContain("General content");
    // Inactive panels exist but have no slot content mounted
    expect(panels[1].text()).toBe("");
  });

  // ── Fallback ──────────────────────────────────────────────

  it("falls back to first enabled tab when active tab is removed", async () => {
    const wrapper = mount(Tabs, {
      props: { items: [...items], modelValue: "billing" },
      slots: {
        "panel-general": "<p>General</p>",
        "panel-security": "<p>Security</p>",
      },
    });
    // Remove billing tab
    await wrapper.setProps({
      items: [
        { key: "general", label: "General" },
        { key: "security", label: "Security" },
      ],
    });
    await nextTick();
    expect(wrapper.emitted("update:modelValue")!.pop()).toEqual(["general"]);
  });
});
