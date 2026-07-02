<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { createTrade, type CreateTradePayload } from '@/api/trade'
import { createLostFound, type CreateLostFoundPayload } from '@/api/lostFound'
import { createGroupBuy, type CreateGroupBuyPayload } from '@/api/groupBuy'
import { createErrand, type CreateErrandPayload } from '@/api/errand'
import { useUserStore } from '@/stores/user'

type PublishType = 'trade' | 'lostFound' | 'groupBuy' | 'errand'

const router = useRouter()
const userStore = useUserStore()
const publishType = ref<PublishType>('trade')
const submitting = ref(false)
const toastMsg = ref('')
const toastType = ref<'success' | 'warn'>('success')

const tradeCategories = ['电子数码', '数码配件', '教材资料', '生活用品', '服饰鞋包', '运动户外', '其他']
const conditions = ['全新未拆', '九成五新', '九成新', '八成新', '七成新及以下']
const lostFoundTypes: { label: string; value: 'lost' | 'found' }[] = [
  { label: '🔎 寻物启事（丢东西找）', value: 'lost' },
  { label: '📦 失物招领（捡到东西发布）', value: 'found' },
]
const groupBuyTypes = ['拼餐', '学习资料', '生活用品', '拼玩', '其他']
const taskTypes = ['取快递', '代买', '代送', '代排队', '代办', '其他']

const form = reactive({
  title: '',
  location: '',
  description: '',
  category: '',
  price: '' as number | '',
  condition: '',
  lostFoundType: 'lost' as 'lost' | 'found',
  itemName: '',
  eventTime: '',
  groupBuyType: '',
  targetCount: '' as number | '',
  taskType: '',
  reward: '' as number | '',
  from: '',
  to: '',
  deadline: '',
})

const errors = reactive<Record<string, string>>({
  title: '',
  location: '',
  description: '',
  category: '',
  price: '',
  condition: '',
  lostFoundType: '',
  itemName: '',
  eventTime: '',
  groupBuyType: '',
  targetCount: '',
  deadline: '',
  taskType: '',
  reward: '',
  from: '',
  to: '',
})

function clearErrors() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
}

function clearFieldError(key: keyof typeof errors) {
  if (errors[key]) errors[key] = ''
}

function validateField(key: keyof typeof errors): string {
  switch (key) {
    case 'title': {
      const v = form.title.trim()
      if (!v) return '请填写发布标题'
      if (v.length < 5) return `标题至少 5 个字（当前 ${v.length} 字）`
      if (v.length > 80) return `标题最多 80 个字（当前 ${v.length} 字）`
      return ''
    }
    case 'location': {
      const v = form.location.trim()
      if (!v) return '请填写地点信息'
      if (v.length < 2) return `地点至少 2 个字（当前 ${v.length} 字）`
      if (v.length > 60) return `地点最多 60 个字（当前 ${v.length} 字）`
      return ''
    }
    case 'description': {
      const v = form.description.trim()
      if (!v) return '请填写详细描述'
      if (v.length < 10) return `详细描述至少 10 个字（当前 ${v.length} 字）`
      if (v.length > 800) return `详细描述最多 800 个字（当前 ${v.length} 字）`
      return ''
    }
    case 'category': {
      if (publishType.value === 'trade' && !form.category) return '请从下拉列表中选择商品分类'
      return ''
    }
    case 'price': {
      if (publishType.value !== 'trade') return ''
      if (form.price === '' || form.price === null || (typeof form.price === 'number' && Number.isNaN(form.price))) return '请填写售价'
      const n = Number(form.price)
      if (Number.isNaN(n)) return '售价必须是合法数字'
      if (n <= 0) return `售价必须大于 0 元（当前 ${n}）`
      if (n > 999999) return `售价不能超过 999,999 元（当前 ${n}）`
      const parts = String(n).split('.')
      if (parts[1] && parts[1].length > 2) return '售价最多保留两位小数'
      return ''
    }
    case 'condition': {
      if (publishType.value === 'trade' && !form.condition) return '请从下拉列表中选择商品成色'
      return ''
    }
    case 'lostFoundType': {
      if (publishType.value === 'lostFound' && !form.lostFoundType) return '请选择招领类型（寻物启事 / 失物招领）'
      return ''
    }
    case 'itemName': {
      if (publishType.value !== 'lostFound') return ''
      const v = form.itemName.trim()
      if (!v) return '请填写物品名称'
      if (v.length < 2) return `物品名称至少 2 个字（当前 ${v.length} 字）`
      if (v.length > 40) return `物品名称最多 40 个字（当前 ${v.length} 字）`
      return ''
    }
    case 'eventTime': {
      if (publishType.value !== 'lostFound') return ''
      if (!form.eventTime) return '请选择失物/招领的发生时间'
      if (new Date(form.eventTime).getTime() > Date.now() + 60_000) return '发生时间不能晚于当前时间（允许误差 1 分钟）'
      return ''
    }
    case 'groupBuyType': {
      if (publishType.value === 'groupBuy' && !form.groupBuyType) return '请从下拉列表中选择拼单类型'
      return ''
    }
    case 'targetCount': {
      if (publishType.value !== 'groupBuy') return ''
      if (form.targetCount === '' || form.targetCount === null || (typeof form.targetCount === 'number' && Number.isNaN(form.targetCount))) return '请填写拼单目标人数'
      const n = Number(form.targetCount)
      if (!Number.isInteger(n)) return '目标人数必须是整数'
      if (n < 2) return `目标人数至少为 2 人（当前 ${n}）`
      if (n > 500) return `目标人数最多 500 人（当前 ${n}）`
      return ''
    }
    case 'taskType': {
      if (publishType.value === 'errand' && !form.taskType) return '请从下拉列表中选择跑腿任务类型'
      return ''
    }
    case 'reward': {
      if (publishType.value !== 'errand') return ''
      if (form.reward === '' || form.reward === null || (typeof form.reward === 'number' && Number.isNaN(form.reward))) return '请填写跑腿酬劳（免费请填 0）'
      const n = Number(form.reward)
      if (Number.isNaN(n)) return '酬劳必须是合法数字'
      if (n < 0) return `酬劳不能为负数（当前 ${n}），免费请填 0`
      if (n > 99999) return `酬劳最多 99,999 元（当前 ${n}）`
      const parts = String(n).split('.')
      if (parts[1] && parts[1].length > 2) return '酬劳最多保留两位小数'
      return ''
    }
    case 'from': {
      if (publishType.value !== 'errand') return ''
      const v = form.from.trim()
      if (!v) return '请填写取件地址'
      if (v.length < 2) return `取件地址至少 2 个字（当前 ${v.length} 字）`
      if (v.length > 80) return `取件地址最多 80 个字（当前 ${v.length} 字）`
      if (form.to.trim() && v === form.to.trim()) return '取件地址与送达地址不能相同'
      return ''
    }
    case 'to': {
      if (publishType.value !== 'errand') return ''
      const v = form.to.trim()
      if (!v) return '请填写送达地址'
      if (v.length < 2) return `送达地址至少 2 个字（当前 ${v.length} 字）`
      if (v.length > 80) return `送达地址最多 80 个字（当前 ${v.length} 字）`
      if (form.from.trim() && v === form.from.trim()) return '送达地址与取件地址不能相同'
      return ''
    }
    case 'deadline': {
      if (!['groupBuy', 'errand'].includes(publishType.value)) return ''
      if (!form.deadline) return '请选择截止时间'
      const t = new Date(form.deadline).getTime()
      const now = Date.now()
      if (Number.isNaN(t)) return '截止时间格式不正确'
      const min = 5 * 60 * 1000
      if (t <= now + min) return `截止时间必须晚于当前时间至少 5 分钟（避免刚刚发布就截止）`
      const max = 365 * 24 * 60 * 60 * 1000
      if (t > now + max) return '截止时间不能超过 1 年以后'
      return ''
    }
    default:
      return ''
  }
}

function nowDateTimeLocal(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function toDisplayDateTime(val: string): string {
  if (!val) return ''
  return val.replace('T', ' ')
}

watch(publishType, () => {
  resetForm()
  toastMsg.value = ''
})

function validateForm(): boolean {
  clearErrors()
  let ok = true
  const allKeys = Object.keys(errors) as (keyof typeof errors)[]
  for (const k of allKeys) {
    const msg = validateField(k)
    if (msg) {
      errors[k] = msg
      ok = false
    }
  }
  return ok
}

function showToast(msg: string, type: 'success' | 'warn' = 'success') {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => (toastMsg.value = ''), 2800)
}

async function handleSubmit() {
  if (!userStore.isLoggedIn) {
    alert('请先登录再发布')
    return
  }
  if (!validateForm()) {
    const firstKey = (Object.keys(errors) as (keyof typeof errors)[]).find((k) => errors[k])
    const firstMsg = firstKey ? errors[firstKey] : '请检查表单中的红色提示项'
    alert(`📝 表单校验未通过：\n\n${firstMsg}\n\n请修正后重新提交`)
    showToast('请检查表单中的红色提示项', 'warn')
    return
  }
  submitting.value = true
  const publishTypeLabel: Record<PublishType, string> = {
    trade: '二手交易',
    lostFound: '失物招领',
    groupBuy: '拼单搭子',
    errand: '跑腿委托',
  }
  const typeLabel = publishTypeLabel[publishType.value]
  try {
    let successMsg = ''
    let createdId: string | number | null = null
    switch (publishType.value) {
      case 'trade': {
        const payload: CreateTradePayload = {
          title: form.title.trim(),
          category: form.category,
          price: Number(form.price),
          condition: form.condition,
          location: form.location.trim(),
          publishTime: toDisplayDateTime(nowDateTimeLocal()),
          image: '',
          status: 'open',
          description: form.description.trim(),
          publisher: userStore.displayName,
        }
        const res = await createTrade(payload)
        createdId = res.data.id
        successMsg = `✅ 二手发布成功，ID=${createdId}`
        break
      }
      case 'lostFound': {
        const payload: CreateLostFoundPayload = {
          title: form.title.trim(),
          type: form.lostFoundType,
          itemName: form.itemName.trim(),
          location: form.location.trim(),
          eventTime: toDisplayDateTime(form.eventTime),
          contact: '站内消息联系',
          status: 'open',
          description: form.description.trim(),
          publisher: userStore.displayName,
        }
        const res = await createLostFound(payload)
        createdId = res.data.id
        const label = form.lostFoundType === 'lost' ? '寻物启事' : '失物招领'
        successMsg = `✅ ${label}发布成功，ID=${createdId}`
        break
      }
      case 'groupBuy': {
        const payload: CreateGroupBuyPayload = {
          title: form.title.trim(),
          type: form.groupBuyType,
          targetCount: Number(form.targetCount),
          currentCount: 1,
          deadline: toDisplayDateTime(form.deadline),
          location: form.location.trim(),
          status: 'open',
          description: form.description.trim(),
          publisher: userStore.displayName,
        }
        const res = await createGroupBuy(payload)
        createdId = res.data.id
        successMsg = `✅ 拼单发布成功，ID=${createdId}`
        break
      }
      case 'errand': {
        const payload: CreateErrandPayload = {
          title: form.title.trim(),
          taskType: form.taskType,
          reward: Number(form.reward),
          from: form.from.trim(),
          to: form.to.trim(),
          deadline: toDisplayDateTime(form.deadline),
          status: 'open',
          description: form.description.trim(),
          publisher: userStore.displayName,
        }
        const res = await createErrand(payload)
        createdId = res.data.id
        successMsg = `✅ 跑腿发布成功，ID=${createdId}`
        break
      }
    }
    showToast(successMsg)
    alert(`🎉 ${typeLabel}发布成功！\n\nID：${createdId ?? '-'}  \n发布人：${userStore.displayName}\n\n即将跳转至二手交易列表页查看~`)
    resetForm()
    setTimeout(() => router.push('/trade'), 800)
  } catch (e) {
    const rawMsg = e instanceof Error ? e.message : typeof e === 'string' ? e : '网络异常或接口错误'
    const fullMsg = `❌ ${typeLabel}发布失败：\n\n${rawMsg}\n\n请检查网络后重试，若仍失败可稍后再试。`
    showToast(`❌ 发布失败：${rawMsg}`, 'warn')
    alert(fullMsg)
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  clearErrors()
  form.title = ''
  form.location = ''
  form.description = ''
  form.category = ''
  form.price = ''
  form.condition = ''
  form.lostFoundType = 'lost'
  form.itemName = ''
  form.eventTime = ''
  form.groupBuyType = ''
  form.targetCount = ''
  form.taskType = ''
  form.reward = ''
  form.from = ''
  form.to = ''
  form.deadline = ''
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>📝 发布信息</h1>
      <p>选择发布类型，填写必要信息，让校园需求更快被看见。</p>
    </div>

    <Transition name="fade">
      <div v-if="toastMsg" class="toast" :class="toastType">{{ toastMsg }}</div>
    </Transition>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <FormField label="发布类型" required>
        <select
          v-model="publishType"
          @blur="(errors.lostFoundType = '', errors.category = '', errors.groupBuyType = '', errors.taskType = '')"
        >
          <option value="trade">🛒 二手交易</option>
          <option value="lostFound">🔍 失物招领</option>
          <option value="groupBuy">👥 拼单搭子</option>
          <option value="errand">🏃 跑腿委托</option>
        </select>
      </FormField>

      <FormField label="标题" required :error="errors.title">
        <input
          v-model.trim="form.title"
          type="text"
          maxlength="100"
          placeholder="例如：九成新机械键盘转让（5-80 字）"
          @input="clearFieldError('title')"
          @blur="errors.title = validateField('title')"
        />
      </FormField>

      <FormField label="地点" required :error="errors.location">
        <input
          v-model.trim="form.location"
          type="text"
          maxlength="60"
          placeholder="例如：主校区南门 / 图书馆三楼（2-60 字）"
          @input="clearFieldError('location')"
          @blur="errors.location = validateField('location')"
        />
      </FormField>

      <template v-if="publishType === 'trade'">
        <FormField label="商品分类" required :error="errors.category">
          <select
            v-model="form.category"
            @blur="errors.category = validateField('category')"
            @change="clearFieldError('category')"
          >
            <option value="">请选择分类</option>
            <option v-for="c in tradeCategories" :key="c" :value="c">{{ c }}</option>
          </select>
        </FormField>

        <FormField label="售价（元）" required :error="errors.price">
          <input
            v-model.number="form.price"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="例如：89（大于 0，最多两位小数）"
            @input="clearFieldError('price')"
            @blur="errors.price = validateField('price')"
          />
        </FormField>

        <FormField label="成色" required :error="errors.condition">
          <select
            v-model="form.condition"
            @blur="errors.condition = validateField('condition')"
            @change="clearFieldError('condition')"
          >
            <option value="">请选择成色</option>
            <option v-for="c in conditions" :key="c" :value="c">{{ c }}</option>
          </select>
        </FormField>
      </template>

      <template v-if="publishType === 'lostFound'">
        <FormField label="招领类型" required :error="errors.lostFoundType">
          <select
            v-model="form.lostFoundType"
            @blur="errors.lostFoundType = validateField('lostFoundType')"
            @change="clearFieldError('lostFoundType')"
          >
            <option v-for="t in lostFoundTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </FormField>

        <FormField label="物品名称" required :error="errors.itemName">
          <input
            v-model.trim="form.itemName"
            type="text"
            maxlength="40"
            placeholder="例如：黑色校园卡 / 蓝色雨伞（2-40 字）"
            @input="clearFieldError('itemName'); clearFieldError('lostFoundType')"
            @blur="errors.itemName = validateField('itemName')"
          />
        </FormField>

        <FormField label="发生时间" required :error="errors.eventTime">
          <input
            v-model="form.eventTime"
            type="datetime-local"
            :max="nowDateTimeLocal()"
            @change="clearFieldError('eventTime')"
            @blur="errors.eventTime = validateField('eventTime')"
          />
        </FormField>
      </template>

      <template v-if="publishType === 'groupBuy'">
        <FormField label="拼单类型" required :error="errors.groupBuyType">
          <select
            v-model="form.groupBuyType"
            @blur="errors.groupBuyType = validateField('groupBuyType')"
            @change="clearFieldError('groupBuyType')"
          >
            <option value="">请选择拼单类型</option>
            <option v-for="t in groupBuyTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </FormField>

        <FormField label="目标人数" required :error="errors.targetCount">
          <input
            v-model.number="form.targetCount"
            type="number"
            min="2"
            step="1"
            placeholder="例如：10（2-500 的整数）"
            @input="clearFieldError('targetCount')"
            @blur="errors.targetCount = validateField('targetCount')"
          />
        </FormField>

        <FormField label="截止时间" required :error="errors.deadline">
          <input
            v-model="form.deadline"
            type="datetime-local"
            :min="nowDateTimeLocal()"
            @change="clearFieldError('deadline')"
            @blur="errors.deadline = validateField('deadline')"
          />
        </FormField>
      </template>

      <template v-if="publishType === 'errand'">
        <FormField label="任务类型" required :error="errors.taskType">
          <select
            v-model="form.taskType"
            @blur="errors.taskType = validateField('taskType')"
            @change="clearFieldError('taskType')"
          >
            <option value="">请选择任务类型</option>
            <option v-for="t in taskTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </FormField>

        <FormField label="酬劳（元）" required :error="errors.reward">
          <input
            v-model.number="form.reward"
            type="number"
            min="0"
            step="0.5"
            placeholder="例如：5（≥ 0，最多两位小数，免费填 0）"
            @input="clearFieldError('reward')"
            @blur="errors.reward = validateField('reward')"
          />
        </FormField>

        <FormField label="取件" required :error="errors.from">
          <input
            v-model.trim="form.from"
            type="text"
            maxlength="80"
            placeholder="例如：菜鸟驿站（2-80 字，与送达不同）"
            @input="clearFieldError('from'); errors.to = validateField('to')"
            @blur="errors.from = validateField('from'); errors.to = validateField('to')"
          />
        </FormField>

        <FormField label="送达" required :error="errors.to">
          <input
            v-model.trim="form.to"
            type="text"
            maxlength="80"
            placeholder="例如：西区 5 栋 301（2-80 字，与取件不同）"
            @input="clearFieldError('to'); errors.from = validateField('from')"
            @blur="errors.to = validateField('to'); errors.from = validateField('from')"
          />
        </FormField>

        <FormField label="截止时间" required :error="errors.deadline">
          <input
            v-model="form.deadline"
            type="datetime-local"
            :min="nowDateTimeLocal()"
            @change="clearFieldError('deadline')"
            @blur="errors.deadline = validateField('deadline')"
          />
        </FormField>
      </template>

      <FormField label="详细描述" required :error="errors.description">
        <textarea
          v-model.trim="form.description"
          rows="5"
          maxlength="1000"
          placeholder="请简要描述具体情况，补充更多细节能更快得到响应（10-800 字）"
          @input="clearFieldError('description')"
          @blur="errors.description = validateField('description')"
        ></textarea>
      </FormField>

      <div class="actions">
        <button type="button" class="secondary" :disabled="submitting" @click="resetForm">重置</button>
        <button type="submit" class="primary" :disabled="submitting">
          {{ submitting ? '提交中...' : '发布' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page {
  max-width: 680px;
  margin: 0 auto;
  padding: 28px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 4px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.2px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.toast {
  align-self: center;
  padding: 10px 20px;
  border-radius: 8px;
  background: #1f2937;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.14);
  animation: toastIn 0.2s ease-out;
}

.toast.success {
  background: #10b981;
}

.toast.warn {
  background: #f59e0b;
}

@keyframes toastIn {
  from {
    transform: translateY(-6px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.publish-form {
  padding: 28px 30px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.publish-form :deep(.form-field) {
  margin-bottom: 0;
}

.publish-form :deep(.form-field__control input),
.publish-form :deep(.form-field__control textarea),
.publish-form :deep(.form-field__control select) {
  padding: 12px 14px;
  border-color: #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.publish-form :deep(.form-field__control input:focus),
.publish-form :deep(.form-field__control textarea:focus),
.publish-form :deep(.form-field__control select:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.publish-form :deep(.form-field__label) {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  padding-top: 4px;
}

.actions button {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.actions .primary {
  background: #3b82f6;
  color: #fff;
  border: 1px solid #3b82f6;
}

.actions .primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.actions .primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: saturate(0.7);
  pointer-events: none;
}

.actions .secondary {
  background: #fff;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.actions .secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #1f2937;
}

.actions .secondary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background: #f3f4f6;
  color: #9ca3af;
  pointer-events: none;
}

@media (max-width: 640px) {
  .page {
    padding: 20px 14px 40px;
    gap: 18px;
  }
  .publish-form {
    padding: 20px 18px;
  }
  .actions {
    flex-direction: column;
  }
}
</style>
