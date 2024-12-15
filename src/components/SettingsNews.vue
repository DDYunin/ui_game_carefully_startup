<template>
  <div class="wrapper">
    <v-data-table :headers="headers" :items="news" hide-default-footer>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Новости</v-toolbar-title>
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
                  label="Название"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.description"
                  label="Описание"
                ></v-text-field>
                <!-- Выпадашку -->
                <v-text-field
                  v-model="editedItem.round"
                  label="Раунд"
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
    title: 'Название',
    align: 'start',
    key: 'name',
  },
  {
    title: 'Описание',
    key: 'description',
    align: 'center',
  },
  {
    title: 'Раунд',
    key: 'round',
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

const news = ref([])

const getNews = async () => {
  try {
    const { data } = await API.getNews();
    console.log(data.data)
    news.value = data.data;
  } catch (e) {
    console.error(e);
  }
}

onMounted(async () => {
  getNews();
});

const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1);
const editedItem = reactive({
  name: '',
  description: '',
  round: 1
});

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Добавить' : 'Редактировать';
});

const editItem = (item) => {
  editedIndex.value = news.value.findIndex(company => {
    return company.id === item.id;
  });
  Object.assign(editedItem, item);
  dialog.value = true;
};

const deleteItem = async (item) => {
  try {
    await API.deleteNew(item.id);
  } catch (e) {
    console.error(e);
  }
  editedIndex.value = news.value.findIndex(company => {
    return company.id === item.id;
  });
  Object.assign(editedItem, {
    name: '',
    description: '',
    round: 1
  });
  dialogDelete.value = true;
};

const deleteItemConfirm = () => {
  news.value.splice(editedIndex.value, 1);
  dialogDelete.value = false;
};

const save = async () => {
  if (editedIndex.value > -1) {
    await API.updateNew(fromFrontToBack(editedItem), news.value[editedIndex.value].id);
    Object.assign(news.value[editedIndex.value], editedItem);
  } else {
    try {
      await API.createNew(fromFrontToBack(editedItem));
      getNews();
      Object.assign(editedItem, {
        name: '',
        description: '',
        round: 1
      });
    } catch (e) {
      console.error(e);
    }
  }
  dialog.value = false;
};

const fromFrontToBack = (item) => {
  return {
    name: item.name,
    description: item.description,
    type: 1,
    round: Number(item.round)
  }
}
</script>

<style scoped>
.wrapper {
  border: 1px solid black;
}
</style>
