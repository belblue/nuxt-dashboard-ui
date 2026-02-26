<script setup lang="ts">
/**
 * Badge
 *
 * A small label for status indicators, counts, or categories.
 * Supports semantic color variants and optional dot/dismiss.
 *
 * @example
 * <DBadge variant="success">Active</DBadge>
 * <DBadge variant="danger" dot>Offline</DBadge>
 * <DBadge variant="info" dismissible @dismiss="remove()">New</DBadge>
 */

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Show a colored dot before the label */
  dot?: boolean;
  /** Show a dismiss/close button */
  dismissible?: boolean;
  /** Render as a pill (fully rounded) */
  pill?: boolean;
  /** Render as outline style instead of filled */
  outline?: boolean;
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: "default",
  size: "md",
  dot: false,
  dismissible: false,
  pill: false,
  outline: false,
});

const emit = defineEmits<{
  dismiss: [];
}>();

defineSlots<{
  default?: (props: {}) => any;
}>();
</script>

<template>
  <span
    class="badge"
    :class="[
      `badge--${variant}`,
      `badge--${size}`,
      { 'badge--pill': pill, 'badge--outline': outline },
    ]"
  >
    <span v-if="dot" class="badge__dot" aria-hidden="true" />
    <slot />
    <button
      v-if="dismissible"
      class="badge__dismiss"
      type="button"
      aria-label="Dismiss"
      @click.stop="emit('dismiss')"
    >
      &times;
    </button>
  </span>
</template>

<style scoped>
/* CSS Variables for theming — consumers can override these */
.badge {
  --badge-default-bg: #dbeafe;
  --badge-default-color: #1e3a5f;
  --badge-default-border: #60a5fa;
  --badge-success-bg: #d1fae5;
  --badge-success-color: #065f46;
  --badge-success-border: #34d399;
  --badge-warning-bg: #fef3c7;
  --badge-warning-color: #92400e;
  --badge-warning-border: #fbbf24;
  --badge-danger-bg: #fee2e2;
  --badge-danger-color: #991b1b;
  --badge-danger-border: #f87171;
  --badge-info-bg: #dbeafe;
  --badge-info-color: #1e40af;
  --badge-info-border: #60a5fa;
  --badge-radius: 6px;
  --badge-pill-radius: 9999px;

  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: var(--badge-radius);
}

.badge--pill {
  border-radius: var(--badge-pill-radius);
}

/* Sizes */
.badge--sm {
  font-size: 0.75rem;
  padding: 0.1875rem 0.5rem;
}

.badge--md {
  font-size: 0.875rem;
  padding: 0.25rem 0.625rem;
}

.badge--lg {
  font-size: 1rem;
  padding: 0.375rem 0.75rem;
}

/* Filled variants */
.badge--default {
  background: var(--badge-default-bg);
  color: var(--badge-default-color);
}

.badge--success {
  background: var(--badge-success-bg);
  color: var(--badge-success-color);
}

.badge--warning {
  background: var(--badge-warning-bg);
  color: var(--badge-warning-color);
}

.badge--danger {
  background: var(--badge-danger-bg);
  color: var(--badge-danger-color);
}

.badge--info {
  background: var(--badge-info-bg);
  color: var(--badge-info-color);
}

/* Outline variants */
.badge--outline.badge--default {
  background: transparent;
  border-color: var(--badge-default-border);
  color: var(--badge-default-color);
}

.badge--outline.badge--success {
  background: transparent;
  border-color: var(--badge-success-border);
  color: var(--badge-success-color);
}

.badge--outline.badge--warning {
  background: transparent;
  border-color: var(--badge-warning-border);
  color: var(--badge-warning-color);
}

.badge--outline.badge--danger {
  background: transparent;
  border-color: var(--badge-danger-border);
  color: var(--badge-danger-color);
}

.badge--outline.badge--info {
  background: transparent;
  border-color: var(--badge-info-border);
  color: var(--badge-info-color);
}

/* Dot indicator */
.badge__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

/* Dismiss button */
.badge__dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0;
  margin-left: 0.125rem;
  font-size: 1em;
  line-height: 1;
  opacity: 0.6;
  position: relative;
}

/* Expand touch target to 44x44 without affecting visual size */
.badge__dismiss::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 44px;
  min-height: 44px;
}

.badge__dismiss:hover {
  opacity: 1;
}

.badge__dismiss:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 1px;
  border-radius: 2px;
}

/* Dark mode via .dark class */
:global(.dark) .badge {
  --badge-default-bg: #1f2937;
  --badge-default-color: #e5e7eb;
  --badge-default-border: #4b5563;
  --badge-success-bg: #052e16;
  --badge-success-color: #6ee7b7;
  --badge-success-border: #059669;
  --badge-warning-bg: #451a03;
  --badge-warning-color: #fcd34d;
  --badge-warning-border: #d97706;
  --badge-danger-bg: #450a0a;
  --badge-danger-color: #fca5a5;
  --badge-danger-border: #dc2626;
  --badge-info-bg: #172554;
  --badge-info-color: #93c5fd;
  --badge-info-border: #3b82f6;
}

</style>
