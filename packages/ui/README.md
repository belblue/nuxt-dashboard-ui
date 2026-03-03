# nuxt-dashboard-ui

A Nuxt 3 dashboard UI component library with accessible, SSR-safe, and fully themeable components.

## Features

- 12 ready-to-use dashboard components
- Full dark mode support via CSS custom properties
- SSR-safe with hydration-first design
- WCAG 2.1 AA accessible (keyboard navigation, ARIA attributes)
- Zero external dependencies
- Auto-imported components and composables

## Quick Setup

Install the module:

```bash
npm install nuxt-dashboard-ui
```

Add it to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-dashboard-ui'],
})
```

That's it! All components (prefixed with `D`) and composables are auto-imported.

## Components

| Component | Description |
|-----------|-------------|
| `<DBadge>` | Inline label for status, counts, or categories with color variants |
| `<DDataTable>` | Data table with sorting, loading skeletons, and custom cell slots |
| `<DDropdown>` | Action menu or custom popover with full keyboard navigation |
| `<DEmptyState>` | Placeholder for empty data views |
| `<DModal>` | Dialog overlay with focus trapping, scroll lock, and transitions |
| `<DPagination>` | Page navigation with ellipsis, range info, and responsive layout |
| `<DPhoneInput>` | Phone number input with searchable country dropdown and locale detection |
| `<DProgressBar>` | Progress bar with auto-color mode and indeterminate animation |
| `<DSkeletonLoader>` | Content placeholder with multiple shape variants and hydration mode |
| `<DStatCard>` | Dashboard KPI card with trend indicator and number formatting |
| `<DTabs>` | Switchable tab panels with WAI-ARIA keyboard navigation |
| `<DTooltip>` | CSS-positioned tooltip with configurable placement and triggers |

## Composables

| Composable | Description |
|------------|-------------|
| `useDataTable` | Wires sorting, pagination, and async fetching for DataTable |
| `useFocusTrap` | Traps keyboard focus within a container element |
| `useHydrated` | Returns a ref that is `false` during SSR, `true` after mount |
| `usePagination` | Calculates pagination state, visible pages, and navigation |
| `useSortQuerySync` | Syncs sort state with URL query parameters |
| `useTableSort` | Manages sort state with toggle cycling and row sorting |

## Usage Examples

### DataTable with sorting

```vue
<template>
  <DDataTable
    :columns="columns"
    :rows="rows"
    :sort="sort"
    striped
    @sort="onSort"
  />
</template>

<script setup lang="ts">
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
]

const { rows, sort, onSort } = useDataTable({
  key: 'users',
  columns,
  fetcher: () => fetch('/api/users').then(r => r.json()),
})
</script>
```

### Modal

```vue
<template>
  <DModal v-model:open="showModal" title="Confirm action">
    <p>Are you sure you want to continue?</p>
    <template #footer>
      <button @click="showModal = false">Cancel</button>
      <button @click="confirm">Confirm</button>
    </template>
  </DModal>
</template>
```

### Badge

```vue
<template>
  <DBadge variant="success">Active</DBadge>
  <DBadge variant="danger" dot>Offline</DBadge>
  <DBadge variant="warning" pill outline>Pending</DBadge>
</template>
```

### StatCard

```vue
<template>
  <DStatCard
    title="Revenue"
    :value="48250"
    trend="up"
    trend-value="12%"
  />
</template>
```

## Theming

All components use CSS custom properties. Override them to match your design:

```css
:root {
  --d-color-primary: #3b82f6;
  --d-color-success: #22c55e;
  --d-color-warning: #f59e0b;
  --d-color-danger: #ef4444;
  --d-color-info: #3b82f6;
  --d-bg: #ffffff;
  --d-bg-secondary: #f9fafb;
  --d-text: #111827;
  --d-text-secondary: #6b7280;
  --d-border: #e5e7eb;
  --d-radius: 0.5rem;
}
```

For dark mode, override the same variables under a `.dark` class or `@media (prefers-color-scheme: dark)`.

## License

[MIT](./LICENSE)
