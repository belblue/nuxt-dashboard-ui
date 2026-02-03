<script setup lang="ts">
import { computed, useId, useSlots } from "vue";
import type { DataTableColumn, SortState } from "./types";
import { useTableSort } from "../../composables/useTableSort";

/**
 * DataTable
 *
 * A dashboard-focused data table with sorting, custom cell rendering,
 * loading/empty states, and full accessibility support.
 *
 * @example
 * <DDataTable
 *   :columns="[{ key: 'name', label: 'Name', sortable: true }]"
 *   :rows="[{ name: 'Alice' }, { name: 'Bob' }]"
 *   caption="Team members"
 *   striped
 * />
 */

interface DataTableProps {
  columns: DataTableColumn[];
  rows: Record<string, unknown>[];
  sort?: SortState | null;
  loading?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  emptyMessage?: string;
  rowKey?: string;
  clickableRows?: boolean;
  caption?: string;
  skeletonRows?: number;
}

const props = withDefaults(defineProps<DataTableProps>(), {
  loading: false,
  striped: false,
  hoverable: true,
  emptyMessage: "No data available",
  rowKey: "id",
  clickableRows: false,
  skeletonRows: 5,
});

const emit = defineEmits<{
  sort: [sort: SortState];
  "row-click": [row: Record<string, unknown>, index: number];
}>();

defineSlots<{
  "header-cell"?: (props: { column: DataTableColumn }) => any;
  cell?: (props: {
    column: DataTableColumn;
    row: Record<string, unknown>;
    value: unknown;
    rowIndex: number;
  }) => any;
  [key: `cell-${string}`]: (props: {
    column: DataTableColumn;
    row: Record<string, unknown>;
    value: unknown;
    rowIndex: number;
  }) => any;
  empty?: (props: {}) => any;
  loading?: (props: {}) => any;
  toolbar?: (props: {}) => any;
}>();

const tableId = useId();
const slots = useSlots();

const { currentSort, toggleSort, sortRows } = useTableSort({
  externalSort: computed(() => props.sort),
  onSort: (sort) => emit("sort", sort),
});

const displayRows = computed(() => {
  return sortRows(props.rows);
});

const getRowKey = (
  row: Record<string, unknown>,
  index: number
): string | number => {
  const key = row[props.rowKey];
  return (key as string | number) ?? index;
};

const getSortAriaLabel = (column: DataTableColumn): string => {
  if (!column.sortable) return column.label;
  const sort = currentSort.value;
  if (sort?.key === column.key) {
    if (sort.direction === "asc")
      return `${column.label}, sorted ascending, activate to sort descending`;
    if (sort.direction === "desc")
      return `${column.label}, sorted descending, activate to remove sort`;
  }
  return `${column.label}, activate to sort ascending`;
};

const getSortIcon = (column: DataTableColumn): string => {
  const sort = currentSort.value;
  if (sort?.key === column.key) {
    if (sort.direction === "asc") return "↑";
    if (sort.direction === "desc") return "↓";
  }
  return "↕";
};

const handleHeaderClick = (column: DataTableColumn) => {
  if (column.sortable) toggleSort(column.key);
};

const handleHeaderKeydown = (
  event: KeyboardEvent,
  column: DataTableColumn
) => {
  if (column.sortable && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    toggleSort(column.key);
  }
};

const handleRowClick = (row: Record<string, unknown>, index: number) => {
  if (props.clickableRows) {
    emit("row-click", row, index);
  }
};

const hasCellSlot = (columnKey: string): boolean => {
  return !!slots[`cell-${columnKey}`];
};
</script>

<template>
  <div
    class="data-table"
    :class="{
      'data-table--striped': striped,
      'data-table--hoverable': hoverable,
      'data-table--clickable-rows': clickableRows,
      'data-table--loading': loading,
    }"
  >
    <div v-if="$slots.toolbar" class="data-table__toolbar">
      <slot name="toolbar" />
    </div>

    <div class="data-table__wrapper">
      <table
        class="data-table__table"
        :aria-describedby="caption ? `${tableId}-caption` : undefined"
      >
        <caption
          v-if="caption"
          :id="`${tableId}-caption`"
          class="sr-only"
        >
          {{ caption }}
        </caption>

        <thead class="data-table__head">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="data-table__header-cell"
              :class="[
                `data-table__header-cell--align-${column.align || 'left'}`,
                {
                  'data-table__header-cell--sortable': column.sortable,
                  'data-table__header-cell--sorted':
                    currentSort?.key === column.key &&
                    currentSort?.direction,
                },
              ]"
              :style="column.width ? { width: column.width } : {}"
              :aria-sort="
                currentSort?.key === column.key && currentSort?.direction
                  ? currentSort.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              "
              :tabindex="column.sortable ? 0 : undefined"
              :aria-label="getSortAriaLabel(column)"
              scope="col"
              @click="handleHeaderClick(column)"
              @keydown="handleHeaderKeydown($event, column)"
            >
              <slot name="header-cell" :column="column">
                <span class="data-table__header-label">{{
                  column.label
                }}</span>
                <span
                  v-if="column.sortable"
                  class="data-table__sort-icon"
                  aria-hidden="true"
                >
                  {{ getSortIcon(column) }}
                </span>
              </slot>
            </th>
          </tr>
        </thead>

        <tbody class="data-table__body">
          <template v-if="loading">
            <slot name="loading">
              <tr
                v-for="n in skeletonRows"
                :key="`skeleton-${n}`"
                class="data-table__row data-table__row--skeleton"
              >
                <td
                  v-for="column in columns"
                  :key="column.key"
                  class="data-table__cell"
                >
                  <div class="data-table__skeleton" />
                </td>
              </tr>
            </slot>
          </template>

          <template v-else-if="displayRows.length === 0">
            <tr class="data-table__row data-table__row--empty">
              <td
                :colspan="columns.length"
                class="data-table__cell data-table__cell--empty"
              >
                <slot name="empty">
                  {{ emptyMessage }}
                </slot>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="(row, rowIndex) in displayRows"
              :key="getRowKey(row, rowIndex)"
              class="data-table__row"
              :tabindex="clickableRows ? 0 : undefined"
              :role="clickableRows ? 'button' : undefined"
              @click="handleRowClick(row, rowIndex)"
              @keydown.enter="handleRowClick(row, rowIndex)"
              @keydown.space.prevent="handleRowClick(row, rowIndex)"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="data-table__cell"
                :class="`data-table__cell--align-${column.align || 'left'}`"
              >
                <!-- @vue-expect-error Dynamic slot name not resolved by Volar -->
                <slot
                  v-if="hasCellSlot(column.key)"
                  :name="`cell-${column.key}`"
                  :row="row"
                  :value="row[column.key]"
                  :column="column"
                  :row-index="rowIndex"
                />
                <slot
                  v-else
                  name="cell"
                  :row="row"
                  :value="row[column.key]"
                  :column="column"
                  :row-index="rowIndex"
                >
                  {{ row[column.key] ?? "" }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* CSS Variables for theming — consumers can override these */
.data-table {
  --dt-bg: #ffffff;
  --dt-border-color: #e5e7eb;
  --dt-border-radius: 0.75rem;
  --dt-header-bg: #f9fafb;
  --dt-header-color: #374151;
  --dt-header-font-weight: 600;
  --dt-cell-padding: 0.75rem 1rem;
  --dt-row-bg: transparent;
  --dt-row-hover-bg: #f9fafb;
  --dt-row-stripe-bg: #f3f4f6;
  --dt-text-color: #111827;
  --dt-empty-color: #6b7280;
  --dt-sort-active-color: #3b82f6;
  --dt-skeleton-color: #e5e7eb;
  --dt-focus-ring: 2px solid #3b82f6;

  background: var(--dt-bg);
  border: 1px solid var(--dt-border-color);
  border-radius: var(--dt-border-radius);
  overflow: hidden;
}

.data-table__toolbar {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--dt-border-color);
}

.data-table__wrapper {
  overflow-x: auto;
}

.data-table__table {
  width: 100%;
  border-collapse: collapse;
  color: var(--dt-text-color);
  font-size: 0.875rem;
}

/* Header */
.data-table__head {
  background: var(--dt-header-bg);
}

.data-table__header-cell {
  padding: var(--dt-cell-padding);
  font-weight: var(--dt-header-font-weight);
  color: var(--dt-header-color);
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid var(--dt-border-color);
  user-select: none;
}

.data-table__header-cell--align-center {
  text-align: center;
}

.data-table__header-cell--align-right {
  text-align: right;
}

.data-table__header-cell--sortable {
  cursor: pointer;
}

.data-table__header-cell--sortable:hover {
  color: var(--dt-sort-active-color);
}

.data-table__header-cell--sortable:focus-visible {
  outline: var(--dt-focus-ring);
  outline-offset: -2px;
}

.data-table__header-cell--sorted {
  color: var(--dt-sort-active-color);
}

.data-table__header-label {
  margin-right: 0.25rem;
}

.data-table__sort-icon {
  display: inline-block;
  font-size: 0.75rem;
  opacity: 0.5;
}

.data-table__header-cell--sorted .data-table__sort-icon {
  opacity: 1;
}

/* Body */
.data-table__cell {
  padding: var(--dt-cell-padding);
  border-bottom: 1px solid var(--dt-border-color);
}

.data-table__cell--align-center {
  text-align: center;
}

.data-table__cell--align-right {
  text-align: right;
}

.data-table__cell--empty {
  text-align: center;
  color: var(--dt-empty-color);
  padding: 2rem 1rem;
}

/* Row variants */
.data-table__row:last-child .data-table__cell {
  border-bottom: none;
}

.data-table--striped .data-table__row:nth-child(even) {
  background: var(--dt-row-stripe-bg);
}

.data-table--hoverable .data-table__row:not(.data-table__row--empty):not(.data-table__row--skeleton):hover {
  background: var(--dt-row-hover-bg);
}

.data-table--clickable-rows .data-table__row:not(.data-table__row--empty):not(.data-table__row--skeleton) {
  cursor: pointer;
}

.data-table--clickable-rows .data-table__row:focus-visible {
  outline: var(--dt-focus-ring);
  outline-offset: -2px;
}

/* Loading skeleton */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.data-table__skeleton {
  height: 16px;
  width: 75%;
  background: var(--dt-skeleton-color);
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Dark mode via .dark class */
.dark .data-table {
  --dt-bg: #1f2937;
  --dt-border-color: #374151;
  --dt-header-bg: #111827;
  --dt-header-color: #d1d5db;
  --dt-row-hover-bg: #374151;
  --dt-row-stripe-bg: #1a2332;
  --dt-text-color: #f9fafb;
  --dt-empty-color: #9ca3af;
  --dt-skeleton-color: #374151;
}

/* Dark mode via prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  .data-table {
    --dt-bg: #1f2937;
    --dt-border-color: #374151;
    --dt-header-bg: #111827;
    --dt-header-color: #d1d5db;
    --dt-row-hover-bg: #374151;
    --dt-row-stripe-bg: #1a2332;
    --dt-text-color: #f9fafb;
    --dt-empty-color: #9ca3af;
    --dt-skeleton-color: #374151;
  }
}
</style>
