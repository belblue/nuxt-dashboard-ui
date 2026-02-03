import { describe, it, expect } from "vitest";
import { defineComponent, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { useHydrated } from "./useHydrated";

// Helper: wraps the composable in a component so we can test lifecycle
function createTestComponent() {
  return defineComponent({
    setup() {
      const hydrated = useHydrated();
      return { hydrated };
    },
    template: `<div>{{ hydrated ? 'hydrated' : 'pending' }}</div>`,
  });
}

describe("useHydrated", () => {
  it("becomes true after mount", async () => {
    const TestComponent = createTestComponent();
    const wrapper = mount(TestComponent);
    await nextTick();
    expect(wrapper.vm.hydrated).toBe(true);
  });

  it("renders hydrated text after mount", async () => {
    const TestComponent = createTestComponent();
    const wrapper = mount(TestComponent);
    await nextTick();
    expect(wrapper.text()).toBe("hydrated");
  });

  it("is reactive and updates the template", async () => {
    const TestComponent = createTestComponent();
    const wrapper = mount(TestComponent);
    await nextTick();
    expect(wrapper.text()).toContain("hydrated");
  });
});
