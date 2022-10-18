<template>
<div class="flex h-screen bg-gray-700 text-white">
  <nav class="flex flex-col min-w-[12rem] bg-gray-600">
    <Link class="p-3 hover:bg-gray-500" :class="{ 'bg-gray-500': $page.url === '/admin/podcasts' }" href="/admin/podcasts">Podcasts</Link>
    <Link class="p-3 hover:bg-gray-500" :class="{ 'bg-gray-500': $page.url === '/admin/settings' }" href="/admin/settings">Settings</Link>
    <Link class="p-3 hover:bg-gray-500" method="post" :data="{ _csrf_token: $page.props._csrf_token }" href="/admin/logout">Logout</Link>
  </nav>
  <div class="p-6 w-full overflow-y-scroll">
    <slot />
  </div>
</div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3'
</script>