<script setup lang="ts">
import { useRouter } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'

interface Message {
  id: number
  from: string
  content: string
  time: string
  unread: boolean
}

const router = useRouter()

const messages: Message[] = [
  { id: 1, from: '计算机学院_小王', content: '你好，iPad 还在吗？能少 100 吗？', time: '10 分钟前', unread: true },
  { id: 2, from: '外国语学院_Lily', content: '书我要了，明天中午食堂门口见~', time: '1 小时前', unread: true },
  { id: 3, from: '系统通知', content: '您发布的「罗技机械键盘」已通过审核，上架成功！', time: '昨天 18:20', unread: false },
  { id: 4, from: '体育学院_大刘', content: '自行车能试骑吗？我明天下午有空。', time: '昨天 14:05', unread: false },
  { id: 5, from: '经管学院_小美', content: '鞋子正码吗？我平时穿 41.5。', time: '前天 09:30', unread: false },
]

const unreadCount = messages.filter((m) => m.unread).length
</script>

<template>
  <div class="message">
    <div class="header">
      <h1>消息页</h1>
      <span class="badge" v-if="unreadCount > 0">{{ unreadCount }} 条未读</span>
    </div>

    <ul class="msg-list">
      <li v-for="m in messages" :key="m.id" class="msg-item" :class="{ unread: m.unread }">
        <div class="avatar">{{ m.from.charAt(0) }}</div>
        <div class="body">
          <div class="row">
            <span class="from">{{ m.from }}</span>
            <span class="time">{{ m.time }}</span>
          </div>
          <div class="content">{{ m.content }}</div>
        </div>
        <span class="dot" v-if="m.unread"></span>
      </li>
    </ul>

    <EmptyState v-if="messages.length === 0" icon="💬" text="暂无消息，去逛逛市场和同学们聊聊吧～">
      <button class="btn-primary" @click="router.push('/trade')">🛒 去逛逛市场</button>
    </EmptyState>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header h1 {
  margin: 0;
  font-size: 26px;
}

.badge {
  padding: 2px 10px;
  background: #f56c6c;
  color: #fff;
  border-radius: 999px;
  font-size: 12px;
}

.msg-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.msg-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 10px;
  position: relative;
}

.msg-item.unread {
  background: #fafcff;
  border-color: #b3d8ff;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.from {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.time {
  font-size: 12px;
  color: #bbb;
}

.content {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f56c6c;
  flex-shrink: 0;
  align-self: center;
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
</style>
