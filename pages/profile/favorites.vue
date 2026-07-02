<template>
  <view class="page">
    <scroll-view scroll-y style="height: 100vh;">
      <view v-if="list.length">
        <view class="card" v-for="item in list" :key="item.id" @tap="goItem(item)">
          <view class="card-left">
            <view class="type-dot" :style="{ background: typeColor(item.target_type) }"></view>
            <text class="type-label">{{ typeLabel(item.target_type) }}</text>
          </view>
          <view class="card-info">
            <text class="card-id">{{ item.title || `内容 #${item.target_id}` }}</text>
            <text class="card-meta">{{ formatTime(item.created_at) }}</text>
          </view>
          <view class="cancel-btn" @tap.stop="removeFav(item)">
            <text class="cancel-text">取消</text>
          </view>
        </view>
      </view>
      <view v-else class="empty"><text class="empty-text">暂无收藏</text></view>
      <view style="height: 60px;"></view>
    </scroll-view>
  </view>
</template>
<script>
import { api } from '@/utils/api.js'
export default {
  data() { return { list: [] } },
  onLoad() { this.load() },
  methods: {
    load() {
      api.getFavorites().then(r => { if (r.code === 0) this.list = r.data || [] }).catch(() => {})
    },
    typeLabel(t) { return { report: '报告', material: '资料', activity: '活动', case: '案例' }[t] || t },
    typeColor(t) { return { report: '#2563eb', material: '#7c3aed', activity: '#ff6b35', case: '#059669' }[t] || '#9ca3af' },
    formatTime(t) { return t ? t.replace('T', ' ').substring(0, 16).replace(/-/g, '/') : '' },
    goItem(item) {
      if (item.target_type === 'activity') uni.navigateTo({ url: `/pages/activity/detail?id=${item.target_id}` })
      else uni.navigateTo({ url: `/pages/material/detail?id=${item.target_id}&type=${item.target_type}` })
    },
    removeFav(item) {
      api.toggleFavorite({ target_type: item.target_type, target_id: item.target_id }).then(r => {
        if (r.code === 0) { uni.showToast({ title: '已取消收藏', icon: 'success' }); this.load() }
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
.page { background: #f6f7fb; }
.card { background: #fff; border-radius: 12px; margin: 12px 16px; display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
.card-left { display: flex; align-items: center; gap: 6px; }
.type-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.type-label { font-size: 12px; color: #6b7280; }
.card-info { flex: 1; }
.card-id { font-size: 14px; color: #1a1a2e; display: block; margin-bottom: 3px; }
.card-meta { font-size: 12px; color: #9ca3af; }
.cancel-btn { padding: 4px 10px; border-radius: 6px; background: #f3f4f6; }
.cancel-text { font-size: 12px; color: #6b7280; }
.empty { padding: 80px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }
</style>
