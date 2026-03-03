import { ref, watch, onUnmounted, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

interface UseFocusTrapOptions {
  /** The element to trap focus within */
  containerRef: Ref<HTMLElement | null>
  /** Whether the trap is active */
  active: Ref<boolean>
  /** Called when the user presses Escape */
  onEscape?: () => void
}

export function useFocusTrap(options: UseFocusTrapOptions) {
  const previouslyFocused = ref<HTMLElement | null>(null)

  function getFocusableElements(): HTMLElement[] {
    if (!options.containerRef.value) return []
    return Array.from(
      options.containerRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((el) => el.offsetParent !== null)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      options.onEscape?.()
      return
    }

    if (event.key !== 'Tab') return

    const focusable = getFocusableElements()
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  function activate() {
    previouslyFocused.value = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', handleKeydown)

    // Focus the first focusable element inside the container
    const focusable = getFocusableElements()
    if (focusable.length > 0) {
      focusable[0].focus()
    } else {
      // Focus the container itself as fallback
      options.containerRef.value?.focus()
    }
  }

  function deactivate() {
    document.removeEventListener('keydown', handleKeydown)
    previouslyFocused.value?.focus()
    previouslyFocused.value = null
  }

  watch(options.active, (isActive) => {
    if (isActive) {
      activate()
    } else {
      deactivate()
    }
  })

  onUnmounted(() => {
    deactivate()
  })
}
