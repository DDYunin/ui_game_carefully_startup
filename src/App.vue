<script setup>
import { RouterView } from 'vue-router'

import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

const checkUser = () => {
  const tokens = JSON.parse(localStorage.getItem('userTokens'))
  if (tokens) {
    authStore.userInfo.token = tokens.token
    authStore.userInfo.refreshToken = tokens.refreshToken
  }
  console.log(authStore.userInfo)
}

checkUser()
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  width: 100%;
  padding: 15px;
}
</style>
