import http from './http'

export interface UserItem {
  id: string
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
  password: string
  phone: string
  createdAt: string
}

export type CreateUserPayload = Omit<UserItem, 'id'>

export async function getUsers(params?: Partial<UserItem>) {
  const res = await http.get<UserItem[]>('/users')
  if (!params) return res
  const filters = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && String(v) !== '',
  )
  return {
    ...res,
    data: res.data.filter((u) =>
      filters.every(([k, v]) => {
        const val = (u as unknown as Record<string, unknown>)[k]
        if (val === undefined || val === null) return false
        return String(val) === String(v)
      }),
    ),
  }
}

export function createUser(payload: CreateUserPayload) {
  return http.post<UserItem>('/users', payload)
}
