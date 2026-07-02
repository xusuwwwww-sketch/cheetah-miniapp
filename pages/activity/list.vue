<template>
  <view class="page">
    <view class="nav-bar">
      <text class="nav-title">活动</text>
    </view>

    <!-- 搜索 -->
    <view class="search-bar">
      <text class="icon-text">🔍</text>
      <input class="search-input" placeholder="搜索活动" v-model="keyword" @confirm="onSearch" />
    </view>

    <!-- Tabs -->
    <scroll-view scroll-x class="tabs">
      <view class="tab-list">
        <view :class="['tab-item', { active: typeSlug === t.value }]" v-for="t in typeTabs" :key="t.value" @tap="typeSlug = t.value; onSearch()">
          <text :class="['tab-text', { active: typeSlug === t.value }]">{{ t.label }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 列表 -->
    <scroll-view scroll-y class="list" @scrolltolower="loadMore" refresher-enabled :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <view class="card" v-for="a in list" :key="a.id" @tap="goDetail(a.id)">
        <view class="card-cover" :style="{ background: a.gradient || 'linear-gradient(135deg, #ff6b35, #ff9a5c)' }">
          <text class="card-tag" v-if="a.type_name">{{ a.type_name }}</text>
          <text class="card-cover-title">{{ a.title }}</text>
        </view>
        <view class="card-body">
          <view class="card-row">
            <text class="icon-text">📅</text>
            <text class="card-meta">{{ a.start_time }}</text>
          </view>
          <view class="card-row" v-if="a.location">
            <text class="icon-text">📍</text>
            <text class="card-meta">{{ a.location }}</text>
          </view>
          <view class="card-footer">
            <text class="card-count">{{ a.signup_count || 0 }}/{{ a.quota || '不限' }}人</text>
            <text :class="['card-status', statusClass(a)]">{{ statusText(a) }}</text>
          </view>
        </view>
      </view>
      <view v-if="!list.length && !loading" class="empty"><text class="empty-text">暂无活动</text></view>
      <view v-if="loading" class="empty"><text class="empty-text">加载中...</text></view>
      <view style="height: 70px;"></view>
    </scroll-view>
    <!-- TabBar -->
    <view class="tab-bar">
      <view class="tab-item" @tap="goTab('/pages/index/index')">
        <text class="tab-icon">🏠</text>
        <text :class="['tab-text', currentTab==='/pages/index/index' ? 'tab-active' : '']">首页</text>
      </view>
      <view class="tab-item" @tap="goTab('/pages/activity/list')">
        <text class="tab-icon">📅</text>
        <text :class="['tab-text', currentTab==='/pages/activity/list' ? 'tab-active' : '']">活动</text>
      </view>
      <view class="tab-item" @tap="goTab('/pages/material/list')">
        <text class="tab-icon">📂</text>
        <text :class="['tab-text', currentTab==='/pages/material/list' ? 'tab-active' : '']">服务</text>
      </view>
      <view class="tab-item" @tap="goTab('/pages/profile/index')">
        <text class="tab-icon">👤</text>
        <text :class="['tab-text', currentTab==='/pages/profile/index' ? 'tab-active' : '']">我的</text>
      </view>
    </view>

  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() {
    return {
      currentTab: '/pages/activity/list',
      keyword: '',
      typeSlug: '',
      typeTabs: [
        { label: '全部', value: '' },
        { label: '直播', value: 'live' },
        { label: '沙龙', value: 'salon' },
        { label: '闭门会', value: 'closed' },
        { label: '训练营', value: 'bootcamp' }
      ],
      list: [],
      page: 1,
      hasMore: true,
      loading: false,
      refreshing: false
    }
  },
  onShow() { this.page = 1; this.list = []; this.hasMore = true; this.loadData() },
  methods: {
    onSearch() { this.page = 1; this.list = []; this.hasMore = true; this.loadData() },
    onRefresh() { this.refreshing = true; this.page = 1; this.list = []; this.hasMore = true; this.loadData().then(() => { this.refreshing = false }) },
    loadMore() { if (this.hasMore && !this.loading) { this.page++; this.loadData() } },
    loadData() {
      this.loading = true
      return api.getActivities({ type_slug: this.typeSlug, keyword: this.keyword, page: this.page, size: 10 }).then(r => {
        if (r.code === 0) {
          const items = r.data.list || []
          this.list = this.page === 1 ? items : [...this.list, ...items]
          this.hasMore = items.length >= 10
        }
      }).catch(() => {}).finally(() => { this.loading = false })
    },
    statusText(a) {
      if (a.status === 'ended') return '已结束'
      if (a.status === 'full') return '已满'
      if (a.status === 'open') return '报名中'
      return a.status || '待开始'
    },
    statusClass(a) {
      if (a.status === 'ended' || a.status === 'full') return 'closed'
      return 'open'
    },
    goDetail(id) { uni.navigateTo({ url: `/pages/activity/detail?id=${id}` }) }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; }
.nav-bar { padding: 16px; padding-top: 50px; }
.nav-title { font-size: 20px; font-weight: 700; color: #1a1a2e; }
.search-bar { margin: 8px 16px; background: #fff; border-radius: 8px; padding: 10px 12px; display: flex; align-items: center; gap: 8px; }
.search-input { flex: 1; font-size: 14px; }
.tabs { white-space: nowrap; }
.tab-list { display: flex; padding: 0 16px; gap: 16px; }
.tab-item { padding: 8px 0; }
.tab-text { font-size: 14px; color: #6b7280; }
.tab-text.active { color: #ff6b35; font-weight: 600; }
.list { height: calc(100vh - 200px); }
.card { background: #fff; border-radius: 12px; margin: 8px 16px; overflow: hidden; }
.card-cover { padding: 20px 16px; }
.card-tag { font-size: 11px; color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px; }
.card-cover-title { font-size: 16px; font-weight: 600; color: #fff; }
.card-body { padding: 12px 16px; }
.card-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.card-meta { font-size: 12px; color: #6b7280; }
.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.card-count { font-size: 12px; color: #9ca3af; }
.card-status { font-size: 11px; padding: 2px 8px; border-radius: 4px; }
.card-status.open { color: #059669; background: #ecfdf5; }
.card-status.closed { color: #9ca3af; background: #f3f4f6; }
.empty { padding: 40px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }
.tab-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 56px; background: #fff; display: flex; border-top: 1rpx solid #e5e7eb; z-index: 999; padding-bottom: env(safe-area-inset-bottom); }
.tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
.tab-icon { font-size: 20px; line-height: 1; }
.tab-text { font-size: 10px; color: #9ca3af; }
.tab-active { color: #ff6b35; }
</style>
