<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user.isLoggedIn)

interface NavItem {
  to: string
  label: string
  requireAuth?: boolean
}

const navItems: NavItem[] = [
  { to: '/home', label: '首页' },
  { to: '/trade', label: '二手交易' },
  { to: '/lostfound', label: '失物招领' },
  { to: '/groupbuy', label: '拼单搭子' },
  { to: '/errand', label: '跑腿委托' },
  { to: '/board', label: '看板' },
  { to: '/publish', label: '发布', requireAuth: true },
  { to: '/message', label: '消息', requireAuth: true },
]

const visibleItems = computed(() =>
  navItems.filter((item) => !item.requireAuth || isLoggedIn.value),
)
</script>

<template>
  <nav class="app-nav">
    <router-link
      v-for="item in visibleItems"
      :key="item.to"
      :to="item.to"
      class="nav-link"
    >
      {{ item.label }}
    </router-link>
  </nav>
</template>

<style scoped>
.app-nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.nav-link {
  text-decoration: none;
  color: #606266;
  font-size: 15px;
  padding: 8px 18px;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s;
  font-weight: 500;
  position: relative;
}

.nav-link:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

.nav-link.router-link-active {
  color: #409eff;
  background-color: #ecf5ff;
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 16px;
  right: 16px;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 3px 3px 0 0;
}

@media (max-width: 860px) {
  .app-nav {
    gap: 4px;
  }
  .nav-link {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>
