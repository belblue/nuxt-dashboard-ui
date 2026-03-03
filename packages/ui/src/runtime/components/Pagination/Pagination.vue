<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { usePagination, type PageItem } from "../../composables/usePagination";

/**
 * Pagination
 *
 * Page navigation controls for tables and lists.
 * Supports v-model:page, item info display, and ellipsis for large page counts.
 *
 * @example
 * <DPagination v-model:page="currentPage" :total="200" :per-page="10" />
 */

interface PaginationProps {
  /** Current page (1-indexed, v-model:page) */
  page?: number;
  /** Total number of items */
  total: number;
  /** Items per page */
  perPage?: number;
  /** Max visible page buttons */
  maxVisible?: number;
  /** Show "X-Y of Z" info label */
  showInfo?: boolean;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  page: 1,
  perPage: 10,
  maxVisible: 7,
  showInfo: true,
});

const emit = defineEmits<{
  "update:page": [page: number];
}>();

defineSlots<{
  info?: (props: { from: number; to: number; total: number }) => any;
}>();

const currentPage = ref(props.page);

watch(
  () => props.page,
  (val) => {
    currentPage.value = val;
  }
);

const totalRef = computed(() => props.total);
const perPageRef = computed(() => props.perPage);

const {
  totalPages,
  visiblePages,
  from,
  to,
  hasPrev,
  hasNext,
  prevPage,
  nextPage,
  goToPage,
} = usePagination({
  page: currentPage,
  total: totalRef,
  perPage: perPageRef,
  maxVisible: props.maxVisible,
});

function handlePageClick(item: PageItem) {
  if (item === "...") return;
  setPage(item);
}

function handlePrev() {
  prevPage();
  emit("update:page", currentPage.value);
}

function handleNext() {
  nextPage();
  emit("update:page", currentPage.value);
}

function setPage(page: number) {
  goToPage(page);
  emit("update:page", currentPage.value);
}
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <div v-if="showInfo" class="pagination__info">
      <slot name="info" :from="from" :to="to" :total="total">
        <span v-if="total > 0">{{ from }}-{{ to }} of {{ total }}</span>
        <span v-else>No items</span>
      </slot>
    </div>

    <ul v-if="totalPages > 1" class="pagination__list">
      <li>
        <button
          class="pagination__btn pagination__btn--prev"
          :disabled="!hasPrev"
          :aria-disabled="!hasPrev"
          aria-label="Previous page"
          @click="handlePrev"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </li>

      <li v-for="(item, index) in visiblePages" :key="`${item}-${index}`">
        <span
          v-if="item === '...'"
          class="pagination__ellipsis"
          aria-hidden="true"
        >
          ...
        </span>
        <button
          v-else
          class="pagination__btn pagination__btn--page"
          :class="{ 'pagination__btn--active': item === currentPage }"
          :aria-current="item === currentPage ? 'page' : undefined"
          :aria-label="`Page ${item}`"
          @click="handlePageClick(item)"
        >
          {{ item }}
        </button>
      </li>

      <li>
        <button
          class="pagination__btn pagination__btn--next"
          :disabled="!hasNext"
          :aria-disabled="!hasNext"
          aria-label="Next page"
          @click="handleNext"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination {
  --pg-btn-size: 2rem;
  --pg-btn-radius: var(--radius-lg, 0.375rem);
  --pg-btn-bg: transparent;
  --pg-btn-color: var(--color-text-secondary, #0f3080);
  --pg-btn-hover-bg: var(--color-surface-hover, #b8d4f8);
  --pg-btn-active-bg: var(--color-accent-primary, #2563eb);
  --pg-btn-active-color: #ffffff;
  --pg-btn-disabled-color: var(--color-text-disabled, #9ca3af);
  --pg-info-color: var(--color-text-secondary, #0f3080);
  --pg-ellipsis-color: var(--color-text-muted, #4b5563);
  --pg-focus-ring: 2px solid var(--color-accent-primary, #2563eb);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.875rem;
}

.pagination__info {
  color: var(--pg-info-color);
  white-space: nowrap;
}

.pagination__list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--pg-btn-size);
  height: var(--pg-btn-size);
  padding: 0 0.375rem;
  border: none;
  border-radius: var(--pg-btn-radius);
  background: var(--pg-btn-bg);
  color: var(--pg-btn-color);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  line-height: 1;
}

.pagination__btn:hover:not(:disabled) {
  background: var(--pg-btn-hover-bg);
}

.pagination__btn:focus-visible {
  outline: var(--pg-focus-ring);
  outline-offset: -2px;
}

.pagination__btn:disabled {
  color: var(--pg-btn-disabled-color);
  cursor: default;
}

.pagination__btn--active {
  background: var(--pg-btn-active-bg);
  color: var(--pg-btn-active-color);
}

.pagination__btn--active:hover {
  background: var(--pg-btn-active-bg);
}

.pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--pg-btn-size);
  height: var(--pg-btn-size);
  color: var(--pg-ellipsis-color);
  font-size: 0.875rem;
  user-select: none;
}

/* Mobile: stack layout and enlarge touch targets to 44px */
@media (max-width: 640px) {
  .pagination {
    --pg-btn-size: 2.75rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .pagination__info {
    width: 100%;
    text-align: center;
  }
}

</style>

<style>
/* Dark mode — unscoped so ancestor .dark selector works correctly */
.dark .pagination {
  --pg-btn-color: var(--color-text-secondary, #93baf5);
  --pg-btn-hover-bg: var(--color-surface-hover, #1f2b47);
  --pg-btn-active-bg: var(--color-accent-primary, #3b6fd4);
  --pg-btn-active-color: #ffffff;
  --pg-btn-disabled-color: var(--color-text-disabled, #3a4f6e);
  --pg-info-color: var(--color-text-muted, #6b87b8);
  --pg-ellipsis-color: var(--color-text-muted, #6b87b8);
  --pg-focus-ring: 2px solid var(--color-accent-hover, #5b8fe8);
}
</style>
