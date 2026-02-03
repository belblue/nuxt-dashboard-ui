import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import StatCard from "./StatCard.vue";

describe("StatCard", () => {
  // Props rendering
  it("renders title and value", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000 },
    });
    expect(wrapper.text()).toContain("Revenue");
    expect(wrapper.text()).toContain("1.000");
    expect(wrapper.find(".stat-card__value").exists()).toBe(true);
  });

  // Loading state
  it("shows skeleton when loading", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000, loading: true },
    });
    expect(wrapper.find(".skeleton").exists()).toBe(true);
    expect(wrapper.find(".stat-card__title").exists()).toBe(false);
  });

  // Trend classes
  it("applies up trend class", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000, trend: "up", trendValue: 12 },
    });
    expect(wrapper.find(".stat-card__trend--up").exists()).toBe(true);
  });

  it("applies down trend class", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000, trend: "down", trendValue: 12 },
    });
    expect(wrapper.find(".stat-card__trend--down").exists()).toBe(true);
  });

  // Click emit
  it("emits click when clickable", async () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000, clickable: true },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("does not emit click when not clickable", async () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000, clickable: false },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeUndefined();
  });

  // Slots
  it("renders icon slot", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000 },
      slots: { icon: "💰" },
    });
    expect(wrapper.text()).toContain("💰");
  });

  // Number formatting
  it("formats numbers with locale", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 12500, locale: "en-US" },
    });
    expect(wrapper.text()).toContain("12,500");
  });

  // Accessibility
  it("has role=region and aria-labelledby", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000 },
    });
    const card = wrapper.find("article");
    expect(card.attributes("role")).toBe("region");
    const labelledBy = card.attributes("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(wrapper.find(`#${labelledBy}`).text()).toBe("Revenue");
  });

  it("has role=button and tabindex when clickable", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000, clickable: true },
    });
    const card = wrapper.find("article");
    expect(card.attributes("role")).toBe("button");
    expect(card.attributes("tabindex")).toBe("0");
  });

  it("does not have tabindex when not clickable", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000 },
    });
    const card = wrapper.find("article");
    expect(card.attributes("tabindex")).toBeUndefined();
  });

  it("provides screen reader text for trends", () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000, trend: "up", trendValue: 12 },
    });
    const srOnly = wrapper.find(".sr-only");
    expect(srOnly.exists()).toBe(true);
    expect(srOnly.text()).toBe("Increased by 12");
  });

  // Keyboard support
  it("emits click on Enter key when clickable", async () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000, clickable: true },
    });
    await wrapper.trigger("keydown.enter");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("emits click on Space key when clickable", async () => {
    const wrapper = mount(StatCard, {
      props: { title: "Revenue", value: 1000, clickable: true },
    });
    await wrapper.trigger("keydown.space");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });
});
