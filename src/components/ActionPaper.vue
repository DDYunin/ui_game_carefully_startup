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

const value = ref(0);
const picked = ref('sell')

watch(value, (newVal) => {
  emit('update-value', {
    index: props.options.index,
    value: newVal
  });
});

watch(picked, (newPicked) => {
  emit('update-picked', {
    index: props.options.index,
    picked: newPicked
  });
});



</script>


<template>
  <div>
    <input
      type="number"
      class="input"
      v-model="value"
      min="0"
    >
    <label>
      <input type="radio" value="sell" :name="options.name" v-model="picked">
      Продать
    </label>
    <label>
      <input type="radio" value="buy" :name="options.name" v-model="picked">
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