<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import ItemCard from '@/components/ItemCard.vue'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore, type FavoriteItem, type FavoriteType } from '@/stores/favorite'
import { getTrades, type TradeItem } from '@/api/trade'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import { getErrands, type ErrandItem } from '@/api/errand'

const router = useRouter()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const loading = ref(false)
const myTrades = ref<TradeItem[]>([])
const myGroupBuys = ref<GroupBuyItem[]>([])
const myErrands = ref<ErrandItem[]>([])

const typeLabelMap: Record<FavoriteType, string> = {
  trade: '🛒 二手',
  lostFound: '🔍 失物',
  groupBuy: '👥 拼单',
  errand: '🏃 跑腿',
}

async function loadMyPublished() {
  loading.value = true
  try {
    const [tr, gb, er] = await Promise.all([
      getTrades().catch(() => ({ data: [] as TradeItem[] })),
      getGroupBuys().catch(() => ({ data: [] as GroupBuyItem[] })),
      getErrands().catch(() => ({ data: [] as ErrandItem[] })),
    ])
    const pubName = userStore.displayName
    myTrades.value = (tr.data ?? []).filter((i) => i.publisher === pubName)
    myGroupBuys.value = (gb.data ?? []).filter((i) => i.publisher === pubName)
    myErrands.value = (er.data ?? []).filter((i) => i.publisher === pubName)
  } catch (e) {
    console.warn('[Profile] 加载我的发布失败：', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadMyPublished)

function handleRemoveFavorite(item: FavoriteItem) {
  favoriteStore.removeFavorite(item.type, item.id)
}

function doLogout() {
  if (confirm('确定退出登录吗？')) {
    userStore.logout()
    setTimeout(() => router.push('/login'), 300)
  }
}
</script>

<template>
  <div class="uc-page">
    <!-- ① 用户资料区 -->
    <section class="uc-card uc-profile">
      <div class="avatar">{{ userStore.user.avatar }}</div>
      <div class="info">
        <h2 class="name">{{ userStore.user.name }}</h2>
        <div class="meta-row">
          <span class="tag t1">🏫 {{ userStore.user.college }}</span>
          <span class="tag t2">📅 {{ userStore.user.grade }}</span>
        </div>
        <p class="bio">{{ userStore.user.bio || '这个人很懒，还没有填写个性简介～' }}</p>
      </div>
      <div class="actions">
        <button class="btn btn-primary" @click="router.push('/publish')">📝 去发布</button>
        <button class="btn btn-plain" @click="doLogout">🚪 退出登录</button>
      </div>
    </section>

    <!-- ② 我的收藏区 -->
    <section class="uc-card">
      <h3 class="uc-title">⭐ 我的收藏 <small>共 {{ favoriteStore.favoriteCount }} 条</small></h3>
      <EmptyState
        v-if="favoriteStore.favorites.length === 0"
        icon="⭐"
        text="还没有收藏过任何内容，快去列表页挑点喜欢的吧～"
      >
        <button class="empty-btn" @click="router.push('/trade')">🛒 逛逛二手市场</button>
      </EmptyState>
      <div v-else class="fav-grid">
        <article v-for="f in favoriteStore.favorites" :key="`${f.type}-${f.id}`" class="fav-card">
          <header>
            <span class="type-tag">{{ typeLabelMap[f.type] }}</span>
            <span class="fav-loc">📍 {{ f.location }}</span>
          </header>
          <h4>{{ f.title }}</h4>
          <p class="desc">{{ f.description }}</p>
          <footer>
            <button class="btn btn-sm btn-danger" @click="handleRemoveFavorite(f)">💔 取消收藏</button>
          </footer>
        </article>
      </div>
    </section>

    <!-- ③ 我的发布区 -->
    <section class="uc-card">
      <h3 class="uc-title">📝 我的发布</h3>
      <div v-if="loading" class="state">⏳ 加载发布中...</div>
      <EmptyState
        v-else-if="myTrades.length + myGroupBuys.length + myErrands.length === 0"
        icon="📝"
        text="还没有发布过内容，来发布你的第一条校园信息吧～"
      >
        <button class="empty-btn" @click="router.push('/publish')">✨ 立即发布</button>
      </EmptyState>
      <template v-else>
        <section v-if="myTrades.length" class="pub-block">
          <h4 class="block-title">🛒 二手交易（{{ myTrades.length }}）</h4>
          <div class="card-grid">
            <ItemCard
              v-for="item in myTrades"
              :key="item.id"
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
                  <span class="price">¥{{ item.price }}</span>
                  <span class="cond">{{ item.condition }}</span>
                </div>
              </template>
            </ItemCard>
          </div>
        </section>
        <section v-if="myGroupBuys.length" class="pub-block">
          <h4 class="block-title">👥 拼单搭子（{{ myGroupBuys.length }}）</h4>
          <div class="card-grid">
            <ItemCard
              v-for="item in myGroupBuys"
              :key="item.id"
              :id="item.id"
              type="groupBuy"
              :title="item.title"
              :description="item.description"
              :tag="item.type"
              :location="item.location"
              :time="`截止 ${item.deadline}`"
            >
              <template #footer>
                <div class="gb-foot">
                  <span>👥 {{ item.currentCount }} / {{ item.targetCount }}</span>
                </div>
              </template>
            </ItemCard>
          </div>
        </section>
        <section v-if="myErrands.length" class="pub-block">
          <h4 class="block-title">🏃 跑腿委托（{{ myErrands.length }}）</h4>
          <div class="card-grid">
            <ItemCard
              v-for="item in myErrands"
              :key="item.id"
              :id="item.id"
              type="errand"
              :title="item.title"
              :description="item.description"
              :tag="item.taskType"
              :location="`${item.from} → ${item.to}`"
              :time="`截止 ${item.deadline}`"
            >
              <template #footer>
                <div class="er-foot">
                  <span>💰 酬劳 ¥{{ item.reward }}</span>
                </div>
              </template>
            </ItemCard>
          </div>
        </section>
      </template>
    </section>
  </div>
</template>

<style scoped>
.uc-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.uc-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px 28px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}
.uc-title {
  margin: 0 0 18px;
  font-size: 18px;
  color: #111827;
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.uc-title small {
  font-size: 12px;
  color: #9ca3af;
  font-weight: normal;
}
.state {
  color: #6b7280;
  padding: 20px;
  text-align: center;
}

/* ---- 资料区 ---- */
.uc-profile {
  display: flex;
  gap: 24px;
  align-items: center;
  background: linear-gradient(135deg, #eff6ff, #f0fdf4);
  border-color: #bfdbfe;
}
.uc-profile .avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
  color: #fff;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.28);
  flex-shrink: 0;
}
.uc-profile .info {
  flex: 1;
  min-width: 0;
}
.uc-profile .name {
  margin: 0 0 10px;
  font-size: 24px;
  color: #111827;
}
.uc-profile .meta-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.uc-profile .tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
}
.uc-profile .t1 {
  background: #dbeafe;
  color: #1d4ed8;
}
.uc-profile .t2 {
  background: #dcfce7;
  color: #15803d;
}
.uc-profile .bio {
  margin: 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 14px;
}
.uc-profile .actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  width: 130px;
}

/* ---- 通用按钮 ---- */
.btn {
  padding: 9px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  cursor: pointer;
  font-size: 13px;
  transition: 0.15s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}
.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: #fff;
  border-color: transparent;
  font-weight: 600;
}
.btn-primary:hover {
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  filter: brightness(1.05);
}
.btn-danger {
  color: #dc2626;
  border-color: #fecaca;
  background: #fef2f2;
}
.btn-danger:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: #fff;
}
.btn-plain {
  background: #fff;
}
.empty-btn {
  margin-top: 10px;
  padding: 9px 20px;
  border-radius: 8px;
  border: none;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  transition: 0.15s;
}
.empty-btn:hover {
  background: #2563eb;
}

/* ---- 我的收藏 ---- */
.fav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.fav-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 18px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: 0.15s;
}
.fav-card:hover {
  transform: translateY(-2px);
  border-color: #bfdbfe;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.05);
}
.fav-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.fav-card .type-tag {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
}
.fav-card .fav-loc {
  color: #9ca3af;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 55%;
  text-align: right;
}
.fav-card h4 {
  margin: 4px 0;
  font-size: 16px;
  color: #111827;
  line-height: 1.4;
}
.fav-card .desc {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
  min-height: 42px;
}
.fav-card footer {
  margin-top: auto;
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px dashed #e5e7eb;
}

/* ---- 我的发布 ---- */
.pub-block {
  margin-bottom: 22px;
}
.pub-block:last-child {
  margin-bottom: 0;
}
.block-title {
  margin: 0 0 14px;
  font-size: 15px;
  color: #374151;
  padding-left: 10px;
  border-left: 3px solid #3b82f6;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}
.trade-foot,
.gb-foot,
.er-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  color: #4b5563;
  font-size: 13px;
}
.trade-foot .price {
  color: #dc2626;
  font-weight: 700;
  font-size: 16px;
}
.trade-foot .cond {
  background: #f3f4f6;
  padding: 3px 10px;
  border-radius: 6px;
  color: #4b5563;
  font-size: 12px;
}
.gb-foot span,
.er-foot span {
  font-weight: 600;
  color: #059669;
}
.er-foot span {
  color: #d97706;
}

/* ---- 响应式 ---- */
@media (max-width: 820px) {
  .uc-page {
    padding: 18px 14px 32px;
    gap: 16px;
  }
  .uc-card {
    padding: 18px;
  }
  .uc-profile {
    flex-direction: column;
    align-items: flex-start;
  }
  .uc-profile .actions {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .uc-profile .actions .btn {
    flex: 1;
    min-width: 45%;
  }
  .fav-grid,
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
