import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EmptyState from "./EmptyState.vue";

describe("EmptyState", () => {
  // Props
  it("renders title", () => {
    const wrapper = mount(EmptyState, { props: { title: "No data" } });
    expect(wrapper.find(".empty-state__title").text()).toBe("No data");
  });

  it("renders description", () => {
    const wrapper = mount(EmptyState, {
      props: { description: "Try again later." },
    });
    expect(wrapper.find(".empty-state__description").text()).toBe(
      "Try again later."
    );
  });

  it("renders both title and description", () => {
    const wrapper = mount(EmptyState, {
      props: { title: "Empty", description: "Nothing here." },
    });
    expect(wrapper.find(".empty-state__title").exists()).toBe(true);
    expect(wrapper.find(".empty-state__description").exists()).toBe(true);
  });

  // Conditional rendering
  it("hides title element when no title provided", () => {
    const wrapper = mount(EmptyState);
    expect(wrapper.find(".empty-state__title").exists()).toBe(false);
  });

  it("hides description element when no description provided", () => {
    const wrapper = mount(EmptyState);
    expect(wrapper.find(".empty-state__description").exists()).toBe(false);
  });

  it("hides icon wrapper when no icon slot", () => {
    const wrapper = mount(EmptyState, { props: { title: "Empty" } });
    expect(wrapper.find(".empty-state__icon").exists()).toBe(false);
  });

  it("hides action wrapper when no action slot", () => {
    const wrapper = mount(EmptyState, { props: { title: "Empty" } });
    expect(wrapper.find(".empty-state__action").exists()).toBe(false);
  });

  // Slots
  it("renders icon slot", () => {
    const wrapper = mount(EmptyState, {
      slots: { icon: '<span class="test-icon">📭</span>' },
    });
    expect(wrapper.find(".empty-state__icon").exists()).toBe(true);
    expect(wrapper.find(".test-icon").text()).toBe("📭");
  });

  it("renders action slot", () => {
    const wrapper = mount(EmptyState, {
      slots: { action: '<button class="test-btn">Retry</button>' },
    });
    expect(wrapper.find(".empty-state__action").exists()).toBe(true);
    expect(wrapper.find(".test-btn").text()).toBe("Retry");
  });

  it("renders default slot and overrides title/description", () => {
    const wrapper = mount(EmptyState, {
      props: { title: "Ignored", description: "Also ignored" },
      slots: { default: '<div class="custom-body">Custom content</div>' },
    });
    expect(wrapper.find(".custom-body").text()).toBe("Custom content");
    expect(wrapper.find(".empty-state__title").exists()).toBe(false);
    expect(wrapper.find(".empty-state__description").exists()).toBe(false);
  });

  it("renders icon and action slots alongside default slot", () => {
    const wrapper = mount(EmptyState, {
      slots: {
        icon: "<span>🔍</span>",
        default: "<p>Custom body</p>",
        action: "<button>Go</button>",
      },
    });
    expect(wrapper.find(".empty-state__icon").exists()).toBe(true);
    expect(wrapper.find(".empty-state__action").exists()).toBe(true);
  });

  // Accessibility
  it("has role=status", () => {
    const wrapper = mount(EmptyState);
    expect(wrapper.find(".empty-state").attributes("role")).toBe("status");
  });

  // Container
  it("renders as a div element", () => {
    const wrapper = mount(EmptyState);
    expect(wrapper.element.tagName).toBe("DIV");
  });
});
