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
import { reactive, ref } from 'vue'
import { Inertia } from '@inertiajs/inertia'
import sodium from 'libsodium-wrappers' 
import axios from 'axios'

const props = defineProps({
  errors: String
})

const form = reactive({
  email: null,
  password: null,
})

const submit = async () => {
  await sodium.ready

  const user_details_response = await axios.post('/admin/login-meta', {
    email: form.email
  })

  const user_details = user_details_response.data

  const salt_bytes = sodium.from_base64(user_details.salt)

  const password_hashed = sodium.crypto_pwhash(
    sodium.crypto_box_SEEDBYTES, 
    form.password, 
    salt_bytes, 
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, 
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT,
    'base64'
  )

  Inertia.post('/admin/login', {
    email: form.email,
    password_hash: password_hashed
  })
}
</script>