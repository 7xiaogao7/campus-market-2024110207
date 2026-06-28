<script setup lang="ts">
const stats = [
  { label: '在售商品', value: 128, trend: '+12%', color: '#409eff' },
  { label: '注册用户', value: '2,456', trend: '+3.2%', color: '#67c23a' },
  { label: '今日浏览', value: '8,932', trend: '+18%', color: '#e6a23c' },
  { label: '累计交易', value: '3,721', trend: '-0.8%', color: '#f56c6c' },
]

const categories = [
  { name: '电子数码', count: 42 },
  { name: '教材书籍', count: 37 },
  { name: '生活用品', count: 25 },
  { name: '运动户外', count: 15 },
  { name: '服饰鞋包', count: 9 },
]
</script>

<template>
  <div class="board">
    <h1>看板页</h1>

    <section class="stats">
      <div v-for="s in stats" :key="s.label" class="stat">
        <div class="label">{{ s.label }}</div>
        <div class="value" :style="{ color: s.color }">{{ s.value }}</div>
        <div class="trend">{{ s.trend }} 较昨日</div>
      </div>
    </section>

    <section class="card">
      <h2>各分类商品数量</h2>
      <ul class="list">
        <li v-for="c in categories" :key="c.name">
          <span class="name">{{ c.name }}</span>
          <div class="bar">
            <div
              class="fill"
              :style="{ width: `${(c.count / (categories[0]?.count ?? 1)) * 100}%` }"
            ></div>
          </div>
          <span class="num">{{ c.count }} 件</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.board h1 {
  margin: 0;
  font-size: 26px;
}

.board h2 {
  margin: 0 0 18px 0;
  font-size: 18px;
  color: #303133;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.stat {
  padding: 20px 22px;
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat .label {
  font-size: 13px;
  color: #909399;
}

.stat .value {
  font-size: 28px;
  font-weight: 700;
}

.stat .trend {
  font-size: 12px;
  color: #909399;
}

.card {
  padding: 22px;
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 10px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.list li {
  display: grid;
  grid-template-columns: 100px 1fr 70px;
  align-items: center;
  gap: 14px;
}

.name {
  font-size: 14px;
  color: #303133;
}

.bar {
  height: 14px;
  background: #f2f6fc;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #79bbff);
  border-radius: 999px;
  transition: width 0.3s;
}

.num {
  text-align: right;
  font-size: 13px;
  color: #606266;
}
</style>
