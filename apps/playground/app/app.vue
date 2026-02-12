<script setup>
const isLoading = ref(true);
const isDark = ref(false);

// Simulate API loading - stops after 2 seconds
setTimeout(() => {
  isLoading.value = false;
}, 2000);

function toggleDark() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
}
</script>
<template>
  <div class="playground" :class="{ dark: isDark }">
    <div class="playground__header">
      <h1>Dashboard UI Playground</h1>
      <button
        class="theme-toggle"
        :class="{ 'theme-toggle--dark': isDark }"
        @click="toggleDark"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <span class="theme-toggle__track">
          <svg class="theme-toggle__icon theme-toggle__icon--sun" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </svg>
          <svg class="theme-toggle__icon theme-toggle__icon--moon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <span class="theme-toggle__thumb" />
        </span>
      </button>
    </div>

    <div class="cards-grid">
      <DStatCard
        title="Revenue"
        value="$12,234"
        trend="up"
        :trend-value="12"
        :clickable="true"
        :loading="isLoading"
      >
        <template #icon>💰</template>
        <template #value="{ formatted }">{{ formatted }} "</template>
      </DStatCard>
      <DStatCard
        title="Users"
        value="1,234"
        trend="down"
        :clickable="true"
        :trend-value="3"
        :loading="isLoading"
      />
      <DStatCard
        title="Orders"
        value="456"
        :loading="isLoading"
        :clickable="true"
      />
      <DStatCard
        title="Conversion"
        value="2.4%"
        trend="neutral"
        :trend-value="0"
        :clickable="false"
        :loading="isLoading"
      />
    </div>

    <h2>Data Table</h2>
    <DDataTable
      :columns="[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'status', label: 'Status', align: 'center' },
      ]"
      :rows="[
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
        { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
        { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: 'Editor', status: 'Active' },
      ]"
      caption="Team members"
      striped
      :loading="isLoading"
    />

    <h2>Badges</h2>
    <div class="badges-grid">
      <DBadge variant="success" dot>Active</DBadge>
      <DBadge variant="danger" dot>Offline</DBadge>
      <DBadge variant="warning">Pending</DBadge>
      <DBadge variant="info" pill>New</DBadge>
      <DBadge variant="default" outline>Draft</DBadge>
      <DBadge variant="success" outline pill>Approved</DBadge>
      <DBadge variant="danger" dismissible>Remove me</DBadge>
      <DBadge size="sm">Small</DBadge>
      <DBadge size="lg" variant="info">Large</DBadge>
    </div>

    <h2>Skeleton Loader</h2>
    <div class="skeleton-demos">
      <div class="skeleton-demo">
        <h3>Text (3 lines)</h3>
        <DSkeletonLoader variant="text" :count="3" />
      </div>
      <div class="skeleton-demo">
        <h3>Circle</h3>
        <DSkeletonLoader variant="circle" />
      </div>
      <div class="skeleton-demo">
        <h3>Rectangle</h3>
        <DSkeletonLoader variant="rect" height="80px" />
      </div>
      <div class="skeleton-demo">
        <h3>Card</h3>
        <DSkeletonLoader variant="card" />
      </div>
      <div class="skeleton-demo">
        <h3>Static (no animation)</h3>
        <DSkeletonLoader variant="text" :animated="false" :count="2" />
      </div>
      <div class="skeleton-demo">
        <h3>Hydration-first</h3>
        <DSkeletonLoader variant="card" hydrate>
          <p style="padding: 1rem; background: #d1fae5; border-radius: 0.75rem;">
            This content appeared after hydration!
          </p>
        </DSkeletonLoader>
      </div>
    </div>

    <h2>Empty State</h2>
    <div class="empty-state-demos">
      <div class="empty-state-demo">
        <h3>Standalone</h3>
        <DEmptyState
          title="No results found"
          description="Try adjusting your search or filters."
        >
          <template #icon>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </template>
        </DEmptyState>
      </div>
      <div class="empty-state-demo">
        <h3>With action</h3>
        <DEmptyState
          title="No projects yet"
          description="Get started by creating your first project."
        >
          <template #icon>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </template>
          <template #action>
            <button class="demo-btn">Create project</button>
          </template>
        </DEmptyState>
      </div>
    </div>

    <h2>Empty Table (DataTable + EmptyState)</h2>
    <DDataTable
      :columns="[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
      ]"
      :rows="[]"
      caption="Empty team table"
    >
      <template #empty>
        <DEmptyState
          title="No team members"
          description="Invite someone to get started."
        >
          <template #icon>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </template>
          <template #action>
            <button class="demo-btn">Invite member</button>
          </template>
        </DEmptyState>
      </template>
    </DDataTable>
  </div>
</template>

<style>
.playground {
  padding: 2rem;
  background: #f3f4f6;
  min-height: 100vh;
  transition: background 0.3s, color 0.3s;
}

.playground.dark {
  background: #111827;
}

.playground__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.playground h1 {
  margin: 0;
  color: #111827;
}

.playground.dark h1 {
  color: #f9fafb;
}

.theme-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 1;
}

.theme-toggle__track {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  position: relative;
  width: 52px;
  height: 28px;
  background: #9ca3af;
  border-radius: 9999px;
  transition: background 0.3s;
}

.theme-toggle--dark .theme-toggle__track {
  background: #6b7280;
}

.theme-toggle__icon {
  z-index: 1;
  color: #f9fafb;
  transition: opacity 0.3s;
}

.theme-toggle--dark .theme-toggle__icon {
  color: #111827;
}

/* Light mode: show moon, hide sun */
.theme-toggle__icon--sun {
  opacity: 0;
}

.theme-toggle__icon--moon {
  opacity: 1;
}

/* Dark mode: show sun, hide moon */
.theme-toggle--dark .theme-toggle__icon--sun {
  opacity: 1;
}

.theme-toggle--dark .theme-toggle__icon--moon {
  opacity: 0;
}

.theme-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: #ffffff;
  border-radius: 50%;
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.theme-toggle--dark .theme-toggle__thumb {
  left: calc(100% - 26px);
  background: #1f2937;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.playground h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #111827;
}

.playground.dark h2 {
  color: #f9fafb;
}

.badges-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.skeleton-demos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.skeleton-demo {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
}

.playground.dark .skeleton-demo {
  background: #1f2937;
}

.skeleton-demo h3 {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.playground.dark .skeleton-demo h3 {
  color: #9ca3af;
}

.empty-state-demos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.empty-state-demo {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
}

.playground.dark .empty-state-demo {
  background: #1f2937;
}

.empty-state-demo h3 {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.playground.dark .empty-state-demo h3 {
  color: #9ca3af;
}

.demo-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.demo-btn:hover {
  background: #2563eb;
}
</style>
