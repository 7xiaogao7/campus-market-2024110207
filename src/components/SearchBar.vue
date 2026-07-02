<template>
  <div class="search-bar" :class="{ 'is-focused': focused }">
    <span class="sb-icon" aria-hidden="true">🔍</span>
    <input
      ref="inputRef"
      :value="modelValue"
      :placeholder="placeholder"
      type="text"
      class="sb-input"
      maxlength="60"
      @focus="focused = true"
      @blur="focused = false"
      @input="onInput"
      @keydown.enter.prevent="onEnter"
      @keydown.esc="onClear"
    />
    <button
      v-if="modelValue"
      type="button"
      class="sb-btn sb-clear"
      title="清空搜索"
      @click.stop="onClear"
    >
      ✕
    </button>
    <button
      type="button"
      class="sb-btn sb-search"
      title="搜索"
      @click.stop="onSearch"
    >
      搜索
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
  }>(),
  {
    placeholder: '搜索关键字，回车快速搜索…',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', keyword: string): void
  (e: 'clear'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
}

function onEnter() {
  emit('search', props.modelValue.trim())
}

function onSearch() {
  emit('search', props.modelValue.trim())
  inputRef.value?.focus()
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  emit('search', '')
  inputRef.value?.focus()
}
</script>

<style scoped>
.search-bar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px 6px 14px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  transition: 0.2s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.search-bar.is-focused {
  border-color: #409eff;
  background: #f5faff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.12);
}

.sb-icon {
  font-size: 16px;
  line-height: 1;
  opacity: 0.75;
  flex-shrink: 0;
}

.sb-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  padding: 8px 4px;
  color: #303133;
  font-family: inherit;
  line-height: 1.5;
  min-width: 0;
}

.sb-input::placeholder {
  color: #c0c4cc;
}

.sb-btn {
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: 0.15s;
  border-radius: 6px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sb-clear {
  width: 26px;
  height: 26px;
  background: #f4f4f5;
  color: #909399;
  font-size: 12px;
}

.sb-clear:hover {
  background: #f56c6c;
  color: #fff;
}

.sb-search {
  padding: 7px 18px;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.sb-search:hover {
  filter: brightness(1.08);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
  transform: translateY(-0.5px);
}

.sb-search:active {
  transform: translateY(0);
}
</style>
