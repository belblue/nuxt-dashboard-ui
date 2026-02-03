<script setup lang="ts">
import { computed, useId } from "vue";

/**
 * StatCard
 *
 * Displays a key metric with optional trend indicator.
 * Perfect for dashboard KPIs.
 *
 * @example
 * <DStatCard title="Revenue" :value="12500" trend="up" :trend-value="12" />
 */

interface StatCardProps {
  title: string;
  value: number | string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number | string;
  clickable?: boolean;
  loading?: boolean;
  locale?: string;
}

const props = withDefaults(defineProps<StatCardProps>(), {
  trend: "neutral",
  loading: false,
  locale: "de-DE",
});

const emit = defineEmits<{
  click: [];
}>();

// SSR-safe ID for aria-labelledby
const titleId = useId();

const trendClass = computed(() => {
  return {
    "stat-card__trend": true,
    "stat-card__trend--up": props.trend === "up",
    "stat-card__trend--down": props.trend === "down",
    "stat-card__trend--neutral": props.trend === "neutral",
  };
});

const handleClick = () => {
  if (props.clickable) {
    emit("click");
  }
};

const trendLabel = computed(() => {
  if (props.trendValue === undefined) return "";
  if (props.trend === "up") return `Increased by ${props.trendValue}`;
  if (props.trend === "down") return `Decreased by ${props.trendValue}`;
  return `No change: ${props.trendValue}`;
});

const formattedValue = computed(() => {
  if (typeof props.value === "number") {
    return new Intl.NumberFormat(props.locale).format(props.value);
  }
  return props.value;
});
</script>

<template>
  <article
    class="stat-card"
    :class="{ 'stat-card--clickable': clickable }"
    role="region"
    :aria-labelledby="titleId"
    v-bind="clickable ? { tabindex: 0, role: 'button' } : {}"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <template v-if="loading">
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--value"></div>
      <div class="skeleton skeleton--trend"></div>
    </template>

    <template v-else>
      <slot name="icon" />
      <h3 :id="titleId" class="stat-card__title">{{ title }}</h3>
      <div class="stat-card__value">
        <slot name="value" :formatted="formattedValue">
          {{ formattedValue }}
        </slot>
      </div>
      <p v-if="trendValue !== undefined" :class="trendClass">
        <span aria-hidden="true">{{ trend === "up" ? "↑" : trend === "down" ? "↓" : "→" }}</span>
        <span class="sr-only">{{ trendLabel }}</span>
        <span aria-hidden="true">{{ trendValue }}</span>
      </p>
    </template>
  </article>
</template>

<style scoped>
/* CSS Variables for theming — consumers can override these */
.stat-card {
  --stat-card-bg: #ffffff;
  --stat-card-border: #e5e7eb;
  --stat-card-radius: 0.75rem;
  --stat-card-padding: 1.5rem;
  --stat-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --stat-card-title-color: #6b7280;
  --stat-card-value-color: #111827;
  --stat-card-trend-up: #10b981;
  --stat-card-trend-down: #ef4444;
  --stat-card-trend-neutral: #6b7280;
  --stat-card-skeleton: #e5e7eb;
  --stat-card-hover-bg: #f9fafb;
  --stat-card-active-bg: #f3f4f6;

  background: var(--stat-card-bg);
  border: 1px solid var(--stat-card-border);
  border-radius: var(--stat-card-radius);
  padding: var(--stat-card-padding);
  box-shadow: var(--stat-card-shadow);
}

.stat-card__title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--stat-card-title-color);
  margin: 0 0 0.5rem 0;
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--stat-card-value-color);
  line-height: 1.2;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-card__trend--up {
  color: var(--stat-card-trend-up);
}

.stat-card__trend--down {
  color: var(--stat-card-trend-down);
}

.stat-card__trend--neutral {
  color: var(--stat-card-trend-neutral);
}

/* Clickable variant */
.stat-card--clickable {
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}

.stat-card--clickable:hover,
.stat-card--clickable:focus-visible {
  background: var(--stat-card-hover-bg);
  outline: 2px solid var(--stat-card-trend-up);
  outline-offset: 2px;
}

.stat-card--clickable:active {
  background: var(--stat-card-active-bg);
  transform: scale(0.98);
}

/* Loading skeleton */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.skeleton {
  background: var(--stat-card-skeleton);
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton--title {
  height: 14px;
  width: 60%;
  margin-bottom: 0.5rem;
}

.skeleton--value {
  height: 32px;
  width: 80%;
  margin-bottom: 0.5rem;
}

.skeleton--trend {
  height: 14px;
  width: 40%;
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

/* Dark mode via .dark class */
.dark .stat-card {
  --stat-card-bg: #1f2937;
  --stat-card-border: #374151;
  --stat-card-title-color: #9ca3af;
  --stat-card-value-color: #f9fafb;
  --stat-card-skeleton: #374151;
  --stat-card-hover-bg: #374151;
  --stat-card-active-bg: #4b5563;
}

/* Dark mode via prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  .stat-card {
    --stat-card-bg: #1f2937;
    --stat-card-border: #374151;
    --stat-card-title-color: #9ca3af;
    --stat-card-value-color: #f9fafb;
    --stat-card-skeleton: #374151;
    --stat-card-hover-bg: #374151;
    --stat-card-active-bg: #4b5563;
  }
}
</style>
