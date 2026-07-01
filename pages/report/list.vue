<template>
  <view class="page">
    <view class="nav-bar" @tap="goBack">
      <uni-icons type="back" size="20" color="#1a1a2e" />
      <text class="nav-title">行业报告</text>
      <view style="width: 20px;"></view>
    </view>

    <!-- 筛选 -->
    <scroll-view scroll-x class="filters">
      <view class="filter-list">
        <picker :range="industries" range-key="label" @change="onIndustry">
          <text :class="['filter-tag', { active: filter.industry }]">{{ filter.industry || '行业' }}</text>
        </picker>
        <picker :range="regions" range-key="label" @change="onRegion">
          <text :class="['filter-tag', { active: filter.region }]">{{ filter.region || '地区' }}</text>
        </picker>
        <picker :range="years" @change="onYear">
          <text :class="['filter-tag', { active: filter.year }]">{{ filter.year || '年份' }}</text>
        </picker>
        <text :class="['filter-tag', { active: freeOnly }]" @tap="freeOnly = !freeOnly; loadData()">免费</text>
      </view>
    </scroll-view>

    <scroll-view scroll-y class="list" @scrolltolower="loadMore" refresher-enabled :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <view class="card" v-for="r in list" :key="r.id" @tap="goDetail(r.id)">
        <view class="card-cover" :style="{ background: r.gradient || 'linear-gradient(135deg, #2563eb, #60a5fa)' }">
          <uni-icons type="bars" size="24" color="rgba(255,255,255,0.8)" />
          <text :class="['card-price', { free: r.is_free }]">{{ r.is_free ? '免费' : '付费' }}</text>
        </view>
        <view class="card-body">
          <text class="card-title">{{ r.title }}</text>
          <text class="card-meta">{{ r.source || '' }} · {{ r.year || '' }}</text>
        </view>
      </view>
      <view v-if="!list.length && !loading" class="empty"><text class="empty-text">暂无报告</text></view>
      <view v-if="loading" class="empty"><text class="empty-text">加载中...</text></view>
      <view style="height: 20px;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() {
    return {
      filter: { industry: '', region: '', year: '' },
      freeOnly: false,
      industries: [{ label: '全部', value: '' }, { label: '电商', value: 'ecommerce' }, { label: '游戏', value: 'gaming' }, { label: '社交', value: 'social' }, { label: '工具', value: 'tools' }],
      regions: [{ label: '全部', value: '' }, { label: '东南亚', value: 'sea' }, { label: '北美', value: 'na' }, { label: '欧洲', value: 'eu' }, { label: '中东', value: 'me' }],
      years: ['全部', '2026', '2025', '2024', '2023'],
      list: [], page: 1, hasMore: true, loading: false, refreshing: false
    }
  },
  onLoad() { this.loadData() },
  methods: {
    onIndustry(e) { this.filter.industry = this.industries[e.detail.value].value || ''; this.page = 1; this.list = []; this.loadData() },
    onRegion(e) { this.filter.region = this.regions[e.detail.value].value || ''; this.page = 1; this.list = []; this.loadData() },
    onYear(e) { this.filter.year = this.years[e.detail.value] === '全部' ? '' : this.years[e.detail.value]; this.page = 1; this.list = []; this.loadData() },
    onRefresh() { this.refreshing = true; this.page = 1; this.list = []; this.hasMore = true; this.loadData().then(() => { this.refreshing = false }) },
    loadMore() { if (this.hasMore && !this.loading) { this.page++; this.loadData() } },
    loadData() {
      this.loading = true
      return api.getReports({ ...this.filter, page: this.page, size: 10 }).then(r => {
        if (r.code === 0) { this.list = this.page === 1 ? r.data : [...this.list, ...r.data]; this.hasMore = r.data.length >= 10 }
      }).catch(() => {}).finally(() => { this.loading = false })
    },
    goDetail(id) { uni.navigateTo({ url: `/pages/report/detail?id=${id}` }) },
    goBack() { uni.navigateBack() }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; }
.nav-bar { padding: 16px; padding-top: 50px; display: flex; align-items: center; justify-content: space-between; }
.nav-title { font-size: 17px; font-weight: 600; color: #1a1a2e; }
.filters { white-space: nowrap; padding: 8px 0; }
.filter-list { display: flex; gap: 8px; padding: 0 16px; }
.filter-tag { font-size: 13px; color: #6b7280; background: #fff; padding: 6px 12px; border-radius: 16px; }
.filter-tag.active { color: #ff6b35; background: #fff5f0; }
.list { height: calc(100vh - 160px); }
.card { background: #fff; border-radius: 12px; margin: 8px 16px; overflow: hidden; }
.card-cover { height: 100px; display: flex; align-items: center; justify-content: center; position: relative; }
.card-price { position: absolute; top: 8px; right: 8px; font-size: 11px; color: #ff6b35; background: rgba(255,255,255,0.9); padding: 2px 8px; border-radius: 4px; }
.card-price.free { color: #059669; }
.card-body { padding: 12px 16px; }
.card-title { font-size: 15px; font-weight: 500; color: #1a1a2e; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-meta { font-size: 12px; color: #9ca3af; margin-top: 6px; }
.empty { padding: 40px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }
</style>
