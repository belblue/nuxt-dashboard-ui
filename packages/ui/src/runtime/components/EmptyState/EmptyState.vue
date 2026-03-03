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

defineSlots<{
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
  --empty-state-icon-color: var(--color-text-muted, #4b5563);
  --empty-state-icon-size: 3rem;
  --empty-state-title-color: var(--color-text-primary, #111827);
  --empty-state-desc-color: var(--color-text-muted, #4b5563);

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


</style>

<style>
/* Dark mode — unscoped so ancestor .dark selector works correctly */
.dark .empty-state {
  --empty-state-icon-color: var(--color-text-muted, #6b87b8);
  --empty-state-title-color: var(--color-text-primary, #e8eef8);
  --empty-state-desc-color: var(--color-text-muted, #6b87b8);
}
</style>
