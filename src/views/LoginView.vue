<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { API } from '@/api/api-service';
import { useAuthStore } from '@/stores/authStore'


const router = useRouter();

const authStore = useAuthStore();

const teamName = ref('');
const password = ref('');
const haveError = ref(false);
const errorMessage = ref('');

const disabledButton = computed(() => {
  return !(teamName.value.length && password.value.length);
});

const enterToGame = async () => {
  try {
    await authStore.signIn({
      teamName: teamName.value,
      password: password.value
    });
    localStorage.setItem('teamName', teamName.value);
    localStorage.setItem(teamName.value, Date.now());
    router.push({
      name: 'team',
    })
  } catch(e) {
    haveError.value = true;
    errorMessage.value = 'Ошибка на этапе входа';
    setTimeout(() => {
      haveError.value = false
    }, 5000)
    console.error(e)
  } finally {
    teamName.value = '';
    password.value = '';
  }
}


const createTeam = async () => {
  try {
    await API.registration({
      teamName: teamName.value,
      password: password.value
    });
    alert('Команда успешно создана');
  } catch(e) {
    haveError.value = true;
    errorMessage.value = 'Ошибка на этапе регистрации';
    setTimeout(() => {
      haveError.value = false
    }, 5000)
    console.error(e)
  } finally {
    teamName.value = '';
    password.value = '';
  }

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
        <p
          class="error-message"
          v-show="haveError"
        >  {{ errorMessage }}</p>
      </div>
      <footer class="footer">
        <v-btn
          :disabled="disabledButton"
          @click="createTeam"
        >
          Создать команду
        </v-btn>
        <v-btn
          :disabled="disabledButton"
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
  padding: 30px;
}

.footer {
  display: flex;
  column-gap: 20px;
  justify-content: center;
}

.error-message {
  color: red;
  font-size: 20px;
}
</style>