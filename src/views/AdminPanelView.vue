<script setup>
import { ref } from 'vue';
const teams = ref([
  { 
    name: 'Говноеды', 
    members: ['Володя', 'Саня', 'Костян'], 
    showMembers: false,
    money: 5000,
  },
  { 
    name: 'Дерьмоеды', 
    members: ['Стас', 'Влад'], 
    showMembers: false,
    money: 3000,
  },
]);

const isGameCreated = ref(false); 
const isRegistrationOpen = ref(false)
const isGameStarted = ref(false)

const RoundState = {
  NOT_STARTED: 'Ожидает начала',
  IN_PROGRESS: 'В процессе',
  PAUSED: 'Пауза',
  ENDED: 'Завершен'
};

const roundState = ref(RoundState.NOT_STARTED);


const createGame = () => {
  isGameCreated.value = true; 
};

const openRegistration = () => {
    isRegistrationOpen.value = true;
    teams.value.push
};

const closeRegistration = () => {
    isRegistrationOpen.value = false;
};

const startGame = () => {
    isGameStarted.value = true;
};

const endGame = () => {

};

const activeTeam = ref(null);

const openTeamInfo = (team) => {
  activeTeam.value = team;
};

const closeModal = () => {
  activeTeam.value = null;
};

// Храним номер текущего раунда и его статус
const roundNumber = ref(1); // Начинаем с раунда 1

// Функция для начала раунда
const startRound = () => {
  if(roundState.value == RoundState.ENDED) {
    roundNumber.value += 1;
  }
  roundState.value = RoundState.IN_PROGRESS;
};

// Функция для паузы раунда
const pauseRound = () => {
  roundState.value = RoundState.PAUSED;
};

// Функция для окончания раунда
const endRound = () => {
  roundState.value = RoundState.ENDED;
};




const TransactionState = {
  NOT_STARTED: 'Ожидают начала',
  IN_PROGRESS: 'Торги',
  PAUSED: 'Пауза',
  ENDED: 'Завершены'
};

const transactionState = ref(TransactionState.NOT_STARTED);
const remainingTime = 60;

const startTransaction = () => {
    transactionState.value = TransactionState.IN_PROGRESS;
}

const pauseTransaction = () => {
    transactionState.value = TransactionState.PAUSED;
}

const endTransaction = () => {
    transactionState.value = TransactionState.ENDED;
}



</script>

<template>

<div class="container">
    <header>
        <h1>Панель администратора</h1>
    </header>

    <h2 style="margin-top: 10px;">Игра</h2>
    <!-- Нет активной игры -->
    <div v-if="!isGameCreated" class="no-active-game-section" id="no-active-game-section">
      <div class="no-game-info">
        <p>На текущий момент нет активной игры! Создайте новую игру! </p>
      </div>
      <button id="start-game-btn" @click="createGame">Создать игру!</button>
    </div>

   <!-- Блок для активной игры -->
   <div v-else class="active-game-section" id="game-management-active-game">
      <div>
        <h3 style="margin-top: 10px;">Список команд:</h3>
        <ul class="team-list">
          <li v-for="team in teams" :key="team.name" class="team-item">
            <div @click="openTeamInfo(team)" class="team-name">
                {{team.name}}
            </div>
          </li>
        </ul>
      </div>

      <!-- Модалка для отображения информации о команде -->
    <div v-if="activeTeam" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ activeTeam.name }}</h2>
        <h3>Участники:</h3>
        <ul>
          <li v-for="member in activeTeam.members" :key="member" class="team-member">{{ member }}</li>
        </ul>
        <h3>Деньги: {{ activeTeam.money }} ₽</h3>
        <button @click="closeModal">Закрыть</button>
      </div>
    </div>

    <!-- Кнопки управления открытие и закрытие регистрации -->
      <div style="flex-direction: row;">
        <button v-if="!isGameStarted" class="row-button"
            id="start-registration-teams-btn"
            :disabled="isRegistrationOpen" 
            @click="openRegistration"
            >Открыть регистрацию команд
        </button>
        <button v-if="!isGameStarted" class="row-button"
            id="stop-registration-teams-btn" 
            :disabled="!isRegistrationOpen"
            @click="closeRegistration"
            style="margin-right: 10px;"
            >Закрыть регистрацию команд
        </button>
        <button v-if="!isGameStarted" class="row-button"
            id="start-game-btn" 
            :disabled="isRegistrationOpen"
            @click="startGame"
            >Начать игру
        </button>

        <button v-if="isGameStarted" class="row-button"
            id="start-game-btn" 
            :disabled="isRegistrationOpen"
            @click="endGame"
            >Завершить игру
        </button>
      </div>
    </div>

    <!-- Управление раундом -->
    <div v-if="isGameStarted" class="active-game-section"  id="round-management">
      <h2>Управление раундом</h2>
      <p>Раунд номер: <span class="round-number">{{ roundNumber }}</span></p>
      <p>Статус раунда: <span class="round_state">{{ roundState }}</span></p>
    <div style="flex-direction: row;">
        <button class="row-button"
        id="start-round-btn" 
        :disabled="roundState == RoundState.IN_PROGRESS"
        @click="startRound"
        >Начать раунд
        </button>
      <button class="row-button"
       id="pause-round-btn"
       :disabled="roundState != RoundState.IN_PROGRESS"
       @click="pauseRound" 
       >Пауза
    </button>
      <button class="row-button"
      id="end-round-btn" 
      :disabled="roundState == RoundState.ENDED || roundState == RoundState.NOT_STARTED"
      @click="endRound" 
      >Закончить раунд
    </button>
        </div>
    </div>

    <!-- Управление транзакциями -->
    <div v-if="isGameStarted" id="trade-management">
      <h2>Управление торгами</h2>
      <p>Статус торгов: <span class="transation_state">{{ transactionState }}</span></p>
      <p>Оставшееся время торгов: <span class="status" id="trade-timer">{{ remainingTime }}</span></p>

      <button 
        id="start-trade-btn" 
        class="row-button"
        :disabled="transactionState == TransactionState.IN_PROGRESS"
        @click="startTransaction"
        >Начать торги
    </button>
      <button 
      id="pause-trade-btn"
       class="row-button"
       :disabled="transactionState != TransactionState.IN_PROGRESS"
       @click="pauseTransaction"
       >
       Пауза торгов
    </button>
      <button 
      id="end-trade-btn" 
      class="row-button"
      @click="endTransaction"
      :disabled="transactionState == TransactionState.ENDED || transactionState == TransactionState.NOT_STARTED"
      >Завершить торги
    </button>
    </div>

    <!-- История раундов для отката раундов -->
    <div v-if="isGameStarted" class="section" id="log-section">
      <h2>История раундов</h2>
      <div class="log" id="action-log"></div>
      <button id="restore-state-btn" disabled>Restore Previous State</button>
    </div>
  </div>
</template>

<style scoped>
    .container {
      display: flex;
      flex-direction: column;
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }

    /* Стили команд */
    .team-list {
        margin-top: 5px;
        list-style-type: none; 
        padding-left: 0;
    }
    .team-item {
        padding: 10px;
    }
    .team-name {
        font-weight: bold;
        cursor: pointer;
    }
    .team-member {
        list-style-type: none; 
        padding: 5px;
    }

    .row-button {
        margin-right: 10px;
        margin-top: 5px;
    }
    
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      margin-bottom: 10px;
    }
    button {
      background-color: #007BFF;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
    .log {
      border: 1px solid #ccc;
      padding: 10px;
      height: 200px;
      overflow-y: auto;
      background: #f9f9f9;
    }
    .status {
      font-weight: bold;
    }
    .game-management-section {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .no-game-info {
    padding: 10px;
    background-color: #fff4f4;
    color: #d9534f;
    border: 1px solid #d9534f;
    border-radius: 5px;
    margin-bottom: 15px;
    margin-top: 10px;
    font-size: 16px;
  }

  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  text-align: center;
}
</style>