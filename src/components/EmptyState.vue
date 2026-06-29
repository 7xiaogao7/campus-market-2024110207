<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <p class="empty-text">{{ text }}</p>
    <slot v-if="$slots.default" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    text?: string
  }>(),
  {
    icon: '💫',
    text: '暂无数据',
  },
)
</script>

<style scoped>
.empty-state {
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border: 1px dashed #dcdfe6;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  line-height: 1;
  opacity: 0.8;
}

.empty-text {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
</style>
