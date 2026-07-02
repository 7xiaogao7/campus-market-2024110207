<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { getTrades, type TradeItem } from '@/api/trade'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const searchKeyword = ref('')
const allTrades = ref<TradeItem[]>([])

const FALLBACK_TRADES: TradeItem[] = [
  { id: 1, title: '九成新机械键盘', category: '数码配件', price: 89, condition: '九成新', location: '东区宿舍', publisher: '软件工程 2023 级学生', publishTime: '2026-06-01 10:20', image: '', status: 'open', description: '键盘使用正常，因更换设备转让。' },
  { id: 2, title: '高等数学教材', category: '教材资料', price: 18, condition: '八成新', location: '图书馆门口', publisher: '数学学院学生', publishTime: '2026-06-01 14:30', image: '', status: 'open', description: '教材有少量笔记，不影响使用。' },
  { id: 3, title: 'iPad Air 5 256G 带笔', category: '电子数码', price: 3299, condition: '九成五新', location: '主校区东门', publisher: '计算机学院 2022 级', publishTime: '2026-06-02 09:15', image: '', status: 'open', description: '带原装充电器和一代 Apple Pencil，屏幕无划痕，带保护壳。' },
  { id: 4, title: '小米电动滑板车 1S', category: '生活用品', price: 899, condition: '八成新', location: '北区自行车棚', publisher: '机械工程学院', publishTime: '2026-06-02 16:40', image: '', status: 'open', description: '续航约 20 公里，毕业出售，校园代步神器。' },
  { id: 5, title: '全新未拆封小米手环 8', category: '数码配件', price: 229, condition: '全新未拆', location: '主校区南门', publisher: '信息学院 2023 级', publishTime: '2026-06-03 12:00', image: '', status: 'open', description: '京东购入，全新未拆封，支持 NFC，原价 279，因生日收了两个转一个。' },
  { id: 6, title: '耐克 Air Force 1 42 码', category: '服饰鞋包', price: 299, condition: '九成新', location: '南区宿舍 3 栋', publisher: '经管学院学生', publishTime: '2026-06-03 20:25', image: '', status: 'open', description: '正品闲置，只穿过 3 次，鞋盒小票齐全。' },
  { id: 7, title: '罗技 G304 无线鼠标', category: '数码配件', price: 119, condition: '九成新', location: '中区宿舍', publisher: '软件工程 2022 级', publishTime: '2026-06-04 09:50', image: '', status: 'open', description: '自用半年，打游戏定位准，续航超长，送全新接收器电池。' },
  { id: 8, title: '线性代数同济第六版', category: '教材资料', price: 12, condition: '七成新', location: '图书馆二楼', publisher: '土木学院学生', publishTime: '2026-06-04 15:20', image: '', status: 'open', description: '有笔记但整理得很清晰，期末必过！送课后习题答案电子版。' },
  { id: 9, title: '小米台灯 Pro', category: '生活用品', price: 79, condition: '八成新', location: '西区 6 栋', publisher: '设计学院学生', publishTime: '2026-06-05 10:10', image: '', status: 'open', description: '护眼台灯，多档亮度色温可调，USB 充电，学习必备。' },
  { id: 10, title: '优衣库纯棉 T 恤 M 码', category: '服饰鞋包', price: 35, condition: '全新未拆', location: '南区 1 栋', publisher: '经管学院 2024 级', publishTime: '2026-06-05 19:30', image: '', status: 'open', description: '买多了一件，白色基础款，百搭不过时，吊牌未拆，原价 99。' },
]

const filteredTrades = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return allTrades.value
  return allTrades.value.filter((it) =>
    [it.title, it.description, it.category, it.location, String(it.publisher ?? '')]
      .join(' ')
      .toLowerCase()
      .includes(kw),
  )
})

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getTrades()
    allTrades.value = res.data as TradeItem[]
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载二手商品失败，请稍后再试'
    allTrades.value = FALLBACK_TRADES
  } finally {
    loading.value = false
  }
}

function onSearch() {}

onMounted(loadData)

function goDetail(id: number) {
  router.push({ path: `/detail/${id}`, query: { from: '/trade' } })
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div class="left">
        <h1>🛒 二手交易</h1>
        <p class="sub">浏览同学们发布的二手好物，支持按成色、分类、地点筛选</p>
        <span class="count">共 {{ filteredTrades.length }} 件商品{{ searchKeyword.trim() ? `（搜索：${searchKeyword.trim()}）` : '' }}</span>
      </div>
    </header>

    <SearchBar
      v-model="searchKeyword"
      placeholder="搜索商品名称、分类、成色、地点或发布人…"
      @search="onSearch"
    />

    <LoadingState v-if="loading" text="正在加载二手好物…" />
    <ErrorState
      v-else-if="error && filteredTrades.length === 0"
      :error="error"
      @retry="loadData"
    />
    <EmptyState
      v-else-if="filteredTrades.length === 0"
      icon="🛒"
      :text="searchKeyword.trim() ? `没有找到与「${searchKeyword.trim()}」相关的二手商品` : '暂无二手商品，快去发布第一件吧～'"
    >
      <template v-if="!searchKeyword.trim()">
        <button class="empty-btn" @click="router.push('/publish')">📝 去发布</button>
      </template>
      <template v-else>
        <button class="empty-btn" @click="searchKeyword = ''">✕ 清空搜索条件</button>
      </template>
    </EmptyState>

    <section v-else class="card-grid">
      <article
        v-for="item in filteredTrades"
        :key="item.id"
        class="trade-card"
        @click="goDetail(item.id)"
      >
        <ItemCard
          :id="item.id"
          type="trade"
          :title="item.title"
          :description="item.description"
          :tag="item.category"
          :location="item.location"
          :time="item.publishTime"
        >
          <template #footer>
            <div class="trade-foot">
              <div class="left">
                <span class="price">¥{{ item.price }}</span>
                <span class="cond">{{ item.condition }}</span>
              </div>
              <span class="pub">{{ item.publisher }}</span>
            </div>
          </template>
        </ItemCard>
      </article>
    </section>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.left h1 {
  margin: 0;
  font-size: 26px;
  color: #303133;
}
.sub {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
.count {
  color: #606266;
  font-size: 13px;
  font-weight: 500;
}
.right {
  flex-shrink: 0;
}
.fav-entry {
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid #faecd1;
  background: linear-gradient(135deg, #fff9e6, #fffbeb);
  color: #b88230;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.15s;
  font-family: inherit;
}
.fav-entry:hover {
  background: linear-gradient(135deg, #fff3d0, #faeccf);
  border-color: #e6a23c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.18);
}
.toast {
  align-self: center;
  padding: 10px 22px;
  border-radius: 999px;
  background: #303133;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  animation: toastIn 0.2s ease-out;
}
.toast.success {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}
.toast.warn {
  background: linear-gradient(135deg, #e6a23c, #f0c78a);
}
@keyframes toastIn {
  from {
    transform: translateY(-8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
.trade-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.trade-card:hover {
  transform: translateY(-2px);
}
.trade-card :deep(.item-card) {
  height: 100%;
  transition: all 0.2s;
}
.trade-card:hover :deep(.item-card) {
  border-color: #b3d8ff;
  box-shadow: 0 6px 18px rgba(64, 158, 255, 0.1);
}
.trade-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ebeef5;
}
.left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.price {
  font-size: 20px;
  font-weight: 700;
  color: #f56c6c;
}
.cond {
  padding: 2px 8px;
  border-radius: 999px;
  background: #f0f9eb;
  color: #67c23a;
  font-size: 12px;
}
.right-foot {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pub {
  color: #909399;
  font-size: 13px;
}
.fav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ebeef5;
  background: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  padding: 0;
}
.fav-btn:hover {
  transform: scale(1.12);
  border-color: #ffd2d2;
  background: #fff7f7;
}
.fav-btn.favored {
  border-color: #ffc1c1;
  background: #fff1f0;
  transform: scale(1);
  animation: favPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes favPop {
  0% { transform: scale(0.7); }
  60% { transform: scale(1.25); }
  100% { transform: scale(1); }
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
@media (max-width: 720px) {
  .page-header {
    align-items: flex-start;
  }
}
</style>
