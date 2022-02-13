<template>
<h1 class="text-3xl">Podcasts</h1>

<div class="mt-4 flex" v-for="pc in podcasts">
  <img :src="pc.cover_image_url" alt="" class="w-48">
  <div class="ml-3">
    <h2 class="text-2xl"><Link :href="`/admin/podcasts/${pc.slug}`" class="text-teal-200">{{ pc.title }}</Link></h2>
    <p class="mt-3">{{ pc.description }}</p>
  </div>
</div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3'
const props = defineProps({
  podcasts: Array
})
</script>

<script>
import layout from '../shared/layout.vue'
export default { layout }
</script>