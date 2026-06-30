import http from './http'

export interface ErrandItem {
  id: number
  title: string
  taskType: string
  reward: number
  from: string
  to: string
  deadline: string
  publisher: string
  status: string
  description: string
}

export type CreateErrandPayload = Omit<ErrandItem, 'id' | 'publisher'>

export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}

export function createErrand(payload: CreateErrandPayload) {
  return http.post<ErrandItem>('/errands', {
    ...payload,
    publisher: '校园用户'
  })
}
