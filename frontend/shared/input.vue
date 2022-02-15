<template>
  <input
    ref="inputElement"
    class="rounded p-2 bg-gray-800 border border-gray-400 focus:ring focus:border-teal-600" 
    @input="handleInput"
    :value="modelValue"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: String,
  focus: Boolean
})

const emit = defineEmits(['update:modelValue'])

const inputElement = ref(null)

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}

onMounted(() => {
  if (props.focus) {
    inputElement.value.focus()
  }
})
</script>