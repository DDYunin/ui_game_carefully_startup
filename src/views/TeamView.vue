<script setup>

</script>

<template>
  <div class="container">
    <div class="form">
      <header class="header">Настройка команды</header>
      <div>
        <div>Участники команды</div>
        <ul></ul>
        <button>Добавить</button>
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
</style>