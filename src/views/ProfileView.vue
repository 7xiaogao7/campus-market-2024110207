<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, type ActivityItem } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const u = computed(() => userStore.user)
const acts = computed<ActivityItem[]>(() => userStore.RECENT_ACTIVITY)

const stats = computed(() => [
  { key: 'pub', label: '📝 发布数', value: u.value?.published ?? 0, color: '#409EFF', to: '/publish' },
  { key: 'fav', label: '⭐ 收藏数', value: userStore.favoritesCount, color: '#F56C6C', to: '/favorites' },
  { key: 'trade', label: '💰 成交数', value: 18, color: '#67C23A', to: '/list' },
  { key: 'run', label: '🏃 跑腿数', value: 12, color: '#9B59B6', to: '/list' },
  { key: 'find', label: '🔍 帮找回', value: 3, color: '#E6A23C', to: '/list' },
  { key: 'score', label: '🌟 好评数', value: '4.98', color: '#67C23A', to: '/message' },
])

const boardStats = [
  { val: 24, lb: '累计发布', sub: '本周 +3', c: 'c-red' },
  { val: 18, lb: '成功交易', sub: '成交率 75%', c: 'c-green' },
  { val: 12, lb: '跑腿完成', sub: '赏金 ¥168', c: 'c-purple' },
  { val: 3, lb: '帮失主找回', sub: '好评率 100%', c: 'c-orange' },
]

const recentPublished = [
  { icon: '💻', title: '九成新 iPad Air 5', price: '¥3299', tag: '✅ 在售 · 浏览 324', to: '/detail/1001' },
  {
    icon: '📚',
    title: '高数习题集 同济第8版',
    price: '¥25',
    tag: '✅ 已售出',
    to: '/detail/1007',
    sold: true,
  },
  {
    icon: '🔑',
    title: '拾到钥匙一串',
    price: '拾到',
    tag: '✅ 已归还失主',
    to: '/list',
    priceColor: '#E6A23C',
  },
  { icon: '🍵', title: '喜茶满50-20 还差1人', price: '人均 ¥18', tag: '⏰ 进行中', to: '/list', priceColor: '#67C23A' },
]

const achievements = [
  { icon: '🆕', name: '初出茅庐', desc: '注册满 30 天', done: true, theme: 't1' },
  { icon: '💎', name: '诚信卖家', desc: '好评率 ≥ 98%', done: true, theme: 't2' },
  { icon: '🏃‍♂️', name: '跑男跑女', desc: '完成 10 次跑腿', done: true, theme: 't3' },
  { icon: '🦸', name: '拾金不昧', desc: '帮找回 ≥ 3 件', done: true, theme: 't4' },
  { icon: '👥', name: '拼单达人', desc: '发起 5 次成功拼单', done: true, theme: 't3' },
  { icon: '👑', name: '校园大使', desc: '邀请 20 人（6/20）', done: false, theme: 'tx' },
]

interface SideItem {
  icon: string
  label: string
  active?: boolean
  badge?: number
  badgeRed?: boolean
  tip?: boolean
  badgeDynamic?: 'favCount'
  to: string
}

interface SideGroup {
  title: string
  items: SideItem[]
}

const sideGroups: SideGroup[] = [
  {
    title: '我的中心',
    items: [
      { icon: '👤', label: '个人中心首页', active: true, to: '/profile' },
      { icon: '📝', label: '我发布的', badge: 4, to: '/publish' },
      { icon: '⭐', label: '我的收藏', to: '/favorites', badgeDynamic: 'favCount' },
      { icon: '💬', label: '我的消息', badge: 6, badgeRed: true, to: '/message' },
    ],
  },
  {
    title: '交易与任务',
    items: [
      { icon: '🛒', label: '我购买的', to: '/list' },
      { icon: '💰', label: '我出售的', to: '/list' },
      { icon: '🏃', label: '我的跑腿', to: '/list' },
      { icon: '👥', label: '我的拼单', to: '/list' },
    ],
  },
  {
    title: '账号与设置',
    items: [
      { icon: '📤', label: '发布新信息', to: '/publish' },
      { icon: '⚙️', label: '账号设置', to: '/profile', tip: true },
      { icon: '🪪', label: '学生认证', to: '/profile', tip: true },
      { icon: '🔒', label: '隐私设置', to: '/profile', tip: true },
      { icon: '🔔', label: '通知设置', to: '/profile', tip: true },
      { icon: '🎟️', label: '优惠券 / 积分', to: '/profile', tip: true },
    ],
  },
]

const toast = ref<{ type: 'success' | 'info'; msg: string } | null>(null)
function showTip(msg: string, type: 'success' | 'info' = 'info') {
  toast.value = { type, msg }
  setTimeout(() => (toast.value = null), 2400)
}

function clickSide(it: any) {
  if (it.tip) {
    showTip(`【${it.label}】功能开发中，敬请期待 ✨`)
    return
  }
  if (it.to) router.push(it.to)
}

function doLogout() {
  if (confirm('确定退出登录吗？')) {
    userStore.logout()
    showTip('已退出登录', 'success')
    setTimeout(() => router.push('/login'), 500)
  }
}

function avatarSpin() {
  showTip('🎨 头像更换小彩蛋（正式版可上传真实照片）', 'info')
}
</script>

<template>
  <div class="profile-wrap">
    <!-- 头部卡片：10 项必填字段 -->
    <section class="card profile-header">
      <div class="big-avatar" @click="avatarSpin" title="点击更换头像">
        {{ userStore.displayAvatar }}
      </div>

      <div class="user-meta">
        <div class="name-row">
          <h2>{{ u?.name || '新同学' }}</h2>
          <span class="tag tag-primary">🎓 本科生</span>
          <span class="tag tag-success" v-if="u?.verified">✅ 已实名认证</span>
          <span class="tag tag-orange" v-if="u?.stuNo">学号 ****{{ (u.stuNo + '').slice(-4) }}</span>
          <span class="tag tag-purple" v-if="u?.isNew">🎁 新用户</span>
        </div>
        <div class="meta-row">
          <span>🏫 <b>{{ u?.college }}</b></span>
          <span>📍 <b>{{ u?.campus }}</b></span>
          <span>📅 <b>{{ u?.grade }}</b></span>
          <span>📱 <b>{{ u?.phone }}</b></span>
          <span>📆 加入 <b class="hl-blue">{{ u?.joinDays }}</b> 天</span>
        </div>
        <div class="credit-row">
          <span class="lb">信用状态</span>
          <span class="stars">★★★★★</span>
          <b class="score">{{ u?.credit }}</b>
          <span class="sub">/ 100 优秀</span>
          <span class="tag tag-success" style="margin-left: 4px">✅ 信用极好</span>
        </div>
        <div class="stats-grid">
          <div v-for="s in stats" :key="s.key" class="stat" @click="s.to && router.push(s.to)">
            <div class="val" :style="{ color: s.color }">{{ s.value }}</div>
            <div class="lb">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <div class="action-col">
        <button class="btn btn-primary" @click="showTip('资料编辑页开发中 ✏️')">✏️ 编辑资料</button>
        <button
          class="btn btn-plain"
          @click="
            showTip(
              '账号设置弹窗演示中\n\n• 隐私设置\n• 通知设置\n• 地址管理\n• 安全中心\n• 黑名单\n• 学生认证',
            )
          "
        >
          ⚙ 账号设置
        </button>
        <button class="btn btn-plain" @click="router.push('/publish')">📝 我的发布</button>
        <button class="btn btn-plain" @click="router.push('/favorites')">⭐ 我的收藏</button>
        <button class="btn btn-danger" @click="doLogout">🚪 退出登录</button>
      </div>
    </section>

    <!-- 主体：左栏 + 右内容 -->
    <div class="body-grid">
      <aside class="card side-nav">
        <template v-for="g in sideGroups" :key="g.title">
          <div class="group-title">{{ g.title }}</div>
          <a
            v-for="it in g.items"
            :key="it.label"
            class="side-item"
            :class="{ active: it.active }"
            @click.prevent="clickSide(it)"
            href="#"
          >
            <span class="ic">{{ it.icon }}</span>
            <span class="lb">{{ it.label }}</span>
            <span
              v-if="it.badge || (it.badgeDynamic === 'favCount' && userStore.favoritesCount > 0)"
              class="badge"
              :class="{ red: it.badgeRed }"
            >
              {{ it.badgeDynamic === 'favCount' ? userStore.favoritesCount : it.badge }}
            </span>
          </a>
        </template>

        <div class="group-title">帮助与支持</div>
        <a class="side-item" href="#" @click.prevent="showTip('邀请链接已复制，双方各得 20 元优惠券 🤝')">
          <span class="ic">🤝</span>
          <span class="lb">邀请同学得奖励</span>
        </a>
        <a class="side-item" href="#" @click.prevent="showTip('交易安全中心：面交指南 / 防骗案例 / 举报违规 🛡️')">
          <span class="ic">🛡️</span>
          <span class="lb">交易安全中心</span>
        </a>
        <a class="side-item" href="#" @click.prevent="showTip('帮助与反馈：建议使用【举报】功能')">
          <span class="ic">❓</span>
          <span class="lb">帮助与反馈</span>
        </a>
      </aside>

      <div class="main-col">
        <!-- 数据看板 -->
        <section class="card board-card">
          <h3>📈 我的数据看板</h3>
          <div class="board-grid">
            <div v-for="s in boardStats" :key="s.lb" class="stat-box" :class="s.c">
              <div class="val">{{ s.val }}</div>
              <div class="lb">{{ s.lb }}</div>
              <div class="sub">{{ s.sub }}</div>
            </div>
          </div>
        </section>

        <!-- 最近发布 -->
        <section class="card">
          <div class="sec-head">
            <h3>🔥 我最近发布的 <small>（可直接管理）</small></h3>
            <button class="btn btn-plain btn-sm" @click="router.push('/publish')">查看全部 →</button>
          </div>
          <div class="pub-grid">
            <a
              v-for="p in recentPublished"
              :key="p.title"
              class="pub-card"
              @click.prevent="router.push(p.to)"
              href="#"
              :style="p.sold ? { opacity: 0.85 } : {}"
            >
              <div class="cover">{{ p.icon }}</div>
              <div class="pinfo">
                <div class="ptitle" :class="{ sold: p.sold }">{{ p.title }}</div>
                <div class="pprice" :style="p.priceColor ? { color: p.priceColor } : {}">{{ p.price }}</div>
                <span class="tag-mini">{{ p.tag }}</span>
              </div>
            </a>
          </div>
        </section>

        <!-- 最近动态：7. 最近动态 -->
        <section class="card">
          <div class="sec-head">
            <h3>⏰ 最近动态 <small>共 {{ acts.length }} 条 · 按时间倒序</small></h3>
            <button class="btn btn-plain btn-sm" @click="showTip('动态隐私设置：\n当前：仅自己可见\n可改为：仅同学 / 全校可见')">
              🔒 隐私设置
            </button>
          </div>
          <div class="act-list">
            <template v-for="(a, idx) in acts" :key="idx">
              <a class="act-item" @click.prevent="router.push(a.link)" href="#">
                <div class="act-ic" :style="{ background: a.color + '15', borderColor: a.color + '33' }">{{ a.icon }}</div>
                <div class="act-body">
                  <div class="act-text" v-html="a.text"></div>
                  <div class="act-time">🕒 {{ a.time }} · <b :style="{ color: a.color }">点击查看详情 →</b></div>
                </div>
              </a>
              <div v-if="idx < acts.length - 1" class="act-divider"></div>
            </template>
          </div>
        </section>

        <!-- 成就徽章墙 -->
        <section class="card">
          <h3>🌟 成就与徽章墙</h3>
          <div class="ach-grid">
            <div v-for="a in achievements" :key="a.name" class="ach-card" :class="[a.theme, { locked: !a.done }]">
              <div class="aicon">{{ a.icon }}</div>
              <div class="aname">{{ a.name }}</div>
              <div class="adesc">{{ a.desc }}</div>
            </div>
          </div>
        </section>

        <div class="footer-line">
          🎓 校园轻集市 · 每一次交易都在身边 · v1.0.0 <br />
          注册时间 <b>{{ u?.regAt }}</b> · 累计访问 <b>1,680</b> 次 · 累计节省 <b class="hl-red">¥1,288</b>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="toast" class="toast">{{ toast.msg }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.profile-wrap {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.card {
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 12px;
  padding: 22px 26px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}
/* ============== 头部卡片 ============== */
.profile-header {
  display: flex;
  gap: 28px;
  align-items: center;
  padding: 28px 32px;
}
.big-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #79bbff);
  font-size: 44px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.25);
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
}
.big-avatar:hover {
  transform: scale(1.06) rotate(-4deg);
}
.user-meta {
  flex: 1;
  min-width: 0;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.name-row h2 {
  margin: 0;
  font-size: 22px;
  color: #303133;
}
.tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1.5;
  gap: 4px;
}
.tag-primary {
  background: #ecf5ff;
  color: #409eff;
}
.tag-success {
  background: #f0f9eb;
  color: #67c23a;
}
.tag-orange {
  background: #fdf6ec;
  color: #e6a23c;
}
.tag-purple {
  background: #f3eaff;
  color: #9b59b6;
}
.meta-row {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}
.meta-row b {
  color: #303133;
}
.hl-blue {
  color: #409eff;
}
.credit-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.credit-row .lb {
  color: #909399;
  font-size: 13px;
}
.stars {
  color: #e6a23c;
  font-size: 16px;
  letter-spacing: 1px;
}
.credit-row .score {
  color: #e6a23c;
  font-size: 16px;
}
.credit-row .sub {
  color: #909399;
  font-size: 12px;
}
.stats-grid {
  margin-top: 14px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #f0f4ff, #f6fbf3);
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  text-align: center;
}
.stats-grid .stat {
  cursor: pointer;
  transition: 0.15s;
  border-radius: 8px;
  padding: 6px 2px;
}
.stats-grid .stat:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}
.stats-grid .val {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}
.stats-grid .lb {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
.action-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
  flex-shrink: 0;
  width: 130px;
}
.btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e8ecf2;
  background: #fff;
  color: #606266;
  cursor: pointer;
  font-size: 13px;
  transition: 0.15s;
  text-align: center;
}
.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
}
.btn:hover {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}
.btn-primary {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  border-color: transparent;
  font-weight: 500;
}
.btn-primary:hover {
  color: #fff;
  background: linear-gradient(135deg, #337ecc, #409eff);
  filter: brightness(1.05);
}
.btn-danger {
  color: #f56c6c;
  border-color: #fbd8d8;
  background: #fdf0f0;
  font-weight: 500;
}
.btn-danger:hover {
  color: #fff;
  background: #f56c6c;
  border-color: #f56c6c;
}
.btn-plain {
  background: #fff;
  border: 1px solid #e8ecf2;
  color: #606266;
}

/* ============== 主体 ============== */
.body-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
}
.side-nav {
  padding: 12px 8px;
  align-self: start;
  position: sticky;
  top: 20px;
}
.group-title {
  padding: 12px 16px 6px;
  font-weight: 600;
  color: #909399;
  font-size: 13px;
}
.side-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  margin: 2px 10px;
  border-radius: 8px;
  color: #606266;
  text-decoration: none;
  font-size: 14px;
  transition: 0.12s;
  position: relative;
}
.side-item:hover {
  background: #ecf5ff;
  color: #409eff;
}
.side-item.active {
  background: #ecf5ff;
  color: #409eff;
  font-weight: 600;
}
.side-item.active::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: #409eff;
  border-radius: 0 2px 2px 0;
}
.side-item .ic {
  font-size: 16px;
}
.side-item .lb {
  flex: 1;
}
.badge {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #f56c6c;
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  font-weight: 500;
}
.badge:not(.red) {
  background: #409eff;
}
.main-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.board-card {
  background: linear-gradient(135deg, #fff5e6, #fff);
  border-color: #fae9c7;
}
.board-card h3,
.main-col h3 {
  margin: 0 0 16px;
  font-size: 17px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 6px;
}
.main-col h3 small {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}
.board-card h3 {
  color: #e6a23c;
}
.board-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-box {
  padding: 18px 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #f2f6fc;
  transition: 0.2s;
}
.stat-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
}
.stat-box .val {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
}
.stat-box .lb {
  color: #909399;
  font-size: 13px;
  margin-top: 4px;
}
.stat-box .sub {
  color: #606266;
  font-size: 11px;
  margin-top: 2px;
}
.stat-box.c-red .val {
  color: #f56c6c;
}
.stat-box.c-green .val {
  color: #67c23a;
}
.stat-box.c-purple .val {
  color: #9b59b6;
}
.stat-box.c-orange .val {
  color: #e6a23c;
}
.sec-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.sec-head h3 {
  margin: 0;
}

.pub-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.pub-card {
  display: block;
  border: 1px solid #e8ecf2;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: 0.2s;
}
.pub-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
  border-color: #b3d8ff;
}
.pub-card .cover {
  aspect-ratio: 16 / 10;
  background: linear-gradient(135deg, #f0f4ff, #e9ecf5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}
.pub-card .pinfo {
  padding: 10px 12px;
  font-size: 13px;
}
.pub-card .ptitle {
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pub-card .ptitle.sold {
  text-decoration: line-through;
  opacity: 0.6;
}
.pub-card .pprice {
  color: #f56c6c;
  font-weight: 700;
  margin-top: 4px;
  font-size: 15px;
}
.tag-mini {
  display: inline-block;
  margin-top: 4px;
  padding: 1px 8px;
  border-radius: 4px;
  background: #ecf5ff;
  color: #409eff;
  font-size: 11px;
}

.act-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.act-item {
  display: flex;
  gap: 14px;
  padding: 14px;
  border-radius: 8px;
  align-items: flex-start;
  text-decoration: none;
  color: inherit;
  transition: 0.15s;
}
.act-item:hover {
  background: #fafbfc;
}
.act-ic {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  border: 1px solid;
}
.act-body {
  flex: 1;
  min-width: 0;
}
.act-text {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}
.act-text :deep(b) {
  color: #303133;
}
.act-time {
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
}
.act-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #f2f6fc, transparent);
  margin: 0 10px;
}

.ach-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
  text-align: center;
}
.ach-card {
  padding: 16px 8px;
  border-radius: 14px;
  transition: 0.2s;
  border: 1px solid;
}
.ach-card:hover {
  transform: translateY(-2px);
}
.ach-card.locked {
  background: #f5f7fa;
  border-color: #e8ecf2;
  opacity: 0.55;
  filter: grayscale(0.7);
}
.ach-card.t1 {
  background: linear-gradient(135deg, #fff5e6, #fff);
  border-color: #fae9c7;
}
.ach-card.t2 {
  background: linear-gradient(135deg, #fdf0f0, #fff);
  border-color: #fbd8d8;
}
.ach-card.t3 {
  background: linear-gradient(135deg, #f0f9eb, #fff);
  border-color: #d7ecbe;
}
.ach-card.t4 {
  background: linear-gradient(135deg, #fdf6ec, #fff);
  border-color: #faecd8;
}
.ach-card .aicon {
  font-size: 40px;
  line-height: 1;
}
.ach-card .aname {
  font-size: 13px;
  font-weight: 600;
  margin-top: 8px;
  color: #303133;
}
.ach-card .adesc {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

.footer-line {
  text-align: center;
  padding: 14px;
  color: #909399;
  font-size: 12px;
  line-height: 1.8;
}
.hl-red {
  color: #f56c6c;
}

/* Toast */
.toast {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 22px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 8px 22px rgba(64, 158, 255, 0.35);
  z-index: 9999;
  max-width: 80vw;
  white-space: pre-line;
  line-height: 1.6;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -12px);
}

/* Responsive */
@media (max-width: 1024px) {
  .body-grid {
    grid-template-columns: 1fr;
  }
  .side-nav {
    position: static;
  }
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .board-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .pub-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .ach-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 720px) {
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .action-col {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .action-col .btn {
    flex: 1;
    min-width: 45%;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .pub-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .board-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .ach-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
