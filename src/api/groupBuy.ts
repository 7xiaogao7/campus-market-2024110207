import http from './http'

export interface GroupBuyItem {
  id: number
  title: string
  type: string
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  publisher: string
  status: string
  description: string
}

export type CreateGroupBuyPayload = Omit<GroupBuyItem, 'id'>

export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

export function createGroupBuy(payload: CreateGroupBuyPayload) {
  return http.post<GroupBuyItem>('/groupBuys', payload)
}
