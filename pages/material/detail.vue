<template>
  <view class="page">
    <scroll-view scroll-y style="height: calc(100vh - 80px);" v-if="detail">
      <!-- 封面 -->
      <view class="cover" :style="{ background: detail.gradient || defaultGradient }">
        <image v-if="detail.cover_url" :src="detail.cover_url" class="cover-img" mode="aspectFill" />
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
        <rich-text class="rich-content" :nodes="cleanContent(detail.content)" />
      </view>

      <view style="height: 40px;"></view>
    </scroll-view>

    <!-- 加载中 -->
    <view v-if="!detail && loading" class="loading-wrap">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="detail">
      <view class="fav-icon" @tap="toggleFav">
        <image class="fav-img" :src="favorited ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmNmIzNSIgc3Ryb2tlPSIjZmY2YjM1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTIgNS42N2wtMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OCA3Ljc4bDEuMDYgMS4wNkwxMiAyMS4yM2w3Ljc4LTcuNzggMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAgMC03Ljc4eiIvPjwvc3ZnPg==' : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmY2YjM1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTIgNS42N2wtMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OCA3Ljc4bDEuMDYgMS4wNkwxMiAyMS4yM2w3Ljc4LTcuNzggMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAgMC03Ljc4eiIvPjwvc3ZnPg=='" mode="aspectFit" />
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
          <text class="dl-text">预约顾问咨询</text>
        </view>
      </template>
    </view>

    <!-- 留资弹窗（下载前填写基础信息） -->
    <view class="lead-mask" v-if="showLeadForm" @tap="showLeadForm = false">
      <view class="lead-box" @tap.stop>
        <text class="lead-title">填写信息免费下载</text>
        <text class="lead-desc">填写以下信息，即可下载全部免费资料</text>
        <scroll-view scroll-y style="max-height:65vh;">
          <view class="lead-form">
            <view class="lead-item">
              <text class="lead-label">姓名 <text style="color:#ef4444">*</text></text>
              <input class="lead-input" placeholder="请输入姓名" v-model="leadForm.name" placeholder-style="color:#c0c4cc;" />
            </view>
            <view class="lead-item">
              <text class="lead-label">手机号 <text style="color:#ef4444">*</text></text>
              <input class="lead-input" type="tel" placeholder="请输入手机号" v-model="leadForm.phone" placeholder-style="color:#c0c4cc;" />
            </view>
            <view class="lead-item">
              <text class="lead-label">所在行业 <text style="color:#ef4444">*</text></text>
              <input class="lead-input" placeholder="如：跨境电商、游戏出海" v-model="leadForm.industry" placeholder-style="color:#c0c4cc;" />
            </view>
            <view class="lead-item">
              <text class="lead-label">职位 <text style="color:#9ca3af;font-size:11px;">选填</text></text>
              <input class="lead-input" placeholder="如：市场总监、创始人" v-model="leadForm.position" placeholder-style="color:#c0c4cc;" />
            </view>
            <view class="lead-item">
              <text class="lead-label">公司名称 <text style="color:#ef4444">*</text></text>
              <input class="lead-input" placeholder="请输入公司名称" v-model="leadForm.company" placeholder-style="color:#c0c4cc;" />
            </view>
            <view class="lead-item">
              <text class="lead-label">月推广预算 <text style="color:#ef4444">*</text></text>
              <input class="lead-input" placeholder="如：5万以内 / 5-20万 / 20万以上" v-model="leadForm.budget_info" placeholder-style="color:#c0c4cc;" />
            </view>
            <view class="lead-item">
              <text class="lead-label">核心需求 <text style="color:#ef4444">*</text></text>
              <textarea class="lead-textarea" placeholder="简述核心需求" v-model="leadForm.core_need" placeholder-style="color:#c0c4cc;" />
            </view>
            <view class="lead-btn" @tap="submitLead">
              <text class="lead-btn-text">{{ leadSubmitting ? '提交中...' : '立即下载' }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() { return { id: '', type: 'material', detail: null, loading: true, favorited: false, showLeadForm: false, leadForm: { name: '', phone: '', industry: '', position: '', company: '', budget_info: '', core_need: '' }, leadSubmitting: false } },
  computed: {
    defaultGradient() {
      return { report: 'linear-gradient(135deg, #2563eb, #60a5fa)', case: 'linear-gradient(135deg, #059669, #34d399)', material: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }[this.type] || 'linear-gradient(135deg, #7c3aed, #a78bfa)'
    }
  },
  onLoad(e) {
    this.id = e.id
    this.type = e.type || 'material'
    this.loadDetail()
    // 埋点：阅读事件
    const token = uni.getStorageSync('token')
    if (token) {
      api.trackView && api.trackView({ target_type: this.type, target_id: e.id }).catch(() => {})
    }
  },
  methods: {
    cleanContent(html) {
      if (!html) return ''
      // 先清除所有内联尺寸，再加微信小程序兼容的内联样式
      return html
        .replace(/<img([^>]*)\sstyle="[^"]*"([^>]*)\/?>/gi, '<img$1$2/>')
        .replace(/<img([^>]*)\swidth="[^"]*"([^>]*)\/?>/gi, '<img$1$2/>')
        .replace(/<img([^>]*)\sheight="[^"]*"([^>]*)\/?>/gi, '<img$1$2/>')
        .replace(/<img([^>]*)\/>/gi, '<img$1 style="max-width:100%;height:auto;display:block;" />')
    },
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
          this.showLeadForm = true
        } else {
          uni.showToast({ title: r.msg || '下载失败', icon: 'none' })
        }
      }).catch(() => { uni.hideLoading(); uni.showToast({ title: '网络异常', icon: 'none' }) })
    },
    goConsult() {
      uni.navigateTo({ url: '/pages/consult/index' })
    },
    submitLead() {
      const { name, phone, industry, company, budget_info, core_need } = this.leadForm
      if (!name || !phone || !industry || !company || !budget_info || !core_need) {
        return uni.showToast({ title: '请填写必填项', icon: 'none' })
      }
      this.leadSubmitting = true
      // 先更新基础信息（Lv2），再用 submitConsult 保存完整留资
      api.updateBasic(this.leadForm).then(r => {
        if (r.code === 0) {
          // 同时提交完整留资记录
          api.submitConsult({ ...this.leadForm, topic: '下载资料留资' }).catch(() => {})
          this.leadSubmitting = false
          uni.showToast({ title: '信息已完善，正在下载', icon: 'success' })
          this.showLeadForm = false
          setTimeout(() => this.onDownload(), 1000)
        } else {
          this.leadSubmitting = false
          uni.showToast({ title: r.msg || '提交失败', icon: 'none' })
        }
      }).catch(() => { this.leadSubmitting = false; uni.showToast({ title: '网络异常', icon: 'none' }) })
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
.info-label { font-size: 13px; color: #9ca3af; width: 56px; flex-shrink: 0; }
.info-value { font-size: 14px; color: #1a1a2e; flex: 1; }

.section-card { background: #fff; margin: 12px 16px; border-radius: 12px; padding: 16px; }
.section-title { font-size: 15px; font-weight: 600; color: #1a1a2e; display: block; margin-bottom: 10px; }
.section-text { font-size: 14px; color: #6b7280; line-height: 1.8; white-space: pre-wrap; }
.rich-content { font-size: 14px; color: #4b5563; line-height: 1.8; display: block; }

.loading-wrap { padding: 100px; text-align: center; }
.loading-text { font-size: 14px; color: #9ca3af; }

.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: #fff; border-top: 1px solid #e5e7eb; padding-bottom: calc(12px + env(safe-area-inset-bottom)); display: flex; gap: 10px; align-items: center; }
.fav-icon { width: 44px; height: 44px; border-radius: 10px; background: #f6f7fb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fav-img { width: 24px; height: 24px; }
.dl-btn { border-radius: 10px; padding: 14px; text-align: center; background: #2563eb; }
.dl-btn.consult-btn { background: #ff6b35; }
.dl-text { color: #fff; font-size: 16px; font-weight: 600; }
</style>

.lead-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: flex-end; }
.lead-box { background: #fff; border-radius: 16px 16px 0 0; width: 100%; padding: 24px 20px; padding-bottom: calc(24px + env(safe-area-inset-bottom)); }
.lead-title { font-size: 18px; font-weight: 700; color: #1a1a2e; display: block; margin-bottom: 4px; }
.lead-desc { font-size: 13px; color: #9ca3af; display: block; margin-bottom: 16px; }
.lead-form { display: flex; flex-direction: column; gap: 12px; }
.lead-item { display: flex; flex-direction: column; gap: 6px; }
.lead-label { font-size: 13px; color: #6b7280; font-weight: 500; }
.lead-input { background: #f6f7fb; border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #1a1a2e; height: 40px; }
.lead-btn { background: #ff6b35; border-radius: 10px; padding: 14px; text-align: center; margin-top: 4px; }
.lead-btn-text { color: #fff; font-size: 16px; font-weight: 600; }
.lead-textarea { background: #f6f7fb; border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #1a1a2e; height: 72px; width: 100%; }
