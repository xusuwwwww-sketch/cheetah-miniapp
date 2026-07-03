<template>
  <view class="page">
    <scroll-view scroll-y style="height: 100vh;" v-if="detail">
      <!-- 封面 -->
      <view class="cover" :style="{ background: detail.gradient || defaultGradient }">
        <image v-if="detail.cover_url" :src="detail.cover_url" class="cover-img" mode="aspectFill" />
        <view v-else class="cover-text">
          <text class="cover-title">{{ detail.title }}</text>
        </view>
      </view>

      <!-- 标题卡片 -->
      <view class="title-card">
        <text class="main-title">{{ detail.title }}</text>
        <!-- 报告专属标签 -->
        <view class="tags-row" v-if="type === 'report'">
          <text class="tag-badge" v-if="detail.is_free == 1 || detail.is_free === true">免费</text>
          <text class="tag-badge paid" v-else>¥{{ detail.price }}</text>
          <text class="tag-badge gray" v-if="detail.year">{{ detail.year }}</text>
          <text class="tag-badge gray" v-if="detail.industry">{{ detail.industry }}</text>
          <text class="tag-badge gray" v-if="detail.region">{{ detail.region }}</text>
        </view>
      </view>

      <!-- 信息卡片 -->
      <view class="info-card">
        <view class="info-row" v-if="detail.author || detail.source">
          <text class="info-label">{{ type === 'report' ? '来源' : '作者' }}</text>
          <text class="info-value">{{ detail.author || detail.source || '-' }}</text>
        </view>
        <view class="info-row" v-if="type === 'report' && detail.year">
          <text class="info-label">年份</text>
          <text class="info-value">{{ detail.year }}</text>
        </view>
        <view class="info-row" v-if="type !== 'case' && detail.file_size">
          <text class="info-label">文件大小</text>
          <text class="info-value">{{ detail.file_size }}</text>
        </view>
        <view class="info-row" v-if="type === 'report' && detail.region">
          <text class="info-label">地区</text>
          <text class="info-value">{{ detail.region }}</text>
        </view>
      </view>

      <!-- 简介 -->
      <view class="section-card" v-if="detail.summary">
        <text class="section-title">简介</text>
        <text class="section-text">{{ detail.summary }}</text>
      </view>

      <!-- 案例正文 -->
      <view class="section-card" v-if="type === 'case' && detail.content">
        <text class="section-title">案例详情</text>
        <rich-text class="rich-content" :nodes="detail.content" />
      </view>

      <view style="height: 90px;"></view>
    </scroll-view>

    <!-- 加载中 -->
    <view v-if="!detail && loading" class="loading-wrap">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="detail">
      <view class="fav-icon" @tap="toggleFav">
        <text class="fav-text">{{ favorited ? '❤️' : '🤍' }}</text>
      </view>
      <!-- 报告/资料库：下载 -->
      <template v-if="type !== 'case'">
        <view class="dl-btn" @tap="onDownload" style="flex:1">
          <text class="dl-text">⬇ 下载{{ type === 'report' ? '报告' : '资料' }}</text>
        </view>
      </template>
      <!-- 案例库：预约咨询 -->
      <template v-if="type === 'case'">
        <view class="dl-btn consult-btn" @tap="goConsult" style="flex:1">
          <text class="dl-text">💬 预约顾问咨询</text>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() { return { id: '', type: 'material', detail: null, loading: true, favorited: false } },
  computed: {
    defaultGradient() {
      return { report: 'linear-gradient(135deg, #2563eb, #60a5fa)', case: 'linear-gradient(135deg, #059669, #34d399)', material: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }[this.type] || 'linear-gradient(135deg, #7c3aed, #a78bfa)'
    }
  },
  onLoad(e) {
    this.id = e.id
    this.type = e.type || 'material'
    this.loadDetail()
  },
  methods: {
    loadDetail() {
      this.loading = true
      const req = this.type === 'report'
        ? api.getReportDetail(this.id)
        : api.getMaterialDetail(this.id)
      req.then(r => {
        if (r.code === 0) {
          this.detail = r.data
          // 同步收藏状态（detail接口返回了favorited字段）
          if (r.data.favorited !== undefined) {
            this.favorited = !!r.data.favorited
          } else {
            // 未登录时查本地缓存
            const key = `fav_${this.type}_${this.id}`
            this.favorited = !!uni.getStorageSync(key)
          }
        }
      }).catch(() => {}).finally(() => { this.loading = false })
    },
    onDownload() {
      uni.showLoading({ title: '下载中...' })
      const req = this.type === 'report'
        ? api.viewReport(this.id)
        : api.downloadMaterial(this.id)
      req.then(r => {
        uni.hideLoading()
        if (r.code === 0 && r.data && r.data.file_url) {
          // #ifndef H5
          uni.downloadFile({ url: r.data.file_url, success(res) { uni.openDocument({ filePath: res.tempFilePath }) } })
          // #endif
        } else if (r.code === 403) {
          uni.showToast({ title: '请先完善基础信息', icon: 'none' })
        } else {
          uni.showToast({ title: r.msg || '下载失败', icon: 'none' })
        }
      }).catch(() => { uni.hideLoading(); uni.showToast({ title: '网络异常', icon: 'none' }) })
    },
    goConsult() {
      uni.navigateTo({ url: '/pages/consult/index' })
    },
    toggleFav() {
      const token = uni.getStorageSync('token')
      if (!token) return uni.showToast({ title: '请先登录', icon: 'none' })
      api.toggleFavorite({ target_type: this.type, target_id: this.id }).then(r => {
        if (r.code === 0) {
          this.favorited = r.data?.favorited ?? !this.favorited
          const key = `fav_${this.type}_${this.id}`
          this.favorited ? uni.setStorageSync(key, 1) : uni.removeStorageSync(key)
          uni.showToast({ title: this.favorited ? '已收藏' : '已取消收藏', icon: 'none' })
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; }
.cover { height: 200px; position: relative; overflow: hidden; display: flex; align-items: flex-end; }
.cover-img { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
.cover-text { padding: 20px; position: relative; z-index: 1; }
.cover-title { font-size: 20px; font-weight: 700; color: #fff; line-height: 1.4; }

.title-card { background: #fff; margin: 0 16px; margin-top: -16px; border-radius: 12px; padding: 16px; position: relative; z-index: 2; }
.main-title { font-size: 17px; font-weight: 700; color: #1a1a2e; display: block; line-height: 1.5; margin-bottom: 10px; }
.tags-row { display: flex; flex-wrap: wrap; gap: 6px; }
.tag-badge { font-size: 12px; color: #059669; background: #ecfdf5; padding: 3px 8px; border-radius: 4px; }
.tag-badge.paid { color: #ff6b35; background: #fff3ee; }
.tag-badge.gray { color: #6b7280; background: #f3f4f6; }

.info-card { background: #fff; margin: 12px 16px; border-radius: 12px; padding: 4px 16px; }
.info-row { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 13px; color: #9ca3af; width: 70px; flex-shrink: 0; }
.info-value { font-size: 14px; color: #1a1a2e; flex: 1; }

.section-card { background: #fff; margin: 12px 16px; border-radius: 12px; padding: 16px; }
.section-title { font-size: 15px; font-weight: 600; color: #1a1a2e; display: block; margin-bottom: 10px; }
.section-text { font-size: 14px; color: #6b7280; line-height: 1.8; white-space: pre-wrap; }
.rich-content { font-size: 14px; color: #4b5563; line-height: 1.8; display: block; }

.loading-wrap { padding: 100px; text-align: center; }
.loading-text { font-size: 14px; color: #9ca3af; }

.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: #fff; border-top: 1px solid #e5e7eb; padding-bottom: calc(12px + env(safe-area-inset-bottom)); display: flex; gap: 10px; align-items: center; }
.fav-icon { width: 44px; height: 44px; border-radius: 10px; background: #f6f7fb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fav-text { font-size: 22px; }
.dl-btn { border-radius: 10px; padding: 14px; text-align: center; background: #2563eb; }
.dl-btn.consult-btn { background: #ff6b35; }
.dl-text { color: #fff; font-size: 16px; font-weight: 600; }
</style>
