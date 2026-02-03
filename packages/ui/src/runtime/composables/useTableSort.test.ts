import { describe, it, expect, vi } from 'vitest'
import { computed, ref } from 'vue'
import { useTableSort } from './useTableSort'

describe('useTableSort', () => {
  // Sort cycle
  it('toggleSort cycles asc -> desc -> null', () => {
    const { currentSort, toggleSort } = useTableSort()

    toggleSort('name')
    expect(currentSort.value).toEqual({ key: 'name', direction: 'asc' })

    toggleSort('name')
    expect(currentSort.value).toEqual({ key: 'name', direction: 'desc' })

    toggleSort('name')
    expect(currentSort.value).toBeNull()
  })

  it('toggleSort on a new column resets to asc', () => {
    const { currentSort, toggleSort } = useTableSort()

    toggleSort('name')
    expect(currentSort.value?.direction).toBe('asc')

    toggleSort('email')
    expect(currentSort.value).toEqual({ key: 'email', direction: 'asc' })
  })

  // Sorting rows
  it('sortRows sorts strings alphabetically ascending', () => {
    const { toggleSort, sortRows } = useTableSort()
    toggleSort('name')

    const rows = [
      { name: 'Charlie' },
      { name: 'Alice' },
      { name: 'Bob' },
    ]
    const sorted = sortRows(rows)
    expect(sorted.map(r => r.name)).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  it('sortRows sorts strings descending', () => {
    const { toggleSort, sortRows } = useTableSort()
    toggleSort('name')
    toggleSort('name') // desc

    const rows = [
      { name: 'Alice' },
      { name: 'Charlie' },
      { name: 'Bob' },
    ]
    const sorted = sortRows(rows)
    expect(sorted.map(r => r.name)).toEqual(['Charlie', 'Bob', 'Alice'])
  })

  it('sortRows sorts numbers numerically', () => {
    const { toggleSort, sortRows } = useTableSort()
    toggleSort('age')

    const rows = [
      { age: 30 },
      { age: 10 },
      { age: 20 },
    ]
    const sorted = sortRows(rows)
    expect(sorted.map(r => r.age)).toEqual([10, 20, 30])
  })

  it('sortRows handles null/undefined values (pushed to end)', () => {
    const { toggleSort, sortRows } = useTableSort()
    toggleSort('name')

    const rows = [
      { name: null },
      { name: 'Alice' },
      { name: undefined },
      { name: 'Bob' },
    ]
    const sorted = sortRows(rows)
    expect(sorted.map(r => r.name)).toEqual(['Alice', 'Bob', null, undefined])
  })

  it('sortRows returns original order when direction is null', () => {
    const { sortRows } = useTableSort()

    const rows = [
      { name: 'Charlie' },
      { name: 'Alice' },
    ]
    const sorted = sortRows(rows)
    expect(sorted.map(r => r.name)).toEqual(['Charlie', 'Alice'])
  })

  it('sortRows does not mutate the original array', () => {
    const { toggleSort, sortRows } = useTableSort()
    toggleSort('name')

    const rows = [
      { name: 'Charlie' },
      { name: 'Alice' },
    ]
    const sorted = sortRows(rows)
    expect(sorted).not.toBe(rows)
    expect(rows[0].name).toBe('Charlie')
  })

  // Controlled mode
  it('external sort state overrides internal state', () => {
    const externalSort = computed(() => ({ key: 'email', direction: 'desc' as const }))
    const { currentSort } = useTableSort({ externalSort })

    expect(currentSort.value).toEqual({ key: 'email', direction: 'desc' })
  })

  // Callback
  it('onSort callback fires with correct payload', () => {
    const onSort = vi.fn()
    const { toggleSort } = useTableSort({ onSort })

    toggleSort('name')
    expect(onSort).toHaveBeenCalledWith({ key: 'name', direction: 'asc' })
  })
})
