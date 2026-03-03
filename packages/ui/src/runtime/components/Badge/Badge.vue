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

withDefaults(defineProps<BadgeProps>(), {
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
  --badge-default-bg: var(--color-surface-base, #dce9fb);
  --badge-default-color: var(--color-text-secondary, #0f3080);
  --badge-default-border: var(--color-border-default, #83b4f0);
  --badge-success-bg: #d6f5ec;
  --badge-success-color: #0a4a34;
  --badge-success-border: #2dba89;
  --badge-warning-bg: #fef3d0;
  --badge-warning-color: #7a4a00;
  --badge-warning-border: #f0b429;
  --badge-danger-bg: #fde8e8;
  --badge-danger-color: #8b1a1a;
  --badge-danger-border: #e85454;
  --badge-info-bg: #e0f0ff;
  --badge-info-color: var(--color-accent-hover, #1a4db8);
  --badge-info-border: var(--color-border-accent, #4e8fe3);
  --badge-radius: var(--radius-lg, 0.375rem);
  --badge-pill-radius: var(--radius-pill, 9999px);

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
  border-radius: var(--radius-circle, 50%);
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
  border-radius: var(--radius-xs, 2px);
}


</style>

<style>
/* Dark mode — unscoped so ancestor .dark selector works correctly */
.dark .badge {
  --badge-default-bg: var(--color-surface-raised, #1a2540);
  --badge-default-color: var(--color-text-secondary, #93baf5);
  --badge-default-border: var(--color-border-accent, #2d4270);
  --badge-success-bg: #092d22;
  --badge-success-color: #4dd4a0;
  --badge-success-border: #0d7a5a;
  --badge-warning-bg: #2e1a00;
  --badge-warning-color: #f5c440;
  --badge-warning-border: #b87d00;
  --badge-danger-bg: #2e0d0d;
  --badge-danger-color: #f08080;
  --badge-danger-border: #b83333;
  --badge-info-bg: #162038;
  --badge-info-color: #6baaf0;
  --badge-info-border: var(--color-accent-primary, #2563eb);
}
</style>
