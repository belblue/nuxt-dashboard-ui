import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import StatCard from "./StatCard.vue";

describe("StatCard", () => {
  //test props render correctly
  it("renders title and value", () => {
    const wrapper = mount(StatCard, {
      props: {
        title: "Revenue",
        value: 1000,
      },
    });
    expect(wrapper.text()).toContain("Revenue");
    expect(wrapper.text()).toContain("1.000");
    expect(wrapper.find(".stat-card__value").exists()).toBe(true);
  });
  // Test loading state
  it("shows skeleton when loading", () => {
    const wrapper = mount(StatCard, {
      props: {
        title: "Revenue",
        value: 1000,
        loading: true,
      },
    });
    expect(wrapper.find(".skeleton").exists()).toBe(true);
    expect(wrapper.find(".stat-card__title").exists()).toBe(false);
  });
  // Test trend classes
  it("applies correct trend class", () => {
    const wrapper = mount(StatCard, {
      props: {
        title: "Revenue",
        value: 1000,
        trend: "up",
        trendValue: 12,
      },
    });
    expect(wrapper.find(".stat-card__trend--up").exists()).toBe(true);
  });
  it("applies correct trend class", () => {
    const wrapper = mount(StatCard, {
      props: {
        title: "Revenue",
        value: 1000,
        trend: "down",
        trendValue: 12,
      },
    });
    expect(wrapper.find(".stat-card__trend--down").exists()).toBe(true);
  });

  // Test click emit
  it("emits click when clickable", async () => {
    const wrapper = mount(StatCard, {
      props: {
        title: "Revenue",
        value: 1000,
        clickable: true,
      },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });
  it("does not emit click when not clickable", async () => {
    const wrapper = mount(StatCard, {
      props: {
        title: "Revenue",
        value: 1000,
        clickable: false,
      },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeUndefined();
  });

  //test slots
  it("renders icon slot", () => {
    const wrapper = mount(StatCard, {
      props: {
        title: "Revenue",
        value: 1000,
      },
      slots: {
        icon: "💰",
      },
    });
    expect(wrapper.text()).toContain("💰");
  });
  //test number formatting
  it("formats numbers with locale", () => {
    const wrapper = mount(StatCard, {
      props: {
        title: "Revenue",
        value: 12500,
        locale: "en-US",
      },
    });
    expect(wrapper.text()).toContain("12,500");
  });
});
