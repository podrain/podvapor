<template>
<h1 class="text-3xl">{{ episode.title }}</h1>

<audio :src="episode.audio.url" controls class="mt-3"></audio>

<h2 class="text-xl mt-3 text-gray-400">Description</h2>
<p>{{ episode.description }}</p>

<h2 class="text-xl mt-3 text-gray-400">Notes</h2>
<div v-html="episode.notes" class="prose"></div>
</template>

<script setup>
const props = defineProps({
  episode: Object,
})
</script>

<script>
import layout from '../shared/layout.vue'
export default { layout }
</script>