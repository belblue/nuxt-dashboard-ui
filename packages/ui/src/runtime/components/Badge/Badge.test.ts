import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Badge from "./Badge.vue";

describe("Badge", () => {
  // Rendering
  it("renders slot content", () => {
    const wrapper = mount(Badge, { slots: { default: "Active" } });
    expect(wrapper.text()).toContain("Active");
  });

  it("renders as a span element", () => {
    const wrapper = mount(Badge, { slots: { default: "Test" } });
    expect(wrapper.element.tagName).toBe("SPAN");
  });

  // Variants
  it("applies default variant class by default", () => {
    const wrapper = mount(Badge, { slots: { default: "Test" } });
    expect(wrapper.classes()).toContain("badge--default");
  });

  it("applies success variant class", () => {
    const wrapper = mount(Badge, {
      props: { variant: "success" },
      slots: { default: "Active" },
    });
    expect(wrapper.classes()).toContain("badge--success");
  });

  it("applies danger variant class", () => {
    const wrapper = mount(Badge, {
      props: { variant: "danger" },
      slots: { default: "Error" },
    });
    expect(wrapper.classes()).toContain("badge--danger");
  });

  it("applies warning variant class", () => {
    const wrapper = mount(Badge, {
      props: { variant: "warning" },
      slots: { default: "Pending" },
    });
    expect(wrapper.classes()).toContain("badge--warning");
  });

  it("applies info variant class", () => {
    const wrapper = mount(Badge, {
      props: { variant: "info" },
      slots: { default: "New" },
    });
    expect(wrapper.classes()).toContain("badge--info");
  });

  // Sizes
  it("applies md size by default", () => {
    const wrapper = mount(Badge, { slots: { default: "Test" } });
    expect(wrapper.classes()).toContain("badge--md");
  });

  it("applies sm size class", () => {
    const wrapper = mount(Badge, {
      props: { size: "sm" },
      slots: { default: "Test" },
    });
    expect(wrapper.classes()).toContain("badge--sm");
  });

  it("applies lg size class", () => {
    const wrapper = mount(Badge, {
      props: { size: "lg" },
      slots: { default: "Test" },
    });
    expect(wrapper.classes()).toContain("badge--lg");
  });

  // Pill
  it("applies pill class when pill prop is true", () => {
    const wrapper = mount(Badge, {
      props: { pill: true },
      slots: { default: "Test" },
    });
    expect(wrapper.classes()).toContain("badge--pill");
  });

  it("does not apply pill class by default", () => {
    const wrapper = mount(Badge, { slots: { default: "Test" } });
    expect(wrapper.classes()).not.toContain("badge--pill");
  });

  // Outline
  it("applies outline class when outline prop is true", () => {
    const wrapper = mount(Badge, {
      props: { outline: true },
      slots: { default: "Test" },
    });
    expect(wrapper.classes()).toContain("badge--outline");
  });

  // Dot
  it("shows dot when dot prop is true", () => {
    const wrapper = mount(Badge, {
      props: { dot: true },
      slots: { default: "Active" },
    });
    expect(wrapper.find(".badge__dot").exists()).toBe(true);
  });

  it("hides dot by default", () => {
    const wrapper = mount(Badge, { slots: { default: "Active" } });
    expect(wrapper.find(".badge__dot").exists()).toBe(false);
  });

  it("dot is aria-hidden", () => {
    const wrapper = mount(Badge, {
      props: { dot: true },
      slots: { default: "Active" },
    });
    expect(wrapper.find(".badge__dot").attributes("aria-hidden")).toBe("true");
  });

  // Dismiss
  it("shows dismiss button when dismissible", () => {
    const wrapper = mount(Badge, {
      props: { dismissible: true },
      slots: { default: "Tag" },
    });
    expect(wrapper.find(".badge__dismiss").exists()).toBe(true);
  });

  it("hides dismiss button by default", () => {
    const wrapper = mount(Badge, { slots: { default: "Tag" } });
    expect(wrapper.find(".badge__dismiss").exists()).toBe(false);
  });

  it("emits dismiss when dismiss button is clicked", async () => {
    const wrapper = mount(Badge, {
      props: { dismissible: true },
      slots: { default: "Tag" },
    });
    await wrapper.find(".badge__dismiss").trigger("click");
    expect(wrapper.emitted("dismiss")).toHaveLength(1);
  });

  it("dismiss button has aria-label", () => {
    const wrapper = mount(Badge, {
      props: { dismissible: true },
      slots: { default: "Tag" },
    });
    expect(wrapper.find(".badge__dismiss").attributes("aria-label")).toBe(
      "Dismiss"
    );
  });
});
