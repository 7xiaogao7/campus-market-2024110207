<template>
  <div class="form-field">
    <label class="form-field__label">
      <span v-if="required" class="required">*</span>
      {{ label }}
    </label>
    <div class="form-field__control">
      <slot />
    </div>
    <p v-if="error" class="form-field__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    required?: boolean
    error?: string
  }>(),
  {
    required: false,
    error: '',
  },
)
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}

.form-field__label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 2px;
}

.form-field__label .required {
  color: #f56c6c;
  font-weight: 700;
  line-height: 1;
}

.form-field__control {
  width: 100%;
}

.form-field__control :deep(input),
.form-field__control :deep(textarea),
.form-field__control :deep(select) {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  color: #303133;
  background: #fff;
  outline: none;
  transition: 0.2s;
  font-family: inherit;
}

.form-field__control :deep(input:focus),
.form-field__control :deep(textarea:focus),
.form-field__control :deep(select:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.form-field__control :deep(textarea) {
  resize: vertical;
  min-height: 88px;
}

.form-field__error {
  margin: 0;
  font-size: 12px;
  color: #f56c6c;
  line-height: 1.4;
}
</style>
