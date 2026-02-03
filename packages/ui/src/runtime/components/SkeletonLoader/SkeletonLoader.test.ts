import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import SkeletonLoader from "./SkeletonLoader.vue";

describe("SkeletonLoader", () => {
  // Rendering
  it("renders a single skeleton item by default", () => {
    const wrapper = mount(SkeletonLoader);
    expect(wrapper.findAll(".skeleton-loader__item")).toHaveLength(1);
  });

  it("renders multiple items when count is set", () => {
    const wrapper = mount(SkeletonLoader, { props: { count: 3 } });
    expect(wrapper.findAll(".skeleton-loader__item")).toHaveLength(3);
  });

  // Variants
  it("applies text variant by default", () => {
    const wrapper = mount(SkeletonLoader);
    expect(wrapper.find(".skeleton-loader__item").classes()).toContain(
      "skeleton-loader__item--text"
    );
  });

  it("applies circle variant", () => {
    const wrapper = mount(SkeletonLoader, { props: { variant: "circle" } });
    expect(wrapper.find(".skeleton-loader__item").classes()).toContain(
      "skeleton-loader__item--circle"
    );
  });

  it("applies rect variant", () => {
    const wrapper = mount(SkeletonLoader, { props: { variant: "rect" } });
    expect(wrapper.find(".skeleton-loader__item").classes()).toContain(
      "skeleton-loader__item--rect"
    );
  });

  it("applies card variant", () => {
    const wrapper = mount(SkeletonLoader, { props: { variant: "card" } });
    expect(wrapper.find(".skeleton-loader__item").classes()).toContain(
      "skeleton-loader__item--card"
    );
  });

  // Animation
  it("applies animated class by default", () => {
    const wrapper = mount(SkeletonLoader);
    expect(wrapper.find(".skeleton-loader__item").classes()).toContain(
      "skeleton-loader__item--animated"
    );
  });

  it("does not apply animated class when animated is false", () => {
    const wrapper = mount(SkeletonLoader, { props: { animated: false } });
    expect(wrapper.find(".skeleton-loader__item").classes()).not.toContain(
      "skeleton-loader__item--animated"
    );
  });

  // Custom sizing
  it("applies custom width", () => {
    const wrapper = mount(SkeletonLoader, { props: { width: "200px" } });
    expect(wrapper.find(".skeleton-loader__item").attributes("style")).toContain(
      "width: 200px"
    );
  });

  it("applies custom height", () => {
    const wrapper = mount(SkeletonLoader, { props: { height: "50px" } });
    expect(wrapper.find(".skeleton-loader__item").attributes("style")).toContain(
      "height: 50px"
    );
  });

  it("applies both custom width and height", () => {
    const wrapper = mount(SkeletonLoader, {
      props: { width: "100px", height: "100px" },
    });
    const style = wrapper.find(".skeleton-loader__item").attributes("style");
    expect(style).toContain("width: 100px");
    expect(style).toContain("height: 100px");
  });

  // Accessibility
  it("has role=status", () => {
    const wrapper = mount(SkeletonLoader);
    expect(wrapper.find(".skeleton-loader").attributes("role")).toBe("status");
  });

  it("has aria-busy=true", () => {
    const wrapper = mount(SkeletonLoader);
    expect(wrapper.find(".skeleton-loader").attributes("aria-busy")).toBe(
      "true"
    );
  });

  it("has aria-label", () => {
    const wrapper = mount(SkeletonLoader);
    expect(
      wrapper.find(".skeleton-loader").attributes("aria-label")
    ).toBe("Loading content");
  });

  it("has sr-only loading text", () => {
    const wrapper = mount(SkeletonLoader);
    expect(wrapper.find(".sr-only").text()).toBe("Loading…");
  });

  it("skeleton items are aria-hidden", () => {
    const wrapper = mount(SkeletonLoader);
    expect(
      wrapper.find(".skeleton-loader__item").attributes("aria-hidden")
    ).toBe("true");
  });

  // Slot
  it("renders custom content via default slot", () => {
    const wrapper = mount(SkeletonLoader, {
      slots: { default: '<div class="custom-skeleton">Custom</div>' },
    });
    expect(wrapper.find(".custom-skeleton").exists()).toBe(true);
    expect(wrapper.find(".skeleton-loader__item").exists()).toBe(false);
  });

  // Container
  it("renders as a div element", () => {
    const wrapper = mount(SkeletonLoader);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  // Hydration mode
  describe("hydrate mode", () => {
    it("shows skeleton before hydration completes", () => {
      // Before nextTick, onMounted hasn't flushed — skeleton is visible
      const wrapper = mount(SkeletonLoader, {
        props: { hydrate: true },
        slots: { default: '<div class="real-content">Hello</div>' },
      });
      // Skeleton items should be visible (hydrated = false initially)
      expect(wrapper.find(".skeleton-loader__item").exists()).toBe(true);
      expect(wrapper.find(".real-content").exists()).toBe(false);
    });

    it("shows slot content after hydration", async () => {
      const wrapper = mount(SkeletonLoader, {
        props: { hydrate: true },
        slots: { default: '<div class="real-content">Hello</div>' },
      });
      await nextTick();
      expect(wrapper.find(".real-content").exists()).toBe(true);
      expect(wrapper.find(".skeleton-loader__item").exists()).toBe(false);
    });

    it("removes role=status after hydration", async () => {
      const wrapper = mount(SkeletonLoader, {
        props: { hydrate: true },
        slots: { default: "<p>Content</p>" },
      });
      await nextTick();
      expect(
        wrapper.find(".skeleton-loader").attributes("role")
      ).toBeUndefined();
    });

    it("removes aria-busy after hydration", async () => {
      const wrapper = mount(SkeletonLoader, {
        props: { hydrate: true },
        slots: { default: "<p>Content</p>" },
      });
      await nextTick();
      expect(
        wrapper.find(".skeleton-loader").attributes("aria-busy")
      ).toBeUndefined();
    });

    it("removes aria-label after hydration", async () => {
      const wrapper = mount(SkeletonLoader, {
        props: { hydrate: true },
        slots: { default: "<p>Content</p>" },
      });
      await nextTick();
      expect(
        wrapper.find(".skeleton-loader").attributes("aria-label")
      ).toBeUndefined();
    });

    it("does not affect standard mode when hydrate is false", () => {
      const wrapper = mount(SkeletonLoader, {
        props: { hydrate: false },
      });
      expect(wrapper.find(".skeleton-loader__item").exists()).toBe(true);
      expect(wrapper.find(".skeleton-loader").attributes("role")).toBe("status");
    });
  });
});
