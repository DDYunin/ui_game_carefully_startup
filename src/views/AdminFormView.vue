<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const teamName = ref('');
const password = ref('');

const enterToGame = () => {
  if (!teamName.value.trim() || !password.value.trim()) {
    return
  }
  router.push({
    name: 'admin-panel'
  })
}
</script>

<template>
  <div class="container">
    <div class="form">
      <header class="header">Войти в панель администратора</header>
      <div class="body">
        <v-text-field
          label="Логин"
          v-model="teamName"
        >
        </v-text-field>
        <v-text-field
          type="password"
          label="Пароль"
          v-model="password"
        >
        </v-text-field>
      </div>
      <footer class="footer">
        <v-btn
          @click="enterToGame"
        >
          Войти
        </v-btn>
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
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 24px;
}

.body {
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
}

.footer {
  display: flex;
  justify-content: center;
}
</style>