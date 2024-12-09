<template>
  <div class="wrapper">
    <v-data-table :headers="headers" :items="desserts" hide-default-footer>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Компании</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn variant="elevated" @click="dialog = true"> Добавить </v-btn>

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
        <v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

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
    title: 'Действия',
    key: 'actions'
  },
]);

const desserts = ref([
  {
    name: 'Frozen Yogurt',
    cash1: 159,
    cash2: 6.0,
    cash3: 24
  },
  {
    name: 'Ice cream sandwich',
    cash1: 237,
    cash2: 9.0,
    cash3: 37
  },
  {
    name: 'Eclair',
    cash1: 262,
    cash2: 16.0,
    cash3: 23
  },
  {
    name: 'Cupcake',
    cash1: 305,
    cash2: 3.7,
    cash3: 67
  },
  {
    name: 'Gingerbread',
    cash1: 356,
    cash2: 16.0,
    cash3: 49
  },
  {
    name: 'Jelly bean',
    cash1: 375,
    cash2: 0.0,
    cash3: 94
  },
]);

const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1);
const editedItem = reactive({
  name: '',
  cash1: 0,
  cash2: 0,
  cash3: 0
});

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Добавить' : 'Редактировать';
});

const editItem = (item) => {
  debugger
  editedIndex.value = desserts.value.findIndex(dessert => {
    return dessert.name === item.name;
  });
  Object.assign(editedItem, item);
  dialog.value = true;
};

const deleteItem = (item) => {
  editedIndex.value = desserts.value.findIndex(dessert => {
    return dessert.name === item.name;
  });
  Object.assign(editedItem, {
    name: '',
    cash1: 0,
    cash2: 0,
    cash3: 0
  });
  dialogDelete.value = true;
};

const deleteItemConfirm = () => {
  desserts.value.splice(editedIndex.value, 1);
  dialogDelete.value = false;
};

const save = () => {
  if (editedIndex.value > -1) {
    console.log(editedItem.value)
    Object.assign(desserts.value[editedIndex.value], editedItem);
  } else {
    desserts.value.push({...editedItem});
    Object.assign(editedItem, {
      name: '',
      cash1: 0,
      cash2: 0,
      cash3: 0
    });
  }
  dialog.value = false;
};
</script>

<style scoped>
.wrapper {
  border: 1px solid black;
}
</style>
