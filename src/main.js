import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router/router'
import '@/api/axios-config'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
})

const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(vuetify)

app.mount('#app')
