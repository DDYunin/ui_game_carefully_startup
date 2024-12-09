<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { API } from '@/api/api-service';
import { jwtDecode } from "jwt-decode";


const router = useRouter();


const tokens = JSON.parse(localStorage.getItem('userTokens'))
const { sub: teamId, name: teamName} = jwtDecode(tokens.token);


console.log(teamName, teamId);

const items = ref([]);

onMounted(async () => {
  try {
    const { data } = await API.getTeam({
      teamId
    });
    if (data.members) {
      items.value = data.members.map((item, index) => {
        return {
          member: item,
          id: index
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
})


const isReady = ref(false);
const toggleReady = (on) => {
  isReady.value = false;
  if (on) {
    isReady.value = true;
  }
}

const deletePlayer = (delPlayerId) => {
  items.value = items.value.filter(player => {
    return player.id !== delPlayerId
  })
}

const playerName = ref('');
const playerSurName = ref('');

const isDialogOpen = ref(false);
const addPlayer = () => {
  const name = playerName.value.trim();
  const surname = playerSurName.value.trim();
  console.log(name, surname);
  if (
    name === '' ||
    surname === ''
  ) {
    return;
  }
  items.value.push({
    id: Date.now(),
    member: [name,surname].join(' ')
  })
  playerName.value = '';
  playerSurName.value = '';
  isDialogOpen.value = false
}

const updateTeam = async () => {
  try {
    await API.updateTeam({
      id: teamId,
      name: teamName,
      members: items.value.map(item => item.member)
    })
    console.log('Победа')
    toggleReady(true)
  } catch (e) {
    console.error(e)
  }
}

</script>

<!-- <v-btn
append-icon="mdi-keyboard-backspace"
@click="router.push({name: 'home'})"
:style="{
  marginBottom: '30px'
}"
>
Назад
</v-btn> -->

<template>
  <div class="container">
    <div class="form">
      <header class="header">Настройка команды</header>
      <div class="body">
        <v-list class="list">
          <v-list-subheader class="list__title">Участники команды</v-list-subheader>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            class="list__item"
          >
          <template v-slot:append>
            <v-icon
              icon="mdi-close"
              class="list__delete-icon"
              @click="deletePlayer(item.id)"
            ></v-icon>
          </template>
            {{ item.member }}
          </v-list-item>
        </v-list>
        <div class="body__buttons">
          <v-btn
            append-icon="mdi-plus"
            @click="isDialogOpen = true"
          >
            Добавить
          </v-btn>
          <v-btn
            v-if="!isReady"
            @click="updateTeam"
            color="light-green-lighten-3"
          >
            Подтвердить
          </v-btn>
          <v-btn
            v-else
            @click="toggleReady(false)"
            color="red-darken-2"
          >
            Отменить
          </v-btn>
        </div>
      </div>
      <footer class="footer">
        <p>
          Ваш баланс: <span :style="{fontWeight: 700}">600 у.е.</span> </p>
        <p
          v-if="isReady"
        >
          Ожидайте начала игры
          <v-progress-circular
            indeterminate="disable-shrink"
            size="16"
            width="2"
          >
          </v-progress-circular>
        </p>
      </footer>
    </div>
    <v-dialog
      max-width="500"
      v-model="isDialogOpen"
    >
        <v-card
          title="Добавить участника"
        >
        <div
          class="dialog"
        >
          <v-text-field
            label="Имя"
            required
            v-model="playerName"
          ></v-text-field>
          <v-text-field
            label="Фамилия"
            required
            v-model="playerSurName"
          ></v-text-field>
        </div>
          <v-card-actions>
            <v-btn
              @click="isDialogOpen = false"
              color="red-darken-2"
            >Закрыть</v-btn>
            <v-btn
              @click="addPlayer"
              color="light-green-lighten-3"
            >Добавить</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
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

.body {
  margin-bottom: 30px;
}

.body__buttons {
  display: flex;
  column-gap: 20px;
}

.list {
  border: 1px solid black;
  border-radius: 10px;
  margin-bottom: 20px;
}

.list__title {
  font-weight: bold;
  color: black;
  font-size: 20px;
}

.list__item {
  color: black;
  font-size: 18px;
}

.list__delete-icon {
  color: red;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  font-size: 20px;
}

.dialog {
  padding: 0 30px;
}
</style>