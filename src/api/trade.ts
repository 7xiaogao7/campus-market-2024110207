import http from './http'

export interface TradeItem {
  id: number
  title: string
  category: string
  price: number
  condition: string
  location: string
  publisher: string
  publishTime: string
  image: string
  status: string
  description: string
}

export type CreateTradePayload = Omit<TradeItem, 'id' | 'publisher'>

export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

export function createTrade(payload: CreateTradePayload) {
  return http.post<TradeItem>('/trades', {
    ...payload,
    publisher: '校园用户'
  })
}
