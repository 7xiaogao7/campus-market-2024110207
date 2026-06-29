<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getErrands, type ErrandItem } from '@/api/errand'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const errands = ref<ErrandItem[]>([])

const FALLBACK_ERRANDS: ErrandItem[] = [
  { id: 1, title: '帮取快递到宿舍楼下', taskType: '取快递', reward: 3, from: '菜鸟驿站', to: '西区 5 栋', deadline: '2026-06-03 19:00', publisher: '西区学生', status: 'open', description: '快递较轻，送到宿舍楼下即可。' },
  { id: 2, title: '帮买一份晚餐', taskType: '代买', reward: 5, from: '二食堂', to: '实验楼 302', deadline: '2026-06-03 18:30', publisher: '实验室学生', status: 'open', description: '需要在 18:30 前送到。' },
  { id: 3, title: '代排队图书馆占座 1 个', taskType: '代排队', reward: 6, from: '图书馆二楼门口', to: '图书馆三楼靠窗位', deadline: '2026-06-04 07:40', publisher: '考研党', status: 'open', description: '明早 7:40 前帮占 1 个靠窗座位，放书包即可。' },
  { id: 4, title: '东区到北区代送文件袋', taskType: '代送', reward: 4, from: '东区 2 栋 301', to: '北区行政楼 208', deadline: '2026-06-04 10:30', publisher: '行政办公室助理', status: 'open', description: '文件袋轻便，需签到领取，请 10:30 前送达。' },
  { id: 5, title: '帮忙打印 10 页论文到教室', taskType: '代办', reward: 5, from: '图书馆打印店', to: '教学楼 A305', deadline: '2026-06-04 13:50', publisher: '赶课的毕业党', status: 'open', description: '已经上传文件到打印店了，付完钱取出来送到教室，下午有答辩要用到！' },
  { id: 6, title: '帮从快递站搬大件到宿舍', taskType: '取快递', reward: 15, from: '京东派快递站', to: '中区 7 栋 6 楼', deadline: '2026-06-05 20:00', publisher: '中区学生', status: 'open', description: '洗衣机包装箱（10kg 左右），到 6 楼，男生优先，含矿泉水一瓶！' },
  { id: 7, title: '代取中药并送到校医院', taskType: '代办', reward: 10, from: '南门同仁堂', to: '校医院三楼护士站', deadline: '2026-06-06 11:00', publisher: '在校住院同学', status: 'open', description: '已预约好只需凭手机号取药，中药已付款，送护士站即可，万分感谢！' },
  { id: 8, title: '帮买三食堂早餐', taskType: '代买', reward: 3, from: '三食堂一楼', to: '西区 2 栋 502', deadline: '2026-06-07 07:50', publisher: '早八赶课学生', status: 'open', description: '2 个肉包子 + 1 杯豆浆（温），费用另算，7:50 前放门口就行。' },
  { id: 9, title: '代取顺丰冷链快递', taskType: '取快递', reward: 6, from: '西门顺丰营业点', to: '北区 11 栋 312', deadline: '2026-06-07 15:00', publisher: '北区学生', status: 'open', description: '生鲜冷链快递，务必 15:00 营业点下班前去取，可提供取件码，感谢！' },
  { id: 10, title: '周末代喂宿舍仓鼠一只', taskType: '代办', reward: 20, from: '南区 8 栋 403', to: '同宿舍', deadline: '2026-06-08 19:00 到 6月9日', publisher: '回家过端午的同学', status: 'open', description: '两天喂食换水就行，鼠鼠很乖不咬人，食物和说明都备好，可进门用备用钥匙。' },
]

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getErrands()
    errands.value = res.data as ErrandItem[]
  } catch (e: any) {
    console.warn('[Errand] API 请求失败，使用本地 fallback 数据：', e)
    errands.value = FALLBACK_ERRANDS
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

function goDetail(id: number) {
  router.push({ path: `/detail/${id}`, query: { from: '/errand' } })
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>🏃 跑腿委托</h1>
      <p class="sub">没时间取快递、买饭、送资料？在这里发一条，让顺路的同学帮你搞定！</p>
    </header>

    <section v-if="loading" class="state">⏳ 数据加载中...</section>
    <section v-else-if="error" class="state state--err">
      ❌ {{ error }}
      <button class="retry" @click="loadData">🔄 重新加载</button>
    </section>
    <EmptyState v-else-if="errands.length === 0" icon="🏃" text="暂无跑腿委托，有时间也可以来接单哦～">
      <button class="empty-btn" @click="router.push('/publish')">📝 去发布</button>
    </EmptyState>

    <section v-else class="card-grid">
      <ItemCard
        v-for="item in errands"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.taskType"
        :location="`${item.from} → ${item.to}`"
        :time="`截止 ${item.deadline}`"
        @click="goDetail(item.id)"
      >
        <template #footer>
          <div class="er-foot">
            <span class="route">📍 {{ item.from }} → {{ item.to }}</span>
            <div class="right">
              <span class="pub">{{ item.publisher }}</span>
              <span class="reward">💰 ¥{{ item.reward }}</span>
            </div>
          </div>
        </template>
      </ItemCard>
    </section>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.page-header h1 {
  margin: 0;
  font-size: 26px;
  color: #303133;
}
.sub {
  margin: 6px 0 0 0;
  color: #909399;
  font-size: 14px;
}
.state {
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border: 1px dashed #dcdfe6;
  border-radius: 12px;
  color: #909399;
}
.state--err {
  color: #f56c6c;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.retry {
  border: none;
  background: #409eff;
  color: #fff;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.er-foot {
  padding-top: 10px;
  border-top: 1px dashed #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13px;
}
.route {
  color: #606266;
}
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pub {
  color: #909399;
  font-size: 12px;
}
.reward {
  font-size: 18px;
  font-weight: 700;
  color: #e6a23c;
}
.empty-btn {
  margin-top: 6px;
  padding: 8px 20px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.15s;
  font-family: inherit;
}
.empty-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.28);
}
</style>
