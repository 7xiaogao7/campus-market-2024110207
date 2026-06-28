import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface UserInfo {
  id: string
  name: string
  avatar?: string
  initial: string
  phone: string
  stuNo: string
  email?: string
  college: string
  campus: string
  grade: string
  major?: string
  credit: number
  published: number
  favCount: number
  verified: boolean
  isNew: boolean
  joinDays: number
  regAt: string
  isLoggedIn: boolean
}

const STORAGE_KEY = 'campus_market_user_v1'

function ensureUser(u: Partial<UserInfo> & { name?: string }): UserInfo {
  const name = u.name || '新同学'
  const initial = (u.initial || name.charAt(0) || '用').toUpperCase()
  const today = new Date()
  const regAt = u.regAt || today.toISOString().slice(0, 10)
  const d = Math.max(0, Math.floor((today.getTime() - new Date(regAt).getTime()) / 86400000))
  return {
    id: u.id || String(Date.now()),
    name,
    avatar: u.avatar,
    initial,
    phone: u.phone || '138****8888',
    stuNo: u.stuNo || '20231234',
    email: u.email,
    college: u.college || '计算机科学与技术学院',
    campus: u.campus || '主校区（东区）',
    grade: u.grade || '2023 级',
    major: u.major,
    credit: u.credit ?? 98,
    published: u.published ?? 24,
    favCount: u.favCount ?? 36,
    verified: u.verified ?? true,
    isNew: u.isNew ?? false,
    joinDays: u.joinDays ?? d,
    regAt,
    isLoggedIn: true,
  }
}

function loadFromStorage(): UserInfo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const obj = JSON.parse(raw)
      return ensureUser(obj)
    }
  } catch {}
  return null
}

export interface ActivityItem {
  icon: string
  text: string
  time: string
  color: string
  link: string
}

export interface FavoriteItem {
  id: number
  title: string
  price: number
  category: string
  desc: string
  favAt: string
}

const FAV_STORAGE_KEY = 'campus_market_fav_v1'

function loadFavoritesFromStorage(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(FAV_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo | null>(loadFromStorage())
  const favorites = ref<FavoriteItem[]>(loadFavoritesFromStorage())

  watch(
    favorites,
    (val) => {
      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  watch(
    user,
    (val) => {
      if (val && val.isLoggedIn) localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      else localStorage.removeItem(STORAGE_KEY)
    },
    { deep: true },
  )

  const isLoggedIn = computed(() => !!user.value?.isLoggedIn)
  const displayName = computed(() => user.value?.name || '未登录')
  const displayAvatar = computed(() => user.value?.avatar || user.value?.initial || '?')

  const favoritesCount = computed(() => favorites.value.length)
  const favoriteIds = computed(() => new Set(favorites.value.map((f) => f.id)))

  const RECENT_ACTIVITY: ActivityItem[] = [
    {
      icon: '💬',
      text: '<b>同学·小王</b> 对你的「iPad Air 5」留言：能小刀到 3000 吗？',
      time: '10 分钟前',
      color: '#409EFF',
      link: '/message',
    },
    {
      icon: '💰',
      text: '恭喜！你发布的「高等数学同济第8版」已成功<b>售出</b>，收款 ¥25',
      time: '3 小时前',
      color: '#F56C6C',
      link: '/list',
    },
    {
      icon: '⭐',
      text: '你收藏的「iPhone 14 Pro」商家降价了 ¥300，快去看看吧！',
      time: '今天 10:22',
      color: '#E6A23C',
      link: '/detail/1008',
    },
    {
      icon: '🏃',
      text: '你发布的跑腿「帮忙去快递站取件」已被 <b>跑腿侠</b> 接单',
      time: '今天 09:15',
      color: '#9B59B6',
      link: '/message',
    },
    {
      icon: '🔍',
      text: '你发布的「寻找丢失的校园卡」已确认 <b>找到失主</b>，奖励积分 +20',
      time: '昨天 21:48',
      color: '#67C23A',
      link: '/list',
    },
    {
      icon: '📝',
      text: '你发布了新闲置「九成新 iPad Air 5 256G 带笔」，浏览量正在上涨 📈',
      time: '昨天 18:30',
      color: '#409EFF',
      link: '/detail/1001',
    },
    {
      icon: '👥',
      text: '你发起的拼单「喜茶满 50 减 20」已凑单成功，人均仅 ¥18！',
      time: '3 天前',
      color: '#67C23A',
      link: '/list',
    },
    {
      icon: '⭐',
      text: '你收藏了二手闲置「罗技 G304 无线鼠标 99 新」，价格 ¥128',
      time: '5 天前',
      color: '#E6A23C',
      link: '/detail/1004',
    },
  ]

  function login(payload: { account: string; password?: string; code?: string; fromRegister?: boolean }) {
    const demoAccounts: Record<string, Partial<UserInfo>> = {
      '20231234': {
        name: '小杨同学',
        initial: '杨',
        avatar: '😀',
        phone: '138****8888',
        stuNo: '20231234',
        college: '计算机科学与技术学院',
        campus: '主校区（东区）',
        grade: '2023 级',
        major: '软件工程',
        credit: 98,
        published: 24,
        favCount: 36,
        verified: true,
        regAt: '2025-08-05',
      },
    }
    const preset = demoAccounts[payload.account.trim()] || {}
    if (Object.keys(preset).length === 0) {
      preset.name = payload.account.includes('@') ? payload.account.split('@')[0] : `同学${payload.account.slice(-4) || ''}`
      preset.phone = /^1\d{10}$/.test(payload.account) ? payload.account.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : undefined
      preset.stuNo = /^\d{6,}$/.test(payload.account) ? payload.account : undefined
      preset.regAt = new Date().toISOString().slice(0, 10)
    }
    user.value = ensureUser(preset)
    return {
      ok: true,
      isNew: !!payload.fromRegister,
      message: payload.fromRegister ? '🎉 注册成功！已自动登录' : `🎉 欢迎回来，${user.value.name}`,
    }
  }

  function register(payload: {
    phone: string
    code: string
    name: string
    avatar?: string
    pwd: string
    college: string
    campus: string
    grade: string
    major?: string
  }) {
    const u: Partial<UserInfo> = {
      name: payload.name,
      avatar: payload.avatar,
      initial: payload.name.charAt(0),
      phone: payload.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      stuNo: '',
      college: payload.college,
      campus: payload.campus,
      grade: payload.grade,
      major: payload.major,
      credit: 100,
      published: 0,
      favCount: 0,
      verified: false,
      isNew: true,
      regAt: new Date().toISOString().slice(0, 10),
    }
    user.value = ensureUser(u)
    return { ok: true, message: '🎉 注册成功！新人礼包已放入背包' }
  }

  function logout() {
    user.value = null
  }

  function isFavorited(id: number): boolean {
    return favoriteIds.value.has(id)
  }

  function addFavorite(product: { id: number; title: string; price: number; category: string; desc: string }): { ok: boolean; msg: string } {
    if (favoriteIds.value.has(product.id)) return { ok: false, msg: '已收藏，无需重复添加' }
    favorites.value.unshift({
      ...product,
      favAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    })
    if (user.value) user.value.favCount = favorites.value.length
    return { ok: true, msg: `⭐ 已收藏「${product.title}」` }
  }

  function removeFavorite(id: number): { ok: boolean; msg: string } {
    const before = favorites.value.length
    favorites.value = favorites.value.filter((f) => f.id !== id)
    if (favorites.value.length === before) return { ok: false, msg: '该内容未收藏' }
    if (user.value) user.value.favCount = favorites.value.length
    return { ok: true, msg: '💔 已取消收藏' }
  }

  function toggleFavorite(product: { id: number; title: string; price: number; category: string; desc: string }): { ok: boolean; favored: boolean; msg: string } {
    if (isFavorited(product.id)) {
      const r = removeFavorite(product.id)
      return { ok: r.ok, favored: false, msg: r.msg }
    } else {
      const r = addFavorite(product)
      return { ok: r.ok, favored: true, msg: r.msg }
    }
  }

  function clearAllFavorites(): { ok: boolean; msg: string } {
    if (favorites.value.length === 0) return { ok: false, msg: '当前没有收藏内容' }
    favorites.value = []
    if (user.value) user.value.favCount = 0
    return { ok: true, msg: '已清空收藏夹' }
  }

  return {
    user,
    isLoggedIn,
    displayName,
    displayAvatar,
    RECENT_ACTIVITY,
    favorites,
    favoritesCount,
    favoriteIds,
    login,
    register,
    logout,
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,
  }
})
