<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount, useId } from "vue";
import { useHydrated } from "../../composables/useHydrated";
import {
  countries,
  getFlagEmoji,
  findCountryByCode,
  findCountryByDialCode,
} from "./countries";
import type { Country, PhoneInputProps } from "./types";

/**
 * PhoneInput
 *
 * A unified phone number input with country flag dropdown, editable dial code,
 * and phone number field. Auto-detects the user's locale for the default country
 * while maintaining hydration safety (locale detection is client-only).
 *
 * @example
 * <DPhoneInput v-model="phone" placeholder="612 345 678" />
 *
 * @example
 * <DPhoneInput v-model="phone" default-country="GB" />
 */

const props = withDefaults(defineProps<PhoneInputProps>(), {
  modelValue: "",
  disabled: false,
  readonly: false,
  placeholder: "",
  searchable: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:country": [code: string];
}>();

defineSlots<{
  /** Optional label rendered above the input group */
  label?: (props: {}) => any;
}>();

const hydrated = useHydrated();
const inputId = useId();
const listboxId = `${inputId}-listbox`;

// --- Refs ---
const containerRef = ref<HTMLElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const numberRef = ref<HTMLInputElement | null>(null);
const listRef = ref<HTMLElement | null>(null);

const isOpen = ref(false);
const searchQuery = ref("");
const focusedIndex = ref(0);

// --- Initial country (hydration-safe) ---
const fallbackCountry: Country = findCountryByCode("US")!;

function getInitialCountry(): Country {
  if (props.defaultCountry) {
    return findCountryByCode(props.defaultCountry) ?? fallbackCountry;
  }
  return fallbackCountry;
}

const selectedCountry = ref<Country>(getInitialCountry());
const dialCode = ref(selectedCountry.value.dialCode);
const phoneNumber = ref("");

// Parse initial modelValue if provided
if (props.modelValue) {
  const mv = props.modelValue;
  const match = countries.find((c) => mv.startsWith(c.dialCode));
  if (match) {
    selectedCountry.value = match;
    dialCode.value = match.dialCode;
    phoneNumber.value = mv.slice(match.dialCode.length);
  } else {
    phoneNumber.value = mv;
  }
}

// --- Hydration: auto-detect locale after mount ---
watch(hydrated, (isHydrated) => {
  if (!isHydrated) return;
  // Only auto-detect if no explicit defaultCountry and no modelValue was provided
  if (props.defaultCountry || props.modelValue) return;

  try {
    const locale = new Intl.Locale(navigator.language);
    const region = locale.region;
    if (region) {
      const detected = findCountryByCode(region);
      if (detected) {
        selectedCountry.value = detected;
        dialCode.value = detected.dialCode;
        emit("update:country", detected.code);
      }
    }
  } catch {
    // Intl.Locale not available or invalid — keep default
  }
});

// --- Computed ---
const flagEmoji = computed(() => getFlagEmoji(selectedCountry.value.code));

function optionId(code: string) {
  return `${inputId}-option-${code}`;
}

const activeDescendantId = computed(() => {
  const list = filteredCountries.value;
  if (!isOpen.value || list.length === 0) return undefined;
  return optionId(list[focusedIndex.value].code);
});

const filteredCountries = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return countries;
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
  );
});

const fullPhone = computed(() => {
  if (!phoneNumber.value) return dialCode.value;
  return dialCode.value + phoneNumber.value;
});

// --- Sync external modelValue changes ---
watch(
  () => props.modelValue,
  (mv) => {
    if (!mv) {
      phoneNumber.value = "";
      return;
    }
    const match = countries.find((c) => mv.startsWith(c.dialCode));
    if (match) {
      if (match.code !== selectedCountry.value.code) {
        selectedCountry.value = match;
        dialCode.value = match.dialCode;
      }
      phoneNumber.value = mv.slice(match.dialCode.length);
    }
  }
);

// --- Sync defaultCountry prop changes ---
watch(
  () => props.defaultCountry,
  (code) => {
    if (code) {
      const country = findCountryByCode(code);
      if (country) {
        selectedCountry.value = country;
        dialCode.value = country.dialCode;
        emit("update:country", country.code);
      }
    }
  }
);

// --- Handlers ---
function emitUpdate() {
  emit("update:modelValue", fullPhone.value);
}

function onDialCodeInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let val = target.value.trim();

  // Ensure it starts with +
  if (val && !val.startsWith("+")) {
    val = "+" + val;
  }
  dialCode.value = val;

  // Auto-select country from dial code
  const match = findCountryByDialCode(val);
  if (match && match.code !== selectedCountry.value.code) {
    selectedCountry.value = match;
    emit("update:country", match.code);
  }

  emitUpdate();
}

function onPhoneInput(event: Event) {
  const target = event.target as HTMLInputElement;
  phoneNumber.value = target.value;
  emitUpdate();
}

function selectCountry(country: Country) {
  selectedCountry.value = country;
  dialCode.value = country.dialCode;
  emit("update:country", country.code);
  emitUpdate();
  close();
  // Focus the phone number input after selecting a country
  nextTick(() => {
    numberRef.value?.focus();
  });
}

// --- Dropdown open/close ---
function open() {
  if (props.disabled) return;
  isOpen.value = true;
  searchQuery.value = "";
  focusedIndex.value = 0;

  nextTick(() => {
    searchRef.value?.focus();
  });
}

function close() {
  isOpen.value = false;
  searchQuery.value = "";
}

function toggleDropdown() {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

// --- Click-outside ---
function handleDocumentClick(event: MouseEvent) {
  if (!isOpen.value) return;
  if (containerRef.value?.contains(event.target as Node)) return;
  close();
}

watch(isOpen, (val) => {
  if (val) {
    setTimeout(() => {
      document.addEventListener("click", handleDocumentClick);
    }, 0);
  } else {
    document.removeEventListener("click", handleDocumentClick);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});

// --- Keyboard navigation ---
function handleTriggerKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
    case "Enter":
    case " ":
      event.preventDefault();
      open();
      break;
  }
}

function handleListKeydown(event: KeyboardEvent) {
  const list = filteredCountries.value;
  if (list.length === 0) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      focusedIndex.value = (focusedIndex.value + 1) % list.length;
      scrollToFocused();
      break;
    case "ArrowUp":
      event.preventDefault();
      focusedIndex.value =
        (focusedIndex.value - 1 + list.length) % list.length;
      scrollToFocused();
      break;
    case "Home":
      event.preventDefault();
      focusedIndex.value = 0;
      scrollToFocused();
      break;
    case "End":
      event.preventDefault();
      focusedIndex.value = list.length - 1;
      scrollToFocused();
      break;
    case "Enter":
      event.preventDefault();
      if (list[focusedIndex.value]) {
        selectCountry(list[focusedIndex.value]);
      }
      break;
    case "Escape":
      event.preventDefault();
      close();
      break;
    case "Tab":
      close();
      break;
  }
}

function scrollToFocused() {
  nextTick(() => {
    const listEl = listRef.value;
    if (!listEl) return;
    const focused = listEl.children[focusedIndex.value] as HTMLElement;
    if (focused) {
      focused.scrollIntoView({ block: "nearest" });
    }
  });
}

// Reset focused index when search changes
watch(searchQuery, () => {
  focusedIndex.value = 0;
});
</script>

<template>
  <div
    ref="containerRef"
    class="phone-input"
    :class="{
      'phone-input--disabled': disabled,
      'phone-input--readonly': readonly,
      'phone-input--open': isOpen,
    }"
    role="group"
    aria-label="Phone number"
  >
    <slot name="label" />

    <div class="phone-input__field">
      <!-- Country selector button -->
      <button
        class="phone-input__country"
        type="button"
        :aria-expanded="isOpen"
        :aria-controls="isOpen ? listboxId : undefined"
        aria-haspopup="listbox"
        :aria-label="`Selected country: ${selectedCountry.name}`"
        :disabled="disabled"
        @click="toggleDropdown"
        @keydown="handleTriggerKeydown"
      >
        <span class="phone-input__flag" aria-hidden="true">{{
          flagEmoji
        }}</span>
        <svg
          class="phone-input__chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <!-- Editable dial code -->
      <input
        class="phone-input__code"
        type="text"
        inputmode="tel"
        :value="dialCode"
        :disabled="disabled"
        :readonly="readonly"
        aria-label="Country calling code"
        @input="onDialCodeInput"
      >

      <!-- Divider -->
      <span class="phone-input__divider" aria-hidden="true" />

      <!-- Phone number input -->
      <input
        ref="numberRef"
        class="phone-input__number"
        type="tel"
        :value="phoneNumber"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :name="name"
        aria-label="Phone number"
        @input="onPhoneInput"
      >
    </div>

    <!-- Country dropdown -->
    <div
      v-if="isOpen"
      :id="listboxId"
      class="phone-input__dropdown"
      role="listbox"
      aria-label="Select country"
    >
      <div v-if="searchable" class="phone-input__search-wrap">
        <input
          ref="searchRef"
          class="phone-input__search"
          type="text"
          role="combobox"
          placeholder="Search countries..."
          :value="searchQuery"
          aria-label="Search countries"
          aria-autocomplete="list"
          :aria-controls="listboxId"
          :aria-activedescendant="activeDescendantId"
          @input="searchQuery = ($event.target as HTMLInputElement).value"
          @keydown="handleListKeydown"
        >
      </div>

      <div ref="listRef" class="phone-input__list">
        <div
          v-for="(country, index) in filteredCountries"
          :id="optionId(country.code)"
          :key="country.code"
          class="phone-input__option"
          :class="{
            'phone-input__option--focused': index === focusedIndex,
            'phone-input__option--selected':
              country.code === selectedCountry.code,
          }"
          role="option"
          :aria-selected="country.code === selectedCountry.code"
          @click="selectCountry(country)"
          @mouseenter="focusedIndex = index"
        >
          <span class="phone-input__option-flag" aria-hidden="true">{{
            getFlagEmoji(country.code)
          }}</span>
          <span class="phone-input__option-name">{{ country.name }}</span>
          <span class="phone-input__option-code">{{ country.dialCode }}</span>
        </div>

        <div
          v-if="filteredCountries.length === 0"
          class="phone-input__no-results"
        >
          No countries found
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-input {
  --pi-bg: var(--color-surface-raised, #ffffff);
  --pi-border-color: var(--color-border-default, #83b4f0);
  --pi-border-radius: var(--radius-lg, 0.375rem);
  --pi-text-color: var(--color-text-secondary, #0f3080);
  --pi-placeholder-color: var(--color-text-disabled, #9ca3af);
  --pi-disabled-bg: var(--color-surface-base, #dce9fb);
  --pi-disabled-color: var(--color-text-disabled, #9ca3af);
  --pi-focus-ring: 2px solid var(--color-accent-primary, #2563eb);
  --pi-divider-color: var(--color-border-default, #83b4f0);
  --pi-country-hover-bg: var(--color-surface-hover, #b8d4f8);

  /* Dropdown */
  --pi-dropdown-bg: var(--color-surface-raised, #ffffff);
  --pi-dropdown-border: var(--color-border-default, #83b4f0);
  --pi-dropdown-shadow: 0 4px 16px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.06);
  --pi-dropdown-radius: var(--radius-xl, 0.5rem);
  --pi-option-hover-bg: var(--color-surface-base, #dce9fb);
  --pi-option-selected-bg: var(--color-surface-hover, #b8d4f8);
  --pi-option-color: var(--color-text-secondary, #0f3080);
  --pi-option-code-color: var(--color-text-muted, #4b5563);
  --pi-search-bg: var(--color-surface-raised, #ffffff);
  --pi-search-border: var(--color-border-default, #83b4f0);

  position: relative;
  display: inline-flex;
  flex-direction: column;
  font-size: 0.875rem;
  width: 100%;
  max-width: 24rem;
}

/* Unified field row */
.phone-input__field {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--pi-border-color);
  border-radius: var(--pi-border-radius);
  background: var(--pi-bg);
  overflow: hidden;
  transition: border-color 0.15s ease;
}

.phone-input__field:focus-within {
  border-color: var(--color-accent-primary, #2563eb);
  box-shadow: 0 0 0 1px var(--color-accent-primary, #2563eb);
}

/* Country button */
.phone-input__country {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.625rem;
  min-height: 2.75rem;
  background: none;
  border: none;
  border-right: 1px solid var(--pi-divider-color);
  color: var(--pi-text-color);
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
}

.phone-input__country:hover:not(:disabled) {
  background: var(--pi-country-hover-bg);
}

.phone-input__country:focus-visible {
  outline: var(--pi-focus-ring);
  outline-offset: -2px;
}

.phone-input__country:disabled {
  cursor: default;
  opacity: 0.5;
}

/* Expand touch target to 44px minimum */
.phone-input__country::before {
  content: "";
  position: absolute;
  inset: 0;
  min-width: 44px;
  min-height: 44px;
}

.phone-input__flag {
  font-size: 1.25rem;
  line-height: 1;
}

.phone-input__chevron {
  opacity: 0.6;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.phone-input--open .phone-input__chevron {
  transform: rotate(180deg);
}

/* Dial code input */
.phone-input__code {
  width: 4rem;
  min-height: 2.75rem;
  padding: 0 0.375rem;
  border: none;
  background: transparent;
  color: var(--pi-text-color);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  text-align: center;
  outline: none;
  flex-shrink: 0;
}

.phone-input__code:disabled {
  color: var(--pi-disabled-color);
  cursor: default;
}

/* Divider between code and number */
.phone-input__divider {
  width: 1px;
  align-self: stretch;
  margin: 0.5rem 0;
  background: var(--pi-divider-color);
  flex-shrink: 0;
}

/* Phone number input */
.phone-input__number {
  flex: 1;
  min-height: 2.75rem;
  min-width: 0;
  padding: 0 0.75rem;
  border: none;
  background: transparent;
  color: var(--pi-text-color);
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
}

.phone-input__number::placeholder {
  color: var(--pi-placeholder-color);
}

.phone-input__number:disabled {
  color: var(--pi-disabled-color);
  cursor: default;
}

/* Disabled state */
.phone-input--disabled .phone-input__field {
  background: var(--pi-disabled-bg);
  border-color: var(--pi-disabled-color);
}

/* Dropdown panel */
.phone-input__dropdown {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--pi-dropdown-bg);
  border: 1px solid var(--pi-dropdown-border);
  border-radius: var(--pi-dropdown-radius);
  box-shadow: var(--pi-dropdown-shadow);
  overflow: hidden;
}

/* Search input */
.phone-input__search-wrap {
  padding: 0.5rem;
  border-bottom: 1px solid var(--pi-divider-color);
}

.phone-input__search {
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--pi-search-border);
  border-radius: var(--radius-md, 0.25rem);
  background: var(--pi-search-bg);
  color: var(--pi-text-color);
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
}

.phone-input__search:focus {
  border-color: var(--color-accent-primary, #2563eb);
  box-shadow: inset 0 0 0 1px var(--color-accent-primary, #2563eb);
}

.phone-input__search::placeholder {
  color: var(--pi-placeholder-color);
}

/* Options list */
.phone-input__list {
  max-height: 15rem;
  overflow-y: auto;
  padding: 0.25rem;
}

/* Option item */
.phone-input__option {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 0.75rem;
  min-height: 2.75rem;
  border-radius: var(--radius-md, 0.25rem);
  cursor: pointer;
  color: var(--pi-option-color);
}

.phone-input__option:hover,
.phone-input__option--focused {
  background: var(--pi-option-hover-bg);
}

.phone-input__option--selected {
  background: var(--pi-option-selected-bg);
  font-weight: 600;
}

.phone-input__option-flag {
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.phone-input__option-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone-input__option-code {
  color: var(--pi-option-code-color);
  font-size: 0.8125rem;
  flex-shrink: 0;
}

/* No results */
.phone-input__no-results {
  padding: 1rem;
  text-align: center;
  color: var(--pi-placeholder-color);
  font-size: 0.875rem;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .phone-input__chevron,
  .phone-input__field {
    transition: none;
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .phone-input {
    max-width: 100%;
  }

  .phone-input__dropdown {
    left: 0;
    right: 0;
    min-width: 0;
  }
}
</style>

<style>
/* Dark mode — unscoped so ancestor .dark selector works correctly */
.dark .phone-input {
  --pi-bg: var(--color-surface-base, #131c2e);
  --pi-border-color: var(--color-border-default, #243358);
  --pi-text-color: var(--color-text-primary, #e8eef8);
  --pi-placeholder-color: var(--color-text-disabled, #3a4f6e);
  --pi-disabled-bg: var(--color-surface-hover, #1f2b47);
  --pi-disabled-color: var(--color-text-disabled, #3a4f6e);
  --pi-focus-ring: 2px solid var(--color-accent-hover, #5b8fe8);
  --pi-divider-color: var(--color-border-accent, #2d4270);
  --pi-country-hover-bg: var(--color-surface-hover, #1f2b47);

  --pi-dropdown-bg: var(--color-surface-raised, #1a2540);
  --pi-dropdown-border: var(--color-border-default, #243358);
  --pi-dropdown-shadow: 0 4px 16px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
  --pi-option-hover-bg: var(--color-surface-hover, #1f2b47);
  --pi-option-selected-bg: var(--color-surface-hover, #1f2b47);
  --pi-option-color: var(--color-text-primary, #e8eef8);
  --pi-option-code-color: var(--color-text-muted, #6b87b8);
  --pi-search-bg: var(--color-surface-base, #131c2e);
  --pi-search-border: var(--color-border-accent, #2d4270);
}

.dark .phone-input__field:focus-within {
  border-color: var(--color-accent-hover, #5b8fe8);
  box-shadow: 0 0 0 1px var(--color-accent-hover, #5b8fe8);
}

.dark .phone-input__search:focus {
  border-color: var(--color-accent-hover, #5b8fe8);
  box-shadow: inset 0 0 0 1px var(--color-accent-hover, #5b8fe8);
}
</style>
