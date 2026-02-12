<script setup lang="ts">
/**
 * EmptyState
 *
 * A placeholder shown when there is no data to display.
 * Pairs well with DataTable's #empty slot but works standalone too.
 *
 * @example
 * <DEmptyState title="No results" description="Try different filters.">
 *   <template #icon>🔍</template>
 *   <template #action>
 *     <button @click="reset">Reset</button>
 *   </template>
 * </DEmptyState>
 */

interface EmptyStateProps {
  /** Main heading text */
  title?: string;
  /** Supporting description below the title */
  description?: string;
}

defineProps<EmptyStateProps>();

const slots = defineSlots<{
  /** Replaces title + description with fully custom content */
  default?: (props: {}) => any;
  /** Icon or illustration above the title */
  icon?: (props: {}) => any;
  /** Action area below the description (buttons, links) */
  action?: (props: {}) => any;
}>();
</script>

<template>
  <div class="empty-state" role="status">
    <div v-if="$slots.icon" class="empty-state__icon">
      <slot name="icon" />
    </div>

    <slot>
      <p v-if="title" class="empty-state__title">{{ title }}</p>
      <p v-if="description" class="empty-state__description">
        {{ description }}
      </p>
    </slot>

    <div v-if="$slots.action" class="empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  --empty-state-padding: 2.5rem 1.5rem;
  --empty-state-gap: 0.75rem;
  --empty-state-icon-color: #9ca3af;
  --empty-state-icon-size: 3rem;
  --empty-state-title-color: #111827;
  --empty-state-desc-color: #6b7280;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--empty-state-padding);
  gap: var(--empty-state-gap);
}

.empty-state__icon {
  color: var(--empty-state-icon-color);
  font-size: var(--empty-state-icon-size);
  line-height: 1;
}

.empty-state__title {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  color: var(--empty-state-title-color);
}

.empty-state__description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--empty-state-desc-color);
  max-width: 36ch;
}

.empty-state__action {
  margin-top: 0.25rem;
}

/* Dark mode via .dark class */
:global(.dark) .empty-state {
  --empty-state-icon-color: #6b7280;
  --empty-state-title-color: #f9fafb;
  --empty-state-desc-color: #9ca3af;
}

/* Dark mode via prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  .empty-state {
    --empty-state-icon-color: #6b7280;
    --empty-state-title-color: #f9fafb;
    --empty-state-desc-color: #9ca3af;
  }
}
</style>
