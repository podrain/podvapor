import axios from 'axios'
import { usePage } from '@inertiajs/vue3'

const instance = axios.create()
instance.interceptors.request.use((config) => {
  if (config.method !== 'get') {
    config.data._csrf_token = usePage().props._csrf_token
  }
  return config
})

export default instance