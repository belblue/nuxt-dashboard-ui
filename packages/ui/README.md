# Nuxt Dashboard UI

A Nuxt 3 component library for building dashboard and admin interfaces. Hydration-safe, accessible, fully typed, and zero CSS dependencies.

> **[🔗 Live Demo](https://nuxt-dashboard-playground.vercel.app/)** — See all components in action with dark mode support

## Core Principles

### Hydration-First

Every component is designed to work flawlessly with SSR. There are **zero hydration mismatches** by design:

- **`useHydrated()` composable** — Returns `false` during SSR and flips to `true` only after `onMounted()`. Both server and initial client render see the same value, eliminating mismatches.
- **Modal** uses `<Teleport v-if="hydrated" to="body">` — the Teleport only activates after hydration, preventing the classic SSR Teleport mismatch.
- **SkeletonLoader** supports `hydrate` mode — shows the skeleton during SSR and automatically swaps to real content once the client hydrates. No layout shift, no flash of wrong content.
- **PhoneInput** detects the user's locale via `navigator.language` only after hydration — SSR renders a safe default country, then the client updates once mounted.
- **Focus trap** only activates when `hydrated && open` — no DOM queries during SSR.

```vue
<!-- Hydration-first skeleton: shows placeholder during SSR, real content after mount -->
<DSkeletonLoader variant="card" hydrate>
  <MyExpensiveWidget />
</DSkeletonLoader>
```

### Accessibility-First

All components follow **WCAG 2.1 AA** guidelines from the ground up:

- **Semantic HTML** — Correct elements (`<nav>`, `<dialog>`, `<table>`, `role="tablist"`, etc.)
- **Full ARIA support** — `role`, `aria-label`, `aria-expanded`, `aria-describedby`, `aria-selected`, `aria-current`, `aria-modal`, `aria-busy`
- **Complete keyboard navigation** — Enter, Space, Escape, Arrow keys, Tab, Home, End — all interactive components are fully operable without a mouse
- **Focus trapping** — Modal traps focus within the dialog; Tab and Shift+Tab cycle through focusable elements
- **Focus-visible outlines** — Keyboard focus indicators on all interactive elements, invisible for mouse users
- **Screen reader support** — `.sr-only` text for loading states, meaningful labels for all controls
- **44px touch targets** — All interactive elements meet the minimum touch target size (via element sizing or expanded `::before` pseudo-elements)
- **Reduced motion** — Every animation respects `prefers-reduced-motion: reduce`
- **Contrast ratios** — All colour combinations verified against WCAG AA (4.5:1 for text, 3:1 for UI elements)

## Features

- **SSR / Hydration-safe** — Every component works with server-side rendering, zero hydration mismatches
- **Zero CSS dependencies** — Plain CSS with CSS custom properties for theming. No Tailwind, no SCSS, no runtime CSS-in-JS
- **Full TypeScript** — Strict typing for all props, emits, and slots
- **WCAG 2.1 AA accessible** — Keyboard navigation, ARIA attributes, screen reader support, 44px touch targets
- **Design token system** — All visual tokens exposed as `--component-*` CSS custom properties with global token fallbacks
- **Dark mode** — Built-in support via `.dark` class with 4-level surface hierarchy
- **Responsive** — Mobile-friendly layouts with scrollable tab bars, enlarged touch targets, and viewport-aware tooltips
- **Reduced motion** — All animations respect `prefers-reduced-motion: reduce`

## Quick Start

### Install

```bash
# pnpm
pnpm add nuxt-dashboard-ui

# npm
npm install nuxt-dashboard-ui

# yarn
yarn add nuxt-dashboard-ui
```

### Setup

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-dashboard-ui"],
});
```

All components are auto-imported with the `D` prefix. No manual imports needed.

### Configuration

```ts
export default defineNuxtConfig({
  modules: ["nuxt-dashboard-ui"],
  dashboardUI: {
    // Change the component prefix (default: 'D')
    prefix: "D",
  },
});
```

## Type Definitions

Shared TypeScript interfaces used across components.

### DataTableColumn

```ts
interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}
```

| Field | Type | Description |
|-------|------|-------------|
| `key` | `string` | Unique key matching a row property |
| `label` | `string` | Column header display text |
| `sortable` | `boolean?` | Whether column is sortable |
| `width` | `string?` | CSS width (e.g., `'200px'`) |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment (default: `'left'`) |

### SortState

```ts
interface SortState {
  key: string;
  direction: "asc" | "desc" | null;
}
```

### TabItem

```ts
interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
  badge?: string;
}
```

### DropdownItem

```ts
interface DropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
  divider?: boolean;
}
```

### Country (PhoneInput)

```ts
interface Country {
  code: string;     // ISO 3166-1 alpha-2 (e.g., "ES")
  name: string;     // English name (e.g., "Spain")
  dialCode: string; // With + prefix (e.g., "+34")
}
```

## Components

### DStatCard

Dashboard KPI metric card with loading skeleton, trend indicators, click support, and locale-aware number formatting.

```vue
<DStatCard
  title="Total Revenue"
  :value="48520"
  trend="up"
  trend-value="+12.5%"
  :loading="isLoading"
  locale="en-US"
>
  <template #icon>
    <RevenueIcon />
  </template>
</DStatCard>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | *required* | Label above the value |
| `value` | `number \| string` | *required* | Main metric to display |
| `trend` | `'up' \| 'down' \| 'neutral'` | `'neutral'` | Trend direction arrow |
| `trendValue` | `number \| string` | `undefined` | Text shown next to the trend arrow |
| `clickable` | `boolean` | `false` | Makes the card interactive |
| `loading` | `boolean` | `false` | Shows skeleton placeholder |
| `locale` | `string` | `'de-DE'` | Locale for `Intl.NumberFormat` |

**Emits**

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | — | Fired when card is clicked (requires `clickable`) |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#icon` | — | Icon or illustration before the title |
| `#value` | `{ formatted: string }` | Custom value rendering with the formatted number string |

**CSS Variables:** `--stat-card-bg`, `--stat-card-border`, `--stat-card-radius`, `--stat-card-padding`, `--stat-card-shadow`, `--stat-card-title-color`, `--stat-card-value-color`, `--stat-card-trend-up`, `--stat-card-trend-down`, `--stat-card-trend-neutral`, `--stat-card-skeleton`, `--stat-card-hover-bg`, `--stat-card-active-bg`, `--stat-card-focus-ring`

**Keyboard:** When `clickable`, Enter and Space activate. Card receives `tabindex="0"` and `role="button"`.

---

### DDataTable

Data table with sortable columns, loading/empty states, striped/hoverable rows, clickable rows, and custom cell rendering. Horizontally scrollable on mobile.

```vue
<DDataTable
  :columns="columns"
  :rows="users"
  :sort="currentSort"
  :loading="isLoading"
  striped
  hoverable
  clickable-rows
  caption="Team members"
  @sort="onSort"
  @row-click="onRowClick"
>
  <template #cell-status="{ value }">
    <DBadge :variant="value === 'active' ? 'success' : 'danger'">
      {{ value }}
    </DBadge>
  </template>
  <template #empty>
    <DEmptyState title="No users found" description="Try adjusting your filters." />
  </template>
</DDataTable>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `DataTableColumn[]` | *required* | Column definitions |
| `rows` | `Record<string, unknown>[]` | *required* | Row data array |
| `sort` | `SortState \| null` | `undefined` | External sort state |
| `loading` | `boolean` | `false` | Show skeleton rows |
| `striped` | `boolean` | `false` | Alternating row backgrounds |
| `hoverable` | `boolean` | `true` | Highlight rows on hover |
| `emptyMessage` | `string` | `'No data available'` | Text when no rows |
| `rowKey` | `string` | `'id'` | Row property used for `:key` |
| `clickableRows` | `boolean` | `false` | Makes rows interactive |
| `caption` | `string` | `undefined` | Accessible table caption (sr-only) |
| `skeletonRows` | `number` | `5` | Number of skeleton rows during loading |

**Emits**

| Event | Payload | Description |
|-------|---------|-------------|
| `sort` | `SortState` | Fired when a sortable column header is clicked |
| `row-click` | `row: Record<string, unknown>, index: number` | Fired when a row is clicked (requires `clickableRows`) |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#toolbar` | — | Content above the table (search bar, filters) |
| `#header-cell` | `{ column: DataTableColumn }` | Custom column header rendering |
| `#cell` | `{ column, row, value, rowIndex }` | Generic cell rendering for all columns |
| `#cell-{key}` | `{ column, row, value, rowIndex }` | Cell rendering for a specific column by key |
| `#empty` | — | Custom empty state content |
| `#loading` | — | Custom loading state content |

**CSS Variables:** `--dt-bg`, `--dt-border-color`, `--dt-border-radius`, `--dt-header-bg`, `--dt-header-color`, `--dt-header-font-weight`, `--dt-cell-padding`, `--dt-row-bg`, `--dt-row-hover-bg`, `--dt-row-stripe-bg`, `--dt-text-color`, `--dt-empty-color`, `--dt-sort-active-color`, `--dt-skeleton-color`, `--dt-focus-ring`

**Keyboard:** Sortable headers: `tabindex="0"`, Enter/Space cycles sort (asc → desc → none). Clickable rows: `tabindex="0"`, Enter/Space triggers `row-click`.

---

### DBadge

Status label with semantic colour variants, sizes, dot indicator, pill shape, outline style, and dismissible mode.

```vue
<DBadge variant="success">Active</DBadge>
<DBadge variant="danger" size="sm" dot>Offline</DBadge>
<DBadge variant="info" pill dismissible @dismiss="onDismiss">New</DBadge>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Semantic colour variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `dot` | `boolean` | `false` | Show coloured dot indicator |
| `pill` | `boolean` | `false` | Fully rounded shape |
| `outline` | `boolean` | `false` | Outline style instead of filled |
| `dismissible` | `boolean` | `false` | Show dismiss button |

**Emits**

| Event | Payload | Description |
|-------|---------|-------------|
| `dismiss` | — | Fired when dismiss button is clicked |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#default` | — | Badge label content |

**CSS Variables:** `--badge-default-bg`, `--badge-default-color`, `--badge-default-border`, `--badge-success-bg`, `--badge-success-color`, `--badge-success-border`, `--badge-warning-bg`, `--badge-warning-color`, `--badge-warning-border`, `--badge-danger-bg`, `--badge-danger-color`, `--badge-danger-border`, `--badge-info-bg`, `--badge-info-color`, `--badge-info-border`, `--badge-radius`, `--badge-pill-radius`

---

### DProgressBar

Progress indicator with semantic variants, auto-colour by value, label, and indeterminate mode.

```vue
<DProgressBar :value="75" label="Upload" show-value />
<DProgressBar :value="30" variant="warning" />
<DProgressBar indeterminate />
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | *required* | Current progress value |
| `max` | `number` | `100` | Maximum value |
| `label` | `string` | `undefined` | Label text above the bar |
| `showValue` | `boolean` | `false` | Show percentage next to label |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Colour variant |
| `indeterminate` | `boolean` | `false` | Animated indeterminate mode |

When `variant` is `'default'`, the fill colour is automatically determined by the percentage: <30% danger, <70% warning, >=70% success.

**CSS Variables:** `--pg-track-bg`, `--pg-track-radius`, `--pg-fill-default`, `--pg-fill-success`, `--pg-fill-warning`, `--pg-fill-danger`, `--pg-fill-radius`, `--pg-label-color`, `--pg-indeterminate-from`, `--pg-indeterminate-mid`

**Accessibility:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`.

---

### DSkeletonLoader

Loading placeholder with multiple shape variants and **hydration-aware rendering**.

```vue
<!-- Standard: controlled by parent loading state -->
<DSkeletonLoader variant="text" :count="3" />

<!-- Hydration-first: skeleton on SSR, real content after client mount -->
<DSkeletonLoader variant="card" hydrate>
  <MyExpensiveWidget />
</DSkeletonLoader>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'circle' \| 'rect' \| 'card'` | `'text'` | Shape of placeholder |
| `width` | `string` | `undefined` | Custom CSS width |
| `height` | `string` | `undefined` | Custom CSS height |
| `animated` | `boolean` | `true` | Enable pulse animation |
| `count` | `number` | `1` | Number of skeleton items |
| `hydrate` | `boolean` | `false` | Hydration-first mode |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#default` | — | Content shown after hydration (when `hydrate` is true) |

In `hydrate` mode, the skeleton is rendered during SSR and the initial client render (both see the same output — no mismatch). Once `onMounted` fires, the skeleton is replaced by the default slot content.

**CSS Variables:** `--skeleton-bg`, `--skeleton-highlight`, `--skeleton-radius`, `--skeleton-text-height`, `--skeleton-circle-size`, `--skeleton-rect-height`, `--skeleton-card-height`, `--skeleton-card-radius`, `--skeleton-gap`

**Accessibility:** `role="status"`, `aria-label="Loading content"`, `aria-busy="true"`, sr-only "Loading..." text.

---

### DEmptyState

Empty data placeholder with icon and action slots.

```vue
<DEmptyState
  title="No results"
  description="Try changing your search terms."
>
  <template #icon>
    <SearchIcon />
  </template>
  <template #action>
    <button @click="clearSearch">Clear filters</button>
  </template>
</DEmptyState>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Main heading text |
| `description` | `string` | `undefined` | Supporting description |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#default` | — | Replaces title + description with custom content |
| `#icon` | — | Icon or illustration above the title |
| `#action` | — | Action area below the description |

**CSS Variables:** `--empty-state-padding`, `--empty-state-gap`, `--empty-state-icon-color`, `--empty-state-icon-size`, `--empty-state-title-color`, `--empty-state-desc-color`

**Accessibility:** `role="status"` on container.

---

### DTooltip

Contextual help tooltip with 4 placements, multiple trigger modes, and viewport-aware sizing on mobile.

```vue
<DTooltip content="Edit this item" placement="top">
  <button>Edit</button>
</DTooltip>

<DTooltip placement="bottom">
  <template #content>
    <strong>Rich content</strong> with HTML
  </template>
  <button>More info</button>
</DTooltip>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | `''` | Tooltip text content |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position relative to trigger |
| `trigger` | `'hover' \| 'focus' \| 'hover+focus'` | `'hover+focus'` | How the tooltip is triggered |
| `delay` | `number` | `200` | Delay in ms before showing (hover only) |
| `disabled` | `boolean` | `false` | Disable the tooltip |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#default` | — | The trigger element |
| `#content` | — | Custom rich tooltip content (overrides `content` prop) |

**CSS Variables:** `--tooltip-bg`, `--tooltip-color`, `--tooltip-shadow`, `--tooltip-font-size`, `--tooltip-padding`, `--tooltip-radius`, `--tooltip-arrow-size`, `--tooltip-offset`, `--tooltip-max-width`, `--tooltip-z-index`

**Accessibility:** `role="tooltip"` on bubble, `aria-describedby` links trigger to tooltip content.

**Keyboard:** Escape hides the tooltip. Focus triggers show when `trigger` includes `'focus'`.

---

### DModal

Accessible dialog with **hydration-safe Teleport**, focus trapping, scroll lock, and backdrop/ESC dismissal.

```vue
<DModal v-model:open="showModal" title="Confirm action">
  <p>Are you sure?</p>
  <template #footer>
    <button @click="showModal = false">Cancel</button>
    <button @click="confirm">Confirm</button>
  </template>
</DModal>

<!-- Or with a trigger slot -->
<DModal title="Details">
  <template #trigger="{ open }">
    <button @click="open">View details</button>
  </template>
  <p>Modal content here.</p>
</DModal>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls visibility (`v-model:open`) |
| `title` | `string` | `undefined` | Header title text |
| `description` | `string` | `undefined` | Description below the title |
| `closeOnEscape` | `boolean` | `true` | Close when pressing Escape |
| `closeOnBackdrop` | `boolean` | `true` | Close when clicking the backdrop |
| `fullscreen` | `boolean` | `false` | Fullscreen overlay mode |

**Emits**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:open` | `boolean` | v-model sync for open state |
| `close` | — | Fired when the modal closes |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#trigger` | `{ open: () => void }` | Trigger element to open the modal |
| `#header` | — | Replace the default header (title + close button) |
| `#default` | — | Modal body content |
| `#footer` | — | Footer for action buttons |

**CSS Variables:** `--modal-backdrop-bg`, `--modal-bg`, `--modal-border-color`, `--modal-radius`, `--modal-shadow`, `--modal-padding`, `--modal-title-color`, `--modal-desc-color`, `--modal-close-color`, `--modal-close-hover-color`, `--modal-footer-border`, `--modal-max-width`

The Modal uses `useHydrated()` internally — the Teleport to `<body>` only activates after hydration completes, preventing SSR mismatches.

**Keyboard:** Escape closes (if `closeOnEscape`). Tab/Shift+Tab cycle focus within the dialog (focus trap). Focus returns to the previously focused element on close.

---

### DTabs

Tabbed content with line/pill variants, full WAI-ARIA keyboard navigation, lazy rendering, and badge support. Horizontally scrollable when tabs overflow on mobile.

```vue
<DTabs v-model="activeTab" :items="tabs" variant="line">
  <template #panel-users>
    <UserList />
  </template>
  <template #panel-settings>
    <SettingsForm />
  </template>
</DTabs>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TabItem[]` | *required* | Tab definitions |
| `modelValue` | `string` | first enabled key | Active tab key (`v-model`) |
| `variant` | `'line' \| 'pill'` | `'line'` | Visual style variant |
| `lazy` | `boolean` | `false` | Only mount the active panel |

**Emits**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | v-model sync for active tab key |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#tab-{key}` | `{ item: TabItem, active: boolean }` | Custom tab button content for a specific tab |
| `#panel-{key}` | — | Panel content for a specific tab |

**CSS Variables:** `--tabs-border-color`, `--tabs-tab-color`, `--tabs-tab-hover-color`, `--tabs-tab-hover-bg`, `--tabs-tab-active-color`, `--tabs-tab-disabled-color`, `--tabs-tab-padding`, `--tabs-tab-font-weight`, `--tabs-panel-padding`, `--tabs-badge-bg`, `--tabs-badge-color`, `--tabs-pill-bg`, `--tabs-pill-active-bg`, `--tabs-pill-active-color`, `--tabs-pill-hover-bg`, `--tabs-pill-radius`, `--tabs-focus-ring`

**Keyboard:** Arrow Left/Right navigate tabs, Home/End for first/last tab, Enter/Space to select. Follows WAI-ARIA Tabs pattern with roving `tabindex`.

---

### DDropdown

Action menu with keyboard navigation, click-outside close, custom content mode, and dividers.

```vue
<DDropdown
  :items="[
    { key: 'edit', label: 'Edit' },
    { key: 'duplicate', label: 'Duplicate' },
    { key: 'delete', label: 'Delete', divider: true },
  ]"
  @select="onAction"
>
  <button>Actions</button>
</DDropdown>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DropdownItem[]` | `[]` | Menu items (ignored if `#content` slot used) |
| `placement` | `'top' \| 'bottom'` | `'bottom'` | Vertical placement |
| `align` | `'start' \| 'end'` | `'start'` | Horizontal alignment |
| `width` | `'auto' \| 'trigger' \| number` | `'auto'` | Menu width behaviour |
| `disabled` | `boolean` | `false` | Disable the dropdown |

**Emits**

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `DropdownItem` | Fired when an item is selected |
| `open` | — | Fired when dropdown opens |
| `close` | — | Fired when dropdown closes |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#default` | `{ isOpen: boolean }` | Trigger element |
| `#content` | `{ close: () => void }` | Custom dropdown body (replaces items list) |
| `#item` | `{ item, index, active }` | Custom item rendering |

**CSS Variables:** `--dropdown-bg`, `--dropdown-border-color`, `--dropdown-shadow`, `--dropdown-radius`, `--dropdown-padding`, `--dropdown-offset`, `--dropdown-min-width`, `--dropdown-z-index`, `--dropdown-item-padding`, `--dropdown-item-color`, `--dropdown-item-hover-bg`, `--dropdown-item-hover-color`, `--dropdown-item-disabled-color`, `--dropdown-item-radius`, `--dropdown-divider-color`, `--dropdown-focus-ring`

**Keyboard:** Trigger: Enter/Space/ArrowDown open, ArrowUp opens and focuses last item. Menu: Arrow Up/Down navigate, Enter/Space select, Escape closes, Home/End for first/last item, Tab closes.

---

### DPagination

Page navigation with ellipsis for large page counts, item info display, and enlarged touch targets on mobile.

```vue
<DPagination
  v-model:page="currentPage"
  :total="200"
  :per-page="10"
/>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | `1` | Current page, 1-indexed (`v-model:page`) |
| `total` | `number` | *required* | Total item count |
| `perPage` | `number` | `10` | Items per page |
| `maxVisible` | `number` | `7` | Max visible page buttons |
| `showInfo` | `boolean` | `true` | Show "X–Y of Z" info label |

**Emits**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:page` | `number` | v-model sync for current page |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#info` | `{ from, to, total }` | Custom info label |

**CSS Variables:** `--pg-btn-size`, `--pg-btn-radius`, `--pg-btn-bg`, `--pg-btn-color`, `--pg-btn-hover-bg`, `--pg-btn-active-bg`, `--pg-btn-active-color`, `--pg-btn-disabled-color`, `--pg-info-color`, `--pg-ellipsis-color`, `--pg-focus-ring`

**Accessibility:** `<nav aria-label="Pagination">`, `aria-current="page"` on active button, `aria-label` on prev/next buttons, `aria-disabled` on disabled buttons.

---

### DPhoneInput

Phone number input with country flag dropdown, editable dial code, and **hydration-safe locale detection**. The three parts (flag selector, dial code, phone number) are visually unified into a single input row.

```vue
<!-- Auto-detects country from browser locale -->
<DPhoneInput v-model="phone" placeholder="612 345 678" />

<!-- Preset country -->
<DPhoneInput v-model="phone" default-country="GB" placeholder="20 7946 0958" />
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Full phone string (`v-model`) |
| `defaultCountry` | `string` | `undefined` | ISO 2-letter country code override |
| `disabled` | `boolean` | `false` | Disable the entire component |
| `readonly` | `boolean` | `false` | Make inputs read-only |
| `placeholder` | `string` | `''` | Phone number input placeholder |
| `name` | `string` | `undefined` | Form field name attribute |
| `searchable` | `boolean` | `true` | Enable search in country dropdown |

**Emits**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Full phone string (dial code + number) |
| `update:country` | `string` | ISO code when country changes |

**Slots**

| Slot | Props | Description |
|------|-------|-------------|
| `#label` | — | Label rendered above the input group |

**CSS Variables:** `--pi-bg`, `--pi-border-color`, `--pi-border-radius`, `--pi-text-color`, `--pi-placeholder-color`, `--pi-disabled-bg`, `--pi-disabled-color`, `--pi-focus-ring`, `--pi-divider-color`, `--pi-country-hover-bg`, `--pi-dropdown-bg`, `--pi-dropdown-border`, `--pi-dropdown-shadow`, `--pi-dropdown-radius`, `--pi-option-hover-bg`, `--pi-option-selected-bg`, `--pi-option-color`, `--pi-option-code-color`, `--pi-search-bg`, `--pi-search-border`

Key behaviours:
- **Locale auto-detect**: Uses `navigator.language` after hydration to set the default country. SSR renders with "US" (or `defaultCountry` prop) — zero hydration mismatch.
- **Dial code sync**: Typing a different dial code (e.g., "+44") auto-updates the country flag to match.
- **Searchable dropdown**: Filter countries by name, ISO code, or dial code.

**Keyboard:** Country button: Enter/Space/ArrowDown open dropdown. Dropdown: Arrow Up/Down navigate, Enter selects, Escape/Tab closes, Home/End for first/last.

## Composables

All composables are auto-imported via the Nuxt module. No manual imports needed.

### useHydrated

Returns a reactive boolean that is `false` during SSR and becomes `true` after mount. Used internally by Modal, SkeletonLoader, and PhoneInput to prevent hydration mismatches.

```ts
function useHydrated(): Ref<boolean>
```

**Usage**

```vue
<script setup>
const hydrated = useHydrated()
</script>

<template>
  <Teleport v-if="hydrated" to="body">
    <div>Client-only content</div>
  </Teleport>
</template>
```

---

### useFocusTrap

Traps keyboard focus within a container element. Handles Tab/Shift+Tab cycling, Escape key, and restores focus to the previously focused element when deactivated.

```ts
function useFocusTrap(options: {
  containerRef: Ref<HTMLElement | null>;
  active: Ref<boolean>;
  onEscape?: () => void;
}): void
```

**Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `containerRef` | `Ref<HTMLElement \| null>` | The element to trap focus within |
| `active` | `Ref<boolean>` | Whether the trap is currently active |
| `onEscape` | `() => void` | Optional callback when Escape is pressed |

**Usage**

```vue
<script setup>
const modalRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

useFocusTrap({
  containerRef: modalRef,
  active: computed(() => isOpen.value),
  onEscape: () => { isOpen.value = false }
})
</script>
```

Used internally by Modal.

---

### usePagination

Reactive page range computation with ellipsis, prev/next logic, and item range info.

```ts
function usePagination(options: {
  page: Ref<number>;
  total: Ref<number>;
  perPage: Ref<number>;
  maxVisible?: number;
}): UsePaginationReturn
```

**Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `Ref<number>` | — | Current page (1-indexed) |
| `total` | `Ref<number>` | — | Total number of items |
| `perPage` | `Ref<number>` | — | Items per page |
| `maxVisible` | `number` | `7` | Max visible page buttons |

**Returns**

| Property | Type | Description |
|----------|------|-------------|
| `totalPages` | `ComputedRef<number>` | Total page count |
| `visiblePages` | `ComputedRef<(number \| '...')[]>` | Page numbers and ellipsis markers |
| `from` | `ComputedRef<number>` | First item index on current page (1-indexed) |
| `to` | `ComputedRef<number>` | Last item index on current page |
| `hasPrev` | `ComputedRef<boolean>` | Whether previous page exists |
| `hasNext` | `ComputedRef<boolean>` | Whether next page exists |
| `prevPage` | `() => void` | Go to previous page |
| `nextPage` | `() => void` | Go to next page |
| `goToPage` | `(page: number) => void` | Go to specific page (clamped) |

**Usage**

```ts
const page = ref(1)
const { totalPages, visiblePages, from, to } = usePagination({
  page,
  total: ref(200),
  perPage: ref(10),
  maxVisible: 7
})
// visiblePages.value → [1, '...', 8, 9, 10, 11, '...', 20]
```

Used internally by Pagination.

---

### useTableSort

Sort state management with toggle cycling (asc → desc → none) and client-side row sorting.

```ts
function useTableSort(options?: {
  externalSort?: ComputedRef<SortState | null | undefined>;
  initialSort?: SortState | null;
  onSort?: (sort: SortState) => void;
}): UseTableSortReturn
```

**Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `externalSort` | `ComputedRef<SortState \| null>` | External sort state (controlled mode) |
| `initialSort` | `SortState \| null` | Initial sort for uncontrolled mode |
| `onSort` | `(sort: SortState) => void` | Callback on sort change |

**Returns**

| Property | Type | Description |
|----------|------|-------------|
| `currentSort` | `ComputedRef<SortState \| null>` | Active sort state |
| `toggleSort` | `(key: string) => void` | Cycle sort on a column |
| `sortRows` | `(rows: Record<string, unknown>[]) => Record<string, unknown>[]` | Sort an array by current state |

**Usage**

```ts
const { currentSort, toggleSort, sortRows } = useTableSort({
  initialSort: { key: 'name', direction: 'asc' }
})

// In a column header click handler
toggleSort('email')

// Client-side sort
const sorted = sortRows(rawRows)
```

Used internally by DataTable.

---

### useDataTable

Full data table state management with server/client-side sorting and pagination. Integrates with Nuxt's `useAsyncData` for automatic re-fetching.

```ts
function useDataTable<T extends Record<string, unknown>>(options: {
  key: string;
  fetcher: (params: { sort, page, perPage }) => Promise<T[] | { rows: T[]; total: number }>;
  columns: DataTableColumn[] | Ref<DataTableColumn[]>;
  defaultSort?: SortState | null;
  serverSort?: boolean;
  perPage?: number;
  serverPagination?: boolean;
}): UseDataTableReturn<T>
```

**Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `key` | `string` | Unique key for `useAsyncData` deduplication |
| `fetcher` | `function` | Async function returning rows or `{ rows, total }` |
| `columns` | `DataTableColumn[] \| Ref<DataTableColumn[]>` | Column definitions |
| `defaultSort` | `SortState \| null` | Initial sort state |
| `serverSort` | `boolean` | Whether sort triggers re-fetch |
| `perPage` | `number` | Items per page (enables pagination) |
| `serverPagination` | `boolean` | Whether pagination is server-side |

**Returns**

| Property | Type | Description |
|----------|------|-------------|
| `rows` | `ComputedRef<T[]>` | Display rows (bind to `:rows`) |
| `columns` | `ComputedRef<DataTableColumn[]>` | Columns (bind to `:columns`) |
| `loading` | `ComputedRef<boolean>` | Loading state (bind to `:loading`) |
| `sort` | `ComputedRef<SortState \| null>` | Sort state (bind to `:sort`) |
| `onSort` | `(sort: SortState) => void` | Sort handler (bind to `@sort`) |
| `refresh` | `() => Promise<void>` | Manually re-fetch data |
| `error` | `Ref<Error \| null>` | Fetch error |
| `page` | `Ref<number>` | Current page (1-indexed) |
| `totalItems` | `Ref<number>` | Total item count |
| `perPage` | `Ref<number>` | Items per page |
| `onPageChange` | `(page: number) => void` | Page change handler |

**Usage**

```vue
<script setup>
const { rows, columns, loading, sort, onSort, page, totalItems, onPageChange } = useDataTable({
  key: 'users-table',
  fetcher: async ({ sort, page, perPage }) => {
    const res = await $fetch('/api/users', {
      query: { sort: sort?.key, dir: sort?.direction, page, perPage }
    })
    return { rows: res.data, total: res.total }
  },
  columns: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ],
  serverSort: true,
  serverPagination: true,
  perPage: 10
})
</script>

<template>
  <DDataTable :columns="columns" :rows="rows" :sort="sort" :loading="loading" @sort="onSort" />
  <DPagination v-model:page="page" :total="totalItems" :per-page="10" />
</template>
```

Requires Nuxt runtime context (`useAsyncData`, `useRoute`).

---

### useSortQuerySync

Syncs table sort state with URL query parameters for shareable, bookmarkable sorting.

```ts
function useSortQuerySync(options?: {
  sortParam?: string;
  directionParam?: string;
  defaultSort?: SortState | null;
}): { sort: ComputedRef<SortState | null>; setSort: (sort: SortState) => void }
```

**Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `sortParam` | `string` | `'sort'` | Query param name for the sort key |
| `directionParam` | `string` | `'dir'` | Query param name for direction |
| `defaultSort` | `SortState \| null` | `null` | Fallback when no query params |

**Returns**

| Property | Type | Description |
|----------|------|-------------|
| `sort` | `ComputedRef<SortState \| null>` | Sort state derived from URL |
| `setSort` | `(sort: SortState) => void` | Update URL query params |

**Usage**

```ts
const { sort, setSort } = useSortQuerySync({
  defaultSort: { key: 'name', direction: 'asc' }
})

// URL: /users?sort=email&dir=desc
// sort.value → { key: 'email', direction: 'desc' }

setSort({ key: 'name', direction: 'asc' })
// URL becomes: /users?sort=name&dir=asc
```

Requires Nuxt runtime context (`useRoute`, `useRouter`).

## Theming

### Design Token System

Every component uses a **self-contained CSS variable system with global token fallbacks**:

```css
/* Component declares its own variables, referencing global tokens with fallbacks */
.stat-card {
  --stat-card-bg: var(--color-surface-base, #dce9fb);
  --stat-card-border: var(--color-border-default, #83b4f0);
  --stat-card-radius: var(--radius-2xl, 0.75rem);
}
```

This means:
- **Components work standalone** — the fallback hex values are always present
- **Components respond to a global theme** — override `--color-surface-base` on `:root` and all card-based components update together
- **Per-instance overrides** work too — set `--stat-card-bg` on a single element

### Global Theme Override

```css
/* Override globally — all components using this token respond */
:root {
  --color-surface-base: #f0f4ff;
  --color-accent-primary: #4f46e5;
}

/* Or override a specific component */
.stat-card {
  --stat-card-bg: #f0f9ff;
}
```

### Dark Mode

Dark mode activates via the `.dark` class on any ancestor element. The library implements a **4-level surface hierarchy** for depth perception:

| Level    | Hex       | Usage                          |
|----------|-----------|--------------------------------|
| Page     | `#0d1117` | Page background                |
| Base     | `#131c2e` | Cards, tables, tab containers  |
| Elevated | `#1a2540` | Modals, dropdowns, tooltips    |
| Overlay  | `#1f2b47` | Hover states, focused items    |

```html
<!-- Toggle dark mode by adding .dark to <html> or <body> -->
<html class="dark">
  ...
</html>
```

### Colour Palette

The library uses a blue-tinted palette with WCAG AA-verified contrast ratios.

**Light Mode**

| Role | Token | Value |
|------|-------|-------|
| Page background | `--color-page-bg` | `#f0f7ff` |
| Card / surface | `--color-surface-base` | `#dce9fb` |
| Raised surface | `--color-surface-raised` | `#ffffff` |
| Hover | `--color-surface-hover` | `#b8d4f8` |
| Text primary | `--color-text-primary` | `#111827` |
| Text secondary | `--color-text-secondary` | `#0f3080` |
| Text muted | `--color-text-muted` | `#4b5563` |
| Border | `--color-border-default` | `#83b4f0` |
| Accent | `--color-accent-primary` | `#2563eb` |

**Dark Mode**

| Role | Token | Value |
|------|-------|-------|
| Page background | `--color-page-bg` | `#0d1117` |
| Card / surface | `--color-surface-base` | `#131c2e` |
| Raised surface | `--color-surface-raised` | `#1a2540` |
| Hover | `--color-surface-hover` | `#1f2b47` |
| Text primary | `--color-text-primary` | `#e8eef8` |
| Text secondary | `--color-text-secondary` | `#93baf5` |
| Text muted | `--color-text-muted` | `#6b87b8` |
| Border | `--color-border-default` | `#243358` |
| Accent | `--color-accent-primary` | `#3b6fd4` |

**Semantic Badge Colours**

| Variant | Light BG | Light Text | Dark BG | Dark Text |
|---------|----------|------------|---------|-----------|
| Success | `#d6f5ec` | `#0a4a34` | `#092d22` | `#4dd4a0` |
| Warning | `#fef3d0` | `#7a4a00` | `#2e1a00` | `#f5c440` |
| Danger  | `#fde8e8` | `#8b1a1a` | `#2e0d0d` | `#f08080` |
| Info    | `#e0f0ff` | `#1a4db8` | `#162038` | `#6baaf0` |

### Border Radius Tokens

| Token | Value |
|-------|-------|
| `--radius-xs` | `2px` |
| `--radius-sm` | `4px` |
| `--radius-md` | `0.25rem` |
| `--radius-lg` | `0.375rem` |
| `--radius-xl` | `0.5rem` |
| `--radius-2xl` | `0.75rem` |
| `--radius-pill` | `9999px` |
| `--radius-circle` | `50%` |

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- Semantic HTML elements
- ARIA attributes (`role`, `aria-label`, `aria-expanded`, `aria-describedby`, `aria-selected`, `aria-current`, `aria-modal`, `aria-busy`, etc.)
- Full keyboard navigation (Enter, Space, Escape, Arrow keys, Tab, Shift+Tab, Home, End)
- Focus trapping in Modal (Tab/Shift+Tab cycle through focusable elements)
- Screen reader text via `.sr-only`
- `focus-visible` outlines for keyboard users
- Minimum 44x44px touch targets on all interactive elements
- `prefers-reduced-motion` support for all animations
- WCAG AA contrast ratios verified for all colour combinations

## Development

### Prerequisites

- Node.js 18+
- pnpm 10+

### Setup

```bash
git clone https://github.com/belblue/nuxt-dashboard-ui.git
cd nuxt-dashboard-ui
pnpm install
```

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev:playground` | Run the playground app for testing components |
| `npx vitest run` | Run all tests (382 tests across 17 files) |
| `npx vitest run --watch` | Run tests in watch mode |
| `pnpm build` | Build the module for distribution |

### Project Structure

```
nuxt-dashboard-ui/
├── packages/
│   └── ui/
│       └── src/
│           ├── module.ts              # Nuxt module entry
│           └── runtime/
│               ├── components/        # All component folders
│               │   ├── Badge/
│               │   ├── DataTable/
│               │   ├── Dropdown/
│               │   ├── EmptyState/
│               │   ├── Modal/
│               │   ├── Pagination/
│               │   ├── PhoneInput/
│               │   ├── ProgressBar/
│               │   ├── SkeletonLoader/
│               │   ├── StatCard/
│               │   ├── Tabs/
│               │   └── Tooltip/
│               └── composables/       # Shared composables
│                   ├── useDataTable.ts
│                   ├── useFocusTrap.ts
│                   ├── useHydrated.ts
│                   ├── usePagination.ts
│                   ├── useSortQuerySync.ts
│                   └── useTableSort.ts
├── apps/
│   └── playground/                    # Dev playground app
├── vitest.config.ts
└── pnpm-workspace.yaml
```

### Adding a New Component

1. Create a folder under `runtime/components/YourComponent/`
2. Add `YourComponent.vue`, `types.ts` (if needed), `index.ts`, and `YourComponent.test.ts`
3. The component auto-registers as `<DYourComponent />` via the module -- no manual registration needed
4. Follow existing patterns: TypeScript strict, BEM CSS, CSS custom properties with global token fallbacks, ARIA, keyboard nav, dark mode, reduced motion, 44px touch targets

## License

[MIT](./LICENSE)
