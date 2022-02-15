import { createApp, h } from 'vue'
import { App, plugin } from '@inertiajs/inertia-vue3'
import { InertiaProgress } from '@inertiajs/progress'
import './app.css'
import Button from './shared/button.vue'
import Input from './shared/input.vue'
import TextArea from './shared/textarea.vue'

InertiaProgress.init()

const el = document.getElementById('app')
let Pages = import.meta.glob('./pages/**/*.vue')

createApp({
  render: () => h(App, {
      initialPage: JSON.parse(el.dataset.page),
      resolveComponent: name => Pages['./pages/'+name+'.vue']().then(bundle => bundle.default),
  })
}).component('Button', Button).component('Input', Input).component('TextArea', TextArea).use(plugin).mount(el)