<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers, createUser } from '@/api/user'

const router = useRouter()
const submitting = ref(false)

const form = reactive({
  username: '',
  password: '',
  name: '',
  college: '',
  grade: '',
})

type FormKey = keyof typeof form
const errors = reactive<Record<FormKey, string>>({
  username: '',
  password: '',
  name: '',
  college: '',
  grade: '',
})

const gradeOptions = ['2021级', '2022级', '2023级', '2024级', '2025级']

const collegeOptions = [
  '计算机科学与技术学院',
  '软件工程学院',
  '数学学院',
  '物理学院',
  '外国语学院',
  '经济管理学院',
  '法学院',
  '艺术学院',
  '机械工程学院',
  '化学与化工学院',
  '其他学院',
]

function clearErrors() {
  const keys = Object.keys(errors) as FormKey[]
  keys.forEach((k) => {
    errors[k] = ''
  })
}

function validateForm(): boolean {
  clearErrors()
  let ok = true

  if (!form.username.trim()) {
    errors.username = '请输入用户名（手机号）'
    ok = false
  } else if (!/^1\d{10}$/.test(form.username.trim())) {
    errors.username = '用户名应为 11 位手机号'
    ok = false
  }

  if (!form.password.trim()) {
    errors.password = '请输入密码'
    ok = false
  } else if (form.password.length < 6) {
    errors.password = '密码至少 6 位'
    ok = false
  }

  if (!form.name.trim()) {
    errors.name = '请输入姓名'
    ok = false
  }

  if (!form.college.trim()) {
    errors.college = '请选择学院'
    ok = false
  }

  if (!form.grade.trim()) {
    errors.grade = '请选择年级'
    ok = false
  }

  return ok
}

async function handleSubmit() {
  if (!validateForm()) return
  submitting.value = true
  try {
    const { data } = await getUsers({ phone: form.username.trim() })
    if (data && data.length > 0) {
      alert('该用户名（手机号）已被注册，请换一个或直接登录')
      return
    }

    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`

    await createUser({
      phone: form.username.trim(),
      password: form.password,
      name: form.name.trim(),
      college: form.college,
      grade: form.grade,
      avatar: '😀',
      bio: '',
      createdAt,
    })

    alert('🎉 注册成功，请用新账号登录')
    router.push('/login')
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : '网络异常，请稍后重试'
    alert('❌ 注册失败：' + errMsg)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="register-page">
    <div class="register-card">
      <h1 class="title">🎁 注册校园轻集市</h1>
      <p class="subtitle">填写基本信息，开通你的校园账号</p>

      <form class="form" @submit.prevent="handleSubmit">
        <div class="field">
          <label>用户名（手机号）<span class="required">*</span></label>
          <input
            v-model.trim="form.username"
            type="tel"
            placeholder="请输入 11 位手机号"
            maxlength="11"
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
            placeholder="至少 6 位"
            :class="{ error: !!errors.password }"
            @input="errors.password = ''"
          />
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
        </div>

        <div class="field">
          <label>姓名<span class="required">*</span></label>
          <input
            v-model.trim="form.name"
            type="text"
            placeholder="请输入真实姓名或昵称"
            :class="{ error: !!errors.name }"
            @input="errors.name = ''"
          />
          <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
        </div>

        <div class="field">
          <label>学院<span class="required">*</span></label>
          <select
            v-model="form.college"
            :class="{ error: !!errors.college }"
            @change="errors.college = ''"
          >
            <option value="">请选择学院</option>
            <option v-for="c in collegeOptions" :key="c" :value="c">{{ c }}</option>
          </select>
          <p v-if="errors.college" class="error-text">{{ errors.college }}</p>
        </div>

        <div class="field">
          <label>年级<span class="required">*</span></label>
          <select
            v-model="form.grade"
            :class="{ error: !!errors.grade }"
            @change="errors.grade = ''"
          >
            <option value="">请选择年级</option>
            <option v-for="g in gradeOptions" :key="g" :value="g">{{ g }}</option>
          </select>
          <p v-if="errors.grade" class="error-text">{{ errors.grade }}</p>
        </div>

        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? '提交中...' : '立即注册' }}
        </button>
      </form>

      <p class="login-link">
        已有账号？<router-link to="/login">去登录 →</router-link>
      </p>
    </div>
  </section>
</template>

<style scoped>
.register-page {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #eaf4ff 0%, #f0faf0 100%);
}

.register-card {
  width: 100%;
  max-width: 460px;
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
  margin: 0 0 28px;
  color: #909399;
  text-align: center;
  font-size: 14px;
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

.field input,
.field select {
  padding: 10px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, background 0.2s;
  background: #ffffff;
  box-sizing: border-box;
}

.field input:focus,
.field select:focus {
  outline: none;
  border-color: #409eff;
  background: #f5faff;
}

.field input.error,
.field select.error {
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

.login-link {
  margin: 24px 0 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 520px) {
  .register-card {
    padding: 24px 20px;
  }
  .title {
    font-size: 20px;
  }
}
</style>
