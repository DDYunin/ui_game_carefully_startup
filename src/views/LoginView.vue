<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SettingsCompanies from '@/components/SettingsCompanies.vue';

const router = useRouter();

const teamName = ref('');
const password = ref('');

const enterToGame = () => {
  if (!teamName.value.trim() || !password.value.trim()) {
    return
  }
  router.push({
    name: 'game'
  })
}

const createTeam = () => {
  router.push({
    name: 'team'
  })
}
</script>

<template>
  <div class="container">
    <div class="form">
      <header class="header">Начать игру</header>
      <div class="body">
        <v-text-field
          label="Название команды"
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
          @click="createTeam"
        >
          Создать команду
        </v-btn>
        <v-btn
          @click="enterToGame"
        >
          Войти
        </v-btn>
      </footer>
    </div>
    <SettingsCompanies />
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
  padding: 30px;
}

.footer {
  display: flex;
  column-gap: 20px;
  justify-content: center;
}
</style>