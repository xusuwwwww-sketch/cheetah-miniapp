<template>
  <view class="page">
    <!-- Tab 切换 -->
    <view class="tabs">
      <view
        v-for="t in tabs" :key="t.type"
        :class="['tab-item', { active: currentType === t.type }]"
        @tap="switchTab(t.type)"
      >
        <text :class="['tab-text', { active: currentType === t.type }]">{{ t.label }}</text>
      </view>
    </view>

    <!-- 列表 -->
    <scroll-view
      scroll-y
      class="list"
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 报告/资料库：横向卡片 -->
      <template v-if="currentType !== 'case'">
        <view class="h-card" v-for="item in list" :key="item.id" @tap="goDetail(item.id)">
          <view class="h-thumb" :style="{ background: item.gradient || defaultGradient }">
            <image v-if="item.cover_url" :src="item.cover_url" class="h-thumb-img" mode="aspectFill" />
            <text v-else class="h-thumb-label">{{ currentType === 'report' ? 'REPORT' : 'PDF' }}</text>
          </view>
          <view class="h-info">
            <text class="h-title">{{ item.title }}</text>
            <text class="h-meta">{{ item.author || '' }}</text>
            <text class="h-size" v-if="item.file_size">{{ item.file_size }}</text>
          </view>
          <view class="dl-btn" @tap.stop="goDetail(item.id)">
            <text class="dl-text">下载</text>
          </view>
        </view>
      </template>

      <!-- 案例库：大图卡片 -->
      <template v-if="currentType === 'case'">
        <view class="v-card" v-for="item in list" :key="item.id" @tap="goDetail(item.id)">
          <view class="v-cover" :style="{ background: item.gradient || '#059669' }">
            <image v-if="item.cover_url" :src="item.cover_url" class="v-cover-img" mode="aspectFill" />
          </view>
          <view class="v-body">
            <text class="v-title">{{ item.title }}</text>
            <text class="v-meta" v-if="item.author">{{ item.author }}</text>
            <text class="v-summary" v-if="item.summary">{{ item.summary }}</text>
          </view>
        </view>
      </template>

      <view v-if="!list.length && !loading" class="empty">
        <text class="empty-text">暂无{{ currentLabel }}</text>
      </view>
      <view v-if="loading && !list.length" class="empty">
        <text class="empty-text">加载中...</text>
      </view>
      <view style="height: 80px;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() {
    return {
      tabs: [
        { label: '查报告', type: 'report' },
        { label: '案例库', type: 'case' },
        { label: '资料库', type: 'material' },
      ],
      currentType: 'report',
      list: [],
      page: 1,
      hasMore: true,
      loading: false,
      refreshing: false,
    }
  },
  computed: {
    currentLabel() {
      return { report: '报告', case: '案例', material: '资料' }[this.currentType] || '内容'
    },
    defaultGradient() {
      return { report: 'linear-gradient(135deg, #2563eb, #60a5fa)', case: 'linear-gradient(135deg, #059669, #34d399)', material: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }[this.currentType]
    }
  },
  onShow() {
    // 从 storage 读取首页传过来的 tab 类型
    const type = uni.getStorageSync('serviceTab')
    if (type) {
      this.currentType = type
      uni.removeStorageSync('serviceTab')
    }
    this.resetAndLoad()
  },
  methods: {
    switchTab(type) {
      this.currentType = type
      this.resetAndLoad()
    },
    resetAndLoad() {
      this.page = 1
      this.list = []
      this.hasMore = true
      this.loadData()
    },
    onRefresh() {
      this.refreshing = true
      this.resetAndLoad()
      setTimeout(() => { this.refreshing = false }, 800)
    },
    loadMore() {
      if (this.hasMore && !this.loading) { this.page++; this.loadData() }
    },
    loadData() {
      if (!this.hasMore || this.loading) return
      this.loading = true
      const req = this.currentType === 'report'
        ? api.getReports({ page: this.page, size: 10 })
        : api.getMaterials({ content_type: this.currentType, page: this.page, size: 10 })
      req.then(r => {
        if (r.code === 0) {
          const items = r.data.list || []
          this.list = this.page === 1 ? items : [...this.list, ...items]
          this.hasMore = items.length >= 10
        }
      }).catch(() => {}).finally(() => { this.loading = false })
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/material/detail?id=${id}&type=${this.currentType}` })
    }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
.tabs { display: flex; background: #fff; padding: 0 16px; border-bottom: 1px solid #f3f4f6; }
.tab-item { padding: 14px 20px 12px; position: relative; }
.tab-text { font-size: 15px; color: #6b7280; font-weight: 500; }
.tab-text.active { color: #ff6b35; font-weight: 600; }
.tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 16px; right: 16px; height: 2px; background: #ff6b35; border-radius: 2px; }
.list { flex: 1; min-height: 0; }

/* 横向卡片（报告/资料库） */
.h-card { background: #fff; border-radius: 12px; margin: 10px 16px; display: flex; gap: 12px; padding: 12px; overflow: hidden; }
.h-thumb { width: 80px; height: 80px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.h-thumb-img { width: 100%; height: 100%; }
.h-thumb-label { font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 700; }
.h-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
.h-title { font-size: 14px; font-weight: 600; color: #1a1a2e; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.h-meta { font-size: 12px; color: #9ca3af; margin-top: 4px; }
.h-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
.h-size { font-size: 12px; color: #9ca3af; }
.dl-btn { background: #ff6b35; border-radius: 8px; padding: 8px 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; align-self: center; }
.dl-text { font-size: 12px; color: #fff; font-weight: 500; }

/* 竖向卡片（案例库） */
.v-card { background: #fff; border-radius: 12px; margin: 10px 16px; overflow: hidden; }
.v-cover { height: 160px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.v-cover-img { width: 100%; height: 100%; }
.v-body { padding: 12px 16px; }
.v-title { font-size: 15px; font-weight: 600; color: #1a1a2e; display: block; margin-bottom: 4px; }
.v-meta { font-size: 12px; color: #9ca3af; display: block; margin-bottom: 6px; }
.v-summary { font-size: 13px; color: #6b7280; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.empty { padding: 60px 0; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }
</style>
