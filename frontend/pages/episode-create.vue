<template>
<Link class="text-teal-200" :href="`/admin/podcasts/${podcast.slug}`">Back to podcast</Link>
<h1 class="text-3xl mt-4">New episode for {{ podcast.title }}</h1>

<div class="mt-4 flex flex-col">
  <label for="form-title">Title</label>
  <Input class="mt-1" id="form-title" type="text" v-model="form.title" focus />
</div>

<div class="flex flex-col mt-6">
  <label for="form-description">Description</label>
  <TextArea id="form-description" class="mt-1" v-model="form.description"></TextArea>
</div>

<div class="mt-6">
  <span>Notes (HTML)</span>
  <div class="mt-1">
    <QuillEditor 
      v-model:content="form.notes"
      content-type="html"
    />
  </div>
</div>

<div class="mt-6">
  <label for="form-audio">Audio file</label>
  <div class="py-3">
    <input id="form-audio" type="file" @change="setAudioFile" />
  </div>
</div>

<div class="mt-3" v-if="audioFile">
  <span class="bg-purple-900 p-2">Loudness: {{ audioFileLoudness }}</span>
</div>

<Button 
  class="mt-6 disabled:bg-teal-500" 
  @click="submitEpisode"
  :disabled="submittingText !== ''"
>{{ submittingText || 'Submit episode'}}</Button>
</template>

<style>
  .ql-container {
    @apply rounded-b border-gray-400 !important;
  }

  .ql-stroke {
    stroke: white !important;
  }

  .ql-picker {
    @apply text-white text-base !important;
  }

  .ql-picker-label:hover {
    @apply bg-teal-500 !important;
  }

  .ql-active {
    @apply bg-teal-600 text-white !important
  }

  .ql-formats > button:hover {
    @apply bg-teal-600 !important
  }

  .ql-picker-item {
    @apply text-black !important
  }

  .ql-toolbar {
    @apply bg-gray-800 border-gray-400 rounded-t !important
  }

  .ql-toolbar *:focus {
  @apply bg-gray-800 !important
  }

  .ql-editor {
    @apply bg-gray-800 text-base rounded-b !important;
  }

  .ql-editor a {
    @apply text-teal-200 !important
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
import { LoudnessMeter } from '@domchristie/needles'

const props = defineProps({
  podcast: Object
})

const audioFile = ref(null)

const form = reactive({
  title: '',
  description: '',
  notes: '',
})

const setAudioFile = async (e) => {
  audioFileLoudness.value = 'Calculating...'
  audioFile.value = e.target.files[0]

  const AudioContext = window.AudioContext || window.webkitAudioContext
  const audioContext = new AudioContext()
  
  const audioData = await audioContext.decodeAudioData(await audioFile.value.arrayBuffer(), (buffer) => {
    const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext
    const offlineAudioContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    )

    const source = offlineAudioContext.createBufferSource()
    source.buffer = buffer

    const loudnessMeter = new LoudnessMeter({
      source,
      workerUri: '/public/needles-worker.js'
    })

    loudnessMeter.on('dataavailable', function (event) {
      audioFileLoudness.value = event.data.value.toFixed(2)
    })

    loudnessMeter.start()
  })
}

const audioFileLoudness = ref('')

const submittingText = ref('')

const submitEpisode = async () => {
  submittingText.value = 'Submitting...'

  const uuid = uuidv4()
  const now = DateTime.now()
  const newFilename = uuid + '.mp3'

  const uploadUrlResponse = await axios.get('/admin/presigned-upload-url/'+newFilename)
  const uploadURL = uploadUrlResponse.data

  const audioArrayBuffer = await audioFile.value.arrayBuffer()

  // ID3 tags

  // Get image
  submittingText.value = 'Downloading image...'
  const podcastImage = await axios.get(props.podcast.cover_image_url, {
    responseType: 'arraybuffer'
  })

  submittingText.value = 'Writing ID3 tags...'
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
      submittingText.value = 'Uploading audio file: '+Math.floor(percentCompleted)+'% complete'
    }
  })

  const cbAudioContext = window.AudioContext || window.webkitAudioContext
  const audioContext = new cbAudioContext()

  submittingText.value = 'Decoding audio data...'
  const audioData = await audioContext.decodeAudioData(writer.arrayBuffer)

  submittingText.value = 'Saving to database...'
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