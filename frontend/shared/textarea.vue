<template>
<textarea
  class="rounded p-2 bg-gray-800 border border-gray-400 focus:ring focus:border-teal-600" 
  @input="handleInput"
  :value="modelValue"
><slot /></textarea>
</template>

<script setup>
const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>