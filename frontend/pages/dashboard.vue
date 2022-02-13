<template>
  <h1>Hello user {{ user_id }}, Vue is working</h1>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  user_id: String
})
</script>

<script>
import layout from '../shared/layout.vue'
export default { layout }
</script>