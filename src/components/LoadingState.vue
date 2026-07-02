<template>
  <div class="loading-state">
    <div class="spinner" aria-hidden="true"></div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: '加载中…',
  },
)
</script>

<style scoped>
.loading-state {
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid #ebeef5;
  border-top-color: #409eff;
  border-right-color: #67c23a;
  animation: ls-spin 0.9s linear infinite;
  box-sizing: border-box;
  flex-shrink: 0;
}

.loading-text {
  margin: 0;
  color: #909399;
  font-size: 14px;
  line-height: 1.6;
}

@keyframes ls-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
