# Changelog

## 0.1.0 (2025)

### Components

- **StatCard** — Key metric display with trend indicators and loading skeleton
- **DataTable** — Sortable, striped data table with keyboard navigation
- **Badge** — Status labels with semantic variants, dot, dismiss, pill, outline
- **EmptyState** — Placeholder for empty data views with icon and action slots
- **Pagination** — Page navigation with ellipsis and keyboard support
- **Tabs** — Switchable panels with line/pill variants and WAI-ARIA tabs pattern
- **Modal** — Dialog overlay with focus trap, Escape close, and fullscreen mode
- **Tooltip** — Hover/focus tooltip with 4 placements and rich content support
- **SkeletonLoader** — Loading placeholders with shimmer animation
- **ProgressBar** — Determinate/indeterminate progress with auto-variant colors
- **Dropdown** — Menu with keyboard navigation, dividers, and custom content slot
- **PhoneInput** — International phone input with country flag dropdown, dial code editing, and locale auto-detection

### Composables

- **useDataTable** — Combined table sorting + pagination
- **useTableSort** — Reactive sort state management
- **usePagination** — Page calculation and navigation
- **useSortQuerySync** — URL query string sync for sort state
- **useFocusTrap** — Focus trapping for modal-like components
- **useHydrated** — SSR hydration safety check

### Features

- Nuxt 3+ auto-import for all components and composables
- Configurable component prefix (default: `D`)
- CSS custom properties for full theming control
- Dark mode via `.dark` ancestor class
- WCAG 2.1 AA accessibility
- SSR/hydration safe — zero hydration mismatches
- Zero CSS framework dependencies
