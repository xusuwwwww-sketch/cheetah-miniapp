<template>
  <view class="page">
    <!-- Nav -->
    <view class="nav-bar" @tap="goBack">
      <uni-icons type="back" size="20" color="#1a1a2e" />
      <text class="nav-title">活动详情</text>
      <view style="width: 20px;"></view>
    </view>

    <scroll-view scroll-y class="content" v-if="detail">
      <!-- 头图 -->
      <view class="cover" :style="{ background: detail.gradient || 'linear-gradient(135deg, #ff6b35, #ff9a5c)' }">
        <text class="cover-title">{{ detail.title }}</text>
        <text class="cover-tag" v-if="detail.type_name">{{ detail.type_name }}</text>
      </view>

      <!-- 信息 -->
      <view class="info-card">
        <view class="info-row">
          <uni-icons type="calendar" size="16" color="#ff6b35" />
          <text class="info-label">时间</text>
          <text class="info-value">{{ detail.start_time }}</text>
        </view>
        <view class="info-row" v-if="detail.location">
          <uni-icons type="location" size="16" color="#ff6b35" />
          <text class="info-label">地点</text>
          <text class="info-value">{{ detail.location }}</text>
        </view>
        <view class="info-row" v-if="detail.organizer">
          <uni-icons type="staff" size="16" color="#ff6b35" />
          <text class="info-label">主办方</text>
          <text class="info-value">{{ detail.organizer }}</text>
        </view>
        <view class="info-row" v-if="detail.signup_deadline">
          <uni-icons type="clock" size="16" color="#ff6b35" />
          <text class="info-label">报名截止</text>
          <text class="info-value">{{ detail.signup_deadline }}</text>
        </view>
        <view class="info-row">
          <uni-icons type="person" size="16" color="#ff6b35" />
          <text class="info-label">名额</text>
          <text class="info-value">{{ detail.signup_count || 0 }}/{{ detail.max_quota || '不限' }}</text>
        </view>
      </view>

      <!-- 描述 -->
      <view class="desc-card" v-if="detail.description">
        <text class="desc-title">活动详情</text>
        <rich-text class="desc-content" :nodes="detail.description" />
      </view>

      <view style="height: 80px;"></view>
    </scroll-view>

    <view v-if="!detail && loading" class="empty"><text class="empty-text">加载中...</text></view>
    <view v-if="!detail && !loading" class="empty"><text class="empty-text">活动不存在</text></view>

    <!-- 底部按钮 -->
    <view class="bottom-bar" v-if="detail">
      <view :class="['btn', { disabled: detail.status === 'ended' || detail.status === 'full' }]" @tap="onSignup">
        <text class="btn-text">{{ detail.status === 'ended' ? '已结束' : detail.status === 'full' ? '已满员' : '立即报名' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() { return { id: '', detail: null, loading: true } },
  onLoad(e) { this.id = e.id; this.loadDetail() },
  methods: {
    loadDetail() {
      this.loading = true
      api.getActivityDetail(this.id).then(r => { if (r.code === 0) this.detail = r.data }).catch(() => {}).finally(() => { this.loading = false })
    },
    onSignup() {
      if (!this.detail || this.detail.status === 'ended' || this.detail.status === 'full') return
      api.signupActivity(this.id).then(r => {
        if (r.code === 0) { uni.showToast({ title: '报名成功', icon: 'success' }); this.loadDetail() }
        else uni.showToast({ title: r.msg || '报名失败', icon: 'none' })
      }).catch(() => { uni.showToast({ title: '网络异常', icon: 'none' }) })
    },
    goBack() { uni.navigateBack() }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; }
.nav-bar { padding: 16px; padding-top: 50px; display: flex; align-items: center; justify-content: space-between; }
.nav-title { font-size: 17px; font-weight: 600; color: #1a1a2e; }
.content { height: calc(100vh - 90px); }
.cover { padding: 30px 20px; }
.cover-title { font-size: 20px; font-weight: 700; color: #fff; }
.cover-tag { font-size: 12px; color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; display: inline-block; margin-top: 8px; }
.info-card { background: #fff; margin: -12px 16px 12px; border-radius: 12px; padding: 16px; }
.info-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 13px; color: #6b7280; width: 70px; flex-shrink: 0; }
.info-value { font-size: 14px; color: #1a1a2e; flex: 1; }
.desc-card { background: #fff; margin: 12px 16px; border-radius: 12px; padding: 16px; }
.desc-title { font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
.desc-content { font-size: 14px; color: #6b7280; line-height: 1.8; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: #fff; border-top: 1px solid #e5e7eb; padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
.btn { background: #ff6b35; border-radius: 8px; padding: 14px; text-align: center; }
.btn.disabled { background: #d1d5db; }
.btn-text { color: #fff; font-size: 16px; font-weight: 600; }
.empty { padding: 80px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }
</style>
