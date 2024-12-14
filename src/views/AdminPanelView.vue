<script setup>
import { onMounted,ref } from 'vue';
import SettingsCompanies from '@/components/SettingsCompanies.vue';
import { API } from '@/api/api-service';

const teams = ref([
  { 
    name: 'Команда 1', 
    members: ['Володя', 'Саня', 'Костян'], 
    showMembers: false,
    shares: [
      {
        name: "Средние рога",
        price: 100,
        count: 10
      },
      {
        name: "Большие рога",
        price: 200,
        count: 10
      },
      {
        name: "Маленькие рога",
        price: 50,
        count: 3
      }

    ],
    money: 5000
  },
  { 
    name: 'Команда 2', 
    members: ['Стас', 'Влад'], 
    shares: [

    ],
    showMembers: false,
    money: 3000
  },
]);

const teamsShortInfo = ref([
])


// --------------------------- Инициалиация игры -------------------------------------
const isGameCreated = ref(false); 
const isRegistrationOpen = ref(false)
const isGameStarted = ref(false)

onMounted(async () => {
  getCompanies()

  try {
    const {data} = await API.getGame();
    console.log(data);
    if(data.state == 3) {
      // Игра завершена или не началась. Сбрасываем все 
      isGameCreated.value = false;
      isRegistrationOpen.value = false;
      isGameStarted.value = false;
      needSettingsButton.value = false;
    } else if(data.state == -1) { // 
      getTeams();
      needSettingsButton.value = true;
      isGameCreated.value = true;
      isRegistrationOpen.value = false;
    } else if(data.state == 2) {
      isGameStarted.value = true;
      isGameCreated.value = true;
      needSettingsButton.value = false;
      getTeams();
      // Видимо перезагрузили страничку и игра уже идет, поэтому нужно обновить всю инфу по командам и компаниям
    } else if(data.state == 1) {
      isGameCreated.value = true;
      isRegistrationOpen.value = true;
      teamFetcher.value = setInterval(() => { getTeams() }, 5000);
      needSettingsButton.value = true;
    }
  } catch(e) {
    console.error(e);
  } finally {

  }

})

const teamFetcher = ref(null);

const getTeams = async() => {
  try {
    const { data } = await API.getTeams();
    console.log(data);
    teamsShortInfo.value = data.data;
  } catch(e) {
    console.log(e);
  }
}

const createGame = async() => {
  try {
    const {data} = await API.createGame();
    isGameCreated.value = true;
    isRegistrationOpen.value = false;
    console.log(data);
    needSettingsButton.value = true
  } catch(e) {
    console.log(e);
  }

};

const openRegistration = async() => {
  try {
    const {data} = await API.openRegistration();
    teamFetcher.value = setInterval(() => { getTeams() }, 5000);
    isGameCreated.value = true;
    isRegistrationOpen.value = true;
  } catch(e) {
    console.log(e);
  }
    isRegistrationOpen.value = true;
    teams.value.push
};

const closeRegistration =  async() => {
    try{
      await API.stopRegistration();
      isRegistrationOpen.value = false;
      clearInterval(teamFetcher.value);
    } catch(e) {

    }
};

const startGame = async () => {
    try {
      const {data} = await API.startGame();
      isGameStarted.value = true;
      isGameCreated.value = true;
      needSettingsButton.value = false
      console.log(data);
    } catch(e) {
      console.log(e);
    }  
};

const endGame = async () => {
  try {
    const {data} = await API.stopGame();
      isGameCreated.value = false;
      isRegistrationOpen.value = false;
      isGameStarted.value = false;
      needSettingsButton.value = false
      teamsShortInfo.value = [];
    console.log(data);
  } catch(e) {
    console.log(e);
  }
  
};

const activeTeam = ref(null);

const openTeamInfo = async (teamId) => {
  const response = await API.getTeam({teamId})
  if (response.status != 200 ) {
    alert("error on load companies")
    return
  }
  debugger
  activeTeam.value = response.data
  if (response.data.shares) {
    const companyIds = Object.keys(response.data.shares)
    const companyShareCount = Object.values(response.data.shares)
    activeTeam.value.shares = []
    for (let i = 0; i < companyIds.length; i++) {
      const company = getCompanyById(Number(companyIds[i]))
      const item = {
        companyName: company.name,
        count: companyShareCount[i],
        cost: company.shares[roundNumber.value]
      }
      activeTeam.value.shares.push(item)
    }
    console.log(activeTeam.value)
  } else {
    console.log("bad response - empty shares")
  }
};

const companies = ref([])

async function getCompanies() {
  try {
    const response = await API.getCompanies();
    if (response.status != 200) {
      alert("error on load companies")
      return
    }
    companies.value = response.data.data
  } catch (e) {
    console.error(e);
  }
}

function getCompanyById(id) {
  return companies.value.find((item) => item.id === id)
}

const closeModal = () => {
  activeTeam.value = null;
};

const totalMoney = (activeTeam) => {
  const sharesTotal = activeTeam.shares.reduce((total, share) => {
    return total + (share.cost * share.count); 
  }, 0);

  return sharesTotal + activeTeam.balanceAmount;
};

// ----------------------- Shares Load --------------------------



// --------------------------- Управление раундом -------------------------------------

const RoundState = {
  NOT_STARTED: 'Ожидает начала',
  IN_PROGRESS: 'В процессе',
  ENDED: 'Завершен'
};

const roundState = ref(RoundState.NOT_STARTED);
const roundNumber = ref(1); 

// Функция для начала раунда
const startRound = async() => {
  await API.startRound();
  if(roundState.value == RoundState.ENDED) {
    roundNumber.value += 1;
  }
  roundState.value = RoundState.IN_PROGRESS;
  transactionState.value = TransactionState.NOT_STARTED;
};


const endRound = async () => {
  await API.stopRound();
  roundState.value = RoundState.ENDED;
};

// --------------------------- Управление транзакциями -------------------------------------

const TransactionState = {
  NOT_STARTED: 'Ожидают начала',
  IN_PROGRESS: 'Торги',
  PAUSED: 'Пауза',
  ENDED: 'Завершены'
};

const transactionState = ref(TransactionState.NOT_STARTED);

const defaultTransactionDuration = 300; // Длительность таймера
const remainingDurationTime = ref(defaultTransactionDuration); // Оставшееся время
const timer = ref(null);

const startTransaction = async() => {
    await API.startTrade();
    transactionState.value = TransactionState.IN_PROGRESS;
    if (!timer.value) {
      timer.value = setInterval(() => {
        if (remainingDurationTime.value > 0) {
          remainingDurationTime.value -= 1;
        } else {
          endTransaction();
        }
      }, 1000);
    }
}

const pauseTransaction = () => {
    transactionState.value = TransactionState.PAUSED;
    clearInterval(timer.value);
    timer.value = null;
}

const endTransaction = async () => {
    await API.stopTrade();
    transactionState.value = TransactionState.ENDED;
    remainingDurationTime.value = defaultTransactionDuration;
    clearInterval(timer.value);
    timer.value = null;
    // Вызов метоад на бек об окончании торгов

}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};



const settingsModalIsOpened = ref(false)
const settings = ref({})
const needSettingsButton = ref(false)

async function openSettingsModal() {
  settingsModalIsOpened.value = true
  try {
    const {data} = await API.getSetting();  
    settings.value = data
  } catch(e) {
    console.log(e);
  }
}

async function closeSettingsModal(needSaveSettings) {
  settingsModalIsOpened.value = false
  if (!needSaveSettings) {
    return
  }

  try {
    await API.updateSetting(settings.value);  
  } catch(e) {
    console.log(e);
  }
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

   <!-- Список команд -->
   <div v-else class="active-game-section" id="game-management-active-game">
      <div>
        <h3>Список команд:</h3>
      <v-card 
        max-width="500"
        class="my-4"
        style="text-align: left;" >
        <v-list>
          <v-list-item 
            v-for="(teamShortInfo, index) in teamsShortInfo" 
            :key="index"
            @click="openTeamInfo(teamShortInfo.id)">
              <v-list-item-content>
                <v-list-item-title style="font-weight: bold;">{{ teamShortInfo.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </v-list>
      </v-card>
      </div>

      <!-- Модалка для отображения информации о команде -->
    <div v-if="activeTeam" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ activeTeam.name }}</h2>
        <h3>Участники:</h3>
        <ul>
          <li v-for="member in activeTeam.members" :key="member" class="team-member">{{ member }}</li>
        </ul>
        <h3>Акции: </h3>
        <table class="team-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество</th>
            <th>Стоимость одной штуки</th>
            <th>Общая стоимость</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(share, index) in activeTeam.shares" :key="index">
            <td>{{ share.companyName }}</td>
            <td>{{ share.count }}</td>
            <td>{{ share.cost }}</td>
            <td>{{ share.count * share.cost }}</td>
          </tr>
        </tbody>
      </table>

        <h3 style="text-align: left; margin-top: 15px;">Оставшиеся деньги: {{ activeTeam.balanceAmount }} </h3>
        <h3 style="text-align: left;">Суммарный капитал: {{ totalMoney(activeTeam) }} </h3>
        <button style="margin-top: 10px;" @click="closeModal">Закрыть</button>
      </div>
    </div>


    <button v-if="needSettingsButton" class="row-button" @click="openSettingsModal">  Настройки </button>

    <div class="modal-overlay" v-if="settingsModalIsOpened">
      <div class="settings-modal">
        <h2>Настройки</h2>
        <table class="settings-table" >
          <tr>
            <td class="settings-table-item"> Количество раундов </td>
            <td class="settings-table-item"> {{settings.roundsCount}} </td>
          </tr>
          <tr style="margin-top: 20px;">
            <td class="settings-table-item"> Продолжительность торгов </td>
            <td class="settings-table-item"> {{settings.roundsDuration}} </td>
          </tr>
          <tr style="margin-top: 20px;">
            <td class="settings-table-item"> Дефолтный баланс команд </td>
            <td class="settings-table-item"> <input type="number" class="settings-input" v-model="settings.defaultBalance"> </td>
          </tr>
          <tr style="margin-top: 20px;">
            <td class="settings-table-item"> Ссылка на pdf </td>
            <td class="settings-table-item"> <input type="text" class="settings-input" v-model="settings.linkToPdf"> </td>
          </tr>
        </table>
        <div style="display: flex; flex-direction: row; margin-top: 170px">
          <button @click="closeSettingsModal(false)">Закрыть без сохранения</button>
          <button style="margin-left: 20px;" @click="closeSettingsModal(true)">Сохранить</button>
        </div>
      </div>
    </div>




    <!-- Кнопки управления открытия и закрытия регистрации -->
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
      id="end-round-btn" 
      :disabled="roundState == RoundState.ENDED || roundState == RoundState.NOT_STARTED || transactionState == TransactionState.IN_PROGRESS 
      || transactionState == TransactionState.PAUSED"
      @click="endRound" 
      >Закончить раунд
    </button>
        </div>
    </div>

    <!-- Управление транзакциями -->
    <div v-if="isGameStarted" class="active-game-section" id="trade-management">
      <h2>Управление торгами</h2>
      <p>Статус торгов: <span class="transation_state">{{ transactionState }}</span></p>
      <p>Оставшееся время торгов: {{ formatTime(remainingDurationTime) }} </p>
      <button id="start-trade-btn" 
        class="row-button"
        :disabled="transactionState == TransactionState.IN_PROGRESS || roundState == RoundState.NOT_STARTED || roundState == RoundState.ENDED 
        || transactionState == TransactionState.ENDED"
        @click="startTransaction"
        >Начать торги
    </button>
      <!-- <button 
      id="pause-trade-btn"
       class="row-button"
       :disabled="transactionState != TransactionState.IN_PROGRESS || roundState == TransactionState.NOT_STARTED 
          || roundState == TransactionState.ENDED"
       @click="pauseTransaction"
       >
       Пауза торгов
    </button> -->
      <button 
      id="end-trade-btn" 
      class="row-button"
      @click="endTransaction"
      :disabled="transactionState == TransactionState.ENDED || transactionState == TransactionState.NOT_STARTED || 
        roundState == TransactionState.NOT_STARTED  || roundState == TransactionState.ENDED"
      >Завершить торги
    </button>
    </div>  

    <div class="companies_container">
      <SettingsCompanies v-show="isGameCreated" class="active-game-section" />
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

    /* Стили отображения команд */
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
        padding: 2px;
    }

    /* Стили для кнопок, расположенных в одной строке */
    .row-button {
        margin-right: 10px;
        margin-top: 5px;
    }
    
    /* Стиль для активных секций */
    .active-game-section {
      margin-top: 10px;
    }

    .status {
      font-weight: bold;
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

  /* Стиль акций */
  .share {
    list-style-type: none; 
    padding: 2px;
  }

  /* Модалка */
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
  z-index: 10000000000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  text-align: center;
}


/* Табличка с акциями */
.team-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.team-table th, .team-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.team-table th {
  background-color: #f4f4f4;
}

.companies_container {
  padding: 100px 0 100px 0;
}

.settings-modal {
  width: 70%;
  height: 70%;
  background-color: white;
  padding: 30px;
}
.settings-table {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  margin-top: 50px;
  margin-left: 0;
  width: 70%;
} 
.settings-table-item {
  width: 300px;
  flex-grow: 1;
}
.settings-input {
  width: 100%;
  border-bottom: 1px solid #000;
}
.settings-input:focus {
  border: 0;
}
</style>