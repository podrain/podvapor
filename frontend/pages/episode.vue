<template>
<Link class="text-teal-200" :href="`/admin/podcasts/${podcast.slug}`">Back to podcast</Link>
<h1 class="text-3xl">{{ episode.title }}</h1>

<audio :src="episode.audio.url" controls class="mt-3"></audio>

<h2 class="text-xl mt-3 text-gray-400">Description</h2>
<p>{{ episode.description }}</p>

<h2 class="text-xl mt-3 text-gray-400">Notes</h2>
<div v-html="episode.notes" class="prose"></div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3'
const props = defineProps({
  podcast: Object,
  episode: Object,
})
</script>

<script>
import layout from '../shared/layout.vue'
export default { layout }
</script>