<template>
  <div class="flex h-screen justify-center items-center bg-gray-700 text-white">
    <form class="flex flex-col w-64" @submit.prevent="submit">
      <div
        v-if="errors"
        class="bg-red-300 text-black p-2 mb-2 rounded"
      >
        {{ errors }}
      </div>
      <div class="flex flex-col">
        <label for="email">Email</label>
        <Input id="email" type="email" v-model="form.email" />
      </div>

      <div class="flex flex-col mt-2">
        <label for="password">Password</label>
        <Input id="password" type="password" v-model="form.password" />
      </div>
      
      <Button class="mt-4" type="submit">Login</Button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Inertia } from '@inertiajs/inertia'

const props = defineProps({
  errors: String
})

const form = reactive({
  email: null,
  password: null,
})

const submit = () => {
  Inertia.post('/admin/login', form)
}
</script>