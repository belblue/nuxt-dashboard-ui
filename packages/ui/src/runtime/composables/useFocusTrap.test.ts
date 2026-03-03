import { describe, it, expect, vi, afterEach } from "vitest";
import { defineComponent, ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { useFocusTrap } from "./useFocusTrap";

function createTestComponent(options: { onEscape?: () => void } = {}) {
  return defineComponent({
    setup() {
      const containerRef = ref<HTMLElement | null>(null);
      const active = ref(false);
      useFocusTrap({
        containerRef,
        active,
        onEscape: options.onEscape,
      });
      return { containerRef, active };
    },
    template: `
      <div ref="containerRef" tabindex="-1">
        <button class="first">First</button>
        <button class="second">Second</button>
        <button class="third">Third</button>
      </div>
    `,
  });
}

describe("useFocusTrap", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("focuses the first focusable element when activated", async () => {
    const TestComponent = createTestComponent();
    const wrapper = mount(TestComponent, { attachTo: document.body });
    wrapper.vm.active = true;
    await nextTick();
    expect(document.activeElement).toBe(wrapper.find(".first").element);
    wrapper.unmount();
  });

  it("wraps focus from last to first on Tab", async () => {
    const TestComponent = createTestComponent();
    const wrapper = mount(TestComponent, { attachTo: document.body });
    wrapper.vm.active = true;
    await nextTick();

    // Focus the last button
    (wrapper.find(".third").element as HTMLElement).focus();
    expect(document.activeElement).toBe(wrapper.find(".third").element);

    // Press Tab on the last element
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    await nextTick();

    expect(document.activeElement).toBe(wrapper.find(".first").element);
    wrapper.unmount();
  });

  it("wraps focus from first to last on Shift+Tab", async () => {
    const TestComponent = createTestComponent();
    const wrapper = mount(TestComponent, { attachTo: document.body });
    wrapper.vm.active = true;
    await nextTick();

    // Focus should be on first element
    expect(document.activeElement).toBe(wrapper.find(".first").element);

    // Press Shift+Tab on the first element
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    await nextTick();

    expect(document.activeElement).toBe(wrapper.find(".third").element);
    wrapper.unmount();
  });

  it("calls onEscape when Escape is pressed", async () => {
    const onEscape = vi.fn();
    const TestComponent = createTestComponent({ onEscape });
    const wrapper = mount(TestComponent, { attachTo: document.body });
    wrapper.vm.active = true;
    await nextTick();

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
    expect(onEscape).toHaveBeenCalledOnce();
    wrapper.unmount();
  });

  it("restores focus to previously focused element on deactivate", async () => {
    const outer = document.createElement("button");
    outer.textContent = "Outside";
    document.body.appendChild(outer);
    outer.focus();

    const TestComponent = createTestComponent();
    const wrapper = mount(TestComponent, { attachTo: document.body });

    wrapper.vm.active = true;
    await nextTick();
    expect(document.activeElement).not.toBe(outer);

    wrapper.vm.active = false;
    await nextTick();
    expect(document.activeElement).toBe(outer);

    wrapper.unmount();
    outer.remove();
  });

  it("removes keydown listener when deactivated", async () => {
    const onEscape = vi.fn();
    const TestComponent = createTestComponent({ onEscape });
    const wrapper = mount(TestComponent, { attachTo: document.body });

    wrapper.vm.active = true;
    await nextTick();
    wrapper.vm.active = false;
    await nextTick();

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
    expect(onEscape).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
