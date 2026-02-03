import { ref, computed, type ComputedRef } from 'vue'
import type { SortState, SortDirection } from '../components/DataTable/types'

interface UseTableSortOptions {
  /** External sort state (controlled mode). When provided, internal state is ignored. */
  externalSort?: ComputedRef<SortState | null | undefined>
  /** Initial sort state for uncontrolled mode */
  initialSort?: SortState | null
  /** Callback when sort changes */
  onSort?: (sort: SortState) => void
}

interface UseTableSortReturn {
  /** Current active sort state */
  currentSort: ComputedRef<SortState | null>
  /** Call this when a column header is clicked */
  toggleSort: (key: string) => void
  /** Sort an array of rows according to current sort */
  sortRows: (rows: Record<string, unknown>[]) => Record<string, unknown>[]
}

export function useTableSort(options: UseTableSortOptions = {}): UseTableSortReturn {
  const internalSort = ref<SortState | null>(options.initialSort ?? null)

  const currentSort = computed((): SortState | null => {
    return options.externalSort?.value ?? internalSort.value
  })

  const toggleSort = (key: string) => {
    let newDirection: SortDirection
    if (currentSort.value?.key === key) {
      if (currentSort.value.direction === 'asc') newDirection = 'desc'
      else if (currentSort.value.direction === 'desc') newDirection = null
      else newDirection = 'asc'
    } else {
      newDirection = 'asc'
    }

    const newSort: SortState = { key, direction: newDirection }

    if (!options.externalSort?.value) {
      internalSort.value = newDirection ? newSort : null
    }

    options.onSort?.(newSort)
  }

  const sortRows = (rows: Record<string, unknown>[]): Record<string, unknown>[] => {
    const sort = currentSort.value
    if (!sort || !sort.direction) return rows

    return [...rows].sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      let comparison = 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else {
        comparison = String(aVal).localeCompare(String(bVal))
      }

      return sort.direction === 'desc' ? -comparison : comparison
    })
  }

  return { currentSort, toggleSort, sortRows }
}
