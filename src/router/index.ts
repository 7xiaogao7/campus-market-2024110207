import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: () => import('@/views/DetailView.vue'),
      props: true,
    },
    {
      path: '/publish',
      name: 'Publish',
      component: () => import('@/views/PublishView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('@/views/MessageView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/views/MyFavoritesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/board',
      name: 'Board',
      component: () => import('@/views/BoardView.vue'),
    },
    {
      path: '/trade',
      name: 'Trade',
      component: () => import('@/views/TradeView.vue'),
    },
    {
      path: '/lostfound',
      redirect: '/lost-found',
    },
    {
      path: '/lost-found',
      name: 'LostFound',
      component: () => import('@/views/LostFoundView.vue'),
    },
    {
      path: '/groupbuy',
      redirect: '/group-buy',
    },
    {
      path: '/group-buy',
      name: 'GroupBuy',
      component: () => import('@/views/GroupBuyView.vue'),
    },
    {
      path: '/errand',
      name: 'Errand',
      component: () => import('@/views/ErrandView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home',
    },
  ],
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.user.isLoggedIn) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
  if (to.meta.guestOnly && userStore.user.isLoggedIn) {
    return '/home'
  }
  return true
})

export default router
