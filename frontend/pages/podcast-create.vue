<template>
<Link href="/admin/podcasts" class="text-teal-200">Back to podcasts</Link>
<h1 class="text-3xl mt-4">Create new podcast</h1>

<div class="mt-4 flex flex-col">
  <label for="form-title">Title</label>
  <Input class="mt-1" id="form-title" type="text" v-model="form.title" focus />
</div>

<div class="mt-4 flex flex-col">
  <label for="form-slug">Slug</label>
  <Input class="mt-1" id="form-slug" type="text" v-model="form.slug" />
</div>

<div class="mt-4 flex flex-col">
  <label for="form-description">Description</label>
  <TextArea class="mt-1" id="form-description" type="text" v-model="form.description" />
</div>

<div class="mt-4 flex flex-col w-1/4">
  <label for="form-slug">Categories</label>
  <div v-for="cat in form.categories" :key="cat.id" class="flex mt-2">
    <Input class="flex-1" id="form-slug" type="text" v-model="cat.name" />
    <Button outline class="ml-2 w-12" @click="removeCategory(cat.id)">X</Button>
  </div>
  <Button class="mt-2" outline @click="addCategoryField">Add Category</Button>
</div>

<div class="mt-4 flex flex-col">
  <label for="form-owner">Owner</label>
  <div class="flex">
    <div class="flex flex-col w-1/4">
      <label for="form-owner-name" class="italic">Name</label>
      <Input class="mt-1" id="form-owner" type="text" v-model="form.owner.name" />
    </div>

    <div class="flex flex-col w-1/4 ml-2">
      <label for="form-owner-email" class="italic">Email</label>
      <Input class="mt-1" id="form-email" type="text" v-model="form.owner.email" />
    </div>
  </div>
</div>

<div class="mt-4 flex flex-col">
  <label for="form-author">Author</label>
  <Input class="mt-1" id="form-author" type="text" v-model="form.author" />
</div>

<div class="mt-4 flex flex-col">
  <label for="form-copyright">Copyright</label>
  <Input class="mt-1" id="form-slug" type="text" v-model="form.copyright" />
</div>

<div class="mt-6">
  <label for="form-image">Cover image</label>
  <div class="py-3">
    <input id="form-image" type="file" @change="setImageFile" />
  </div>
</div>

<Button class="mt-4" @click="submitPodcast">Save podcast</Button>

</template>

<script setup>
import { Inertia } from '@inertiajs/inertia'
import { Link } from '@inertiajs/inertia-vue3'
import { reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import axios from '../axios'

const form = reactive({
  id: uuidv4(),
  title: '',
  slug: '',
  description: '',
  categories: [
    {
      id: uuidv4(),
      name: ''
    }
  ],
  owner: {
    name: '',
    email: ''
  },
  author: '',
  copyright: '',
})

const imageFile = ref(null)
const setImageFile = (e) => {
  imageFile.value = e.target.files[0]
}

const newCategoryName = ref('')

const addCategoryField = () => {
  form.categories.push({
    id: uuidv4(),
    name: newCategoryName.value
  })

  newCategoryName.value = ''
}

const removeCategory = (id) => {
  const index = form.categories.findIndex(cat => cat.id === id)
  form.categories.splice(index, 1)
}

const submitPodcast = async () => {
  const newFilename = form.id + '.png'
  const uploadUrlResponse = await axios.get('/admin/presigned-upload-url-images/'+newFilename)
  const uploadURL = uploadUrlResponse.data

  await axios.put(uploadURL, imageFile.value, {
    headers: {
      'Content-Type': 'image/png',
      'x-amz-acl': 'public-read'
    },

    onUploadProgress: (progressEvent) => {
      const percentCompleted = (progressEvent.loaded * 100) / progressEvent.total
    }
  })

  form.cover_image_url = '/images/'+newFilename

  Inertia.post('/admin/podcasts', form)
}

</script>

<script>
import layout from '../shared/layout.vue'
export default { layout }
</script>