import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Modal from "./Modal.vue";

// Mock useHydrated to return true immediately in tests
vi.mock("../../composables/useHydrated", async () => {
  const { ref } = await import("vue");
  return { useHydrated: () => ref(true) };
});

describe("Modal", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    // Clean up any teleported modal elements
    document.querySelectorAll(".modal__backdrop").forEach((el) => el.remove());
  });

  // ── Rendering ──────────────────────────────────────────────

  it("does not render dialog when closed", () => {
    const wrapper = mount(Modal, {
      props: { open: false, title: "Test" },
    });
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it("renders dialog when open", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test Modal" },
      attachTo: document.body,
    });
    await nextTick();
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    wrapper.unmount();
  });

  it("renders title when provided", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "My Title" },
      attachTo: document.body,
    });
    await nextTick();
    const title = document.querySelector(".modal__title");
    expect(title?.textContent).toBe("My Title");
    wrapper.unmount();
  });

  it("renders description when provided", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Title", description: "Some description" },
      attachTo: document.body,
    });
    await nextTick();
    const desc = document.querySelector(".modal__description");
    expect(desc?.textContent).toBe("Some description");
    wrapper.unmount();
  });

  it("renders default slot content as body", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test" },
      slots: { default: "<p>Body content</p>" },
      attachTo: document.body,
    });
    await nextTick();
    const body = document.querySelector(".modal__body");
    expect(body?.textContent).toContain("Body content");
    wrapper.unmount();
  });

  it("renders footer slot when provided", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test" },
      slots: { footer: "<button>Save</button>" },
      attachTo: document.body,
    });
    await nextTick();
    const footer = document.querySelector(".modal__footer");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain("Save");
    wrapper.unmount();
  });

  it("does not render footer when slot is not provided", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test" },
      attachTo: document.body,
    });
    await nextTick();
    const footer = document.querySelector(".modal__footer");
    expect(footer).toBeNull();
    wrapper.unmount();
  });

  // ── Close behavior ──────────────────────────────────────────

  it("closes when close button is clicked", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test" },
      attachTo: document.body,
    });
    await nextTick();
    const closeBtn = document.querySelector(".modal__close") as HTMLElement;
    closeBtn?.click();
    await nextTick();
    const emitted = wrapper.emitted("update:open")!;
    expect(emitted[emitted.length - 1]).toEqual([false]);
    expect(wrapper.emitted("close")).toBeTruthy();
    wrapper.unmount();
  });

  it("closes on backdrop click when closeOnBackdrop is true", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test", closeOnBackdrop: true },
      attachTo: document.body,
    });
    await nextTick();
    const backdrop = document.querySelector(".modal__backdrop") as HTMLElement;
    backdrop?.click();
    await nextTick();
    expect(wrapper.emitted("close")).toBeTruthy();
    wrapper.unmount();
  });

  it("does not close on backdrop click when closeOnBackdrop is false", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test", closeOnBackdrop: false },
      attachTo: document.body,
    });
    await nextTick();
    const backdrop = document.querySelector(".modal__backdrop") as HTMLElement;
    backdrop?.click();
    await nextTick();
    // Should only have the initial open emit, no close
    const closeEmits = wrapper.emitted("close");
    expect(closeEmits).toBeFalsy();
    wrapper.unmount();
  });

  it("does not close on dialog click (only backdrop)", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test" },
      attachTo: document.body,
    });
    await nextTick();
    const dialog = document.querySelector(".modal__dialog") as HTMLElement;
    dialog?.click();
    await nextTick();
    const closeEmits = wrapper.emitted("close");
    expect(closeEmits).toBeFalsy();
    wrapper.unmount();
  });

  // ── Accessibility ──────────────────────────────────────────

  it("has role dialog and aria-modal", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test" },
      attachTo: document.body,
    });
    await nextTick();
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    wrapper.unmount();
  });

  it("sets aria-labelledby when title is provided", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "My Modal" },
      attachTo: document.body,
    });
    await nextTick();
    const dialog = document.querySelector('[role="dialog"]');
    const labelledBy = dialog?.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    const title = document.getElementById(labelledBy!);
    expect(title?.textContent).toBe("My Modal");
    wrapper.unmount();
  });

  it("sets aria-describedby when description is provided", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test", description: "A description" },
      attachTo: document.body,
    });
    await nextTick();
    const dialog = document.querySelector('[role="dialog"]');
    const describedBy = dialog?.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const desc = document.getElementById(describedBy!);
    expect(desc?.textContent).toBe("A description");
    wrapper.unmount();
  });

  it("close button has aria-label", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test" },
      attachTo: document.body,
    });
    await nextTick();
    const closeBtn = document.querySelector(".modal__close");
    expect(closeBtn?.getAttribute("aria-label")).toBe("Close");
    wrapper.unmount();
  });

  // ── Scroll lock ──────────────────────────────────────────

  it("locks body scroll when opened", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test" },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");
    wrapper.unmount();
  });

  it("restores body scroll when closed", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test" },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");
    await wrapper.setProps({ open: false });
    await nextTick();
    expect(document.body.style.overflow).toBe("");
    wrapper.unmount();
  });

  // ── Fullscreen ──────────────────────────────────────────

  it("applies fullscreen class when fullscreen prop is true", async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: "Test", fullscreen: true },
      attachTo: document.body,
    });
    await nextTick();
    const dialog = document.querySelector(".modal__dialog--fullscreen");
    expect(dialog).not.toBeNull();
    wrapper.unmount();
  });

  // ── Trigger slot ──────────────────────────────────────────

  it("renders trigger slot and opens modal on trigger call", async () => {
    const wrapper = mount(Modal, {
      props: { title: "Test" },
      slots: {
        trigger: `<template #trigger="{ open }"><button class="trigger-btn" @click="open">Open</button></template>`,
      },
      attachTo: document.body,
    });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    const triggerBtn = wrapper.find(".trigger-btn");
    await triggerBtn.trigger("click");
    await nextTick();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    wrapper.unmount();
  });
});
