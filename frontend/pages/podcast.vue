<template>
<Link href="/admin/podcasts" class="text-teal-200">Back to podcasts</Link>
<div class="mt-6 flex">
  <img :src="podcast.cover_image_url" alt="" class="w-48">
  <div class="ml-6">
    <h1 class="text-3xl">{{ podcast.title }}</h1>
    <p class="mt-3 mb-6">{{ podcast.description }}</p>
    <Link :href="`/admin/podcasts/${podcast.slug}/newepisode`" class="pv-button">New Episode</Link>
  </div>
</div>

<div class="mt-6 bg-gray-600 p-3 rounded" v-for="ep in episodes">
  <h2 class="text-2xl"><Link :href="`/admin/episodes/${ep.id}`" class="text-teal-200">{{ ep.title }}</Link></h2>
  <span class="text-gray-300 italic">{{ ep.published }}</span>
  <audio :src="ep.audio.url" controls class="mt-2"></audio>
  <p class="mt-2 italic text-lg">{{ ep.description }}</p>
</div>

</template>

<script setup>
import { Link } from '@inertiajs/vue3'
const props = defineProps({
  podcast: Object,
  episodes: Array,
})
</script>

<script>
import layout from '../shared/layout.vue'
export default { layout }
</script>