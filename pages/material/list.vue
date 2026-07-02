<template>
  <view class="page">
    <view class="nav-bar" @tap="goBack">
      <text class="icon-text">‹</text>
      <text class="nav-title">资料库</text>
      <view style="width: 20px;"></view>
    </view>

    <!-- 分类 tabs -->
    <scroll-view scroll-x class="tabs">
      <view class="tab-list">
        <view :class="['tab-item', { active: currentCat === '' }]" @tap="currentCat = ''; loadData()">
          <text :class="['tab-text', { active: currentCat === '' }]">全部</text>
        </view>
        <view :class="['tab-item', { active: currentCat === c }]" v-for="c in categories" :key="c" @tap="currentCat = c; loadData()">
          <text :class="['tab-text', { active: currentCat === c }]">{{ c }}</text>
        </view>
      </view>
    </scroll-view>

    <scroll-view scroll-y class="list" @scrolltolower="loadMore" refresher-enabled :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <view class="card" v-for="m in list" :key="m.id" @tap="goDetail(m.id)">
        <view class="card-cover" :style="{ background: m.gradient || 'linear-gradient(135deg, #7c3aed, #a78bfa)' }">
          <text class="icon-text">📂</text>
        </view>
        <view class="card-body">
          <text class="card-title">{{ m.title }}</text>
          <view class="card-meta-row">
            <text class="card-meta">{{ m.author || '未知' }}</text>
            <text class="card-meta" v-if="m.file_size">{{ m.file_size }}</text>
          </view>
        </view>
      </view>
      <view v-if="!list.length && !loading" class="empty"><text class="empty-text">暂无资料</text></view>
      <view v-if="loading" class="empty"><text class="empty-text">加载中...</text></view>
      <view style="height: 70px;"></view>
    </scroll-view>
    </view>

  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() { return { categories: [], currentCat: '', list: [], page: 1, hasMore: true, loading: false, refreshing: false } },
  onShow() { this.loadCategories(); this.page = 1; this.list = []; this.loadData() },
  methods: {
    loadCategories() {
      api.getMaterialCategories().then(r => { if (r.code === 0) this.categories = r.data }).catch(() => {})
    },
    onRefresh() { this.refreshing = true; this.page = 1; this.list = []; this.hasMore = true; this.loadData().then(() => { this.refreshing = false }) },
    loadMore() { if (this.hasMore && !this.loading) { this.page++; this.loadData() } },
    loadData() {
      this.loading = true
      return api.getMaterials({ category: this.currentCat, page: this.page, size: 10 }).then(r => {
        if (r.code === 0) { const items = r.data.list || []; this.list = this.page === 1 ? items : [...this.list, ...items]; this.hasMore = items.length >= 10 }
      }).catch(() => {}).finally(() => { this.loading = false })
    },
    goDetail(id) { uni.navigateTo({ url: `/pages/material/detail?id=${id}` }) },
    goBack() { uni.navigateBack() }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; }
.nav-bar { padding: 16px; padding-top: 50px; display: flex; align-items: center; justify-content: space-between; }
.nav-title { font-size: 17px; font-weight: 600; color: #1a1a2e; }
.tabs { white-space: nowrap; }
.tab-list { display: flex; padding: 0 16px; gap: 16px; }
.tab-item { padding: 8px 0; }
.tab-text { font-size: 14px; color: #6b7280; }
.tab-text.active { color: #ff6b35; font-weight: 600; }
.list { height: calc(100vh - 200px); }
.card { background: #fff; border-radius: 12px; margin: 8px 16px; overflow: hidden; }
.card-cover { height: 80px; display: flex; align-items: center; justify-content: center; }
.card-body { padding: 12px 16px; }
.card-title { font-size: 15px; font-weight: 500; color: #1a1a2e; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.card-meta-row { display: flex; justify-content: space-between; margin-top: 6px; }
.card-meta { font-size: 12px; color: #9ca3af; }
.empty { padding: 40px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }

</style>
