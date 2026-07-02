import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUsers, type UserItem } from '@/api/user'

export const STORAGE_KEY = 'campus_market_current_user_v1'

export interface CurrentUser {
  id: string
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
  isLoggedIn?: boolean
}

function isValidUser(u: unknown): u is CurrentUser {
  if (!u || typeof u !== 'object') return false
  const o = u as Record<string, unknown>
  return typeof o.id === 'string' && typeof o.name === 'string'
}

function emptyShell(loggedIn: boolean): CurrentUser {
  return {
    id: '',
    name: '',
    college: '',
    grade: '',
    avatar: '',
    bio: '',
    isLoggedIn: loggedIn,
  }
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<CurrentUser | null>(null)
  const isLoggedIn = ref<boolean>(false)

  function persist() {
    if (currentUser.value) {
      const { isLoggedIn: _drop, ...rest } = currentUser.value
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const displayName = computed(() => {
    const u = currentUser.value
    if (!u) return '未登录用户'
    const parts = [u.grade, u.college].filter(Boolean)
    if (!parts.length) return u.name
    return `${u.name}（${parts.join('·')}）`
  })

  const user = computed<CurrentUser>(() => {
    if (currentUser.value) {
      return { ...currentUser.value, isLoggedIn: isLoggedIn.value }
    }
    return emptyShell(isLoggedIn.value)
  })

  async function login(
    usernameOrObj: string | Record<string, unknown>,
    maybePassword?: string,
  ): Promise<{ ok: boolean; message: string }> {
    let username = ''
    let password = ''

    if (typeof usernameOrObj === 'string') {
      username = usernameOrObj.trim()
      password = String(maybePassword ?? '')
    } else if (usernameOrObj && typeof usernameOrObj === 'object') {
      const obj = usernameOrObj
      const account = [obj.account, obj.phone, obj.username, obj.name]
        .map((v) => (typeof v === 'string' ? v.trim() : ''))
        .find((v) => !!v) ?? ''
      username = account
      const pwd = [obj.password, obj.pwd]
        .map((v) => (typeof v === 'string' ? v : ''))
        .find((v) => !!v)
      password = pwd ?? ''
      if (!password && typeof obj.code === 'string' && obj.code.length >= 4) {
      }
    }

    if (!username) {
      throw new Error('请输入账号')
    }

    try {
      const query: Partial<UserItem> = { phone: username }
      const { data } = await getUsers(query)
      if (!data || data.length === 0) {
        const { data: byName } = await getUsers({ name: username } as Partial<UserItem>)
        if (!byName || byName.length === 0) {
          throw new Error('账号不存在，请先注册')
        }
        const match = password ? byName.filter((u) => u.password === password) : byName
        if (!match.length) {
          throw new Error('账号或密码错误')
        }
        const u = match[0]!
        currentUser.value = {
          id: u.id,
          name: u.name,
          college: u.college,
          grade: u.grade,
          avatar: u.avatar || '😀',
          bio: u.bio || '',
        }
      } else {
        const match = password ? data.filter((u) => u.password === password) : data
        if (!match.length) {
          throw new Error('账号或密码错误')
        }
        const u = match[0]!
        currentUser.value = {
          id: u.id,
          name: u.name,
          college: u.college,
          grade: u.grade,
          avatar: u.avatar || '😀',
          bio: u.bio || '',
        }
      }

      isLoggedIn.value = true
      persist()
      return {
        ok: true,
        message: `登录成功，欢迎回来，${currentUser.value.name}！`,
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '登录失败，请稍后重试'
      throw new Error(msg)
    }
  }

  function logout() {
    currentUser.value = null
    isLoggedIn.value = false
    localStorage.removeItem(STORAGE_KEY)
  }

  function restoreLogin() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (!isValidUser(parsed)) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      currentUser.value = {
        id: parsed.id,
        name: parsed.name,
        college: parsed.college || '',
        grade: parsed.grade || '',
        avatar: parsed.avatar || '😀',
        bio: parsed.bio || '',
      }
      isLoggedIn.value = true
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      currentUser.value = null
      isLoggedIn.value = false
    }
  }

  function updateProfile(payload: Partial<Omit<CurrentUser, 'id' | 'isLoggedIn'>>) {
    if (currentUser.value) {
      Object.assign(currentUser.value, payload)
      persist()
    }
  }

  restoreLogin()

  return {
    currentUser,
    isLoggedIn,
    displayName,
    user,
    login,
    logout,
    restoreLogin,
    updateProfile,
  }
})
