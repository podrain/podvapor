import { createApp, h } from 'vue'
// import { App, plugin, usePage } from '@inertiajs/inertia-vue3'
// import { Inertia } from '@inertiajs/inertia'
import { router, createInertiaApp, usePage } from '@inertiajs/vue3'
import './app.css'
import Button from './shared/button.vue'
import Input from './shared/input.vue'
import TextArea from './shared/textarea.vue'

const el = document.getElementById('app')
let Pages = import.meta.glob('./pages/**/*.vue')

router.on('before', (event) => {
  if (event.detail.visit.method !== 'get') {
    event.detail.visit.data._csrf_token = usePage().props._csrf_token
  }
})

createInertiaApp({
  resolve:  name => Pages['./pages/'+name+'.vue']().then(bundle => bundle.default),
  setup({ el, App, props, plugin }) {
    createApp({
      render: () => h(App, props)
    }).component('Button', Button).component('Input', Input).component('TextArea', TextArea).use(plugin).mount(el)
  }
})