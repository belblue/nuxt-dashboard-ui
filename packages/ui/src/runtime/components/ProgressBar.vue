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
  width: 100%;
}

.progress-bar__label {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.progress-bar__track {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-bar--success {
  background: #10b981;
}
.progress-bar--warning {
  background: #f59e0b;
}
.progress-bar--danger {
  background: #ef4444;
}

.progress-bar__fill--indeterminate {
  width: 50% !important;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%);
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
</style>
