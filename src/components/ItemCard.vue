<template>
  <article class="item-card" :class="{ clickable: $attrs.onClick }" v-bind="$attrs">
    <div class="item-card__header">
      <h3>{{ title }}</h3>
      <span v-if="tag" class="tag">{{ tag }}</span>
    </div>

    <p class="description">{{ description }}</p>

    <div class="meta">
      <span v-if="location">地点：{{ location }}</span>
      <span v-if="time">时间：{{ time }}</span>
    </div>

    <div v-if="$slots.footer" class="footer">
      <slot name="footer" />
    </div>

    <div class="fav-bar">
      <button
        type="button"
        class="fav-toggle"
        :class="{ favored: favored, 'not-logged': !userStore.isLoggedIn }"
        @click.stop="handleToggle"
      >
        <template v-if="!userStore.isLoggedIn">🔒 收藏</template>
        <template v-else-if="favored">⭐ 已收藏</template>
        <template v-else>🤍 收藏</template>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFavoriteStore, type FavoriteType } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  type: FavoriteType
  id: number
  title: string
  description: string
  tag?: string
  location?: string
  time?: string
}>()

const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

const favored = computed(() => favoriteStore.isFavorite(props.type, props.id))

function handleToggle() {
  if (!userStore.isLoggedIn) {
    alert('请先登录后再收藏')
    return
  }
  favoriteStore.toggleFavorite({
    type: props.type,
    id: props.id,
    title: props.title,
    description: props.description,
    location: props.location ?? '',
  })
}
</script>

<style scoped>
.item-card {
  padding: 18px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: 0.18s;
}

.item-card.clickable {
  cursor: pointer;
}

.item-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
  border-color: #c6e2ff;
}

.item-card__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.item-card h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  white-space: nowrap;
}

.description {
  margin: 12px 0;
  color: #4b5563;
  line-height: 1.6;
}

.meta {
  display: flex;
  gap: 16px;
  color: #6b7280;
  font-size: 13px;
  flex-wrap: wrap;
}

.footer {
  margin-top: 12px;
}

.fav-bar {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.fav-toggle {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  font-size: 13px;
  cursor: pointer;
  transition: 0.18s;
  font-family: inherit;
  font-weight: 500;
}

.fav-toggle:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.fav-toggle.favored {
  background: linear-gradient(135deg, #fff7d6 0%, #ffe28a 100%);
  border-color: #f59e0b;
  color: #b45309;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.18);
}

.fav-toggle.favored:hover {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #ef4444;
  color: #991b1b;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.22);
}

.fav-toggle.not-logged {
  border-style: dashed;
  border-color: #c7d2fe;
  color: #6366f1;
  background: #f5f3ff;
}

.fav-toggle.not-logged:hover {
  border-color: #6366f1;
  background: #eef2ff;
  color: #4338ca;
}
</style>
