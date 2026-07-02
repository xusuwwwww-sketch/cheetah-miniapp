<template>
  <view class="page">
    <view class="nav-bar" @tap="goBack">
      <text class="icon-text">‹</text>
      <text class="nav-title">报告详情</text>
      <view style="width: 20px;"></view>
    </view>

    <scroll-view scroll-y class="content" v-if="detail">
      <view class="cover" :style="{ background: detail.gradient || 'linear-gradient(135deg, #2563eb, #60a5fa)' }">
        <text class="icon-text">📊</text>
        <text class="cover-title">{{ detail.title }}</text>
      </view>

      <view class="info-card">
        <view class="info-row"><text class="icon-text">👥</text><text class="info-label">来源</text><text class="info-value">{{ detail.source || '-' }}</text></view>
        <view class="info-row"><text class="icon-text">📅</text><text class="info-label">年份</text><text class="info-value">{{ detail.year || '-' }}</text></view>
        <view class="info-row"><text class="icon-text">🏷</text><text class="info-label">行业</text><text class="info-value">{{ detail.industry || '-' }}</text></view>
        <view class="info-row"><text class="icon-text">📍</text><text class="info-label">地区</text><text class="info-value">{{ detail.region || '-' }}</text></view>
      </view>

      <view class="desc-card" v-if="detail.summary">
        <text class="desc-title">简介</text>
        <rich-text class="desc-content" :nodes="detail.summary" />
      </view>
      <view style="height: 80px;"></view>
    </scroll-view>

    <view v-if="!detail && loading" class="empty"><text class="empty-text">加载中...</text></view>

    <view class="bottom-bar" v-if="detail">
      <view class="btn" @tap="onDownload">
        <text class="icon-text">⬇</text>
        <text class="btn-text">  下载报告</text>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() { return { id: '', detail: null, loading: true, profile: null } },
  onLoad(e) { this.id = e.id; this.loadDetail(); this.loadProfile() },
  methods: {
    loadDetail() {
      this.loading = true
      api.getReportDetail(this.id).then(r => { if (r.code === 0) this.detail = r.data }).catch(() => {}).finally(() => { this.loading = false })
    },
    loadProfile() {
      api.getProfile().then(r => { if (r.code === 0) this.profile = r.data }).catch(() => {})
    },
    onDownload() {
      if (this.profile && this.profile.level < 2) {
        return uni.showToast({ title: '请先完善个人信息', icon: 'none' })
      }
      uni.showLoading({ title: '获取中...' })
      api.viewReport(this.id).then(r => {
        uni.hideLoading()
        if (r.code === 0 && r.data && r.data.file_url) {
          // #ifdef H5
          window.open(r.data.file_url)
          // #endif
          // #ifndef H5
          uni.downloadFile({ url: r.data.file_url, success(res) { uni.openDocument({ filePath: res.tempFilePath }) } })
          // #endif
        } else {
          uni.showToast({ title: r.msg || '获取失败', icon: 'none' })
        }
      }).catch(() => { uni.hideLoading(); uni.showToast({ title: '网络异常', icon: 'none' }) })
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
.cover { padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
.cover-title { font-size: 20px; font-weight: 700; color: #fff; margin-top: 12px; text-align: center; }
.info-card { background: #fff; margin: -12px 16px 12px; border-radius: 12px; padding: 16px; }
.info-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 13px; color: #6b7280; width: 60px; flex-shrink: 0; }
.info-value { font-size: 14px; color: #1a1a2e; flex: 1; }
.desc-card { background: #fff; margin: 12px 16px; border-radius: 12px; padding: 16px; }
.desc-title { font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
.desc-content { font-size: 14px; color: #6b7280; line-height: 1.8; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: #fff; border-top: 1px solid #e5e7eb; padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
.btn { background: #ff6b35; border-radius: 8px; padding: 14px; text-align: center; display: flex; align-items: center; justify-content: center; }
.btn-text { color: #fff; font-size: 16px; font-weight: 600; }
.empty { padding: 80px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }
</style>
