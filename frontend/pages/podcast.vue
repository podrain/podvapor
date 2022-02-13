<template>
<div class="mt-4 flex">
  <img :src="podcast.cover_image_url" alt="" class="w-48">
  <div class="ml-3">
    <h1 class="text-3xl">{{ podcast.title }}</h1>
    <h2 class="text-xl mt-3 text-gray-400">Description</h2>
    <p>{{ podcast.description }}</p>
  </div>
</div>

<div class="mt-3 bg-gray-600 p-3 rounded" v-for="ep in episodes">
  <h2 class="text-xl"><Link :href="`/admin/episodes/${ep.id}`" class="text-teal-300">{{ ep.title }}</Link></h2>
  <audio :src="ep.audio.url" controls class="mt-2"></audio>
  <p class="mt-2 italic">{{ ep.description }}</p>
</div>

</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3'
const props = defineProps({
  podcast: Object,
  episodes: Array,
})
</script>

<script>
import layout from '../shared/layout.vue'
export default { layout }
</script>