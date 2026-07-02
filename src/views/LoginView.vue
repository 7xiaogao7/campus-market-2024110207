<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const submitting = ref(false)

const form = reactive({
  username: '',
  password: '',
})

type FormKey = keyof typeof form
const errors = reactive<Record<FormKey, string>>({
  username: '',
  password: '',
})

function clearErrors() {
  (Object.keys(errors) as FormKey[]).forEach((k) => {
    errors[k] = ''
  })
}

function validateForm(): boolean {
  clearErrors()
  let ok = true

  if (!form.username.trim()) {
    errors.username = '请输入用户名（手机号）'
    ok = false
  } else if (!/^1\d{10}$/.test(form.username.trim()) && !/^\d{6,}$/.test(form.username.trim())) {
    errors.username = '用户名应为 11 位手机号或学号'
    ok = false
  }

  if (!form.password.trim()) {
    errors.password = '请输入密码'
    ok = false
  } else if (form.password.length < 6) {
    errors.password = '密码至少 6 位'
    ok = false
  }

  return ok
}

async function handleSubmit() {
  if (!validateForm()) return
  submitting.value = true
  try {
    await userStore.login(form.username.trim(), form.password)
    alert('🎉 登录成功，正在跳转首页…')
    try {
      await router.push('/home')
    } catch {
    }
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : '登录失败，请检查账号密码'
    alert('❌ ' + errMsg)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-card">
      <h1 class="title">🎓 登录校园轻集市</h1>
      <p class="subtitle">使用你的校园账号，开启闲置交易与互助</p>
      <p class="hint-tip">💡 默认测试账号：13800138000 / 123456</p>

      <form class="form" @submit.prevent="handleSubmit">
        <div class="field">
          <label>用户名（手机号 / 学号）<span class="required">*</span></label>
          <input
            v-model.trim="form.username"
            type="text"
            placeholder="请输入 11 位手机号或学号"
            maxlength="16"
            :class="{ error: !!errors.username }"
            @input="errors.username = ''"
          />
          <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
        </div>

        <div class="field">
          <label>密码<span class="required">*</span></label>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入至少 6 位密码"
            :class="{ error: !!errors.password }"
            @input="errors.password = ''"
          />
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
        </div>

        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? '登录中…' : '立即登录' }}
        </button>
      </form>

      <p class="register-link">
        还没有账号？<router-link to="/register">去注册 →</router-link>
      </p>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #eaf4ff 0%, #f0faf0 100%);
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  padding: 36px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(64, 158, 255, 0.12);
}

.title {
  margin: 0 0 6px;
  font-size: 24px;
  color: #303133;
  text-align: center;
  font-weight: 700;
}

.subtitle {
  margin: 0 0 8px;
  color: #909399;
  text-align: center;
  font-size: 14px;
}

.hint-tip {
  margin: 0 0 24px;
  padding: 8px 12px;
  background: #ecf5ff;
  border: 1px solid #d9ecff;
  color: #409eff;
  border-radius: 8px;
  font-size: 12px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.required {
  color: #f56c6c;
  margin-left: 2px;
}

.field input {
  padding: 10px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, background 0.2s;
  background: #ffffff;
  box-sizing: border-box;
}

.field input:focus {
  outline: none;
  border-color: #409eff;
  background: #f5faff;
}

.field input.error {
  border-color: #f56c6c;
  background: #fef0f0;
}

.error-text {
  margin: 0;
  font-size: 12px;
  color: #f56c6c;
  line-height: 1.4;
}

.submit-btn {
  margin-top: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.submit-btn:not(:disabled):hover {
  opacity: 0.92;
}

.submit-btn:not(:disabled):active {
  transform: translateY(1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  margin: 24px 0 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 520px) {
  .login-card {
    padding: 24px 20px;
  }
  .title {
    font-size: 20px;
  }
}
</style>
