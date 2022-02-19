<template>
<button class="pv-button" :class="outline && 'pv-button-outline'" type="submit"><slot /></button>
</template>

<script setup>
  const props = defineProps({
    outline: Boolean
  })
</script>