<template>
  <view class="page">
    <scroll-view scroll-y style="height: 100vh;">
      <view v-if="list.length">
        <view class="card" v-for="item in list" :key="item.id">
          <view class="card-icon" :style="{ background: item.gradient || 'linear-gradient(135deg, #7c3aed, #a78bfa)' }">
            <image v-if="item.cover_url" :src="item.cover_url" class="icon-img" mode="aspectFill" />
            <text v-else class="icon-text">📂</text>
          </view>
          <view class="card-info">
            <text class="card-title">下载记录 #{{ item.id }}</text>
            <text class="card-meta">{{ formatTime(item.created_at) }}</text>
            <text class="card-type">{{ { report: '报告', material: '资料' }[item.target_type] || item.target_type }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty"><text class="empty-text">暂无下载记录</text></view>
      <view style="height: 60px;"></view>
    </scroll-view>
  </view>
</template>
<script>
import { api } from '@/utils/api.js'
export default {
  data() { return { list: [] } },
  onLoad() {
    api.getDownloads().then(r => { if (r.code === 0) this.list = r.data || [] }).catch(() => {})
  },
  methods: {
    formatTime(t) { return t ? t.replace('T', ' ').substring(0, 16).replace(/-/g, '/') : '' }
  }
}
</script>
<style scoped>
.page { background: #f6f7fb; }
.card { background: #fff; border-radius: 12px; margin: 12px 16px; display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
.card-icon { width: 52px; height: 52px; border-radius: 10px; flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.icon-img { width: 100%; height: 100%; }
.icon-text { font-size: 22px; }
.card-info { flex: 1; }
.card-title { font-size: 14px; font-weight: 600; color: #1a1a2e; display: block; margin-bottom: 3px; }
.card-meta { font-size: 12px; color: #9ca3af; display: block; }
.card-type { font-size: 12px; color: #7c3aed; background: #f3eeff; padding: 2px 6px; border-radius: 4px; margin-top: 4px; display: inline-block; }
.empty { padding: 80px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }
</style>
