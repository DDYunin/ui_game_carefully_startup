import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue';
import { useAuthStore } from "@/stores/authStore";
import { useAdminStore } from "@/stores/adminStore";




const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
    {
      path: '/team',
      name: 'team',
      meta: {
        auth: true
      },
      component: () => import('@/views/TeamView.vue'),
    },
    {
      path: '/game',
      name: 'game',
      meta: {
        auth: true
      },
      component: () => import('@/views/GameView.vue'),
    },
    {
      path: '/admin-panel',
      name: 'admin-panel',
      meta: {
        admin: true
      },
      component: () => import('@/views/AdminPanelView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminFormView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' }
    }
  ]
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  // Игрок
  if (to.meta.auth && !authStore.userInfo.token) {
    return { name: 'home' }
  }

  // Админ
  if (to.meta.admin && !authStore.userInfo.token) {
    return { name: 'admin' }
  }
})

export default router
