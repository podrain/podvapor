<template>
  <div class="flex h-screen justify-center items-center bg-gray-700 text-white">
    <form class="flex flex-col w-64" @submit.prevent="submit">
      <div class="flex flex-col">
        <label for="email">Email</label>
        <input id="email" type="email" class="rounded p-2 text-black" v-model="form.email">
      </div>

      <div class="flex flex-col mt-2">
        <label for="password">Password</label>
        <input id="password" type="password" class="rounded p-2 text-black" v-model="form.password">
      </div>
      
      <Button class="mt-4" type="submit">Login</Button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Inertia } from '@inertiajs/inertia'

const form = reactive({
  email: null,
  password: null,
})

const submit = () => {
  Inertia.post('/admin/login', form)
}
</script>