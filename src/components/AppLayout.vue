<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.app-main {
  flex: 1;
}

.app-main :deep(.router-view) {
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px 32px 48px;
}

@media (max-width: 860px) {
  .app-main :deep(.router-view) {
    padding: 20px 18px 40px;
  }
}
</style>
