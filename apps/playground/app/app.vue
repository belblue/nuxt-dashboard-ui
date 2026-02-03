<script setup>
const isLoading = ref(true);

// Simulate API loading - stops after 2 seconds
setTimeout(() => {
  isLoading.value = false;
}, 2000);
</script>
<template>
  <div class="playground">
    <h1>Dashboard UI Playground</h1>

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
  </div>
</template>

<style>
.playground {
  padding: 2rem;
  background: #f3f4f6;
  min-height: 100vh;
}

.playground h1 {
  margin-bottom: 1.5rem;
  color: #111827;
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

.badges-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
</style>
