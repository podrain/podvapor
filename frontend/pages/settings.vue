<template>
<h1 class="text-3xl">Settings</h1>


<div class="mt-4 flex flex-col">
  <label for="form-title">Site name</label>
  <Input class="mt-1" id="form-title" type="text" v-model="form.siteName" focus />
</div>

<Button class="mt-6" @click="submit">Submit</Button>

</template>

<script setup>
  import { Inertia } from '@inertiajs/inertia'
  import { reactive } from 'vue'

  const props = defineProps({
    siteName: String,
  })

  const form = reactive({
    siteName: props.siteName
  })

  const submit = () => {
    Inertia.put('/admin/settings', form)
  }
</script>

<script>
import layout from '../shared/layout.vue'
export default { layout }
</script>