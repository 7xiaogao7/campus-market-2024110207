<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const lostFounds = ref<LostFoundItem[]>([])

const FALLBACK_LOSTFOUNDS: LostFoundItem[] = [
  { id: 1, title: '寻找黑色校园卡', type: 'lost', itemName: '校园卡', location: '一食堂附近', eventTime: '2026-06-02 12:10', contact: '站内消息联系', status: 'open', description: '校园卡卡套为黑色，内有学生证。' },
  { id: 2, title: '拾到蓝色雨伞', type: 'found', itemName: '雨伞', location: '教学楼 A 区', eventTime: '2026-06-02 18:40', contact: '站内消息联系', status: 'open', description: '雨伞放在 A 区一楼值班室。' },
  { id: 3, title: '寻找银色 AirPods Pro', type: 'lost', itemName: '耳机', location: '图书馆 3 楼自习区', eventTime: '2026-06-03 15:30', contact: '138****5678', status: 'open', description: '白色充电盒有小黄人贴纸，拾到者重金酬谢！' },
  { id: 4, title: '拾到黑色双肩书包', type: 'found', itemName: '书包', location: '体育馆篮球场', eventTime: '2026-06-03 19:00', contact: '站内消息联系', status: 'open', description: '书包内有笔记本和水杯，暂存于体育馆门卫室。' },
  { id: 5, title: '寻找遗失的灰色兔耳伞', type: 'lost', itemName: '雨伞', location: '教学楼 C 栋 5 楼走廊', eventTime: '2026-06-04 08:20', contact: 'QQ 22334455', status: 'open', description: '灰色长柄伞，伞柄有一对兔耳朵装饰，是好朋友送的生日礼物，非常重要！' },
  { id: 6, title: '拾到学生证（计算机学院）', type: 'found', itemName: '学生证', location: '二食堂二楼', eventTime: '2026-06-04 12:45', contact: '站内消息联系', status: 'open', description: '学生证姓名为两个字，计算机学院，请失主带身份验证领取。' },
  { id: 7, title: '寻找粉色保温杯', type: 'lost', itemName: '保温杯', location: '教学楼 B 栋 3 楼教室', eventTime: '2026-06-05 10:30', contact: '站内消息联系', status: 'open', description: '膳魔师粉色保温杯，杯身贴有 LINE FRIENDS 贴纸，对我很重要！' },
  { id: 8, title: '拾到一副黑框眼镜', type: 'found', itemName: '眼镜', location: '图书馆 5 楼角落座位', eventTime: '2026-06-05 21:00', contact: '图书馆服务台', status: 'open', description: '黑框近视眼镜，度数不详，已交图书馆一楼服务台保管。' },
  { id: 9, title: '寻找白色充电宝', type: 'lost', itemName: '充电宝', location: '三食堂或操场看台', eventTime: '2026-06-06 13:00', contact: '微信 wx123456', status: 'open', description: '小米 20000mAh 白色充电宝，有一角摔痕，里面有重要充电线一起丢失。' },
  { id: 10, title: '拾到一串门禁卡', type: 'found', itemName: '门禁卡', location: '实验楼 A 栋大厅', eventTime: '2026-06-06 17:20', contact: '实验楼物业前台', status: 'open', description: '两张实验室门禁卡 + 一张校园卡，已交实验楼前台，请失主前去认领。' },
]

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getLostFounds()
    lostFounds.value = res.data as LostFoundItem[]
  } catch (e: any) {
    console.warn('[LostFound] API 请求失败，使用本地 fallback 数据：', e)
    lostFounds.value = FALLBACK_LOSTFOUNDS
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

function goDetail(id: number) {
  router.push({ path: `/detail/${id}`, query: { from: '/lostfound' } })
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>🔍 失物招领</h1>
      <p class="sub">汇聚校园寻物 / 拾获信息，互帮互助物归原主</p>
    </header>

    <section v-if="loading" class="state">⏳ 数据加载中...</section>
    <section v-else-if="error" class="state state--err">
      ❌ {{ error }}
      <button class="retry" @click="loadData">🔄 重新加载</button>
    </section>
    <EmptyState v-else-if="lostFounds.length === 0" icon="🔍" text="暂无失物招领信息">
      <button class="empty-btn" @click="router.push('/publish')">📝 去发布</button>
    </EmptyState>

    <section v-else class="card-grid">
      <ItemCard
        v-for="item in lostFounds"
        :key="item.id"
        :id="item.id"
        type="lostFound"
        :title="item.title"
        :description="item.description"
        :tag="item.type === 'lost' ? '🔍 寻物启事' : '📦 失物招领'"
        :location="item.location"
        :time="item.eventTime"
        @click="goDetail(item.id)"
      >
        <template #footer>
          <div class="lf-foot">
            <span class="name-tag">物品：{{ item.itemName }}</span>
            <span class="status" :class="item.status">{{ item.status === 'open' ? '🟢 处理中' : '✅ 已完成' }}</span>
            <span class="contact">📞 {{ item.contact }}</span>
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
.lf-foot {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px dashed #ebeef5;
  font-size: 13px;
}
.name-tag {
  padding: 2px 8px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 6px;
}
.status {
  color: #67c23a;
}
.contact {
  margin-left: auto;
  color: #909399;
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
