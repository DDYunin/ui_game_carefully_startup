<script setup>
</script>

<template>
  <div class="container">
    <div class="form">
      <header class="header">Начать игру</header>
      <div class="body">
        <div>
          <label for="name">Название команды</label>
          <input type="text" id="name">
        </div>
        <div>
          <label for="password">Пароль</label>
          <input type="password" id="password">
        </div>
      </div>
      <footer class="footer">
        <button class="button">Создать команду</button>
        <button class="button">Войти</button>
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
  padding-top: 20px;
}

.button {
  padding: 10px 15px;
  cursor: pointer;
}
</style>