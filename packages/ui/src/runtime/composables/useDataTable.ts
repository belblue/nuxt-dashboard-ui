import { computed, ref, isRef, type Ref, type ComputedRef } from 'vue'
import { useAsyncData } from '#imports'
import { useTableSort } from './useTableSort'
import type { SortState, DataTableColumn } from '../components/DataTable/types'

interface FetchParams {
  sort: SortState | null
  page: number
  perPage: number
}

interface PaginatedResult<T> {
  rows: T[]
  total: number
}

interface UseDataTableOptions<T extends Record<string, unknown>> {
  /** Unique key for useAsyncData deduplication */
  key: string
  /** Fetcher function -- receives sort/pagination params, returns rows or paginated result */
  fetcher: ((params: FetchParams) => Promise<PaginatedResult<T>>) | ((sort: SortState | null) => Promise<T[]>)
  /** Column definitions (static or reactive) */
  columns: DataTableColumn[] | Ref<DataTableColumn[]>
  /** Initial sort state */
  defaultSort?: SortState | null
  /** Whether to sort server-side (re-fetches on sort change) or client-side (default) */
  serverSort?: boolean
  /** Items per page (enables pagination when set) */
  perPage?: number
  /** Whether pagination is handled server-side */
  serverPagination?: boolean
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
  /** Current page (1-indexed) — available when perPage is set */
  page: Ref<number>
  /** Total items — available when serverPagination is enabled */
  totalItems: Ref<number>
  /** Items per page */
  perPage: Ref<number>
  /** Change the current page */
  onPageChange: (page: number) => void
}

export function useDataTable<T extends Record<string, unknown>>(
  options: UseDataTableOptions<T>
): UseDataTableReturn<T> {
  const { currentSort, toggleSort, sortRows } = useTableSort({
    initialSort: options.defaultSort,
  })

  const page = ref(1)
  const perPage = ref(options.perPage ?? 10)
  const totalItems = ref(0)
  const isPaginated = options.serverPagination === true

  const watchSources = computed(() => ({
    sort: currentSort.value,
    page: page.value,
  }))

  const handler = (() => {
    if (isPaginated) {
      const fetcher = options.fetcher as (params: FetchParams) => Promise<PaginatedResult<T>>
      return fetcher({ sort: currentSort.value, page: page.value, perPage: perPage.value })
    }
    const fetcher = options.fetcher as (sort: SortState | null) => Promise<T[]>
    return fetcher(currentSort.value)
  }) as () => Promise<PaginatedResult<T>>

  const { data, status, error, refresh } = useAsyncData(
    options.key,
    handler,
    {
      watch: (options.serverSort || isPaginated) ? [watchSources] : undefined,
    }
  )

  const loading = computed(() => status.value === 'pending')

  const rows = computed(() => {
    if (isPaginated) {
      const result = data.value as PaginatedResult<T> | null
      if (result) {
        totalItems.value = result.total
        return result.rows
      }
      return []
    }

    const raw = (data.value ?? []) as T[]
    const sorted = options.serverSort ? raw : sortRows(raw) as T[]

    // Client-side pagination
    if (options.perPage) {
      totalItems.value = sorted.length
      const start = (page.value - 1) * perPage.value
      return sorted.slice(start, start + perPage.value)
    }

    return sorted
  })

  const resolvedColumns = computed(() => {
    return isRef(options.columns) ? options.columns.value : options.columns
  })

  const onSort = (sort: SortState) => {
    toggleSort(sort.key)
    // Reset to page 1 on sort change
    if (options.perPage || isPaginated) {
      page.value = 1
    }
  }

  const onPageChange = (newPage: number) => {
    page.value = newPage
  }

  return {
    rows,
    columns: resolvedColumns,
    loading,
    sort: currentSort,
    onSort,
    refresh: async () => { await refresh() },
    error: error as Ref<Error | null>,
    page,
    totalItems,
    perPage,
    onPageChange,
  }
}
