import { computed, isRef, type Ref, type ComputedRef } from 'vue'
import { useAsyncData } from '#imports'
import { useTableSort } from './useTableSort'
import type { SortState, DataTableColumn } from '../components/DataTable/types'

interface UseDataTableOptions<T extends Record<string, unknown>> {
  /** Unique key for useAsyncData deduplication */
  key: string
  /** Fetcher function -- receives current sort state, returns rows */
  fetcher: (sort: SortState | null) => Promise<T[]>
  /** Column definitions (static or reactive) */
  columns: DataTableColumn[] | Ref<DataTableColumn[]>
  /** Initial sort state */
  defaultSort?: SortState | null
  /** Whether to sort server-side (re-fetches on sort change) or client-side (default) */
  serverSort?: boolean
}

interface UseDataTableReturn<T extends Record<string, unknown>> {
  /** Rows to pass to DataTable :rows */
  rows: ComputedRef<T[]>
  /** Columns to pass to DataTable :columns */
  columns: ComputedRef<DataTableColumn[]>
  /** Loading state to pass to DataTable :loading */
  loading: ComputedRef<boolean>
  /** Sort state to pass to DataTable :sort */
  sort: ComputedRef<SortState | null>
  /** Handler to pass to DataTable @sort */
  onSort: (sort: SortState) => void
  /** Re-fetch data */
  refresh: () => Promise<void>
  /** Error from useAsyncData */
  error: Ref<Error | null>
}

export function useDataTable<T extends Record<string, unknown>>(
  options: UseDataTableOptions<T>
): UseDataTableReturn<T> {
  const { currentSort, toggleSort, sortRows } = useTableSort({
    initialSort: options.defaultSort,
  })

  const { data, status, error, refresh } = useAsyncData(
    options.key,
    () => options.fetcher(currentSort.value),
    {
      watch: options.serverSort ? [currentSort] : undefined,
    }
  )

  const loading = computed(() => status.value === 'pending')

  const rows = computed(() => {
    const raw = (data.value ?? []) as T[]
    if (!options.serverSort) {
      return sortRows(raw) as T[]
    }
    return raw
  })

  const resolvedColumns = computed(() => {
    return isRef(options.columns) ? options.columns.value : options.columns
  })

  const onSort = (sort: SortState) => {
    toggleSort(sort.key)
  }

  return {
    rows,
    columns: resolvedColumns,
    loading,
    sort: currentSort,
    onSort,
    refresh: async () => { await refresh() },
    error: error as Ref<Error | null>,
  }
}
