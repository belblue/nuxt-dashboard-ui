export interface DropdownItem {
  /** Unique key for the item */
  key: string;
  /** Display label */
  label: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Render a visual divider before this item */
  divider?: boolean;
}
