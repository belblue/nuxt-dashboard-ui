<script setup lang="ts">
import { computed } from "vue";

/**
 * StatCard
 *
 * Displays a key metric with optional trend indicator.
 * Perfect for dashboard KPIs.
 *
 * @example
 * <DStatCard title="Revenue" :value="12500" trend="up" :trend-value="12" />
 */

// Define what props the component accepts
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

// Computed class for trend styling
const trendClass = computed(() => {
  return {
    "stat-card__trend": true,
    "stat-card__trend--up": props.trend === "up",
    "stat-card__trend--down": props.trend === "down",
    "stat-card__trend--neutral": props.trend === "neutral",
  };
});

const emit = defineEmits<{
  click: [];
}>();
const handleClick = () => {
  if (props.clickable) {
    emit("click");
    console.log("clicked");
  }
};

const formattedValue = computed(() => {
  if (typeof props.value === "number") {
    return new Intl.NumberFormat(props.locale).format(props.value);
  }
  return props.value;
});
</script>

<template>
  <div :class="[{ pointer: clickable }, 'stat-card']" @click="handleClick">
    <template v-if="loading">
      <h3 class="skeleton skeleton--title"></h3>
      <div class="skeleton skeleton--value"></div>
      <p class="skeleton skeleton--trend"></p>
    </template>

    <template v-else>
      <div class="">
        <slot name="icon"> </slot>
        <!--icon slot-->

        <h3 class="stat-card__title">{{ title }}</h3>
        <div class="stat-card__value">
          <slot name="value" :formatted="formattedValue">
            <!--value slot with prop-->
            {{ formattedValue
            }}<!--fallback-->
          </slot>
        </div>
        <p v-if="trendValue !== undefined" :class="trendClass">
          <span>{{ trend === "up" ? "↑" : trend === "down" ? "↓" : "→" }}</span>
          {{ trendValue }}
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.skeleton {
  background: #e5e7eb;
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

.dark .skeleton {
  background: #374151;
}
/* CSS Variables for theming - users can override these */
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

  /* Card styling */
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

/* Dark mode support */
.dark .stat-card {
  --stat-card-bg: #1f2937;
  --stat-card-border: #374151;
  --stat-card-title-color: #9ca3af;
  --stat-card-value-color: #f9fafb;
}
.pointer {
  cursor: pointer;
}
.pointer:focus,
.pointer:hover {
  --stat-card-bg: #8910b93e;
}

.pointer:active {
  --stat-card-bg: #8910b9; /* dark purple on click */
  transform: scale(0.98); /* subtle press effect */
}
</style>
