<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const quickLinks = [
  { label: '逛一逛商品', path: '/list', desc: '查看学长学姐的闲置好物', icon: '🛍️' },
  { label: '发布闲置', path: '/publish', desc: '把用不上的东西变现', icon: '📤' },
  { label: '查看消息', path: '/message', desc: '不错过任何咨询', icon: '💬' },
  { label: '数据看板', path: '/board', desc: '平台整体数据概览', icon: '📊' },
]

const go = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home">
    <section class="welcome">
      <h1>欢迎来到校园轻集市 🎉</h1>
      <p>校园内部的闲置物品交易平台，安全、便捷、放心。</p>
    </section>

    <section class="quick">
      <h2>快速入口</h2>
      <div class="quick-grid">
        <div
          v-for="item in quickLinks"
          :key="item.path"
          class="quick-card"
          @click="go(item.path)"
        >
          <div class="icon">{{ item.icon }}</div>
          <div class="label">{{ item.label }}</div>
          <div class="desc">{{ item.desc }}</div>
        </div>
      </div>
    </section>

    <section class="tips">
      <h2>使用须知</h2>
      <ul>
        <li>✅ 交易前请确认商品成色，建议校园面交</li>
        <li>✅ 保护好个人信息，不要泄露密码</li>
        <li>✅ 发现违规商品可到「消息」中举报</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.welcome {
  padding: 28px;
  background: linear-gradient(135deg, #ecf5ff, #f0f9ff);
  border-radius: 10px;
}

.welcome h1 {
  margin: 0 0 8px 0;
  font-size: 26px;
  color: #303133;
}

.welcome p {
  margin: 0;
  color: #606266;
}

.quick h2,
.tips h2 {
  margin: 0 0 16px 0;
  font-size: 20px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.quick-card {
  padding: 22px;
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-card:hover {
  transform: translateY(-2px);
  border-color: #b3d8ff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.label {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.desc {
  font-size: 13px;
  color: #909399;
}

.tips ul {
  margin: 0;
  padding: 18px 18px 18px 40px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  color: #606266;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
