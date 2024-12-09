<script setup>
import { API } from '@/api/api-service';
import { onMounted, ref } from 'vue';
import ActionPaper from '@/components/ActionPaper.vue';
import { jwtDecode } from "jwt-decode";


const tokens = JSON.parse(localStorage.getItem('userTokens'))
const { sub: teamId, name: teamName} = jwtDecode(tokens.token);

const companies = ref([
  {
    id: 2,
    name: 'as',
    cash: 1,
    number: 21,
    value: 0,
    picked: ''
  },
  {
    id: 4,
    name: 'asa',
    cash: 1,
    number: 21,
    value: 0,
    picked: ''
  }
]);

onMounted(async () => {
  try {
    const { data } = await API.getCompanies();
  } catch (e) {
    console.error(e);
  }
})

const updateValue = ({ index, value }) => {
  companies.value[index].value = value;
}

const updatePicked = ({ index, picked }) => {
  companies.value[index].picked = picked;
}

const makeActionPapers = async () => {  
  const ids = companies.value.map(company => company.id)
  const papers = companies.value.map(company => {
    if (company.picked === 'sell') {
      return company.value * -1
    }
    return company.value
  })
  const result = ids.reduce((acc, key, index) => {
    acc[key] = papers[index];
    return acc;
  }, {});
  try {
    const { data } = await API.buyPapers({
      id: teamId,
      sharesChanges: result
    });
  } catch (e) {
    console.error(e);
  }
}

</script>

<template>
  <div class="container">
    <div class="left-column">
      <div class="round-info">
        <div>Раунд №</div>
        <div>Таймер</div>
      </div>
      <div class="balance-info">
        <div>Текущий баланс: </div>
      </div>
      <div class="company-info">
        <div class="header">Заявка "Брокеру-Банку"</div>
        <v-table class="table">
          <thead>
            <tr>
              <th>
                Название компании
              </th>
              <th>
                Стоимость акции
              </th>
              <th>
                Текущее количество
              </th>
              <th>
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, companyIndex) in companies"
              :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.cash }}</td>
              <td>{{ item.number }}</td>
              <td>
                <ActionPaper
                  class="cash-info"
                  :options="{
                    name: item.name,
                    index: companyIndex
                  }"
                  @update-value="updateValue"
                  @update-picked="updatePicked"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div>
        <button
          class="button"
          @click="makeActionPapers"
        >
          Подтвердить
        </button>
      </div>
    </div>
    <div style="width: 30px;"></div>
    <div class="right-column">
      <div>
        <div class="news block">
          <div class="block__title">Новости</div>
          <div class="block__buttons">
            <button class="button block__button">Купить за 10</button>
            <button class="button block__button">Посмотреть купленные</button>
          </div>
        </div>
      </div>
      <div>
        <div class="analytic block">
          <div class="block__title">Аналитика</div>
          <div class="block__buttons">
            <button class="button block__button">Купить за 50</button>
            <button class="button block__button">Посмотреть купленные</button>
          </div>
        </div>
      </div>
      <div>
        <div class="events block">
          <div class="block__title">Случайные события</div>
          <div class="block__buttons">
            <button class="button block__button">Активировать</button>
          </div>
        </div>
      </div>
    </div>
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