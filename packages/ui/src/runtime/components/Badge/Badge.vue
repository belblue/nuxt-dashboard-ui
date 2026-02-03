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
  --badge-default-bg: #f3f4f6;
  --badge-default-color: #1f2937;
  --badge-default-border: #9ca3af;
  --badge-success-bg: #d1fae5;
  --badge-success-color: #064e3b;
  --badge-success-border: #34d399;
  --badge-warning-bg: #fef3c7;
  --badge-warning-color: #78350f;
  --badge-warning-border: #f59e0b;
  --badge-danger-bg: #fee2e2;
  --badge-danger-color: #7f1d1d;
  --badge-danger-border: #f87171;
  --badge-info-bg: #dbeafe;
  --badge-info-color: #1e3a8a;
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
  font-size: 0.6875rem;
  padding: 0.125rem 0.5rem;
}

.badge--md {
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
}

.badge--lg {
  font-size: 0.875rem;
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
.dark .badge {
  --badge-default-bg: #374151;
  --badge-default-color: #f3f4f6;
  --badge-default-border: #6b7280;
  --badge-success-bg: #064e3b;
  --badge-success-color: #a7f3d0;
  --badge-success-border: #10b981;
  --badge-warning-bg: #78350f;
  --badge-warning-color: #fde68a;
  --badge-warning-border: #f59e0b;
  --badge-danger-bg: #7f1d1d;
  --badge-danger-color: #fecaca;
  --badge-danger-border: #f87171;
  --badge-info-bg: #1e3a5f;
  --badge-info-color: #bfdbfe;
  --badge-info-border: #60a5fa;
}

/* Dark mode via prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  .badge {
    --badge-default-bg: #374151;
    --badge-default-color: #f3f4f6;
    --badge-default-border: #6b7280;
    --badge-success-bg: #064e3b;
    --badge-success-color: #a7f3d0;
    --badge-success-border: #10b981;
    --badge-warning-bg: #78350f;
    --badge-warning-color: #fde68a;
    --badge-warning-border: #f59e0b;
    --badge-danger-bg: #7f1d1d;
    --badge-danger-color: #fecaca;
    --badge-danger-border: #f87171;
    --badge-info-bg: #1e3a5f;
    --badge-info-color: #bfdbfe;
    --badge-info-border: #60a5fa;
  }
}
</style>
