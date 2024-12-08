import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/views/TeamView.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
    },
    {
      path: '/admin-panel',
      children: [],
      component: () => import('@/views/AdminPanelView.vue'),
    },
    {
      path: '/admin',
      children: [],
      component: () => import('@/views/GameView.vue'),
    },
  ],
})

export default router
