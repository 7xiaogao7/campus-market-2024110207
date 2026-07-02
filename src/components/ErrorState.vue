<template>
  <div class="error-state">
    <div class="error-icon" aria-hidden="true">⚠️</div>
    <p class="error-text">{{ error }}</p>
    <button class="retry-btn" @click="handleRetry">
      {{ retryText }}
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    error?: string
    retryText?: string
  }>(),
  {
    error: '加载失败，请稍后再试',
    retryText: '🔄 重新加载',
  },
)

const emit = defineEmits<{
  (e: 'retry'): void
}>()

function handleRetry() {
  emit('retry')
}
</script>

<style scoped>
.error-state {
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border: 1px solid #fde2e2;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.error-icon {
  font-size: 44px;
  line-height: 1;
  opacity: 0.92;
}

.error-text {
  margin: 0;
  color: #f56c6c;
  font-size: 14px;
  line-height: 1.7;
  max-width: 480px;
  word-break: break-word;
}

.retry-btn {
  margin-top: 6px;
  padding: 9px 22px;
  border-radius: 8px;
  border: 1px solid #f56c6c;
  background: #fff;
  color: #f56c6c;
  font-size: 14px;
  cursor: pointer;
  transition: 0.15s;
  font-family: inherit;
  font-weight: 500;
}

.retry-btn:hover {
  background: #f56c6c;
  color: #fff;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.25);
}

.retry-btn:active {
  transform: translateY(1px);
}
</style>
