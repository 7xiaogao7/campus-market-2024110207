<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const step = ref<1 | 2 | 3>(1)

const phone = ref('')
const code = ref('')
const codeCountdown = ref(0)

const name = ref('')
const avatar = ref('😀')
const pwd = ref('')
const pwd2 = ref('')
const college = ref('')
const campus = ref('')
const grade = ref('')
const major = ref('')
const agree = ref(false)

const loading = ref(false)
const toast = ref<{ type: 'success' | 'error'; msg: string } | null>(null)

function showToast(type: 'success' | 'error', msg: string) {
  toast.value = { type, msg }
  setTimeout(() => (toast.value = null), 2600)
}

const avatarList = ['😀', '🐱', '🐶', '🦊', '🐼', '🐻', '🦁', '🐨', '🐸', '🌟', '🌈', '🍀', '🎮', '📚', '🎨', '🎯']

const colleges = [
  '计算机科学与技术学院',
  '电子信息工程学院',
  '数学与统计学院',
  '物理与光电工程学院',
  '化学与化工学院',
  '外国语学院',
  '经济管理学院',
  '法学院',
  '传媒与设计学院',
  '生命科学学院',
  '土木工程学院',
  '机械工程学院',
  '艺术学院',
  '医学院',
  '其他学院',
]
const campuses = ['主校区（东区）', '主校区（西区）', '南校区', '北校区', '新校区']
const grades = ['2020 级', '2021 级', '2022 级', '2023 级', '2024 级', '2025 级', '研究生']

function sendCode() {
  if (codeCountdown.value > 0) return
  if (!/^1\d{10}$/.test(phone.value)) {
    showToast('error', '请输入正确的 11 位手机号')
    return
  }
  codeCountdown.value = 60
  const t = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) clearInterval(t)
  }, 1000)
  showToast('success', '验证码已发送（演示：1234）')
  code.value = '1234'
}

const step1Valid = computed(() => /^1\d{10}$/.test(phone.value) && code.value.length === 4)

function goStep2() {
  if (!step1Valid.value) {
    showToast('error', '请先完成手机号 + 验证码')
    return
  }
  step.value = 2
  showToast('success', '✅ 验证成功！请继续完善资料')
}

const step2Valid = computed(
  () =>
    name.value.trim().length >= 2 &&
    pwd.value.length >= 6 &&
    pwd.value === pwd2.value &&
    college.value &&
    campus.value &&
    grade.value &&
    agree.value,
)

async function submit() {
  if (!step2Valid.value) {
    if (name.value.trim().length < 2) return showToast('error', '昵称至少 2 个字符')
    if (pwd.value.length < 6) return showToast('error', '密码至少 6 位')
    if (pwd.value !== pwd2.value) return showToast('error', '两次密码不一致')
    if (!college.value) return showToast('error', '请选择学院')
    if (!campus.value) return showToast('error', '请选择校区')
    if (!grade.value) return showToast('error', '请选择年级')
    if (!agree.value) return showToast('error', '请先阅读并勾选协议')
    return
  }
  loading.value = true
  await new Promise((r) => setTimeout(r, 700))
  userStore.register({
    phone: phone.value,
    code: code.value,
    name: name.value.trim(),
    avatar: avatar.value,
    pwd: pwd.value,
    college: college.value,
    campus: campus.value,
    grade: grade.value,
    major: major.value,
  })
  loading.value = false
  step.value = 3
}

function finish() {
  showToast('success', '🎁 新人礼包已放入背包，马上进入校园轻集市！')
  setTimeout(() => router.push('/home'), 900)
}
</script>

<template>
  <div class="auth-wrap">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">🎁</div>
        <h2>加入校园轻集市</h2>
        <p>现在注册，首单立减 ¥20，学长学姐等你来</p>
      </div>

      <div class="step-line">
        <div class="step" :class="{ active: step === 1, done: step > 1 }">
          <span class="num">{{ step > 1 ? '✓' : '1' }}</span>验证信息
        </div>
        <div class="split"></div>
        <div class="step" :class="{ active: step === 2, done: step > 2 }">
          <span class="num">{{ step > 2 ? '✓' : '2' }}</span>完善资料
        </div>
        <div class="split"></div>
        <div class="step" :class="{ active: step === 3 }">
          <span class="num">3</span>注册成功
        </div>
      </div>

      <!-- Step 1 -->
      <div v-if="step === 1">
        <div class="form-group">
          <label class="form-label">手机号码</label>
          <div class="input-icon">
            <span>📱</span>
            <input v-model="phone" class="form-input" placeholder="请输入 11 位手机号" maxlength="11" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">短信验证码</label>
          <div class="form-row">
            <div class="input-icon">
              <span>🔐</span>
              <input v-model="code" class="form-input" placeholder="4 位验证码" maxlength="4" />
            </div>
            <button type="button" class="btn-code" :disabled="codeCountdown > 0" @click="sendCode">
              {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
            </button>
          </div>
        </div>
        <button class="btn-primary" @click="goStep2">下一步 →</button>
        <div class="auth-tip">
          💡 演示环境：任意手机号 + 点击【获取验证码】按钮会自动填入「1234」
        </div>
      </div>

      <!-- Step 2 -->
      <div v-if="step === 2">
        <div class="form-group">
          <label class="form-label">选择你的头像（点击选中）</label>
          <div class="avatar-pick">
            <div
              v-for="a in avatarList"
              :key="a"
              class="avatar-opt"
              :class="{ active: avatar === a }"
              @click="avatar = a"
            >
              {{ a }}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">昵称</label>
          <div class="input-icon">
            <span>👤</span>
            <input v-model="name" class="form-input" placeholder="2-12 个字符，同学会看到这个名字" maxlength="12" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">设置密码</label>
            <div class="input-icon">
              <span>🔒</span>
              <input v-model="pwd" type="password" class="form-input" placeholder="至少 6 位" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">再次输入</label>
            <div class="input-icon">
              <span>🫱</span>
              <input v-model="pwd2" type="password" class="form-input" placeholder="再输一次密码" />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">所在学院</label>
            <select v-model="college" class="form-input">
              <option value="">请选择学院</option>
              <option v-for="c in colleges" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">所在校区</label>
            <select v-model="campus" class="form-input">
              <option value="">请选择校区</option>
              <option v-for="c in campuses" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">年级</label>
            <select v-model="grade" class="form-input">
              <option value="">请选择年级</option>
              <option v-for="g in grades" :key="g" :value="g">{{ g }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">专业（选填）</label>
            <div class="input-icon">
              <span>📚</span>
              <input v-model="major" class="form-input" placeholder="如：软件工程" maxlength="20" />
            </div>
          </div>
        </div>

        <div class="form-options" style="justify-content: flex-start; gap: 8px; margin-top: 4px">
          <label style="gap: 8px">
            <input v-model="agree" type="checkbox" />
            我已阅读并同意 <a href="#" @click.prevent style="color: #409eff">《用户协议》</a> 与
            <a href="#" @click.prevent style="color: #409eff">《隐私政策》</a>
          </label>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 16px">
          <button class="btn-plain" @click="step = 1">← 返回</button>
          <button class="btn-primary" :disabled="loading" @click="submit">
            <span v-if="loading">注册中…</span>
            <span v-else>🎉 完成注册</span>
          </button>
        </div>
      </div>

      <!-- Step 3 -->
      <div v-if="step === 3" class="done-card">
        <div class="big-emoji">🎉</div>
        <h3>{{ (userStore.user?.name || '新同学') + '，欢迎加入校园轻集市！' }}</h3>
        <p>
          你的账号已创建，新人大礼包已放入你的背包 🎁<br />
          <span style="color: #409eff; font-weight: 600">
            🎫 首单立减 ¥20 · 🆓 发布置顶 1 天 · 🏷️ 跑腿免服务费
          </span>
          <br />
          <br />
          学院：<b>{{ college }}</b> · 校区：<b>{{ campus }}</b> · 年级：<b>{{ grade }}</b>
        </p>

        <div class="gift-list">
          <div class="gift-item">
            <span>🎫</span>
            <div>
              <b>满 50 减 20 券 ×1</b>
              <small>全场二手交易可用 · 30 天有效</small>
            </div>
          </div>
          <div class="gift-item">
            <span>🆓</span>
            <div>
              <b>发布置顶 1 天 ×1</b>
              <small>发布闲置可使用 · 曝光+300%</small>
            </div>
          </div>
          <div class="gift-item">
            <span>🏃</span>
            <div>
              <b>跑腿免服务费 ×1</b>
              <small>价值 ¥3 · 发跑腿任务可用</small>
            </div>
          </div>
        </div>

        <button class="btn-primary" @click="finish" style="margin-top: 18px; max-width: 280px; margin-inline: auto">
          🏃 立即进入首页 →
        </button>
        <div class="auth-foot" style="margin-top: 14px">
          <router-link to="/login">← 返回登录</router-link>
        </div>
      </div>

      <div v-if="step !== 3" class="auth-foot">
        已有账号？
        <router-link to="/login">去登录 →</router-link>
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
  background: linear-gradient(135deg, #fff5e6 0%, #f0f9ff 100%);
  position: relative;
}
.auth-card {
  width: 100%;
  max-width: 520px;
  padding: 36px 32px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.07);
  border: 1px solid #e8ecf2;
}
.auth-header {
  text-align: center;
  margin-bottom: 22px;
}
.auth-header .logo {
  width: 64px;
  height: 64px;
  line-height: 64px;
  text-align: center;
  background: linear-gradient(135deg, #e6a23c, #f3d19e);
  border-radius: 50%;
  font-size: 34px;
  margin: 0 auto 12px;
  box-shadow: 0 8px 20px rgba(230, 162, 60, 0.25);
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
.step-line {
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  gap: 8px;
}
.step-line .step {
  flex: 1;
  padding: 8px 10px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 12px;
  color: #909399;
  text-align: center;
  font-weight: 500;
  transition: 0.2s;
}
.step-line .step .num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  margin-right: 6px;
  font-size: 11px;
  color: #909399;
  border: 1px solid #e8ecf2;
}
.step-line .step.active {
  background: #ecf5ff;
  color: #409eff;
}
.step-line .step.active .num {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.step-line .step.done {
  background: #f0f9eb;
  color: #67c23a;
}
.step-line .step.done .num {
  background: #67c23a;
  color: #fff;
  border-color: #67c23a;
}
.step-line .split {
  width: 14px;
  height: 2px;
  background: #f2f6fc;
  border-radius: 2px;
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
.form-input,
select.form-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8ecf2;
  border-radius: 8px;
  font-size: 14px;
  color: #303133;
  background: #fafcff;
  outline: none;
  transition: 0.15s;
  appearance: none;
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
  height: 42px;
  align-self: center;
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
  margin-bottom: 10px;
  font-size: 12px;
  color: #909399;
}
.form-options label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-wrap: wrap;
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
.btn-plain {
  padding: 12px 22px;
  border: 1px solid #e8ecf2;
  background: #fff;
  color: #606266;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}
.btn-plain:hover {
  border-color: #409eff;
  color: #409eff;
}
.avatar-pick {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  margin: 8px 0 8px;
}
.avatar-opt {
  aspect-ratio: 1;
  border-radius: 50%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: 0.15s;
  border: 2px solid transparent;
}
.avatar-opt:hover {
  transform: scale(1.08);
  background: #ecf5ff;
}
.avatar-opt.active {
  border-color: #409eff;
  background: #ecf5ff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}
.auth-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 14px;
  padding: 10px 12px;
  background: #fff5e6;
  border-radius: 8px;
  line-height: 1.7;
  border: 1px solid #faecd8;
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
.done-card {
  text-align: center;
  padding: 10px 4px;
}
.done-card .big-emoji {
  font-size: 72px;
  line-height: 1;
  margin-bottom: 14px;
  animation: bounce 1s infinite alternate;
}
@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-8px);
  }
}
.done-card h3 {
  color: #303133;
  margin: 0 0 10px;
  font-size: 20px;
}
.done-card p {
  color: #606266;
  font-size: 13px;
  line-height: 1.8;
  margin: 0;
}
.gift-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  background: #fffaf0;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #faecd8;
}
.gift-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
}
.gift-item > span {
  font-size: 28px;
  flex-shrink: 0;
}
.gift-item b {
  display: block;
  color: #303133;
  font-size: 14px;
}
.gift-item small {
  color: #909399;
  font-size: 12px;
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
@media (max-width: 560px) {
  .auth-card {
    padding: 28px 20px;
  }
  .avatar-pick {
    grid-template-columns: repeat(6, 1fr);
  }
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
