<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

interface FullProduct {
  id: number
  title: string
  price: number
  category: string
  desc: string
}

const productIdStr = computed(() => route.params.id as string)
const productIdNum = computed(() => Number(productIdStr.value))

const productMap: Record<number, FullProduct> = {
  1001: { id: 1001, title: '九成新 iPad Air 5', price: 3299, category: '电子数码', desc: '带原装充电器，屏幕无划痕。' },
  1002: { id: 1002, title: '考研英语红宝书 2026', price: 48, category: '教材书籍', desc: '几乎全新，附赠电子版作文模板。' },
  1003: { id: 1003, title: '小米电动滑板车 1S', price: 899, category: '生活用品', desc: '续航25公里，校园代步神器。' },
  1004: { id: 1004, title: '罗技机械键盘 K380', price: 189, category: '电子数码', desc: '青轴手感顺滑，蓝牙有线双模。' },
  1005: { id: 1005, title: '耐克 Air Force 1 42码', price: 299, category: '服饰鞋包', desc: '正品闲置，只穿过3次。' },
  1006: { id: 1006, title: '迪卡侬山地自行车', price: 699, category: '运动户外', desc: '毕业出售，21速变速。' },
  1007: { id: 1007, title: '索尼头戴蓝牙耳机', price: 239, category: '电子数码', desc: '续航35小时，通话降噪。' },
  1008: { id: 1008, title: '高等数学同济七版', price: 35, category: '教材书籍', desc: '少量笔记，赠习题答案书。' },
}

const product = computed<FullProduct | undefined>(() => productMap[productIdNum.value])
const isFavored = computed(() => (product.value ? userStore.isFavorited(product.value.id) : false))

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

function handleToggleFav() {
  if (!product.value) return
  if (!userStore.isLoggedIn) {
    showToast('请先登录后再收藏哦～', 'warn')
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { redirect: `/detail/${product.value!.id}` },
      })
    }, 800)
    return
  }
  const r = userStore.toggleFavorite(product.value)
  showToast(r.msg, r.ok ? 'success' : 'warn')
}

function contactSeller() {
  if (!userStore.isLoggedIn) {
    showToast('请先登录再联系卖家哦～', 'warn')
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { redirect: `/detail/${productIdStr.value}` },
      })
    }, 800)
    return
  }
  router.push('/message')
}

const fromList = computed(() => (route.query.from as string) || '/list')

let lastId = productIdStr.value
watch(productIdStr, (newId) => {
  if (newId !== lastId) {
    lastId = newId
  }
})
</script>

<template>
  <div class="detail-page">
    <div class="breadcrumb">
      <button class="back-btn" @click="router.push(fromList)">← 返回列表</button>
      <span class="crumb-text">
        <span @click="router.push('/home')" class="crumb-link">首页</span>
        <span class="sep">/</span>
        <span @click="router.push('/list')" class="crumb-link">闲置好物</span>
        <span class="sep">/</span>
        <span class="current">{{ product ? product.title : '商品不存在' }}</span>
      </span>
    </div>

    <div v-if="toastMsg" class="toast" :class="toastType">{{ toastMsg }}</div>

    <div v-if="product" class="detail-card">
      <div class="card-header">
        <div>
          <span class="cat-tag">{{ product.category }}</span>
          <span class="id-tag">ID: #{{ product.id }}</span>
        </div>
        <button
          class="fav-btn-lg"
          :class="{ favored: isFavored }"
          @click="handleToggleFav"
        >
          {{ isFavored ? '❤️ 已收藏' : '🤍 收藏好物' }}
        </button>
      </div>

      <h1 class="product-title">{{ product.title }}</h1>
      <div class="price-line">
        <span class="price-symbol">¥</span>
        <span class="price-num">{{ product.price }}</span>
        <span class="price-tip">校园自提 · 面交更安心</span>
      </div>

      <div class="desc-section">
        <h3 class="section-title">📝 商品描述</h3>
        <p class="desc-text">{{ product.desc }}</p>
      </div>

      <div class="info-grid">
        <div class="info-cell">
          <div class="label">发布人</div>
          <div class="value">👤 同学·小杨</div>
        </div>
        <div class="info-cell">
          <div class="label">所在校区</div>
          <div class="value">🏫 主校区（东区）</div>
        </div>
        <div class="info-cell">
          <div class="label">信用状态</div>
          <div class="value green">✅ 已认证 · 信用 98</div>
        </div>
        <div class="info-cell">
          <div class="label">发布时间</div>
          <div class="value">📅 3 天前</div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn btn-contact" @click="contactSeller">💬 联系卖家</button>
        <button class="btn btn-fav-ghost" @click="handleToggleFav" :class="{ favored: isFavored }">
          {{ isFavored ? '💔 取消收藏' : '⭐ 加入收藏夹' }}
        </button>
      </div>

      <div class="tips-box">
        <p class="tips-title">💡 校园集市交易提示</p>
        <ul class="tips-list">
          <li>建议选择校内公共场所面交，确保安全</li>
          <li>当面验清物品后再付款，避免纠纷</li>
          <li>如遇可疑信息，可通过「消息」页举报</li>
        </ul>
      </div>
    </div>

    <div v-else class="not-found">
      <div class="nf-emoji">🔍</div>
      <div class="nf-title">找不到这个商品</div>
      <div class="nf-desc">ID「{{ productIdStr }}」对应的商品不存在或已下架</div>
      <button class="btn btn-primary" @click="router.push('/list')">去逛逛其他商品</button>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
}

.back-btn {
  padding: 8px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: 0.15s;
  font-family: inherit;
  flex-shrink: 0;
}

.back-btn:hover {
  background: #ecf5ff;
  color: #409eff;
  border-color: #b3d8ff;
}

.crumb-text {
  font-size: 14px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.crumb-link {
  cursor: pointer;
  transition: 0.15s;
}

.crumb-link:hover {
  color: #409eff;
}

.sep {
  color: #c0c4cc;
}

.current {
  color: #303133;
  font-weight: 500;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  from { transform: translateY(-8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.detail-card {
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 14px;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.cat-tag {
  padding: 4px 12px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  margin-right: 10px;
}

.id-tag {
  padding: 4px 12px;
  background: #f4f4f5;
  color: #909399;
  border-radius: 999px;
  font-size: 12px;
  font-family: Consolas, monospace;
}

.fav-btn-lg {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.fav-btn-lg:hover {
  border-color: #ffc1c1;
  background: #fff5f5;
}

.fav-btn-lg.favored {
  border-color: #ffb3b3;
  background: #fff1f0;
  color: #f56c6c;
  animation: favPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes favPop {
  0% { transform: scale(0.85); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.product-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.35;
}

.price-line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 16px 22px;
  background: linear-gradient(135deg, #fff1f0 0%, #fff8f0 100%);
  border-radius: 12px;
  border-left: 4px solid #f56c6c;
}

.price-symbol {
  color: #f56c6c;
  font-size: 22px;
  font-weight: 600;
}

.price-num {
  color: #f56c6c;
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}

.price-tip {
  margin-left: 18px;
  color: #909399;
  font-size: 13px;
}

.section-title {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.desc-section .desc-text {
  margin: 0;
  padding: 14px 18px;
  background: #fafafa;
  border-radius: 10px;
  color: #606266;
  font-size: 15px;
  line-height: 1.75;
  border: 1px dashed #e4e7ed;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.info-cell {
  padding: 14px 18px;
  background: #fafbfc;
  border: 1px solid #ebeef5;
  border-radius: 10px;
}

.info-cell .label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.info-cell .value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.info-cell .value.green {
  color: #67c23a;
}

.action-row {
  display: flex;
  gap: 14px;
  padding-top: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 28px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
  min-width: 160px;
}

.btn-contact {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.28);
}

.btn-contact:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.38);
}

.btn-fav-ghost {
  background: #fff;
  border-color: #ebeef5;
  color: #606266;
}

.btn-fav-ghost:hover {
  color: #e6a23c;
  border-color: #faecd1;
  background: #fffbf0;
}

.btn-fav-ghost.favored {
  color: #f56c6c;
  border-color: #ffc1c1;
  background: #fff5f5;
}

.tips-box {
  margin-top: 4px;
  padding: 18px 22px;
  background: linear-gradient(135deg, #ecf5ff, #f4faff);
  border: 1px dashed #b3d8ff;
  border-radius: 12px;
}

.tips-title {
  margin: 0 0 8px;
  font-size: 14px;
  color: #409eff;
  font-weight: 600;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  color: #606266;
  font-size: 13px;
  line-height: 2;
}

.btn-primary {
  padding: 12px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 20px;
  background: #fff;
  border: 1px dashed #dcdfe6;
  border-radius: 14px;
}

.nf-emoji { font-size: 64px; line-height: 1; }
.nf-title { font-size: 20px; color: #303133; font-weight: 600; }
.nf-desc { color: #909399; font-size: 14px; }

@media (max-width: 720px) {
  .detail-card { padding: 20px 18px; }
  .product-title { font-size: 22px; }
  .price-num { font-size: 30px; }
  .info-grid { grid-template-columns: 1fr; }
  .breadcrumb { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>
