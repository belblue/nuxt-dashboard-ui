<script setup lang="ts">
import { computed, ref, watch, useId, useSlots } from "vue";
import type { TabItem } from "./types";

/**
 * Tabs
 *
 * Organizes content into switchable panels with full keyboard navigation
 * and WAI-ARIA tabs pattern.
 *
 * @example
 * <DTabs v-model="active" :items="[{ key: 'a', label: 'Tab A' }]">
 *   <template #panel-a>Content A</template>
 * </DTabs>
 */

interface TabsProps {
  /** Tab definitions */
  items: TabItem[];
  /** Active tab key (v-model) */
  modelValue?: string;
  /** Visual variant */
  variant?: "line" | "pill";
  /** Only mount the active panel (lazy rendering) */
  lazy?: boolean;
}

const props = withDefaults(defineProps<TabsProps>(), {
  variant: "line",
  lazy: false,
});

const emit = defineEmits<{
  "update:modelValue": [key: string];
}>();

const slots = useSlots();
const tabsId = useId();

const enabledItems = computed(() => props.items.filter((i) => !i.disabled));

const firstEnabled = computed(() => enabledItems.value[0]?.key ?? "");

const activeKey = ref(props.modelValue ?? firstEnabled.value);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) activeKey.value = val;
  }
);

// If the active tab becomes disabled or removed, fall back to first enabled
watch(
  () => props.items,
  () => {
    const exists = props.items.find(
      (i) => i.key === activeKey.value && !i.disabled
    );
    if (!exists) {
      activeKey.value = firstEnabled.value;
      emit("update:modelValue", activeKey.value);
    }
  },
  { deep: true }
);

function selectTab(key: string) {
  const item = props.items.find((i) => i.key === key);
  if (item?.disabled) return;
  activeKey.value = key;
  emit("update:modelValue", key);
}

function getTabId(key: string): string {
  return `${tabsId}-tab-${key}`;
}

function getPanelId(key: string): string {
  return `${tabsId}-panel-${key}`;
}

function handleKeydown(event: KeyboardEvent) {
  const enabled = enabledItems.value;
  if (enabled.length === 0) return;

  const currentIndex = enabled.findIndex((i) => i.key === activeKey.value);
  let nextIndex: number | null = null;

  switch (event.key) {
    case "ArrowRight":
      nextIndex = (currentIndex + 1) % enabled.length;
      break;
    case "ArrowLeft":
      nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
      break;
    case "Home":
      nextIndex = 0;
      break;
    case "End":
      nextIndex = enabled.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  const next = enabled[nextIndex];
  selectTab(next.key);

  // Focus the newly activated tab button
  const tabEl = document.getElementById(getTabId(next.key));
  tabEl?.focus();
}

function hasTabSlot(key: string): boolean {
  return !!slots[`tab-${key}`];
}
</script>

<template>
  <div class="tabs" :class="`tabs--${variant}`">
    <div class="tabs__list" role="tablist" @keydown="handleKeydown">
      <button
        v-for="item in items"
        :id="getTabId(item.key)"
        :key="item.key"
        class="tabs__tab"
        :class="{
          'tabs__tab--active': item.key === activeKey,
          'tabs__tab--disabled': item.disabled,
        }"
        role="tab"
        :aria-selected="item.key === activeKey"
        :aria-controls="getPanelId(item.key)"
        :aria-disabled="item.disabled || undefined"
        :tabindex="item.key === activeKey ? 0 : -1"
        :disabled="item.disabled"
        @click="selectTab(item.key)"
      >
        <slot
          v-if="hasTabSlot(item.key)"
          :name="`tab-${item.key}`"
          :item="item"
          :active="item.key === activeKey"
        />
        <template v-else>
          <span class="tabs__label">{{ item.label }}</span>
          <span v-if="item.badge" class="tabs__badge">{{ item.badge }}</span>
        </template>
      </button>
    </div>

    <template v-if="lazy">
      <div
        v-for="item in items"
        v-show="item.key === activeKey"
        :id="getPanelId(item.key)"
        :key="item.key"
        class="tabs__panel"
        role="tabpanel"
        :aria-labelledby="getTabId(item.key)"
        :tabindex="0"
      >
        <slot
          v-if="item.key === activeKey"
          :name="`panel-${item.key}`"
        />
      </div>
    </template>
    <template v-else>
      <div
        v-for="item in items"
        v-show="item.key === activeKey"
        :id="getPanelId(item.key)"
        :key="item.key"
        class="tabs__panel"
        role="tabpanel"
        :aria-labelledby="getTabId(item.key)"
        :tabindex="0"
      >
        <slot :name="`panel-${item.key}`" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.tabs {
  --tabs-border-color: var(--color-border-default, #83b4f0);
  --tabs-tab-color: var(--color-text-muted, #4b5563);
  --tabs-tab-hover-color: var(--color-accent-hover, #1a4db8);
  --tabs-tab-hover-bg: var(--color-surface-hover, #b8d4f8);
  --tabs-tab-active-color: var(--color-text-secondary, #0f3080);
  --tabs-tab-disabled-color: var(--color-text-disabled, #9ca3af);
  --tabs-tab-padding: 0.625rem 1rem;
  --tabs-tab-font-weight: 500;
  --tabs-panel-padding: 1rem 0;
  --tabs-badge-bg: var(--color-border-default, #83b4f0);
  --tabs-badge-color: var(--color-text-secondary, #0f3080);
  --tabs-pill-bg: transparent;
  --tabs-pill-active-bg: var(--color-accent-primary, #2563eb);
  --tabs-pill-active-color: #ffffff;
  --tabs-pill-hover-bg: var(--color-surface-hover, #b8d4f8);
  --tabs-pill-radius: var(--radius-lg, 0.375rem);
  --tabs-focus-ring: 2px solid var(--color-accent-primary, #2563eb);
}

/* Tab list */
.tabs__list {
  display: flex;
  gap: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.tabs__list::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* Line variant */
.tabs--line .tabs__list {
  border-bottom: 1px solid var(--tabs-border-color);
}

.tabs--line .tabs__tab {
  position: relative;
  padding: var(--tabs-tab-padding);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  color: var(--tabs-tab-color);
  font-size: 0.875rem;
  font-weight: var(--tabs-tab-font-weight);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
}

.tabs--line .tabs__tab:hover:not(:disabled) {
  color: var(--tabs-tab-hover-color);
  background: var(--tabs-tab-hover-bg);
  border-radius: var(--radius-lg, 0.375rem) var(--radius-lg, 0.375rem) 0 0;
}

.tabs--line .tabs__tab--active {
  color: var(--tabs-tab-active-color);
  border-bottom-color: var(--tabs-tab-active-color);
}

/* Pill variant */
.tabs--pill .tabs__list {
  gap: 0.25rem;
}

.tabs--pill .tabs__tab {
  padding: var(--tabs-tab-padding);
  background: var(--tabs-pill-bg);
  border: none;
  border-radius: var(--tabs-pill-radius);
  color: var(--tabs-tab-color);
  font-size: 0.875rem;
  font-weight: var(--tabs-tab-font-weight);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
}

.tabs--pill .tabs__tab:hover:not(:disabled) {
  background: var(--tabs-pill-hover-bg);
  color: var(--tabs-tab-hover-color);
}

.tabs--pill .tabs__tab--active {
  background: var(--tabs-pill-active-bg);
  color: var(--tabs-pill-active-color);
}

/* Shared tab states */
.tabs__tab:focus-visible {
  outline: var(--tabs-focus-ring);
  outline-offset: -2px;
}

.tabs__tab--disabled {
  color: var(--tabs-tab-disabled-color);
  cursor: default;
}

/* Badge */
.tabs__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  border-radius: var(--radius-pill, 9999px);
  background: var(--tabs-badge-bg);
  color: var(--tabs-badge-color);
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1;
}

.tabs__tab--active .tabs__badge {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
}

.tabs--line .tabs__tab--active .tabs__badge {
  background: var(--tabs-tab-active-color);
  color: var(--tabs-pill-active-color);
}

/* Panel */
.tabs__panel {
  padding: var(--tabs-panel-padding);
}

.tabs__panel:focus-visible {
  outline: var(--tabs-focus-ring);
  outline-offset: 2px;
  border-radius: var(--radius-md, 0.25rem);
}


</style>

<style>
/* Dark mode — unscoped so ancestor .dark selector works correctly */
.dark .tabs {
  --tabs-border-color: var(--color-border-default, #243358);
  --tabs-tab-color: var(--color-text-muted, #6b87b8);
  --tabs-tab-hover-color: var(--color-text-secondary, #93baf5);
  --tabs-tab-hover-bg: var(--color-surface-hover, #1f2b47);
  --tabs-tab-active-color: var(--color-text-primary, #e8eef8);
  --tabs-tab-disabled-color: var(--color-text-disabled, #3a4f6e);
  --tabs-badge-bg: var(--color-border-default, #243358);
  --tabs-badge-color: var(--color-text-secondary, #93baf5);
  --tabs-pill-hover-bg: var(--color-surface-hover, #1f2b47);
  --tabs-pill-active-bg: var(--color-accent-primary, #3b6fd4);
  --tabs-pill-active-color: #ffffff;
  --tabs-focus-ring: 2px solid var(--color-accent-hover, #5b8fe8);
}
</style>
