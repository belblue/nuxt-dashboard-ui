import { computed, type Ref, type ComputedRef } from 'vue'

export interface UsePaginationOptions {
  /** Current page (1-indexed) */
  page: Ref<number>
  /** Total number of items */
  total: Ref<number>
  /** Items per page */
  perPage: Ref<number>
  /** Max visible page buttons (odd number recommended) */
  maxVisible?: number
}

export type PageItem = number | '...'

export interface UsePaginationReturn {
  totalPages: ComputedRef<number>
  /** Array of page numbers and ellipsis markers */
  visiblePages: ComputedRef<PageItem[]>
  /** First item index on current page (1-indexed) */
  from: ComputedRef<number>
  /** Last item index on current page (1-indexed) */
  to: ComputedRef<number>
  hasPrev: ComputedRef<boolean>
  hasNext: ComputedRef<boolean>
  prevPage: () => void
  nextPage: () => void
  goToPage: (page: number) => void
}

export function usePagination(options: UsePaginationOptions): UsePaginationReturn {
  const maxVisible = options.maxVisible ?? 7

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(options.total.value / options.perPage.value))
  })

  const from = computed(() => {
    if (options.total.value === 0) return 0
    return (options.page.value - 1) * options.perPage.value + 1
  })

  const to = computed(() => {
    return Math.min(options.page.value * options.perPage.value, options.total.value)
  })

  const hasPrev = computed(() => options.page.value > 1)
  const hasNext = computed(() => options.page.value < totalPages.value)

  const visiblePages = computed((): PageItem[] => {
    const total = totalPages.value
    const current = options.page.value

    // If all pages fit, show them all
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages: PageItem[] = []
    // Always show first page
    pages.push(1)

    // Calculate the range around the current page
    // Reserve 2 slots for first and last, so middle slots = maxVisible - 2
    const middleSlots = maxVisible - 2
    let start = current - Math.floor(middleSlots / 2)
    let end = current + Math.floor(middleSlots / 2)

    // Clamp to valid range
    if (start <= 2) {
      start = 2
      end = start + middleSlots - 1
    }
    if (end >= total) {
      end = total - 1
      start = end - middleSlots + 1
    }
    start = Math.max(2, start)
    end = Math.min(total - 1, end)

    // Add ellipsis or pages between first and start
    if (start > 2) {
      pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis or pages between end and last
    if (end < total - 1) {
      pages.push('...')
    }

    // Always show last page
    if (total > 1) {
      pages.push(total)
    }

    return pages
  })

  function goToPage(page: number) {
    const clamped = Math.max(1, Math.min(page, totalPages.value))
    options.page.value = clamped
  }

  function prevPage() {
    if (hasPrev.value) goToPage(options.page.value - 1)
  }

  function nextPage() {
    if (hasNext.value) goToPage(options.page.value + 1)
  }

  return {
    totalPages,
    visiblePages,
    from,
    to,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
    goToPage,
  }
}
