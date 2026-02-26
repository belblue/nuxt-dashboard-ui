<script setup lang="ts">
import { ref, computed, useId, useSlots } from "vue";

/**
 * Tooltip
 *
 * A CSS-positioned tooltip bubble with arrow for contextual help.
 * Supports hover, focus, and touch triggers with four placements.
 *
 * @example
 * <DTooltip content="Helpful tip">
 *   <button>Hover me</button>
 * </DTooltip>
 */

type TooltipPlacement = "top" | "bottom" | "left" | "right";
type TooltipTrigger = "hover" | "focus" | "hover+focus";

interface TooltipProps {
  /** Text content displayed in the tooltip bubble */
  content?: string;
  /** Position of the tooltip relative to the trigger */
  placement?: TooltipPlacement;
  /** How the tooltip is triggered */
  trigger?: TooltipTrigger;
  /** Delay in ms before showing the tooltip (hover only) */
  delay?: number;
  /** Disables the tooltip entirely */
  disabled?: boolean;
}

const props = withDefaults(defineProps<TooltipProps>(), {
  content: "",
  placement: "top",
  trigger: "hover+focus",
  delay: 200,
  disabled: false,
});

defineSlots<{
  /** The trigger element that the tooltip is attached to */
  default?: (props: {}) => any;
  /** Custom tooltip content, overrides the content prop */
  content?: (props: {}) => any;
}>();

const slots = useSlots();
const tooltipId = useId();

let delayTimer: ReturnType<typeof setTimeout> | null = null;

const isHovered = ref(false);
const isFocused = ref(false);
const isTouched = ref(false);

const hasContent = computed(() => {
  return !!props.content || !!slots.content;
});

const shouldShow = computed(() => {
  if (props.disabled || !hasContent.value) return false;
  return isHovered.value || isFocused.value || isTouched.value;
});

function clearDelay() {
  if (delayTimer !== null) {
    clearTimeout(delayTimer);
    delayTimer = null;
  }
}

function hide() {
  isHovered.value = false;
  isFocused.value = false;
  isTouched.value = false;
  clearDelay();
}

function onMouseEnter() {
  if (props.disabled) return;
  if (props.trigger !== "hover" && props.trigger !== "hover+focus") return;
  clearDelay();
  if (props.delay > 0) {
    delayTimer = setTimeout(() => {
      isHovered.value = true;
    }, props.delay);
  } else {
    isHovered.value = true;
  }
}

function onMouseLeave() {
  clearDelay();
  isHovered.value = false;
}

function onFocusIn() {
  if (props.disabled) return;
  if (props.trigger !== "focus" && props.trigger !== "hover+focus") return;
  isFocused.value = true;
}

function onFocusOut() {
  isFocused.value = false;
}

function onTouchStart() {
  if (props.disabled) return;
  isTouched.value = !isTouched.value;
  if (isTouched.value) {
    setTimeout(() => {
      isTouched.value = false;
    }, 1500);
  }
}
</script>

<template>
  <span
    class="tooltip"
    :class="[
      `tooltip--${placement}`,
      { 'tooltip--visible': shouldShow, 'tooltip--disabled': disabled },
    ]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.escape="hide"
    @touchstart.passive="onTouchStart"
  >
    <span
      class="tooltip__trigger"
      :aria-describedby="hasContent ? tooltipId : undefined"
    >
      <slot />
    </span>

    <span
      v-if="hasContent"
      :id="tooltipId"
      role="tooltip"
      class="tooltip__bubble"
    >
      <slot name="content">{{ content }}</slot>
    </span>
  </span>
</template>

<style scoped>
.tooltip {
  --tooltip-bg: #18212f;
  --tooltip-color: #f1f5f9;
  --tooltip-shadow: 0 4px 14px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
  --tooltip-font-size: 0.8125rem;
  --tooltip-padding: 0.5rem 0.75rem;
  --tooltip-radius: 8px;
  --tooltip-arrow-size: 6px;
  --tooltip-offset: 10px;
  --tooltip-max-width: 260px;
  --tooltip-z-index: 1000;

  position: relative;
  display: inline-flex;
}

.tooltip__trigger {
  display: inline-flex;
}

/* Bubble */
.tooltip__bubble {
  position: absolute;
  z-index: var(--tooltip-z-index);
  background: var(--tooltip-bg);
  color: var(--tooltip-color);
  font-size: var(--tooltip-font-size);
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: var(--tooltip-padding);
  border-radius: var(--tooltip-radius);
  max-width: var(--tooltip-max-width);
  width: max-content;
  line-height: 1.5;
  text-align: center;
  white-space: normal;
  pointer-events: none;
  box-shadow: var(--tooltip-shadow);
  opacity: 0;
  visibility: hidden;
  transform-origin: center;
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.tooltip--visible .tooltip__bubble {
  opacity: 1;
  visibility: visible;
}

/* Arrow */
.tooltip__bubble::after {
  content: "";
  position: absolute;
  border: var(--tooltip-arrow-size) solid transparent;
}

/* Placement: top */
.tooltip--top .tooltip__bubble {
  bottom: calc(100% + var(--tooltip-offset));
  left: 50%;
  transform: translateX(-50%) translateY(4px) scale(0.97);
}

.tooltip--top.tooltip--visible .tooltip__bubble {
  transform: translateX(-50%) translateY(0) scale(1);
}

.tooltip--top .tooltip__bubble::after {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: var(--tooltip-bg);
}

/* Placement: bottom */
.tooltip--bottom .tooltip__bubble {
  top: calc(100% + var(--tooltip-offset));
  left: 50%;
  transform: translateX(-50%) translateY(-4px) scale(0.97);
}

.tooltip--bottom.tooltip--visible .tooltip__bubble {
  transform: translateX(-50%) translateY(0) scale(1);
}

.tooltip--bottom .tooltip__bubble::after {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: var(--tooltip-bg);
}

/* Placement: left */
.tooltip--left .tooltip__bubble {
  right: calc(100% + var(--tooltip-offset));
  top: 50%;
  transform: translateY(-50%) translateX(4px) scale(0.97);
}

.tooltip--left.tooltip--visible .tooltip__bubble {
  transform: translateY(-50%) translateX(0) scale(1);
}

.tooltip--left .tooltip__bubble::after {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: var(--tooltip-bg);
}

/* Placement: right */
.tooltip--right .tooltip__bubble {
  left: calc(100% + var(--tooltip-offset));
  top: 50%;
  transform: translateY(-50%) translateX(-4px) scale(0.97);
}

.tooltip--right.tooltip--visible .tooltip__bubble {
  transform: translateY(-50%) translateX(0) scale(1);
}

.tooltip--right .tooltip__bubble::after {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: var(--tooltip-bg);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .tooltip__bubble {
    transition: none;
  }
}

/* Dark mode via .dark class */
:global(.dark) .tooltip {
  --tooltip-bg: #f1f5f9;
  --tooltip-color: #0f172a;
  --tooltip-shadow: 0 4px 14px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2);
}

</style>
