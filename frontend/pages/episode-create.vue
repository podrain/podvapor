<template>
<Link class="text-teal-200" :href="`/admin/podcasts/${podcast.slug}`">Back to podcast</Link>
<h1 class="text-3xl mt-4">New episode for {{ podcast.title }}</h1>

<div class="mt-4 flex flex-col">
  <label for="form-title">Title</label>
  <input ref="formTitle" id="form-title" type="text" class="rounded p-2 text-black" v-model="form.title">
</div>

<div class="flex flex-col mt-6">
  <label for="password">Description</label>
  <textarea id="password" type="password" class="rounded p-2 text-black" v-model="form.description"></textarea>
</div>

<div class="mt-6">
  <span>Notes (HTML)</span>
  <QuillEditor 
    v-model:content="form.notes"
    content-type="html"
  />
</div>

<div class="mt-6">
  <label for="form-audio">Audio file</label>
  <div class="py-3">
    <input id="form-audio" type="file" @change="setAudioFile" />
  </div>
</div>

<Button class="mt-6" @click="submitEpisode">Submit episode</Button>
</template>

<style>
  /* .ql-stroke {
    stroke: white !important;
  }

  .ql-picker {
    color: white !important;
  }

  .ql-picker-label:hover {
    background-color: black !important;
  }

  .ql-active {
    @apply bg-teal-500 !important
  }

  .ql-formats > button:hover {
    @apply bg-teal-600 !important
  }

  .ql-picker-item {
    @apply text-black !important
  } */

  .ql-toolbar {
    @apply bg-white !important
  }

  .ql-editor {
    @apply bg-white text-black !important;
  }
</style>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Link } from '@inertiajs/inertia-vue3'
import { Inertia } from '@inertiajs/inertia'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'
import axios from 'axios'
import ID3Writer from 'browser-id3-writer'

const props = defineProps({
  podcast: Object
})

const formTitle = ref(null)
const audioFile = ref(null)

const form = reactive({
  title: '',
  description: '',
  notes: '',
})

onMounted(() => {
  formTitle.value.focus()
})

const setAudioFile = (e) => {
  audioFile.value = e.target.files[0]
}

const submitEpisode = async () => {
  const uuid = uuidv4()
  const now = DateTime.now()
  const newFilename = uuid + '.mp3'

  const uploadUrlResponse = await axios.get('/admin/presigned-upload-url/'+newFilename)
  const uploadURL = uploadUrlResponse.data

  const audioArrayBuffer = await audioFile.value.arrayBuffer()

  // ID3 tags

  // Get image
  const podcastImage = await axios.get(props.podcast.cover_image_url, {
    responseType: 'arraybuffer'
  })

  const writer = new ID3Writer(audioArrayBuffer)
  writer.setFrame('TIT2', form.title)
    .setFrame('TALB', props.podcast.title)
    .setFrame('TYER', now.toFormat('yyyy'))
    .setFrame('TPE1', [props.podcast.owner.name])
    .setFrame('APIC', {
      type: 3,
      data: podcastImage.data,
      description: props.podcast.title + ' cover art'
    })
  
  writer.addTag()

  const audioFileSize = writer.arrayBuffer.byteLength

  await axios.put(uploadURL, writer.arrayBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'x-amz-acl': 'public-read'
    },

    onUploadProgress: (progressEvent) => {
      const percentCompleted = (progressEvent.loaded * 100) / progressEvent.total

      console.log(percentCompleted)
    }
  })

  const cbAudioContext = window.AudioContext || window.webkitAudioContext
  const audioContext = new cbAudioContext()

  const audioData = await audioContext.decodeAudioData(writer.arrayBuffer)

  Inertia.post('/admin/podcasts/create', {
    id: uuid,
    title: form.title,
    description: form.description,
    notes: form.notes,
    audio: {
      length: audioFileSize,
      type: 'audio/mpeg',
      url: uploadURL.split('?')[0]
    },
    duration: Math.ceil(audioData.duration),
    published: now.toFormat('yyyy-LL-dd HH:mm:ss'),
    podcast_id: props.podcast.id
  })
}
</script>

<script>
import layout from '../shared/layout.vue'
export default { layout }
</script>