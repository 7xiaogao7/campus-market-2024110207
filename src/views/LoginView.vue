<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const tab = ref<'pwd' | 'code'>('pwd')
const account = ref('20231234')
const pwd = ref('123456')
const phone = ref('')
const code = ref('')
const pwdVisible = ref(false)
const codeCountdown = ref(0)
const loading = ref(false)
const toast = ref<{ type: 'success' | 'error'; msg: string } | null>(null)

function showToast(type: 'success' | 'error', msg: string) {
  toast.value = { type, msg }
  setTimeout(() => (toast.value = null), 2500)
}

function sendCode() {
  if (codeCountdown.value > 0) return
  if (!/^1\d{10}$/.test(phone.value)) {
    showToast('error', '请输入正确的手机号')
    return
  }
  codeCountdown.value = 60
  const t = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) clearInterval(t)
  }, 1000)
  showToast('success', `验证码已发送至 ${phone.value.slice(0, 3)}****${phone.value.slice(-4)}（演示：1234）`)
  code.value = '1234'
}

async function submit() {
  if (loading.value) return
  if (tab.value === 'pwd') {
    if (!account.value.trim()) {
      showToast('error', '请输入账号（手机号 / 学号 / 邮箱）')
      return
    }
    if (!pwd.value || pwd.value.length < 6) {
      showToast('error', '请输入至少 6 位密码')
      return
    }
  } else {
    if (!/^1\d{10}$/.test(phone.value)) {
      showToast('error', '请输入正确的手机号')
      return
    }
    if (code.value.length !== 4) {
      showToast('error', '请输入 4 位验证码')
      return
    }
  }
  loading.value = true
  await new Promise((r) => setTimeout(r, 600))
  const payload =
    tab.value === 'pwd'
      ? { account: account.value, password: pwd.value }
      : { account: phone.value, code: code.value }
  const res = userStore.login(payload)
  loading.value = false
  showToast('success', res.message)
  const redirect = (route.query.redirect as string) || '/home'
  setTimeout(() => router.push(redirect), 1000)
}
</script>

<template>
  <div class="auth-wrap">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">🎓</div>
        <h2>欢迎登录校园轻集市</h2>
        <p>校园内部的闲置交易 · 失物招领 · 拼单跑腿平台</p>
      </div>

      <div class="auth-tab">
        <div :class="{ active: tab === 'pwd' }" @click="tab = 'pwd'">密码登录</div>
        <div :class="{ active: tab === 'code' }" @click="tab = 'code'">验证码登录</div>
      </div>

      <form @submit.prevent="submit" class="form">
        <div v-if="tab === 'pwd'" class="form-group">
          <label class="form-label">账号（手机号 / 学号 / 邮箱）</label>
          <div class="input-icon">
            <span>👤</span>
            <input v-model="account" class="form-input" placeholder="请输入手机号 / 学号 / 邮箱" />
          </div>
        </div>
        <div v-if="tab === 'pwd'" class="form-group">
          <label class="form-label">登录密码</label>
          <div class="input-icon">
            <span>🔒</span>
            <input
              v-model="pwd"
              :type="pwdVisible ? 'text' : 'password'"
              class="form-input"
              placeholder="请输入密码（演示：123456）"
            />
            <span class="pwd-eye" @click="pwdVisible = !pwdVisible">{{ pwdVisible ? '🙈' : '👁️' }}</span>
          </div>
        </div>

        <div v-if="tab === 'code'" class="form-group">
          <label class="form-label">手机号码</label>
          <div class="input-icon">
            <span>📱</span>
            <input v-model="phone" class="form-input" placeholder="请输入 11 位手机号" maxlength="11" />
          </div>
        </div>
        <div v-if="tab === 'code'" class="form-group">
          <label class="form-label">短信验证码</label>
          <div class="form-row">
            <div class="input-icon">
              <span>🔐</span>
              <input v-model="code" class="form-input" placeholder="4 位验证码" maxlength="4" />
            </div>
            <button type="button" class="btn-code" :disabled="codeCountdown > 0" @click="sendCode">
              {{ codeCountdown > 0 ? codeCountdown + 's 后重发' : '获取验证码' }}
            </button>
          </div>
        </div>

        <div class="form-options">
          <label><input type="checkbox" checked /> 记住我（7 天内自动登录）</label>
          <a href="#" @click.prevent>忘记密码？</a>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading">登录中…</span>
          <span v-else>✨ 立即登录</span>
        </button>

        <div class="auth-tip">
          💡 <b>演示账号</b>：学号 <code>20231234</code>，密码 <code>123456</code><br />
          🆕 也可以随便输入手机号 + 任意密码（≥6 位）即可登录新账号
        </div>
      </form>

      <div class="auth-foot">
        还没有账号？
        <router-link to="/register">立即注册 →</router-link>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="toast" :class="['toast', toast.type]">
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.auth-wrap {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 16px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f9eb 100%);
  position: relative;
}
.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 36px 32px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.07);
  border: 1px solid #e8ecf2;
}
.auth-header {
  text-align: center;
  margin-bottom: 26px;
}
.auth-header .logo {
  width: 64px;
  height: 64px;
  line-height: 64px;
  text-align: center;
  background: linear-gradient(135deg, #409eff, #79bbff);
  border-radius: 50%;
  font-size: 34px;
  margin: 0 auto 12px;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.25);
}
.auth-header h2 {
  margin: 0 0 6px;
  font-size: 22px;
  color: #303133;
}
.auth-header p {
  margin: 0;
  font-size: 13px;
  color: #909399;
}
.auth-tab {
  display: flex;
  border-bottom: 2px solid #f2f6fc;
  margin-bottom: 22px;
}
.auth-tab > div {
  padding: 10px 18px;
  cursor: pointer;
  font-size: 14px;
  color: #909399;
  font-weight: 500;
  position: relative;
  top: 2px;
}
.auth-tab > div.active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}
.form-group {
  margin-bottom: 16px;
}
.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}
.form-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8ecf2;
  border-radius: 8px;
  font-size: 14px;
  color: #303133;
  background: #fafcff;
  outline: none;
  transition: 0.15s;
}
.form-input:focus {
  border-color: #409eff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.12);
}
.input-icon {
  display: flex;
  align-items: center;
  border: 1px solid #e8ecf2;
  border-radius: 8px;
  padding: 0 12px;
  background: #fafcff;
  transition: 0.15s;
}
.input-icon:focus-within {
  border-color: #409eff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.12);
}
.input-icon > span:first-child {
  color: #909399;
  margin-right: 6px;
}
.input-icon .pwd-eye {
  cursor: pointer;
  padding: 0 4px;
  user-select: none;
}
.input-icon .form-input {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  background: transparent;
  padding: 11px 0;
}
.form-row {
  display: flex;
  gap: 10px;
}
.form-row > div {
  flex: 1;
}
.btn-code {
  white-space: nowrap;
  padding: 0 14px;
  border: 1px solid #409eff;
  color: #409eff;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s;
}
.btn-code:hover {
  background: #ecf5ff;
}
.btn-code:disabled {
  color: #909399;
  border-color: #e8ecf2;
  cursor: not-allowed;
}
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  font-size: 12px;
  color: #909399;
}
.form-options a {
  color: #409eff;
  text-decoration: none;
}
.form-options label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(64, 158, 255, 0.4);
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.auth-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 14px;
  padding: 10px 12px;
  background: #ecf5ff;
  border-radius: 8px;
  line-height: 1.7;
}
.auth-tip code {
  background: #fff;
  padding: 1px 6px;
  border-radius: 4px;
  color: #409eff;
  font-size: 11px;
  font-family: Menlo, monospace;
}
.auth-foot {
  margin-top: 18px;
  text-align: center;
  font-size: 13px;
  color: #909399;
}
.auth-foot :deep(a) {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
}
.auth-foot :deep(a:hover) {
  text-decoration: underline;
}
.toast {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}
.toast.success {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}
.toast.error {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -12px);
}
@media (max-width: 480px) {
  .auth-card {
    padding: 28px 22px;
  }
}
</style>
