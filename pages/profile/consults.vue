<template>
  <view class="page">
    <scroll-view scroll-y style="height: 100vh;">
      <view v-if="list.length">
        <view class="card" v-for="item in list" :key="item.id">
          <view class="card-header">
            <text class="card-title">{{ item.topic || '出海顾问咨询' }}</text>
            <view :class="['status-tag', `status-${item.status}`]">
              <text class="status-text">{{ statusLabel(item.status) }}</text>
            </view>
          </view>
          <view class="card-rows">
            <view class="row" v-if="item.name">
              <text class="row-label">姓名</text>
              <text class="row-value">{{ item.name }}</text>
            </view>
            <view class="row" v-if="item.company">
              <text class="row-label">公司</text>
              <text class="row-value">{{ item.company }}</text>
            </view>
            <view class="row">
              <text class="row-label">提交时间</text>
              <text class="row-value">{{ formatTime(item.created_at) }}</text>
            </view>
            <view class="row" v-if="item.scheduled_at">
              <text class="row-label">预约时间</text>
              <text class="row-value">{{ formatTime(item.scheduled_at) }}</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty">
        <text class="empty-text">暂无咨询记录</text>
        <view class="go-btn" @tap="goConsult"><text class="go-text">立即预约咨询</text></view>
      </view>
      <view style="height: 60px;"></view>
    </scroll-view>
  </view>
</template>
<script>
import { api } from '@/utils/api.js'
export default {
  data() { return { list: [] } },
  onLoad() {
    api.getConsults().then(r => { if (r.code === 0) this.list = r.data || [] }).catch(() => {})
  },
  methods: {
    statusLabel(s) { return { 0: '待处理', 1: '已跟进', 2: '已完成', 3: '已取消' }[s] || '待处理' },
    formatTime(t) { return t ? t.replace('T', ' ').substring(0, 16).replace(/-/g, '/') : '' },
    goConsult() { uni.switchTab({ url: '/pages/consult/index' }) }
  }
}
</script>
<style scoped>
.page { background: #f6f7fb; }
.card { background: #fff; border-radius: 12px; margin: 12px 16px; padding: 16px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.card-title { font-size: 15px; font-weight: 600; color: #1a1a2e; flex: 1; margin-right: 8px; }
.status-tag { padding: 3px 8px; border-radius: 4px; }
.status-0 { background: #fff3ec; } .status-0 .status-text { color: #ff6b35; }
.status-1 { background: #eef3ff; } .status-1 .status-text { color: #2563eb; }
.status-2 { background: #ecfdf5; } .status-2 .status-text { color: #059669; }
.status-3 { background: #f3f4f6; } .status-3 .status-text { color: #9ca3af; }
.status-text { font-size: 12px; font-weight: 500; }
.card-rows { display: flex; flex-direction: column; gap: 8px; }
.row { display: flex; }
.row-label { font-size: 13px; color: #9ca3af; width: 70px; flex-shrink: 0; }
.row-value { font-size: 13px; color: #1a1a2e; flex: 1; }
.empty { padding: 80px 0 40px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.empty-text { font-size: 14px; color: #9ca3af; }
.go-btn { background: #ff6b35; border-radius: 10px; padding: 12px 24px; }
.go-text { color: #fff; font-size: 14px; font-weight: 600; }
</style>
