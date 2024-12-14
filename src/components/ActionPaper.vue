<script setup>
import { ref, watch } from 'vue';


const props = defineProps({
  options: {
    type: Object,
    required: true
  }
});

const emit = defineEmits([
  'update-value',
  'update-picked'
])

const numberValue = defineModel('numberValue')
const radioValue = defineModel('radioValue')


</script>


<template>
  <div>
    <input
      type="number"
      class="input"
      v-model="numberValue"
      min="0"
    >
    <label>
      <input
        type="radio"
        value="sell"
        :name="options.name"
        v-model="radioValue"
      >
      Продать
    </label>
    <label>
      <input
        type="radio"
        value="buy"
        :name="options.name"
        v-model="radioValue"
      >
      Купить
    </label>
  </div>
</template>



<style scoped>

.input {
  border: 1px solid black;
  width: 100px;
  height: 22px;
}

</style>