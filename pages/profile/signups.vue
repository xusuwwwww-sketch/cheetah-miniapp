<template>
  <view class="page">
    <scroll-view scroll-y style="height: 100vh;">
      <view v-if="list.length">
        <view class="card" v-for="item in list" :key="item.id" @tap="goDetail(item)">
          <view class="card-cover" :style="{ background: item.gradient || 'linear-gradient(135deg, #ff6b35, #ff9a5c)' }">
            <image v-if="item.cover_url" :src="item.cover_url" class="cover-img" mode="aspectFill" />
          </view>
          <view class="card-body">
            <text class="card-title">{{ item.title }}</text>
            <view class="card-meta-row">
              <text class="card-meta">{{ formatTime(item.start_time) }}</text>
              <text class="card-meta" v-if="item.location">{{ item.location }}</text>
            </view>
            <view class="status-row">
              <text class="status-tag">已报名</text>
              <text class="cancel-btn" @tap.stop="cancelSignup(item)">取消报名</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty"><text class="empty-text">暂无报名记录</text></view>
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
      api.getSignups().then(r => { if (r.code === 0) this.list = r.data || [] }).catch(() => {})
    },
    formatTime(t) { return t ? t.replace('T', ' ').substring(0, 16).replace(/-/g, '/') : '' },
    goDetail(item) { uni.navigateTo({ url: `/pages/activity/detail?id=${item.activity_id}` }) },
    cancelSignup(item) {
      uni.showModal({ title: '确认取消', content: '确定要取消报名吗？', success: (res) => {
        if (res.confirm) {
          api.cancelSignup ? api.cancelSignup(item.activity_id).then(r => { if (r.code === 0) { uni.showToast({ title: '已取消', icon: 'success' }); this.load() } }) : uni.showToast({ title: '功能开发中', icon: 'none' })
        }
      }})
    }
  }
}
</script>
<style scoped>
.page { background: #f6f7fb; }
.card { background: #fff; border-radius: 12px; margin: 12px 16px; overflow: hidden; }
.card-cover { height: 120px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.cover-img { width: 100%; height: 100%; }
.card-body { padding: 12px 16px; }
.card-title { font-size: 15px; font-weight: 600; color: #1a1a2e; display: block; margin-bottom: 6px; }
.card-meta-row { display: flex; gap: 12px; margin-bottom: 8px; }
.card-meta { font-size: 12px; color: #9ca3af; }
.status-row { display: flex; justify-content: space-between; align-items: center; }
.status-tag { font-size: 12px; color: #059669; background: #ecfdf5; padding: 3px 8px; border-radius: 4px; }
.cancel-btn { font-size: 12px; color: #ef4444; }
.empty { padding: 80px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }
</style>
