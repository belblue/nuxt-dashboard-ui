<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  useId,
  nextTick,
  onBeforeUnmount,
} from "vue";
import type { DropdownItem } from "./types";

/**
 * Dropdown
 *
 * An accessible action menu or custom content popover triggered by a button.
 * Supports keyboard navigation (Arrow keys, Enter, Escape, Tab),
 * click-outside dismissal, and two placement directions.
 *
 * @example
 * <DDropdown :items="[{ key: 'edit', label: 'Edit' }]" @select="onSelect">
 *   <button>Actions</button>
 * </DDropdown>
 */

type DropdownPlacement = "top" | "bottom";
type DropdownAlign = "start" | "end";
type DropdownWidth = "auto" | "trigger" | number;

interface DropdownProps {
  /** List of menu items (ignored when #content slot is used) */
  items?: DropdownItem[];
  /** Vertical placement relative to trigger */
  placement?: DropdownPlacement;
  /** Horizontal alignment */
  align?: DropdownAlign;
  /** Width behavior */
  width?: DropdownWidth;
  /** Disable the entire dropdown */
  disabled?: boolean;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  items: () => [],
  placement: "bottom",
  align: "start",
  width: "auto",
  disabled: false,
});

const emit = defineEmits<{
  select: [item: DropdownItem];
  open: [];
  close: [];
}>();

defineSlots<{
  /** Trigger element. Receives { isOpen } for styling. */
  default?: (props: { isOpen: boolean }) => any;
  /** Custom dropdown body, replaces the items list */
  content?: (props: { close: () => void }) => any;
  /** Customize rendering of a single item */
  item?: (props: {
    item: DropdownItem;
    index: number;
    active: boolean;
  }) => any;
}>();

const dropdownId = useId();
const menuId = `${dropdownId}-menu`;

const isOpen = ref(false);
const focusedIndex = ref(-1);
const containerRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const enabledItems = computed(() =>
  props.items.filter((item) => !item.disabled)
);

const menuStyle = computed(() => {
  const style: Record<string, string> = {};
  if (typeof props.width === "number") {
    style.width = `${props.width}px`;
  }
  return style;
});

function focusItem(index: number) {
  nextTick(() => {
    const itemEls =
      menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (itemEls && itemEls[index]) {
      itemEls[index].focus();
    }
  });
}

function open() {
  if (props.disabled) return;
  isOpen.value = true;
  focusedIndex.value = -1;
  emit("open");
  nextTick(() => {
    if (enabledItems.value.length > 0) {
      const first = enabledItems.value[0];
      focusedIndex.value = props.items.indexOf(first);
      focusItem(focusedIndex.value);
    }
  });
}

function openAndFocusLast() {
  if (props.disabled) return;
  isOpen.value = true;
  focusedIndex.value = -1;
  emit("open");
  nextTick(() => {
    if (enabledItems.value.length > 0) {
      const last = enabledItems.value[enabledItems.value.length - 1];
      focusedIndex.value = props.items.indexOf(last);
      focusItem(focusedIndex.value);
    }
  });
}

function close() {
  if (!isOpen.value) return;
  isOpen.value = false;
  focusedIndex.value = -1;
  emit("close");
  nextTick(() => {
    const trigger = triggerRef.value?.querySelector(
      "button, [tabindex], a, input, select"
    ) as HTMLElement | null;
    trigger?.focus();
  });
}

function toggle() {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

function selectItem(item: DropdownItem) {
  if (item.disabled) return;
  emit("select", item);
  close();
}

// Click outside
function handleDocumentClick(event: MouseEvent) {
  if (!isOpen.value) return;
  if (containerRef.value?.contains(event.target as Node)) return;
  close();
}

watch(isOpen, (val) => {
  if (val) {
    setTimeout(() => {
      document.addEventListener("click", handleDocumentClick);
    }, 0);
  } else {
    document.removeEventListener("click", handleDocumentClick);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});

// Keyboard: trigger
function handleTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return;

  switch (event.key) {
    case "Enter":
    case " ":
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) open();
      break;
    case "ArrowUp":
      event.preventDefault();
      if (!isOpen.value) openAndFocusLast();
      break;
  }
}

// Keyboard: menu
function handleMenuKeydown(event: KeyboardEvent) {
  const enabled = enabledItems.value;
  if (enabled.length === 0 && event.key !== "Escape" && event.key !== "Tab")
    return;

  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      const currentInEnabled = enabled.findIndex(
        (item) => props.items.indexOf(item) === focusedIndex.value
      );
      const nextIdx = (currentInEnabled + 1) % enabled.length;
      focusedIndex.value = props.items.indexOf(enabled[nextIdx]);
      focusItem(focusedIndex.value);
      break;
    }
    case "ArrowUp": {
      event.preventDefault();
      const currentInEnabled = enabled.findIndex(
        (item) => props.items.indexOf(item) === focusedIndex.value
      );
      const prevIdx =
        (currentInEnabled - 1 + enabled.length) % enabled.length;
      focusedIndex.value = props.items.indexOf(enabled[prevIdx]);
      focusItem(focusedIndex.value);
      break;
    }
    case "Home": {
      event.preventDefault();
      focusedIndex.value = props.items.indexOf(enabled[0]);
      focusItem(focusedIndex.value);
      break;
    }
    case "End": {
      event.preventDefault();
      focusedIndex.value = props.items.indexOf(enabled[enabled.length - 1]);
      focusItem(focusedIndex.value);
      break;
    }
    case "Enter":
    case " ": {
      event.preventDefault();
      const item = props.items[focusedIndex.value];
      if (item && !item.disabled) {
        selectItem(item);
      }
      break;
    }
    case "Escape":
      event.preventDefault();
      close();
      break;
    case "Tab":
      close();
      break;
  }
}
</script>

<template>
  <div
    ref="containerRef"
    class="dropdown"
    :class="[
      `dropdown--${placement}`,
      `dropdown--align-${align}`,
      {
        'dropdown--open': isOpen,
        'dropdown--disabled': disabled,
        'dropdown--width-trigger': width === 'trigger',
      },
    ]"
  >
    <div
      ref="triggerRef"
      class="dropdown__trigger"
      :aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? menuId : undefined"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <slot :is-open="isOpen" />
    </div>

    <div
      v-if="isOpen"
      :id="menuId"
      ref="menuRef"
      class="dropdown__menu"
      :class="{ 'dropdown__menu--custom': !!$slots.content }"
      :role="$slots.content ? undefined : 'menu'"
      :style="menuStyle"
      @keydown="handleMenuKeydown"
    >
      <slot v-if="$slots.content" name="content" :close="close" />

      <template v-else>
        <template v-for="(item, index) in items" :key="item.key">
          <div
            v-if="item.divider"
            class="dropdown__divider"
            role="separator"
          />
          <div
            class="dropdown__item"
            :class="{
              'dropdown__item--disabled': item.disabled,
              'dropdown__item--focused': index === focusedIndex,
            }"
            role="menuitem"
            :tabindex="-1"
            :aria-disabled="item.disabled || undefined"
            @click="selectItem(item)"
            @mouseenter="focusedIndex = index"
            @mouseleave="focusedIndex = -1"
          >
            <slot
              name="item"
              :item="item"
              :index="index"
              :active="index === focusedIndex"
            >
              {{ item.label }}
            </slot>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  --dropdown-bg: var(--color-surface-raised, #ffffff);
  --dropdown-border-color: var(--color-surface-base, #dce9fb);
  --dropdown-shadow: 0 4px 16px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.06);
  --dropdown-radius: var(--radius-xl, 0.5rem);
  --dropdown-padding: 0.25rem;
  --dropdown-offset: 0.375rem;
  --dropdown-min-width: 10rem;
  --dropdown-z-index: 1000;
  --dropdown-item-padding: 0.5rem 0.75rem;
  --dropdown-item-color: var(--color-text-secondary, #0f3080);
  --dropdown-item-hover-bg: var(--color-surface-base, #dce9fb);
  --dropdown-item-hover-color: var(--color-text-secondary, #0f3080);
  --dropdown-item-disabled-color: var(--color-text-disabled, #9ca3af);
  --dropdown-item-radius: var(--radius-md, 0.25rem);
  --dropdown-divider-color: var(--color-border-divider, #e5e7eb);
  --dropdown-focus-ring: 2px solid var(--color-accent-primary, #2563eb);

  position: relative;
  display: inline-flex;
}

.dropdown--disabled {
  pointer-events: none;
  opacity: 0.5;
}

.dropdown__trigger {
  display: inline-flex;
}

/* Menu */
.dropdown__menu {
  position: absolute;
  z-index: var(--dropdown-z-index);
  background: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border-color);
  border-radius: var(--dropdown-radius);
  box-shadow: var(--dropdown-shadow);
  padding: var(--dropdown-padding);
  min-width: var(--dropdown-min-width);
  width: max-content;
  animation: dropdown-enter 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dropdown__menu--custom {
  padding: 0.75rem;
}

.dropdown--width-trigger .dropdown__menu {
  width: 100%;
  min-width: unset;
}

/* Placement: bottom */
.dropdown--bottom .dropdown__menu {
  top: calc(100% + var(--dropdown-offset));
  transform-origin: top center;
}

/* Placement: top */
.dropdown--top .dropdown__menu {
  bottom: calc(100% + var(--dropdown-offset));
  transform-origin: bottom center;
  animation-name: dropdown-enter-top;
}

/* Alignment */
.dropdown--align-start .dropdown__menu {
  left: 0;
}

.dropdown--align-end .dropdown__menu {
  right: 0;
}

/* Entrance animations */
@keyframes dropdown-enter {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdown-enter-top {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Items */
.dropdown__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--dropdown-item-padding);
  color: var(--dropdown-item-color);
  font-size: 0.875rem;
  font-weight: 400;
  border-radius: var(--dropdown-item-radius);
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  transition: background 0.1s ease, color 0.1s ease;
}

.dropdown__item:hover:not(.dropdown__item--disabled),
.dropdown__item--focused:not(.dropdown__item--disabled) {
  background: var(--dropdown-item-hover-bg);
  color: var(--dropdown-item-hover-color);
}

.dropdown__item:focus-visible {
  outline: var(--dropdown-focus-ring);
  outline-offset: -2px;
}

.dropdown__item--disabled {
  color: var(--dropdown-item-disabled-color);
  cursor: default;
}

/* Divider */
.dropdown__divider {
  height: 1px;
  background: var(--dropdown-divider-color);
  margin: 0.25rem 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .dropdown__menu {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .dropdown__item {
    transition: none;
  }
}


</style>

<style>
/* Dark mode — unscoped so ancestor .dark selector works correctly */
.dark .dropdown {
  --dropdown-bg: var(--color-surface-raised, #1a2540);
  --dropdown-border-color: var(--color-border-default, #243358);
  --dropdown-shadow: 0 4px 16px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
  --dropdown-item-color: var(--color-text-primary, #e8eef8);
  --dropdown-item-hover-bg: var(--color-surface-hover, #1f2b47);
  --dropdown-item-hover-color: var(--color-text-primary, #e8eef8);
  --dropdown-item-disabled-color: var(--color-text-disabled, #3a4f6e);
  --dropdown-divider-color: var(--color-border-default, #243358);
  --dropdown-focus-ring: 2px solid var(--color-accent-hover, #5b8fe8);
}
</style>
