<template>
<div class="flex h-screen bg-teal-700 text-white">
  <nav class="flex flex-col w-36 bg-teal-800">
    <a class="p-3 hover:bg-teal-900" href="#">Podcasts</a>
    <a class="p-3 hover:bg-teal-900" href="#">Create podcast</a>
    <a class="p-3 hover:bg-teal-900" href="#">Settings</a>
    <Link class="p-3 hover:bg-teal-900" method="post" href="/admin/logout">Logout</Link>
  </nav>
  <div class="p-3">
    <slot />
  </div>
</div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3'
</script>