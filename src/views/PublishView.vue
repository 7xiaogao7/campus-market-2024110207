<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { createTrade, type CreateTradePayload } from '@/api/trade'
import { createLostFound, type CreateLostFoundPayload } from '@/api/lostFound'
import { createGroupBuy, type CreateGroupBuyPayload } from '@/api/groupBuy'
import { createErrand, type CreateErrandPayload } from '@/api/errand'

type PublishType = 'trade' | 'lostFound' | 'groupBuy' | 'errand'

const router = useRouter()
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

  if (!form.title.trim()) {
    errors.title = '请输入标题'
    ok = false
  }
  if (!form.location.trim()) {
    errors.location = '请输入地点'
    ok = false
  }
  if (!form.description.trim()) {
    errors.description = '请输入详细描述'
    ok = false
  }

  switch (publishType.value) {
    case 'trade':
      if (!form.category) {
        errors.category = '请选择商品分类'
        ok = false
      }
      if (form.price === '' || Number(form.price) <= 0) {
        errors.price = '价格必须大于 0'
        ok = false
      }
      if (!form.condition) {
        errors.condition = '请选择成色'
        ok = false
      }
      break
    case 'lostFound':
      if (!form.lostFoundType) {
        errors.lostFoundType = '请选择招领类型'
        ok = false
      }
      if (!form.itemName.trim()) {
        errors.itemName = '请输入物品名称'
        ok = false
      }
      if (!form.eventTime) {
        errors.eventTime = '请选择发生时间'
        ok = false
      }
      break
    case 'groupBuy':
      if (!form.groupBuyType) {
        errors.groupBuyType = '请选择拼单类型'
        ok = false
      }
      if (form.targetCount === '' || Number(form.targetCount) < 2) {
        errors.targetCount = '目标人数至少为 2'
        ok = false
      }
      if (!form.deadline) {
        errors.deadline = '请选择截止时间'
        ok = false
      }
      break
    case 'errand':
      if (!form.taskType) {
        errors.taskType = '请选择任务类型'
        ok = false
      }
      if (form.reward === '' || Number(form.reward) < 0) {
        errors.reward = '酬劳不能为负数'
        ok = false
      }
      if (!form.from.trim()) {
        errors.from = '请输入取件地址'
        ok = false
      }
      if (!form.to.trim()) {
        errors.to = '请输入送达地址'
        ok = false
      }
      if (!form.deadline) {
        errors.deadline = '请选择截止时间'
        ok = false
      }
      break
  }

  return ok
}

function showToast(msg: string, type: 'success' | 'warn' = 'success') {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => (toastMsg.value = ''), 2800)
}

async function handleSubmit() {
  if (!validateForm()) {
    showToast('请检查表单中的红色提示项', 'warn')
    return
  }
  submitting.value = true
  try {
    let successMsg = ''
    let jumpTo = ''
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
        }
        const res = await createTrade(payload)
        successMsg = `✅ 二手发布成功，ID=${res.data.id}`
        jumpTo = '/trade'
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
        }
        const res = await createLostFound(payload)
        const label = form.lostFoundType === 'lost' ? '寻物启事' : '失物招领'
        successMsg = `✅ ${label}发布成功，ID=${res.data.id}`
        jumpTo = '/lost-found'
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
        }
        const res = await createGroupBuy(payload)
        successMsg = `✅ 拼单发布成功，ID=${res.data.id}`
        jumpTo = '/group-buy'
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
        }
        const res = await createErrand(payload)
        successMsg = `✅ 跑腿发布成功，ID=${res.data.id}`
        jumpTo = '/errand'
        break
      }
    }
    showToast(successMsg)
    resetForm()
    setTimeout(() => router.push(jumpTo), 1200)
  } catch (e: any) {
    console.error(e)
    showToast(`❌ 发布失败：${e?.message ?? '请稍后再试'}`, 'warn')
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
        <select v-model="publishType">
          <option value="trade">🛒 二手交易</option>
          <option value="lostFound">🔍 失物招领</option>
          <option value="groupBuy">👥 拼单搭子</option>
          <option value="errand">🏃 跑腿委托</option>
        </select>
      </FormField>

      <FormField label="标题" required :error="errors.title">
        <input v-model.trim="form.title" type="text" placeholder="例如：九成新机械键盘转让" />
      </FormField>

      <FormField label="地点" required :error="errors.location">
        <input v-model.trim="form.location" type="text" placeholder="例如：主校区南门 / 图书馆三楼" />
      </FormField>

      <template v-if="publishType === 'trade'">
        <FormField label="商品分类" required :error="errors.category">
          <select v-model="form.category">
            <option value="">请选择分类</option>
            <option v-for="c in tradeCategories" :key="c" :value="c">{{ c }}</option>
          </select>
        </FormField>

        <FormField label="售价（元）" required :error="errors.price">
          <input v-model.number="form.price" type="number" min="0" step="0.01" placeholder="例如：89" />
        </FormField>

        <FormField label="成色" required :error="errors.condition">
          <select v-model="form.condition">
            <option value="">请选择成色</option>
            <option v-for="c in conditions" :key="c" :value="c">{{ c }}</option>
          </select>
        </FormField>
      </template>

      <template v-if="publishType === 'lostFound'">
        <FormField label="招领类型" required :error="errors.lostFoundType">
          <select v-model="form.lostFoundType">
            <option v-for="t in lostFoundTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </FormField>

        <FormField label="物品名称" required :error="errors.itemName">
          <input v-model.trim="form.itemName" type="text" placeholder="例如：黑色校园卡 / 蓝色雨伞" />
        </FormField>

        <FormField label="发生时间" required :error="errors.eventTime">
          <input v-model="form.eventTime" type="datetime-local" />
        </FormField>
      </template>

      <template v-if="publishType === 'groupBuy'">
        <FormField label="拼单类型" required :error="errors.groupBuyType">
          <select v-model="form.groupBuyType">
            <option value="">请选择拼单类型</option>
            <option v-for="t in groupBuyTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </FormField>

        <FormField label="目标人数" required :error="errors.targetCount">
          <input v-model.number="form.targetCount" type="number" min="2" placeholder="例如：10" />
        </FormField>

        <FormField label="截止时间" required :error="errors.deadline">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <template v-if="publishType === 'errand'">
        <FormField label="任务类型" required :error="errors.taskType">
          <select v-model="form.taskType">
            <option value="">请选择任务类型</option>
            <option v-for="t in taskTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </FormField>

        <FormField label="酬劳（元）" required :error="errors.reward">
          <input v-model.number="form.reward" type="number" min="0" step="0.5" placeholder="例如：5" />
        </FormField>

        <FormField label="取件" required :error="errors.from">
          <input v-model.trim="form.from" type="text" placeholder="例如：菜鸟驿站" />
        </FormField>

        <FormField label="送达" required :error="errors.to">
          <input v-model.trim="form.to" type="text" placeholder="例如：西区 5 栋 301" />
        </FormField>

        <FormField label="截止时间" required :error="errors.deadline">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <FormField label="详细描述" required :error="errors.description">
        <textarea v-model.trim="form.description" rows="5" placeholder="请简要描述具体情况，补充更多细节能更快得到响应"></textarea>
      </FormField>

      <div class="actions">
        <button type="button" class="secondary" @click="resetForm">重置</button>
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
}

.actions .secondary {
  background: #fff;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.actions .secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #1f2937;
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
