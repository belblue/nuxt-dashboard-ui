<script setup lang="ts">
import { computed } from "vue";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?:'default' | 'success' | 'warning' | 'danger';
  indeterminate?: boolean;
}

const props = withDefaults(defineProps<ProgressBarProps>(), {
  max: 100,
  variant: 'default',
  showValue: false,
  indeterminate: false,
});

const percentage = computed(()=>{
    const raw = (props.value / props.max) * 100
    return Math.min(100,Math.max(0,raw));
});

const classVariant = computed(()=>{
    if(props.variant !='default'){
        return `progress-bar--${props.variant}`;
    }
    if (percentage.value < 30) return 'progress-bar--danger'
    if (percentage.value < 70) return 'progress-bar--warning'
    return 'progress-bar--success'
})
</script>
<template>
  <div class="progress-bar">
    <div v-if="label" class="progress-bar__label">
      {{ label }}
      <span v-if="showValue">{{ Math.round(percentage) }}%</span>
    </div>
    <div
      class="progress-bar__track"
      role="progressbar"
      :aria-valuenow="indeterminate ? undefined : Math.round(percentage)"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-label="label || 'Progress'"
    >
      <div
        class="progress-bar__fill"
        :class="[classVariant, { 'progress-bar__fill--indeterminate': indeterminate }]"
        :style="indeterminate ? {} : { width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
<style scoped>
.progress-bar {
  --pg-track-bg: var(--color-surface-hover, #b8d4f8);
  --pg-track-radius: var(--radius-sm, 4px);
  --pg-fill-default: var(--color-accent-primary, #2563eb);
  --pg-fill-success: #2dba89;
  --pg-fill-warning: #f0b429;
  --pg-fill-danger: #e85454;
  --pg-fill-radius: var(--radius-sm, 4px);
  --pg-label-color: var(--color-text-primary, #111827);
  --pg-indeterminate-from: var(--color-accent-hover, #1a4db8);
  --pg-indeterminate-mid: var(--color-accent-primary, #2563eb);

  width: 100%;
}

.progress-bar__label {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--pg-label-color);
  margin-bottom: 0.25rem;
}

.progress-bar__track {
  height: 8px;
  background: var(--pg-track-bg);
  border-radius: var(--pg-track-radius);
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: var(--pg-fill-default);
  border-radius: var(--pg-fill-radius);
  transition: width 0.3s ease;
}

.progress-bar--success {
  background: var(--pg-fill-success);
}
.progress-bar--warning {
  background: var(--pg-fill-warning);
}
.progress-bar--danger {
  background: var(--pg-fill-danger);
}

.progress-bar__fill--indeterminate {
  width: 50% !important;
  background: linear-gradient(90deg, var(--pg-indeterminate-from) 0%, var(--pg-indeterminate-mid) 50%, var(--pg-indeterminate-from) 100%);
  animation: indeterminate-slide 1.5s ease-in-out infinite;
}

@keyframes indeterminate-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .progress-bar__fill {
    transition: none;
  }

  .progress-bar__fill--indeterminate {
    animation: none;
  }
}
</style>

<style>
/* Dark mode — unscoped so ancestor .dark selector works correctly */
.dark .progress-bar {
  --pg-track-bg: var(--color-surface-raised, #1a2540);
  --pg-fill-default: var(--color-accent-primary, #3b6fd4);
  --pg-fill-success: #0d7a5a;
  --pg-fill-warning: #b87d00;
  --pg-fill-danger: #b83333;
  --pg-label-color: var(--color-text-primary, #e8eef8);
  --pg-indeterminate-from: #243358;
  --pg-indeterminate-mid: var(--color-accent-primary, #3b6fd4);
}
</style>
