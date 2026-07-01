import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type FavoriteType = 'trade' | 'lostFound' | 'groupBuy' | 'errand'

export interface FavoriteItem {
  type: FavoriteType
  id: number
  title: string
  description: string
  location: string
}

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref<FavoriteItem[]>([])

  const favoriteCount = computed(() => favorites.value.length)

  function isFavorite(type: FavoriteType, id: number): boolean {
    return favorites.value.some((f) => f.type === type && f.id === id)
  }

  function addFavorite(item: FavoriteItem): { ok: boolean; msg: string } {
    if (isFavorite(item.type, item.id)) {
      return { ok: false, msg: '该内容已在收藏夹中' }
    }
    favorites.value.unshift({ ...item })
    return { ok: true, msg: `⭐ 已收藏「${item.title}」` }
  }

  function removeFavorite(type: FavoriteType, id: number): { ok: boolean; msg: string } {
    const before = favorites.value.length
    favorites.value = favorites.value.filter((f) => !(f.type === type && f.id === id))
    if (favorites.value.length === before) {
      return { ok: false, msg: '该内容未收藏，无需取消' }
    }
    return { ok: true, msg: '💔 已取消收藏' }
  }

  function toggleFavorite(item: FavoriteItem): { ok: boolean; favored: boolean; msg: string } {
    if (isFavorite(item.type, item.id)) {
      const r = removeFavorite(item.type, item.id)
      return { ok: r.ok, favored: false, msg: r.msg }
    } else {
      const r = addFavorite(item)
      return { ok: r.ok, favored: true, msg: r.msg }
    }
  }

  function clearAllFavorites(): { ok: boolean; msg: string } {
    if (favorites.value.length === 0) {
      return { ok: false, msg: '当前没有收藏内容，无需清空' }
    }
    const count = favorites.value.length
    favorites.value = []
    return { ok: true, msg: `🗑️ 已清空全部 ${count} 条收藏` }
  }

  return {
    favorites,
    favoriteCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,
  }
})
