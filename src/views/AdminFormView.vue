<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

    router.push({
      name: 'admin-panel',
    })
  } catch(e) {
    unsuccessSignInNotify.value = true
    console.error(e)
  } finally {
    teamName.value = '';
    password.value = '';
  }
}

const unsuccessSignInNotify = ref(false)

</script>

<template>
  <div class="container">

    <v-dialog
      v-model="unsuccessSignInNotify"
      width="auto"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-emoticon-cry-outline"
        text="Неправильный логин или пароль"
        title="Неудача!"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="unsuccessSignInNotify = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>


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
        <p
          class="error-message"
          v-show="haveError"
        >  {{ errorMessage }}</p>
      </div>
      <footer class="footer">
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
  padding: 30px 20px;
}

.footer {
  display: flex;
  justify-content: center;
}
</style>