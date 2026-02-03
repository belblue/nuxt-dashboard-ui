export type SortDirection = 'asc' | 'desc' | null

export type ColumnAlign = 'left' | 'center' | 'right'

export interface DataTableColumn {
  /** Unique key matching a property in the row objects */
  key: string
  /** Display label for the column header */
  label: string
  /** Whether this column can be sorted */
  sortable?: boolean
  /** CSS width value (e.g. '200px', '25%') */
  width?: string
  /** Text alignment */
  align?: ColumnAlign
}

export interface SortState {
  /** The column key currently being sorted */
  key: string
  /** Sort direction */
  direction: SortDirection
}
