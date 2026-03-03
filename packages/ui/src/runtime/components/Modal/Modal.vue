<script setup lang="ts">
import { ref, computed, watch, useId } from "vue";
import { useHydrated } from "../../composables/useHydrated";
import { useFocusTrap } from "../../composables/useFocusTrap";

/**
 * Modal
 *
 * An accessible dialog overlay for confirmations, forms, and detail views.
 * Supports focus trapping, scroll locking, backdrop/escape dismissal,
 * and hydration-safe rendering via Teleport.
 *
 * @example
 * <DModal v-model:open="showModal" title="Confirm action">
 *   <p>Are you sure?</p>
 *   <template #footer>
 *     <button @click="showModal = false">Cancel</button>
 *     <button @click="confirm">Confirm</button>
 *   </template>
 * </DModal>
 */

interface ModalProps {
  /** Controls modal visibility (v-model:open) */
  open?: boolean;
  /** Header title text */
  title?: string;
  /** Description text below the title */
  description?: string;
  /** Close when pressing Escape */
  closeOnEscape?: boolean;
  /** Close when clicking the backdrop */
  closeOnBackdrop?: boolean;
  /** Render as fullscreen overlay */
  fullscreen?: boolean;
}

const props = withDefaults(defineProps<ModalProps>(), {
  open: false,
  closeOnEscape: true,
  closeOnBackdrop: true,
  fullscreen: false,
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  close: [];
}>();

defineSlots<{
  /** Optional trigger element that toggles the modal */
  trigger?: (props: { open: () => void }) => any;
  /** Replaces the default header (title + close button) */
  header?: (props: {}) => any;
  /** Modal body content */
  default?: (props: {}) => any;
  /** Footer area for action buttons */
  footer?: (props: {}) => any;
}>();

const hydrated = useHydrated();
const modalId = useId();
const modalRef = ref<HTMLElement | null>(null);
const isOpen = ref(props.open);

// Sync external prop to internal state
watch(
  () => props.open,
  (val) => {
    isOpen.value = val;
  }
);

// Scroll lock when open state changes
watch(
  isOpen,
  (val, oldVal) => {
    if (typeof document !== "undefined") {
      if (val) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
    // Only emit close if it was previously open (not on initial false)
    if (!val && oldVal) {
      emit("close");
    }
    emit("update:open", val);
  },
  { immediate: true }
);

function openModal() {
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
}

function handleBackdropClick(event: MouseEvent) {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    closeModal();
  }
}

// Focus trap
useFocusTrap({
  containerRef: modalRef,
  active: computed(() => isOpen.value && hydrated.value),
  onEscape: () => {
    if (props.closeOnEscape) closeModal();
  },
});
</script>

<template>
  <slot name="trigger" :open="openModal" />

  <Teleport v-if="hydrated" to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal__backdrop"
        @click="handleBackdropClick"
      >
        <div
          ref="modalRef"
          class="modal__dialog"
          :class="{ 'modal__dialog--fullscreen': fullscreen }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? `${modalId}-title` : undefined"
          :aria-describedby="description ? `${modalId}-desc` : undefined"
          tabindex="-1"
        >
          <!-- Header -->
          <div class="modal__header">
            <slot name="header">
              <h2
                v-if="title"
                :id="`${modalId}-title`"
                class="modal__title"
              >
                {{ title }}
              </h2>
              <button
                class="modal__close"
                type="button"
                aria-label="Close"
                @click="closeModal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </slot>
          </div>

          <!-- Description -->
          <p
            v-if="description"
            :id="`${modalId}-desc`"
            class="modal__description"
          >
            {{ description }}
          </p>

          <!-- Body -->
          <div class="modal__body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal__backdrop {
  --modal-backdrop-bg: rgba(0, 0, 0, 0.5);
  --modal-bg: var(--color-surface-raised, #ffffff);
  --modal-border-color: var(--color-border-default, #83b4f0);
  --modal-radius: var(--radius-2xl, 0.75rem);
  --modal-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  --modal-padding: 1.5rem;
  --modal-title-color: var(--color-text-primary, #111827);
  --modal-desc-color: var(--color-text-muted, #4b5563);
  --modal-close-color: var(--color-text-muted, #4b5563);
  --modal-close-hover-color: var(--color-text-primary, #111827);
  --modal-footer-border: var(--color-border-default, #83b4f0);
  --modal-max-width: 32rem;

  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--modal-backdrop-bg);
}

.modal__dialog {
  background: var(--modal-bg);
  border: 1px solid var(--modal-border-color);
  border-radius: var(--modal-radius);
  box-shadow: var(--modal-shadow);
  width: 100%;
  max-width: var(--modal-max-width);
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  outline: none;
}

.modal__dialog--fullscreen {
  max-width: none;
  max-height: none;
  width: 100%;
  height: 100%;
  border-radius: 0;
}

/* Header */
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--modal-padding);
  padding-bottom: 0;
  gap: 1rem;
}

.modal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--modal-title-color);
  line-height: 1.4;
}

.modal__close {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  border-radius: var(--radius-lg, 0.375rem);
  color: var(--modal-close-color);
  cursor: pointer;
  margin-left: auto;
}

/* Expand touch target to 44px minimum */
.modal__close::before {
  content: "";
  position: absolute;
  inset: -6px;
  min-width: 44px;
  min-height: 44px;
}

.modal__close:hover {
  color: var(--modal-close-hover-color);
  background: rgba(0, 0, 0, 0.05);
}

.modal__close:focus-visible {
  outline: 2px solid var(--color-accent-primary, #2563eb);
  outline-offset: -2px;
}

/* Description */
.modal__description {
  margin: 0.5rem 0 0;
  padding: 0 var(--modal-padding);
  font-size: 0.875rem;
  color: var(--modal-desc-color);
}

/* Body */
.modal__body {
  padding: var(--modal-padding);
  overflow-y: auto;
  flex: 1;
}

/* Footer */
.modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: var(--modal-padding);
  padding-top: 0;
  border-top: 1px solid var(--modal-footer-border);
  padding-top: 1rem;
  margin-top: 0;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal__dialog,
.modal-leave-active .modal__dialog {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__dialog,
.modal-leave-to .modal__dialog {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal__dialog,
  .modal-leave-active .modal__dialog {
    transition: none;
  }
}


</style>

<style>
/* Dark mode — unscoped so ancestor .dark selector works correctly */
.dark .modal__backdrop {
  --modal-backdrop-bg: rgba(0, 0, 0, 0.75);
  --modal-bg: var(--color-surface-raised, #1a2540);
  --modal-border-color: var(--color-border-default, #243358);
  --modal-title-color: var(--color-text-primary, #e8eef8);
  --modal-desc-color: var(--color-text-muted, #6b87b8);
  --modal-close-color: var(--color-text-muted, #6b87b8);
  --modal-close-hover-color: var(--color-text-primary, #e8eef8);
  --modal-footer-border: var(--color-border-default, #243358);
}

.dark .modal__close:focus-visible {
  outline-color: var(--color-accent-hover, #5b8fe8);
}
</style>
