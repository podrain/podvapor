import { createApp, h } from 'vue'
import { App, plugin } from '@inertiajs/inertia-vue3'
import './app.css'
import Button from './shared/button.vue'

const el = document.getElementById('app')
let Pages = import.meta.glob('./pages/**/*.vue')

createApp({
  render: () => h(App, {
      initialPage: JSON.parse(el.dataset.page),
      resolveComponent: name => Pages['./pages/'+name+'.vue']().then(bundle => bundle.default),
  })
}).component('Button', Button).use(plugin).mount(el)