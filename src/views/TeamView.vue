<script setup>
import { ref } from 'vue';

const items = ref(
  [
    { text: 'Петров Иван'},
    { text: 'Петров Илья'},
    { text: 'Петров Максим'},
  ]);
</script>

<template>
  <div class="container">
    <div class="form">
      <header class="header">Настройка команды</header>
      <div>
        <v-list class="list">
          <v-list-subheader class="list__title">Участники команды</v-list-subheader>

          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            color="primary"
          >
          <template v-slot:append>
            <v-icon icon="mdi-close"></v-icon>
          </template>
            {{ item.text }}
          </v-list-item>
        </v-list>
        <v-btn
          density="compact"
          icon="mdi-plus"
        >
        </v-btn>
      </div>
      <footer>
        <p>Ваш баланс 600 у.е.</p>
        <p>Ожидайте начало игры</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 600px;
  border: 1px solid black;
  border-radius: 20px;
  padding: 20px;
}

.header {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}

.list {
  border: 1px solid black;
  border-radius: 10px;
}

.list__title {
  font-weight: bold;
  color: black;
  font-size: 20px;
}
</style>