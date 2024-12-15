<script setup>
import { API } from '@/api/api-service';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ActionPaper from '@/components/ActionPaper.vue';
import { jwtDecode } from 'jwt-decode';
import { socket } from '@/api/ws-api-service';


const tokens = JSON.parse(localStorage.getItem('userTokens'));
const { sub: teamId, name: teamName } = jwtDecode(tokens.token);

const currentRound = ref(1);
const balanceAmount = ref();
const isTradeGo = ref('');
const isGameGo = ref('');
const isRoundGo = ref('');

watch(isRoundGo, async (newIsRoundGo, oldIsRoundGo) => {
  if (newIsRoundGo) {
    getGameState();
    getCompaniesAndTeam();
  }
});

watch(isGameGo, async (newIsRoundGo, oldIsRoundGo) => {
  if (newIsRoundGo === 3) {
    getStatistics()
    showStatistics.value = true;
  }
})

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const [key, value] = Object.entries(data)[0];
  if (key === 'isTradeStage') {
    isTradeGo.value = value;
  }
  if (key === 'gameState') {
    isGameGo.value = value;
  }
  // Для просчёта следующего раунда
  if (key === 'isRoundStage') {
    isRoundGo.value = value;
  }
  console.log('event, ', data, Object.keys(data));
};

const isTradeDone = ref(false);

onMounted(() => {
  getGameState();
  getCompaniesAndTeam();
  getSettings();
});

const getGameState = async () => {
  try {
    const { data } = await API.getGame();
    console.log('Data in getGameState = ', data)
    currentRound.value = data.currentRound;
  } catch (e) {
    console.error(e);
  }
};

const makeActionPapers = async () => {
  const ids = companiesForTable.value.map((company) => company.id);
  const papers = companiesForTable.value.map((company) => {
    if (company.picked === 'sell' &&  company.value !== 0) {
      return company.value * -1;
    }
    return company.value;
  });
  const result = ids.reduce((acc, key, index) => {
    acc[key] = papers[index];
    return acc;
  }, {});
  try {
    await API.buyPapers({
      id: teamId,
      sharesChanges: result,
    }).then(data => {
      if (data.status == 400 || data.status == 500) {
          handleBuyPapersResponse(data.response)
      }
      console.log('Data from makeActionPapers = ', data.data)
      balanceAmount.value = data.data.balanceAmount;
      getCompaniesAndTeam();
    }).catch(error => {
      console.log(error)
    })
  } catch (e) {
    console.error(e);
  }
};


const resetOnStartRound = async () => {
  try {
    const { data } = await API.resetTrade({
      teamId
    });
    console.log('Data from makeActionPapers = ', data)
    balanceAmount.value = data.balanceAmount;
    getCompaniesAndTeam();
  } catch (e) {
    console.error(e);
  }
}

const companiesForTable = ref([]);

const getCompaniesAndTeam = async () => {
  try {
    const [company, team] = await Promise.all([
      API.getCompanies(),
      API.getTeam({teamId})
    ]);
    console.log('Data from getCompanies = ', company.data);
    console.log('Data from getCommandInfo = ', team.data);
    balanceAmount.value = team.data.balanceAmount;
    isTradeDone.value = team.data.hasTransactionInThisRound;
    additionalInfo.value = team.data.additionalInfos;
    companiesForTable.value = company.data.data.map(company => {
      return {
        id: company.id,
        name: company.name,
        cash: company.shares[currentRound.value],
        number: team.data.shares?.[company.id],
        value: 0,
        picked: 'sell'
      }
    });
  } catch (e) {
    console.error(e);
  }
}

// БЛОК НОВОСТЕЙ

const isShowNews = ref(false);
const additionalInfo = ref([]);

const buyNew = async () => {
  try {
    const { data } = await API.buyNew({
      teamId
    });
    console.log('Data from buyNew = ', data)
    balanceAmount.value = data.balanceAmount;
    getCompaniesAndTeam();
  } catch (e) {
    console.error(e);
  }
}

// Блок настроек
const settings = reactive({
  settings: ''
});

const getSettings = async () => {
  try {
    const {data} = await API.getSetting();
    console.log('Data from getSettings = ', data)
    settings.settings = data;
  } catch(e) {
    console.log(e);
  }
}

// Обработка ошибок

const showModalOnTransactionError = ref(false)
const modalOnTransactionErrorText = ref("")


function handleBuyPapersResponse(response) {
  if (response.status == 500) {
    showModalOnTransactionError.value = true
    modalOnTransactionErrorText.value = "Что-то пошло не так"
    return
  }


  if (response.status == 400) {
    showModalOnTransactionError.value = true
    const errorCode = response.data.code
    modalOnTransactionErrorText.value = getmodalOnTransactionErrorTextByErrorCode(errorCode)
    return
  }
}


function getmodalOnTransactionErrorTextByErrorCode(code) {
  if (code == 10001) {
    return "Нельзя провести сделку так как раунд торгов ещё не начался"
  }


  if (code == 10002) {
    return "Выбранно некорректное количество акций для совершения сделки"
  }


  if (code == 10003) {
    return "Недостаточно средств на балансе"
  }
}


function onModalOnTransactionErrorClose() {
  showModalOnTransactionError.value = false
}

// Ожидание раунда

const showLoader = computed(() => {
  if (isRoundGo.value) {
    return false;
  }
  return true;
})

// Cтатистика

const statistics = ref([]);
const showStatistics = ref(false);

const getStatistics = async () => {
  try {
    const {data} = await API.getStatistics();
    console.log('Data from getStatistics = ', data)
    statistics.value = data.results;
  } catch(e) {
    console.log(e);
  }
}

</script>

<template>
  <div class="container">
    <div class="left-column">
      <div class="round-info">
        <div>Раунд № {{ currentRound }}</div>
        <!-- <div>Таймер</div> -->
      </div>
      <div class="balance-info">
        <div>Текущий баланс: {{ balanceAmount }}</div>
      </div>
      <div class="company-info">
        <div class="header">Заявка "Брокеру-Банку"</div>
        <v-table class="table">
          <thead>
            <tr>
              <th>Название компании</th>
              <th>Стоимость акции</th>
              <th>Текущее количество</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, companyIndex) in companiesForTable" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.cash }}</td>
              <td>{{ item.number }}</td>
              <td>
                <ActionPaper
                  class="cash-info"
                  :options="{
                    name: item.name,
                    index: companyIndex,
                  }"
                  v-model:number-value="item.value"
                  v-model:radio-value="item.picked"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div>
        <button
          v-if="!isTradeDone"
          class="button button__buy"
          @click="makeActionPapers"
        >
          Подтвердить
        </button>
        <button
          v-else
          class="button button__sell"
          @click="resetOnStartRound"
        >
          Сбросить
        </button>
      </div>
    </div>
    <div style="width: 30px"></div>
    <div class="right-column">
      <div>
        <div class="news block">
          <div class="block__title">Новости</div>
          <div class="block__buttons">
            <button
              class="button block__button"
              @click="buyNew"
            >
              Купить за {{ settings.settings.defaultAdditionalInfoCost }}
            </button>
            <button
              class="button block__button"
              @click="isShowNews = true"
            >
              Посмотреть купленные
            </button>
          </div>
        </div>
      </div>
      <!-- <div>
        <div class="analytic block">
          <div class="block__title">Аналитика</div>
          <div class="block__buttons">
            <button class="button block__button">Купить за 50</button>
            <button class="button block__button">Посмотреть купленные</button>
          </div>
        </div>
      </div> -->
    </div>
    <v-dialog
      v-model="isShowNews"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Купленные новости</span>
        </v-card-title>
        <v-card-text>
          <v-carousel
            progress="primary"
            hide-delimiters
          >
            <v-carousel-item
              v-for="info in additionalInfo"
              :key="info.id"
            >
              <v-sheet
                height="100%"
              >
                <div class="d-flex fill-height justify-center align-center">
                  <div
                    :style="{
                      display: 'flex',
                      flexDirection: 'column',
                      rowGap: '20px'
                    }"
                  >
                    <div class="text-h2">
                      {{ info.name }}
                    </div>
                    <div class="text-h4">
                      {{ info.description }}
                    </div>
                  </div>
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="isShowNews = false"
            color="red-darken-2"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showModalOnTransactionError"
      width="auto"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-emoticon-cry-outline"
        :text="modalOnTransactionErrorText"
        title="Ошибка!"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="onModalOnTransactionErrorClose"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showLoader"
      width="auto"
      persistent
    >
      <div>
        Ожидайте начала раунда
        <v-progress-circular
          indeterminate="disable-shrink"
          size="36"
          width="4"
        />
      </div>
    </v-dialog>
    <v-dialog
      v-model="showStatistics"
      width="auto"
      persistent
    >
      <v-card
        max-width="400"
      >
        <v-list class="list">
          <v-list-subheader class="list__title">Результаты</v-list-subheader>
          <v-list-item
            v-for="(item, i) in statistics"
            :key="i"
            :value="item"
            class="list__item"
          >
            Место: {{ index + 1 }}. Имя команды: {{ item.teamName }}. Итоговый счет: {{ item.score }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

  </div>
</template>





<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
}

.round-info {
  display: flex;
  column-gap: 30px;
  margin-bottom: 15px;
}

.balance-info {
  margin-bottom: 20px;
}

.company-info {
  margin-bottom: 40px;
}

.table {
  border: 1px solid black;
}

.header {
  border: 1px solid black;
  border-bottom: none;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  padding: 10px 15px;
}

.table__list {
  display: flex;
  flex-direction: column;
  list-style: none;
}

.list-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  column-gap: 10px;
  padding: 10px 15px;
}

.button {
  background: lightblue;
  border: 1px solid black;
  padding: 5px 10px;
}

.button__sell {
  background: lightcoral;
}

.button__buy {
  background: lightgreen;
}

.cash-info {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.block {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 10px 15px;
  row-gap: 20px;
}

.block__title {
  text-align: center;
}

.block__buttons {
  display: flex;
  flex-direction: column;
  row-gap: 15px;
}

.right-column {
  display: flex;
  flex-direction: column;
  row-gap: 40px;
}
</style>
