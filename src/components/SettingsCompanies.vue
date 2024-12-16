<template>
  <div class="wrapper">
    <v-data-table :headers="headers" :items="companies" hide-default-footer>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Компании</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            variant="elevated"
            @click="dialog = true"
            :disabled="props.options.disableButtons"
          >
            Добавить
          </v-btn>

          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-text-field
                  v-model="editedItem.name"
                  label="Название компании"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.cash1"
                  label="Стоимость (1 раунд)"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.cash2"
                  label="Стоимость (2 раунд)"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.cash3"
                  label="Стоимость (3 раунд)"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.cash4"
                  label="Итоговая стоимость"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="elevated" @click="dialog = false">
                  Закрыть
                </v-btn>
                <v-btn variant="elevated" @click="save"> Сохранить </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-text class="text-h5"
                >Вы уверены, что хотите удалить компанию?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="elevated" @click="dialogDelete = false"
                  >Отмена</v-btn
                >
                <v-btn
                  variant="elevated"
                  @click="deleteItemConfirm"
                  >Да</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)"
          :disabled="props.options.disableButtons"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item)"
          :disabled="props.options.disableButtons"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { API } from '@/api/api-service';

const headers = ref([
  {
    title: 'Названия',
    align: 'start',
    key: 'name',
  },
  {
    title: 'Стоимость в 1 раунде',
    key: 'cash1',
    align: 'center',
  },
  {
    title: 'Стоимость в 2 раунде',
    key: 'cash2',
    align: 'center',
  },
  {
    title: 'Стоимость в 3 раунде',
    key: 'cash3',
    align: 'center',
  },
  {
    title: 'Итоговая стоимость',
    key: 'cash4',
    align: 'center',
  },
  {
    title: 'Действия',
    key: 'actions'
  },
]);

const props = defineProps({
  options: {
    type: Object,
  }
})

const companies = ref([])

onMounted(async () => {
  try {
    const { data } = await API.getCompanies();
    console.log(data.data)
    companies.value = data.data.map(fromBackToFront);
  } catch (e) {
    console.error(e);
  }
});

const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1);
const editedItem = reactive({
  name: '',
  cash1: 0,
  cash2: 0,
  cash3: 0,
  cash4: 0
});

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Добавить' : 'Редактировать';
});

const editItem = (item) => {
  editedIndex.value = companies.value.findIndex(company => {
    return company.id === item.id;
  });
  Object.assign(editedItem, item);
  dialog.value = true;
};

let tempCompanyId = '';

const deleteItem = (item) => {
  tempCompanyId = item.id;
  editedIndex.value = companies.value.findIndex(company => {
    return company.id === item.id;
  });
  Object.assign(editedItem, {
    name: '',
    cash1: 0,
    cash2: 0,
    cash3: 0,
    cash4: 0
  });
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  try {
    await API.deleteCompany(tempCompanyId);
  } catch (e) {
    console.error(e);
  }
  companies.value.splice(editedIndex.value, 1);
  dialogDelete.value = false;
};

const save = async () => {
  if (editedIndex.value > -1) {
    await API.updateCompany(fromFrontToBack(editedItem), companies.value[editedIndex.value].id);
    Object.assign(companies.value[editedIndex.value], editedItem);
  } else {
    try {
      const { data } = await API.createCompany(fromFrontToBack(editedItem));
      companies.value.push(fromBackToFront(data));
      Object.assign(editedItem, {
        name: '',
        cash1: 0,
        cash2: 0,
        cash3: 0,
        cash4: 0
      });
    } catch (e) {
      console.error(e);
    }
  }
  dialog.value = false;
};

const fromBackToFront = (item) => {
  return {
    id: item.id,
    name: item.name,
    cash1: item.shares[1],
    cash2: item.shares[2],
    cash3: item.shares[3],
    cash4: item.shares[4]
  }
}

const fromFrontToBack = (item) => {
  return {
    name: item.name,
    shares: {
      1: Number(item.cash1),
      2: Number(item.cash2),
      3: Number(item.cash3),
      4: Number(item.cash4)
    }
  }
}
</script>

<style scoped>
.wrapper {
  border: 1px solid black;
}
</style>
