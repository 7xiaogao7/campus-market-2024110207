<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

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

function goDetail(id: number, e?: MouseEvent) {
  if (e) e.stopPropagation()
  router.push(`/detail/${id}`)
}

function doRemove(id: number, title: string, e: MouseEvent) {
  e.stopPropagation()
  if (!confirm(`确定取消收藏「${title}」吗？`)) return
  const r = userStore.removeFavorite(id)
  showToast(r.msg, r.ok ? 'success' : 'warn')
}

function doClearAll() {
  if (userStore.favoritesCount === 0) {
    showToast('当前没有收藏内容', 'warn')
    return
  }
  if (!confirm(`确定清空全部 ${userStore.favoritesCount} 条收藏吗？此操作无法撤销。`)) return
  const r = userStore.clearAllFavorites()
  showToast(r.msg, r.ok ? 'success' : 'warn')
}

function goBackProfile() {
  router.push('/profile')
}
</script>

<template>
  <div class="fav-page">
    <div class="top-bar">
      <div class="left-area">
        <button class="back-btn" @click="goBackProfile" title="返回个人中心">← 返回</button>
        <div>
          <h1>⭐ 我的收藏</h1>
          <p class="sub">共收藏了 <b>{{ userStore.favoritesCount }}</b> 条内容，可随时查看感兴趣的好物</p>
        </div>
      </div>
      <div class="right-area">
        <button
          class="btn btn-ghost"
          :disabled="userStore.favoritesCount === 0"
          @click="doClearAll"
        >
          🗑️ 清空收藏夹
        </button>
      </div>
    </div>

    <div v-if="toastMsg" class="toast" :class="toastType">{{ toastMsg }}</div>

    <div v-if="userStore.favoritesCount === 0" class="empty-box">
      <div class="empty-emoji">💫</div>
      <div class="empty-title">收藏夹空空如也</div>
      <div class="empty-desc">去列表页逛一逛，遇到心动的好物点一下爱心就好啦～</div>
      <button class="btn btn-primary btn-lg" @click="router.push('/list')">去逛逛列表</button>
    </div>

    <div v-else class="fav-list">
      <div
        v-for="item in userStore.favorites"
        :key="item.id"
        class="fav-item"
        @click="goDetail(item.id)"
      >
        <div class="fav-body">
          <div class="meta-row">
            <span class="cat-tag">{{ item.category }}</span>
            <span class="time-tag">收藏于 {{ item.favAt }}</span>
          </div>
          <div class="title-row">
            <h3 class="title">{{ item.title }}</h3>
            <span class="price">¥{{ item.price }}</span>
          </div>
          <p class="desc">{{ item.desc }}</p>
          <p class="id-line">商品编号：#{{ item.id }}</p>
        </div>
        <div class="fav-actions">
          <button class="btn btn-primary btn-sm" @click="goDetail(item.id, $event)">📖 查看详情</button>
          <button class="btn btn-danger-ghost btn-sm" @click="doRemove(item.id, item.title, $event)">💔 取消收藏</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fav-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 24px 28px;
  background: linear-gradient(135deg, #fff9e6 0%, #fffbeb 100%);
  border: 1px solid #faecd1;
  border-radius: 14px;
}

.left-area {
  display: flex;
  gap: 20px;
  align-items: center;
  flex: 1;
}

.back-btn {
  padding: 10px 18px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: 0.15s;
  font-family: inherit;
  flex-shrink: 0;
  white-space: nowrap;
}

.back-btn:hover {
  background: #ecf5ff;
  color: #409eff;
  border-color: #b3d8ff;
}

.top-bar h1 {
  margin: 0 0 4px;
  font-size: 24px;
  color: #303133;
}

.sub {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.sub b {
  color: #e6a23c;
  font-size: 16px;
  margin: 0 2px;
}

.right-area {
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;
}

.btn-sm {
  padding: 7px 14px;
  font-size: 13px;
  border-radius: 8px;
}

.btn-lg {
  padding: 12px 28px;
  font-size: 16px;
  border-radius: 12px;
}

.btn-primary {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
}

.btn-primary:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.32);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  filter: grayscale(0.4);
}

.btn-ghost {
  background: #fff;
  border-color: #ebeef5;
  color: #606266;
}

.btn-ghost:hover {
  color: #f56c6c;
  border-color: #fbd8d8;
  background: #fef0f0;
}

.btn-ghost:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-danger-ghost {
  background: #fff;
  border-color: #fbd8d8;
  color: #f56c6c;
}

.btn-danger-ghost:hover {
  background: #fef0f0;
  border-color: #f56c6c;
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

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 80px 20px;
  background: #fff;
  border: 1px dashed #dcdfe6;
  border-radius: 14px;
}

.empty-emoji {
  font-size: 64px;
  line-height: 1;
}

.empty-title {
  font-size: 20px;
  color: #303133;
  font-weight: 600;
}

.empty-desc {
  color: #909399;
  font-size: 14px;
}

.fav-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fav-item {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 20px;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.fav-item:hover {
  border-color: #c2e7b0;
  background: #fbfffa;
  box-shadow: 0 4px 16px rgba(103, 194, 58, 0.08);
  transform: translateY(-1px);
}

.fav-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cat-tag {
  padding: 3px 10px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.time-tag {
  font-size: 12px;
  color: #c0c4cc;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}

.title {
  margin: 0;
  font-size: 18px;
  color: #303133;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  color: #f56c6c;
  font-size: 22px;
  font-weight: 700;
  flex-shrink: 0;
}

.desc {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.id-line {
  margin: 0;
  font-size: 12px;
  color: #c0c4cc;
}

.fav-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
}

@media (max-width: 720px) {
  .top-bar {
    flex-direction: column;
    padding: 18px 18px;
    gap: 14px;
  }
  .left-area {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .fav-item {
    flex-direction: column;
    gap: 14px;
    padding: 16px 18px;
  }
  .fav-actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
  }
  .title-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
