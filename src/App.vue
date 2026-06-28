<script setup lang="ts"></script>

<template>
  <nav>
    <router-link to="/home">首页</router-link>
    <router-link to="/list">列表</router-link>
    <router-link to="/publish">发布</router-link>
    <router-link to="/message">消息</router-link>
    <router-link to="/profile">我的</router-link>
  </nav>

  <router-view />
</template>

<style scoped>
nav {
  display: flex;
  gap: 24px;
  padding: 16px 32px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

nav a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s;
}

nav a:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

nav a.router-link-active {
  color: #409eff;
  background-color: #ecf5ff;
  font-weight: 600;
}

:deep(.router-view) {
  padding: 32px;
}
</style>