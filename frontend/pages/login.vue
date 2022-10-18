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
      
      <Button class="mt-4" type="submit" :disabled="logging_in">
        <span v-if="logging_in">Logging in...</span>
        <span v-else>Login</span>
      </Button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Inertia } from '@inertiajs/inertia'
import sodium from 'libsodium-wrappers' 
import axios from '../axios'

const props = defineProps({
  errors: String
})

const form = reactive({
  email: null,
  password: null,
})

const logging_in = ref(false)

const submit = async () => {
  const login_worker = new Worker(new URL('/login_worker.js', import.meta.url), {
    type: 'module'
  })

  logging_in.value = true
  await sodium.ready

  const user_details_response = await axios.post('/admin/login-meta', {
    email: form.email
  })

  const user_details = user_details_response.data

  login_worker.postMessage({
    password: form.password,
    salt_base64: user_details.salt,
  })

  login_worker.onmessage = (e) => {
    Inertia.post('/admin/login', {
      email: form.email,
      password_hash: e.data
    }, {
      onFinish: (page) => {
        logging_in.value = false
        login_worker.terminate()
      }
    })
  }
}
</script>