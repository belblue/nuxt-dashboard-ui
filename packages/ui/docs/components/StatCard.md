# StatCard

Displays a key metric with optional trend indicator. Perfect for dashboard KPIs.

## Basic Usage

```vue
<template>
  <DStatCard
    title="Revenue"
    :value="12500"
    trend="up"
    :trend-value="12"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **required** | The label displayed above the value |
| `value` | `number \| string` | **required** | The main metric to display |
| `trend` | `'up' \| 'down' \| 'neutral'` | `'neutral'` | Trend direction indicator |
| `trendValue` | `number \| string` | `undefined` | Value shown next to trend arrow |
| `clickable` | `boolean` | `false` | Enables click interaction with hover effects |
| `loading` | `boolean` | `false` | Shows skeleton loader when `true` |
| `locale` | `string` | `'de-DE'` | Locale for number formatting (e.g., `'en-US'`, `'es-ES'`) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | - | Emitted when card is clicked (requires `clickable` prop) |

## Slots

### `#icon`

Add a custom icon before the title.

```vue
<DStatCard title="Revenue" :value="12500">
  <template #icon>💰</template>
</DStatCard>
```

### `#value`

Customize value display. Receives `formatted` as a slot prop.

```vue
<DStatCard title="Revenue" :value="12500">
  <template #value="{ formatted }">
    ${{ formatted }}
  </template>
</DStatCard>
```

## Localization / i18n

The `locale` prop controls number formatting via `Intl.NumberFormat`.

### Hydration Safe

The component uses an explicit locale to prevent SSR hydration mismatches. The server and client will always produce identical output.

### Integration Patterns

#### With @nuxtjs/i18n

```vue
<script setup>
const { locale } = useI18n()
</script>

<template>
  <DStatCard
    title="Revenue"
    :value="12500"
    :locale="locale"
  />
</template>
```

#### With a custom composable

```ts
// composables/useLocale.ts
export const useLocale = () => {
  const localeCookie = useCookie('user-locale')

  if (import.meta.client && !localeCookie.value) {
    localeCookie.value = navigator.language
  }

  return localeCookie.value || 'en-US'
}
```

```vue
<script setup>
const locale = useLocale()
</script>

<template>
  <DStatCard :value="12500" :locale="locale" />
</template>
```

#### Using Accept-Language header

```ts
// composables/useLocale.ts
export const useLocale = () => {
  const headers = useRequestHeaders(['accept-language'])
  const acceptLang = headers?.['accept-language'] || 'en-US'
  return acceptLang.split(',')[0].split(';')[0]
}
```

## Examples

### Dashboard KPIs

```vue
<template>
  <div class="grid grid-cols-4 gap-4">
    <DStatCard
      title="Total Users"
      :value="8420"
      trend="up"
      :trend-value="12"
      locale="en-US"
    >
      <template #icon>👥</template>
    </DStatCard>

    <DStatCard
      title="Revenue"
      :value="142500"
      trend="up"
      :trend-value="8.5"
      locale="en-US"
    >
      <template #icon>💰</template>
      <template #value="{ formatted }">${{ formatted }}</template>
    </DStatCard>

    <DStatCard
      title="Conversion"
      :value="3.24"
      trend="down"
      :trend-value="-2"
    >
      <template #value="{ formatted }">{{ formatted }}%</template>
    </DStatCard>

    <DStatCard
      title="Avg. Order"
      :value="89.50"
      trend="neutral"
      locale="en-US"
    >
      <template #value="{ formatted }">${{ formatted }}</template>
    </DStatCard>
  </div>
</template>
```

### Clickable Cards

```vue
<script setup>
const handleCardClick = () => {
  navigateTo('/analytics/users')
}
</script>

<template>
  <DStatCard
    title="Active Users"
    :value="1234"
    clickable
    @click="handleCardClick"
  />
</template>
```

### Loading State

```vue
<script setup>
const { data, pending } = await useFetch('/api/stats')
</script>

<template>
  <DStatCard
    title="Revenue"
    :value="data?.revenue ?? 0"
    :loading="pending"
  />
</template>
```

## Theming

StatCard uses CSS variables for easy customization:

```css
.stat-card {
  --stat-card-bg: #ffffff;
  --stat-card-border: #e5e7eb;
  --stat-card-radius: 0.75rem;
  --stat-card-padding: 1.5rem;
  --stat-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  --stat-card-title-color: #6b7280;
  --stat-card-value-color: #111827;

  --stat-card-trend-up: #10b981;
  --stat-card-trend-down: #ef4444;
  --stat-card-trend-neutral: #6b7280;
}
```

### Dark Mode

The component includes built-in dark mode support. Apply the `.dark` class to a parent element:

```html
<body class="dark">
  <DStatCard title="Users" :value="1000" />
</body>
```
