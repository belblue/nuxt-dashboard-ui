import { computed } from 'vue'
import { useRoute, useRouter } from '#imports'
import type { SortState, SortDirection } from '../components/DataTable/types'

interface UseSortQuerySyncOptions {
  /** Query param name for the sort key. Default: 'sort' */
  sortParam?: string
  /** Query param name for direction. Default: 'dir' */
  directionParam?: string
  /** Default sort when no query param present */
  defaultSort?: SortState | null
}

export function useSortQuerySync(options: UseSortQuerySyncOptions = {}) {
  const route = useRoute()
  const router = useRouter()
  const sortParam = options.sortParam ?? 'sort'
  const dirParam = options.directionParam ?? 'dir'

  const sort = computed<SortState | null>(() => {
    const key = route.query[sortParam] as string | undefined
    const dir = route.query[dirParam] as SortDirection | undefined
    if (key && (dir === 'asc' || dir === 'desc')) {
      return { key, direction: dir }
    }
    return options.defaultSort ?? null
  })

  const setSort = (newSort: SortState) => {
    const query = { ...route.query }
    if (newSort.direction) {
      query[sortParam] = newSort.key
      query[dirParam] = newSort.direction
    } else {
      delete query[sortParam]
      delete query[dirParam]
    }
    router.replace({ query })
  }

  return { sort, setSort }
}
