<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

interface Product {
  id: number
  title: string
  price: number
  category: string
  desc: string
}

const productList: Product[] = [
  { id: 1001, title: '九成新 iPad Air 5', price: 3299, category: '电子数码', desc: '带原装充电器，屏幕无划痕。' },
  { id: 1002, title: '考研英语红宝书 2026', price: 48, category: '教材书籍', desc: '几乎全新，附赠电子版作文模板。' },
  { id: 1003, title: '小米电动滑板车 1S', price: 899, category: '生活用品', desc: '续航25公里，校园代步神器。' },
  { id: 1004, title: '罗技机械键盘 K380', price: 189, category: '电子数码', desc: '青轴手感顺滑，蓝牙有线双模。' },
  { id: 1005, title: '耐克 Air Force 1 42码', price: 299, category: '服饰鞋包', desc: '正品闲置，只穿过3次。' },
  { id: 1006, title: '迪卡侬山地自行车', price: 699, category: '运动户外', desc: '毕业出售，21速变速。' },
  { id: 1007, title: '索尼头戴蓝牙耳机', price: 239, category: '电子数码', desc: '续航35小时，通话降噪。' },
  { id: 1008, title: '高等数学同济七版', price: 35, category: '教材书籍', desc: '少量笔记，赠习题答案书。' },
]

const goDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

const toastMsg = ref('')
const toastType = ref<'success' | 'info' | 'warn'>('info')
let toastTimer: number | null = null

function showToast(msg: string, type: 'success' | 'info' | 'warn' = 'info') {
  toastMsg.value = msg
  toastType.value = type
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastMsg.value = ''
  }, 2200)
}

function handleToggleFav(product: Product, e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (!userStore.isLoggedIn) {
    showToast('请先登录后再收藏哦～', 'warn')
    setTimeout(() => {
      router.push({ path: '/login', query: { redirect: '/list' } })
    }, 800)
    return
  }
  const r = userStore.toggleFavorite(product)
  showToast(r.msg, r.ok ? 'success' : 'warn')
}

function goFavorites() {
  router.push('/favorites')
}
</script>

<template>
  <div class="list-page">
    <div class="header">
      <div class="left">
        <h1>闲置好物列表</h1>
        <span class="count">共 {{ productList.length }} 件商品</span>
      </div>
      <div class="right">
        <button
          v-if="userStore.isLoggedIn"
          class="fav-entry"
          @click="goFavorites"
        >
          ⭐ 我的收藏 ({{ userStore.favoritesCount }})
        </button>
      </div>
    </div>

    <div v-if="toastMsg" class="toast" :class="toastType">{{ toastMsg }}</div>

    <div class="product-list">
      <div
        v-for="item in productList"
        :key="item.id"
        class="item"
        @click="goDetail(item.id)"
      >
        <div class="left-info">
          <span class="category">{{ item.category }}</span>
          <span class="title">{{ item.title }}</span>
          <span class="desc">{{ item.desc }}</span>
        </div>
        <div class="right-info">
          <div class="top-row">
            <span class="price">¥{{ item.price }}</span>
            <button
              class="fav-btn"
              :class="{ favored: userStore.isFavorited(item.id) }"
              :title="userStore.isFavorited(item.id) ? '已收藏，点击取消' : '点击收藏'"
              @click="handleToggleFav(item, $event)"
            >
              {{ userStore.isFavorited(item.id) ? '❤️' : '🤍' }}
            </button>
          </div>
          <span class="link">查看详情 →</span>
          <span class="id">ID: {{ item.id }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
}

.left {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.left h1 {
  margin: 0;
  font-size: 26px;
}

.count {
  color: #909399;
  font-size: 14px;
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

.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.item:hover {
  border-color: #b3d8ff;
  background: #fafcff;
}

.left-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
}

.category {
  padding: 3px 10px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 999px;
  font-size: 12px;
  flex-shrink: 0;
  font-weight: 500;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.desc {
  font-size: 13px;
  color: #909399;
}

.right-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.top-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: 700;
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

.link {
  color: #409eff;
  font-size: 13px;
}

.id {
  color: #bbb;
  font-size: 12px;
  font-family: Consolas, monospace;
}

@media (max-width: 720px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .item {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .right-info {
    align-items: flex-start;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .right-info .link {
    order: 2;
  }
  .right-info .id {
    order: 3;
  }
}
</style>
