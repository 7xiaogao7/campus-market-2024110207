<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AppNav from './AppNav.vue'

const userStore = useUserStore()
const router = useRouter()

function goHome() {
  router.push('/home')
}

function doLogout() {
  if (confirm('确定退出登录吗？')) {
    userStore.logout()
    router.push('/home')
  }
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <h1 class="site-title" @click="goHome" title="返回首页">校园轻集市</h1>
        <AppNav />
      </div>

      <div class="header-right">
        <template v-if="userStore.isLoggedIn">
          <router-link to="/profile" class="user-entry" title="进入个人中心">
            <span class="mini-avatar">{{ userStore.user.avatar }}</span>
            <span class="user-name">{{ userStore.displayName }}</span>
          </router-link>
          <router-link to="/profile" class="mini-btn">👤 我的</router-link>
          <button class="mini-btn logout-btn" @click="doLogout" title="退出当前账号">🚪 退出</button>
        </template>
        <template v-else>
          <router-link to="/login" class="mini-btn">🔑 登录</router-link>
          <router-link to="/register" class="mini-btn primary">🎁 注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e8ecf2;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 32px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.site-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  user-select: none;
  cursor: pointer;
  transition: opacity 0.15s;
}

.site-title:hover {
  opacity: 0.85;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  flex-shrink: 0;
}

.user-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 6px;
  border-radius: 999px;
  background: #f5f7fa;
  text-decoration: none;
  transition: 0.2s;
  border: 1px solid #e8ecf2;
}

.user-entry:hover {
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #79bbff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
  font-weight: 700;
}

.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e8ecf2;
  background: #fff;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: 0.15s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  font-family: inherit;
}

.mini-btn:hover {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}

.mini-btn.primary {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
}

.mini-btn.primary:hover {
  filter: brightness(1.08);
  color: #fff;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.35);
}

.logout-btn {
  color: #f56c6c;
}

.logout-btn:hover {
  background: #fdf0f0;
  border-color: #fbd8d8;
  color: #f56c6c;
}

@media (max-width: 860px) {
  .header-inner {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 18px 0;
  }
  .header-right {
    justify-content: flex-end;
    padding-bottom: 8px;
  }
  .user-name {
    display: none;
  }
}
</style>
