<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const groupBuys = ref<GroupBuyItem[]>([])

const FALLBACK_GROUPBUYS: GroupBuyItem[] = [
  { id: 1, title: '周五晚火锅拼单', type: '拼餐', targetCount: 6, currentCount: 3, deadline: '2026-06-05 17:00', location: '学校南门', publisher: '计算机学院学生', status: 'open', description: 'AA 制，人数够后统一预约。' },
  { id: 2, title: '四六级资料团购', type: '学习资料', targetCount: 10, currentCount: 7, deadline: '2026-06-06 22:00', location: '线上确认', publisher: '外国语学院学生', status: 'open', description: '达到人数后统一下单。' },
  { id: 3, title: '喜茶满 50 减 20 拼单', type: '拼餐', targetCount: 4, currentCount: 2, deadline: '2026-06-04 15:00', location: '校门口喜茶店', publisher: '经管学院 2024 级', status: 'open', description: '已点 2 杯，还差 2 人，到宿舍楼下分。' },
  { id: 4, title: '毕业照服装租赁团购', type: '生活用品', targetCount: 20, currentCount: 12, deadline: '2026-06-08 18:00', location: '大礼堂门口', publisher: '学生会宣传部', status: 'open', description: '学士服 + 领结/领花，2 天 35 元/套，满 20 人再减 5 元。' },
  { id: 5, title: '美团奶茶 100 减 50 拼单', type: '拼餐', targetCount: 5, currentCount: 2, deadline: '2026-06-05 14:30', location: '中区宿舍楼下分', publisher: '爱喝奶茶的同学', status: 'open', description: '茶百道/古茗/沪上阿姨都可以，凑满 100 减 50，人均超便宜！' },
  { id: 6, title: '端午嘉兴粽子团购', type: '拼餐', targetCount: 30, currentCount: 18, deadline: '2026-06-09 12:00', location: '各宿舍区分发', publisher: '生活部端午活动', status: 'open', description: '鲜肉粽 + 豆沙粽 + 蜜枣粽，10 只装原价 60 现 39.9，含保温箱配送。' },
  { id: 7, title: '山姆会员店瑞士卷拼单', type: '拼餐', targetCount: 4, currentCount: 1, deadline: '2026-06-07 10:00', location: '校内小北门自提', publisher: '食品学院学生', status: 'open', description: '山姆 1.2kg 原味+伯爵茶瑞士卷，一份 16 块太多吃不完，拼每人 4 块 28 元。' },
  { id: 8, title: '考研政治全家桶团购', type: '学习资料', targetCount: 25, currentCount: 11, deadline: '2026-06-10 20:00', location: '宿舍楼下分发', publisher: '考研互助群', status: 'open', description: '肖秀荣 1000 题 + 精讲精练 + 肖四肖八，市场价 268，满 25 人团价 169，正版速发。' },
  { id: 9, title: '校园卡手机 NFC 贴团购', type: '生活用品', targetCount: 50, currentCount: 33, deadline: '2026-06-12 12:00', location: '统一到宿舍派送', publisher: '信息学院技术部', status: 'open', description: '超薄 NFC 贴片，手机背贴即可刷校园卡，测试完美兼容，单张 15 元，满 50 张 9.9。' },
  { id: 10, title: '密室逃脱毕业季团拼', type: '拼玩', targetCount: 8, currentCount: 5, deadline: '2026-06-10 18:00', location: '东门 X 次元密室', publisher: '毕业生活动小组', status: 'open', description: '网红恐怖主题「返校」，8 人开场满员更便宜，人均 78，包送饮料零食。' },
]

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getGroupBuys()
    groupBuys.value = res.data as GroupBuyItem[]
  } catch (e: any) {
    console.warn('[GroupBuy] API 请求失败，使用本地 fallback 数据：', e)
    groupBuys.value = FALLBACK_GROUPBUYS
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

function goDetail(id: number) {
  router.push({ path: `/detail/${id}`, query: { from: '/groupbuy' } })
}

function progress(item: GroupBuyItem) {
  if (!item.targetCount) return 0
  return Math.min(100, Math.round((item.currentCount / item.targetCount) * 100))
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>👥 拼单搭子</h1>
      <p class="sub">找一起拼餐、拼团、拼资料的小伙伴，省钱又社交～</p>
    </header>

    <section v-if="loading" class="state">⏳ 数据加载中...</section>
    <section v-else-if="error" class="state state--err">
      ❌ {{ error }}
      <button class="retry" @click="loadData">🔄 重新加载</button>
    </section>
    <EmptyState v-else-if="groupBuys.length === 0" icon="👥" text="暂无拼单信息，快来发起第一个吧！">
      <button class="empty-btn" @click="router.push('/publish')">📝 去发布</button>
    </EmptyState>

    <section v-else class="card-grid">
      <ItemCard
        v-for="item in groupBuys"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type"
        :location="item.location"
        :time="`截止 ${item.deadline}`"
        @click="goDetail(item.id)"
      >
        <template #footer>
          <div class="gb-foot">
            <div class="progress-wrap">
              <div class="bar"><div class="fill" :style="{ width: progress(item) + '%' }"></div></div>
              <span class="num">👥 {{ item.currentCount }} / {{ item.targetCount }}</span>
            </div>
            <span class="pub">{{ item.publisher }}</span>
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
.gb-foot {
  padding-top: 10px;
  border-top: 1px dashed #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bar {
  flex: 1;
  height: 8px;
  background: #ebeef5;
  border-radius: 999px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a, #85ce61);
  transition: width 0.3s;
}
.num {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}
.pub {
  align-self: flex-end;
  color: #909399;
  font-size: 12px;
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
