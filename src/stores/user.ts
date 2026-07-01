import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CurrentUser {
  id: string
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', () => {
  const user = ref<CurrentUser>({
    id: '20231234',
    name: '小杨同学',
    college: '计算机科学与技术学院',
    grade: '2023级',
    avatar: '😀',
    bio: '软件工程专业 · 热爱二手好物分享，接靠谱跑腿小单 ☕',
    isLoggedIn: true,
  })

  const displayName = computed(
    () => `${user.value.name}（${user.value.grade}·${user.value.college}）`,
  )

  function updateProfile(payload: Partial<Omit<CurrentUser, 'id' | 'isLoggedIn'>>) {
    Object.assign(user.value, payload)
  }

  function login(_payload?: unknown): { ok: boolean; message: string } {
    const p = _payload as { account?: string } | undefined
    if (p?.account) {
      const acc = String(p.account)
      if (acc.length >= 4) {
        const tail = acc.slice(-4)
        let guessName = user.value.name
        if (/^1\d{10}$/.test(acc)) guessName = `同学${tail}`
        else if (/^\d+$/.test(acc)) guessName = `学号${tail}同学`
        Object.assign(user.value, {
          name: guessName,
          id: /^\d+$/.test(acc) ? acc : user.value.id,
        })
      }
    }
    user.value.isLoggedIn = true
    return { ok: true, message: `登录成功，欢迎回来，${user.value.name}！` }
  }

  function register(
    payload?: Partial<{
      phone: string
      code: string
      name: string
      avatar: string
      pwd: string
      college: string
      campus: string
      grade: string
      major: string
    }>,
  ): { ok: boolean; message: string } {
    const p = payload ?? {}
    const merge: Partial<Omit<CurrentUser, 'id' | 'isLoggedIn'>> = {}
    if (p.name) merge.name = p.name
    if (p.avatar) merge.avatar = p.avatar
    if (p.college) merge.college = p.college
    if (p.grade) merge.grade = p.grade
    const bioParts: string[] = []
    if (p.major) bioParts.push(p.major + '专业')
    if (p.campus) bioParts.push(p.campus)
    if (bioParts.length) merge.bio = bioParts.join(' · ')
    if (p.phone && /^1\d{10}$/.test(p.phone)) {
      user.value.id = p.phone.slice(-8)
    }
    updateProfile(merge)
    user.value.isLoggedIn = true
    return { ok: true, message: '🎉 注册成功，欢迎加入校园轻集市！' }
  }

  function logout() {
    user.value.isLoggedIn = false
  }

  return {
    user,
    displayName,
    updateProfile,
    login,
    register,
    logout,
  }
})
