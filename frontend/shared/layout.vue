<template>
<div class="flex h-screen bg-gray-700 text-white">
  <nav class="flex flex-col min-w-[9rem] bg-gray-600">
    <a class="p-3 hover:bg-gray-500" href="#">Podcasts</a>
    <a class="p-3 hover:bg-gray-500" href="#">Create podcast</a>
    <a class="p-3 hover:bg-gray-500" href="#">Settings</a>
    <Link class="p-3 hover:bg-gray-500" method="post" href="/admin/logout">Logout</Link>
  </nav>
  <div class="p-3 overflow-y-scroll">
    <slot />
  </div>
</div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3'
</script>