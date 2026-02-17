import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import Tooltip from "./Tooltip.vue";

describe("Tooltip", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Rendering ──────────────────────────────────────────────

  it("renders trigger slot content", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Help text" },
      slots: { default: "<button>Hover me</button>" },
    });
    expect(wrapper.text()).toContain("Hover me");
  });

  it("renders as a span element", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip" },
      slots: { default: "Text" },
    });
    expect(wrapper.element.tagName).toBe("SPAN");
  });

  it("renders tooltip bubble with content prop", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Help text" },
      slots: { default: "Trigger" },
    });
    expect(wrapper.find(".tooltip__bubble").exists()).toBe(true);
    expect(wrapper.find(".tooltip__bubble").text()).toBe("Help text");
  });

  it("does not render bubble when content is empty and no content slot", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "" },
      slots: { default: "Trigger" },
    });
    expect(wrapper.find(".tooltip__bubble").exists()).toBe(false);
  });

  // ── Placement ──────────────────────────────────────────────

  it("applies top placement by default", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip" },
      slots: { default: "Trigger" },
    });
    expect(wrapper.classes()).toContain("tooltip--top");
  });

  it("applies bottom placement", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", placement: "bottom" },
      slots: { default: "Trigger" },
    });
    expect(wrapper.classes()).toContain("tooltip--bottom");
  });

  it("applies left placement", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", placement: "left" },
      slots: { default: "Trigger" },
    });
    expect(wrapper.classes()).toContain("tooltip--left");
  });

  it("applies right placement", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", placement: "right" },
      slots: { default: "Trigger" },
    });
    expect(wrapper.classes()).toContain("tooltip--right");
  });

  // ── Visibility (hover) ────────────────────────────────────

  it("shows tooltip on mouseenter after delay", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", delay: 200 },
      slots: { default: "Trigger" },
    });
    await wrapper.trigger("mouseenter");
    expect(wrapper.classes()).not.toContain("tooltip--visible");
    vi.advanceTimersByTime(200);
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain("tooltip--visible");
  });

  it("hides tooltip on mouseleave", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", delay: 0 },
      slots: { default: "Trigger" },
    });
    await wrapper.trigger("mouseenter");
    expect(wrapper.classes()).toContain("tooltip--visible");
    await wrapper.trigger("mouseleave");
    expect(wrapper.classes()).not.toContain("tooltip--visible");
  });

  it("shows tooltip immediately when delay is 0", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", delay: 0 },
      slots: { default: "Trigger" },
    });
    await wrapper.trigger("mouseenter");
    expect(wrapper.classes()).toContain("tooltip--visible");
  });

  it("cancels delay on mouseleave before delay expires", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", delay: 200 },
      slots: { default: "Trigger" },
    });
    await wrapper.trigger("mouseenter");
    vi.advanceTimersByTime(100);
    await wrapper.trigger("mouseleave");
    vi.advanceTimersByTime(200);
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).not.toContain("tooltip--visible");
  });

  // ── Visibility (focus) ────────────────────────────────────

  it("shows tooltip on focusin", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip" },
      slots: { default: "<button>Click</button>" },
    });
    await wrapper.trigger("focusin");
    expect(wrapper.classes()).toContain("tooltip--visible");
  });

  it("hides tooltip on focusout", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip" },
      slots: { default: "<button>Click</button>" },
    });
    await wrapper.trigger("focusin");
    expect(wrapper.classes()).toContain("tooltip--visible");
    await wrapper.trigger("focusout");
    expect(wrapper.classes()).not.toContain("tooltip--visible");
  });

  // ── Trigger modes ─────────────────────────────────────────

  it("does not show on hover when trigger is focus", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", trigger: "focus", delay: 0 },
      slots: { default: "<button>Click</button>" },
    });
    await wrapper.trigger("mouseenter");
    expect(wrapper.classes()).not.toContain("tooltip--visible");
  });

  it("does not show on focus when trigger is hover", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", trigger: "hover" },
      slots: { default: "<button>Click</button>" },
    });
    await wrapper.trigger("focusin");
    expect(wrapper.classes()).not.toContain("tooltip--visible");
  });

  // ── Disabled ──────────────────────────────────────────────

  it("does not show when disabled", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", disabled: true, delay: 0 },
      slots: { default: "Trigger" },
    });
    await wrapper.trigger("mouseenter");
    expect(wrapper.classes()).not.toContain("tooltip--visible");
  });

  it("applies disabled class when disabled", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", disabled: true },
      slots: { default: "Trigger" },
    });
    expect(wrapper.classes()).toContain("tooltip--disabled");
  });

  // ── Escape key ────────────────────────────────────────────

  it("hides tooltip on Escape", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip", delay: 0 },
      slots: { default: "Trigger" },
    });
    await wrapper.trigger("mouseenter");
    expect(wrapper.classes()).toContain("tooltip--visible");
    await wrapper.trigger("keydown.escape");
    expect(wrapper.classes()).not.toContain("tooltip--visible");
  });

  // ── Content slot ──────────────────────────────────────────

  it("renders content slot instead of content prop", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Ignored" },
      slots: {
        default: "Trigger",
        content: "<strong>Rich content</strong>",
      },
    });
    expect(wrapper.find(".tooltip__bubble").html()).toContain(
      "<strong>Rich content</strong>"
    );
  });

  it("renders bubble when content slot is provided even without content prop", () => {
    const wrapper = mount(Tooltip, {
      slots: {
        default: "Trigger",
        content: "<em>Slot only</em>",
      },
    });
    expect(wrapper.find(".tooltip__bubble").exists()).toBe(true);
  });

  // ── Accessibility ─────────────────────────────────────────

  it("bubble has role=tooltip", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip" },
      slots: { default: "Trigger" },
    });
    expect(wrapper.find(".tooltip__bubble").attributes("role")).toBe("tooltip");
  });

  it("bubble has an id", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip" },
      slots: { default: "Trigger" },
    });
    const id = wrapper.find(".tooltip__bubble").attributes("id");
    expect(id).toBeTruthy();
  });

  it("trigger has aria-describedby matching tooltip id", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip" },
      slots: { default: "Trigger" },
    });
    const bubbleId = wrapper.find(".tooltip__bubble").attributes("id");
    const describedBy = wrapper
      .find(".tooltip__trigger")
      .attributes("aria-describedby");
    expect(describedBy).toBe(bubbleId);
  });

  it("trigger has no aria-describedby when content is empty", () => {
    const wrapper = mount(Tooltip, {
      props: { content: "" },
      slots: { default: "Trigger" },
    });
    expect(
      wrapper.find(".tooltip__trigger").attributes("aria-describedby")
    ).toBeUndefined();
  });

  // ── Touch ─────────────────────────────────────────────────

  it("shows tooltip on touchstart", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Tip" },
      slots: { default: "Trigger" },
    });
    await wrapper.trigger("touchstart");
    expect(wrapper.classes()).toContain("tooltip--visible");
  });
});
