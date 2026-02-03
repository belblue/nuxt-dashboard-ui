<script setup lang="ts">
/**
 * SkeletonLoader
 *
 * A placeholder component that mimics content layout while data is loading.
 * Supports multiple shape variants, repeating via count, and custom sizing.
 *
 * **Hydration mode**: When `hydrate` is true, the skeleton is shown during SSR
 * and automatically replaced by the default slot content once the client hydrates.
 * Both server and initial client render see the skeleton, so there is no mismatch.
 *
 * @example
 * <!-- Manual loading control -->
 * <DSkeletonLoader variant="text" :count="3" />
 *
 * <!-- Hydration-first: skeleton on SSR, real content after mount -->
 * <DSkeletonLoader variant="card" hydrate>
 *   <MyExpensiveWidget />
 * </DSkeletonLoader>
 */

import { computed } from "vue";
import { useHydrated } from "../../composables/useHydrated";

type SkeletonVariant = "text" | "circle" | "rect" | "card";

interface SkeletonLoaderProps {
  /** Shape of the skeleton placeholder */
  variant?: SkeletonVariant;
  /** Custom width (CSS value) */
  width?: string;
  /** Custom height (CSS value) */
  height?: string;
  /** Whether the pulse animation is active */
  animated?: boolean;
  /** Number of skeleton items to render */
  count?: number;
  /**
   * Hydration-first mode: shows the skeleton during SSR and swaps
   * to the default slot content once the client has hydrated.
   */
  hydrate?: boolean;
}

const props = withDefaults(defineProps<SkeletonLoaderProps>(), {
  variant: "text",
  animated: true,
  count: 1,
  hydrate: false,
});

defineSlots<{
  default?: (props: {}) => any;
}>();

const hydrated = useHydrated();

/** In hydrate mode, show skeleton until mounted. Otherwise always show skeleton. */
const showSkeleton = computed(() => {
  if (!props.hydrate) return true;
  return !hydrated.value;
});
</script>

<template>
  <!-- Hydrate mode: swap between skeleton and real content -->
  <div
    v-if="hydrate"
    class="skeleton-loader"
    :role="showSkeleton ? 'status' : undefined"
    :aria-label="showSkeleton ? 'Loading content' : undefined"
    :aria-busy="showSkeleton ? 'true' : undefined"
  >
    <template v-if="showSkeleton">
      <span class="sr-only">Loading…</span>
      <div
        v-for="n in count"
        :key="n"
        class="skeleton-loader__item"
        :class="[
          `skeleton-loader__item--${variant}`,
          { 'skeleton-loader__item--animated': animated },
        ]"
        :style="{
          width: width || undefined,
          height: height || undefined,
        }"
        aria-hidden="true"
      />
    </template>
    <slot v-else />
  </div>

  <!-- Standard mode: always show skeleton, slot replaces items -->
  <div
    v-else
    class="skeleton-loader"
    role="status"
    aria-label="Loading content"
    aria-busy="true"
  >
    <span class="sr-only">Loading…</span>
    <slot>
      <div
        v-for="n in count"
        :key="n"
        class="skeleton-loader__item"
        :class="[
          `skeleton-loader__item--${variant}`,
          { 'skeleton-loader__item--animated': animated },
        ]"
        :style="{
          width: width || undefined,
          height: height || undefined,
        }"
        aria-hidden="true"
      />
    </slot>
  </div>
</template>

<style scoped>
.skeleton-loader {
  --skeleton-bg: #e5e7eb;
  --skeleton-highlight: #f3f4f6;
  --skeleton-radius: 4px;
  --skeleton-text-height: 16px;
  --skeleton-circle-size: 40px;
  --skeleton-rect-height: 100px;
  --skeleton-card-height: 160px;
  --skeleton-card-radius: 0.75rem;
  --skeleton-gap: 0.5rem;

  display: flex;
  flex-direction: column;
  gap: var(--skeleton-gap);
}

/* Base item */
.skeleton-loader__item {
  background: var(--skeleton-bg);
  flex-shrink: 0;
}

/* Variants */
.skeleton-loader__item--text {
  width: 100%;
  height: var(--skeleton-text-height);
  border-radius: var(--skeleton-radius);
}

.skeleton-loader__item--text:last-child:not(:first-child) {
  width: 60%;
}

.skeleton-loader__item--circle {
  width: var(--skeleton-circle-size);
  height: var(--skeleton-circle-size);
  border-radius: 50%;
}

.skeleton-loader__item--rect {
  width: 100%;
  height: var(--skeleton-rect-height);
  border-radius: var(--skeleton-radius);
}

.skeleton-loader__item--card {
  width: 100%;
  height: var(--skeleton-card-height);
  border-radius: var(--skeleton-card-radius);
}

/* Pulse animation — subtle opacity pulse between full and slightly faded */
@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.skeleton-loader__item--animated {
  animation: skeleton-pulse 3s ease-in-out infinite;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Dark mode via .dark class — :global() needed because .dark is on an ancestor outside scoped scope */
:global(.dark) .skeleton-loader {
  --skeleton-bg: #374151;
  --skeleton-highlight: #4b5563;
}

/* Dark mode via prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  .skeleton-loader {
    --skeleton-bg: #374151;
    --skeleton-highlight: #4b5563;
  }
}
</style>
