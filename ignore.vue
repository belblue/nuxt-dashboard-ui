
<script>
watch(source, (newValue, oldValue) => { })
```

**`v-model` on components:**
```
Parent: v-model="value"
Child: defineProps(['modelValue']) + emit('update:modelValue')
</script>
<template>

<ChilInput v-model="searchText"/>
</template>

CHildren 
<script>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
:class="{ className: booleanCondition }"
            ↑              ↑
         'active'      isActive (true/false)
</script>

<template>
  <!-- Single conditional class -->
  <div :class="{ active: isActive }">

  <!-- Multiple conditional classes -->
  <div :class="{ active: isActive, error: hasError, large: isLarge }">

  <!-- Combined with static class -->
  <div class="btn" :class="{ active: isActive }">

  <!-- Using ternary (alternative) -->
  <div :class="isActive ? 'active' : 'inactive'">
</template>
<script setup>
const route = useRoute()    // Read: "Where am I?"
const router = useRouter()  // Act: "Take me somewhere"

// Reading
const userId = route.params.id

// Navigating
router.push('/about')
router.back()
// 1. Declare (array of event names)
const emit = defineEmits(['eventName', 'anotherEvent'])

// 2. Emit (event name + optional data)
emit('eventName', dataToSend)
const emit = defineEmits<{
  delete: [itemId: number]
}>()
</script>

watch(searchQuery(newVlue,Olvalue)=> {console.log(newValue)})