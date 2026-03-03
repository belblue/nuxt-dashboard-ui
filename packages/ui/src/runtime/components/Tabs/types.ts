export interface TabItem {
  /** Unique key used for v-model and slot naming */
  key: string
  /** Display label for the tab button */
  label: string
  /** Whether the tab is disabled */
  disabled?: boolean
  /** Optional badge text shown next to the label */
  badge?: string
}
