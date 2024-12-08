import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue';
import { useAuthStore } from "@/stores/authStore";
import { useAdminStore } from "@/stores/adminStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
        auth: true
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
  const adminStore = useAdminStore();

  console.log('er ', to, from)
  // if (to === from) {
  //   return
  // }

  // Игрок
  if (to.meta.auth && !authStore.userInfo.token) {
    return { name: 'home' }
  }


  if (to.meta.auth && !authStore.userInfo.token) {
    return { name: 'home' }
  }
  if (!to.meta.auth && authStore.userInfo.token) {
    return { name: 'admin-panel'}
  }
})

export default router
