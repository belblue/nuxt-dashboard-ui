import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProgressBar from "./ProgressBar.vue";

describe("ProgressBar", () => {
  // Rendering
  it("renders a track element", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    expect(wrapper.find(".progress-bar__track").exists()).toBe(true);
  });

  it("renders a fill element inside the track", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    expect(wrapper.find(".progress-bar__fill").exists()).toBe(true);
  });

  it("renders as a div element", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  // Percentage calculation
  it("sets fill width based on value/max percentage", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.attributes("style")).toContain("width: 50%");
  });

  it("uses custom max to calculate percentage", () => {
    const wrapper = mount(ProgressBar, { props: { value: 25, max: 50 } });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.attributes("style")).toContain("width: 50%");
  });

  it("clamps percentage to 100% when value exceeds max", () => {
    const wrapper = mount(ProgressBar, { props: { value: 200 } });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.attributes("style")).toContain("width: 100%");
  });

  it("clamps percentage to 0% for negative values", () => {
    const wrapper = mount(ProgressBar, { props: { value: -10 } });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.attributes("style")).toContain("width: 0%");
  });

  // Auto-variant (default variant selects color by percentage)
  it("applies danger class when percentage < 30", () => {
    const wrapper = mount(ProgressBar, { props: { value: 20 } });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.classes()).toContain("progress-bar--danger");
  });

  it("applies warning class when percentage >= 30 and < 70", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.classes()).toContain("progress-bar--warning");
  });

  it("applies success class when percentage >= 70", () => {
    const wrapper = mount(ProgressBar, { props: { value: 80 } });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.classes()).toContain("progress-bar--success");
  });

  // Explicit variant override
  it("applies explicit success variant regardless of percentage", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 10, variant: "success" },
    });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.classes()).toContain("progress-bar--success");
  });

  it("applies explicit danger variant regardless of percentage", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 90, variant: "danger" },
    });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.classes()).toContain("progress-bar--danger");
  });

  it("applies explicit warning variant regardless of percentage", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 90, variant: "warning" },
    });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.classes()).toContain("progress-bar--warning");
  });

  // Label
  it("shows label when label prop is set", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 50, label: "Upload" },
    });
    expect(wrapper.find(".progress-bar__label").exists()).toBe(true);
    expect(wrapper.text()).toContain("Upload");
  });

  it("hides label when label prop is not set", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    expect(wrapper.find(".progress-bar__label").exists()).toBe(false);
  });

  // showValue
  it("shows percentage text when showValue is true and label is set", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 75, label: "Progress", showValue: true },
    });
    expect(wrapper.text()).toContain("75%");
  });

  it("does not show percentage text by default", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 75, label: "Progress" },
    });
    expect(wrapper.text()).not.toContain("75%");
  });

  // Indeterminate
  it("applies indeterminate class when indeterminate is true", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 0, indeterminate: true },
    });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.classes()).toContain("progress-bar__fill--indeterminate");
  });

  it("does not set width style when indeterminate", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 50, indeterminate: true },
    });
    const fill = wrapper.find(".progress-bar__fill");
    expect(fill.attributes("style")).toBeUndefined();
  });

  // Accessibility
  it("has role=progressbar on the track", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    const track = wrapper.find(".progress-bar__track");
    expect(track.attributes("role")).toBe("progressbar");
  });

  it("sets aria-valuenow to the rounded percentage", () => {
    const wrapper = mount(ProgressBar, { props: { value: 33 } });
    const track = wrapper.find(".progress-bar__track");
    expect(track.attributes("aria-valuenow")).toBe("33");
  });

  it("sets aria-valuemin to 0", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    const track = wrapper.find(".progress-bar__track");
    expect(track.attributes("aria-valuemin")).toBe("0");
  });

  it("sets aria-valuemax to 100", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    const track = wrapper.find(".progress-bar__track");
    expect(track.attributes("aria-valuemax")).toBe("100");
  });

  it("uses label prop as aria-label", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 50, label: "Upload progress" },
    });
    const track = wrapper.find(".progress-bar__track");
    expect(track.attributes("aria-label")).toBe("Upload progress");
  });

  it("falls back to 'Progress' as aria-label when no label", () => {
    const wrapper = mount(ProgressBar, { props: { value: 50 } });
    const track = wrapper.find(".progress-bar__track");
    expect(track.attributes("aria-label")).toBe("Progress");
  });

  it("does not set aria-valuenow when indeterminate", () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 50, indeterminate: true },
    });
    const track = wrapper.find(".progress-bar__track");
    expect(track.attributes("aria-valuenow")).toBeUndefined();
  });
});
