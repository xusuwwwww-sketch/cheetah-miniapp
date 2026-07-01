<template>
  <view class="page">
    <!-- 顶部品牌 -->
    <view class="header">
      <text class="brand">猎豹出海工具箱</text>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 轮播 -->
      <swiper class="banner" autoplay circular :interval="4000" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#fff">
        <swiper-item v-for="(b, i) in banners" :key="i">
          <view class="banner-item" :style="{ background: b.gradient || 'linear-gradient(135deg, #ff6b35, #ff9a5c)' }">
            <text class="banner-tag">{{ b.tag }}</text>
            <text class="banner-title">{{ b.title }}</text>
            <text class="banner-desc">{{ b.description }}</text>
          </view>
        </swiper-item>
      </swiper>

      <!-- 功能入口 -->
      <view class="grid">
        <view class="grid-item" v-for="(g, i) in grids" :key="i" @tap="onGrid(g)">
          <view class="grid-icon" :style="{ background: g.bg }">
            <uni-icons :type="g.icon" size="28" color="#fff" />
          </view>
          <text class="grid-text">{{ g.text }}</text>
        </view>
      </view>

      <!-- 热门社群 -->
      <view class="section">
        <view class="section-head"><text class="section-title">热门社群</text></view>
        <scroll-view scroll-x class="community-scroll">
          <view class="community-list">
            <view class="community-card" v-for="c in communities" :key="c.id">
              <view class="community-avatar" :style="{ background: c.icon_color || '#ff6b35' }">
                <uni-icons type="staff" size="20" color="#fff" />
              </view>
              <text class="community-name">{{ c.title }}</text>
              <text class="community-count">{{ c.member_count || 0 }}人</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 精选报告 -->
      <view class="section">
        <view class="section-head">
          <text class="section-title">精选报告</text>
          <text class="section-more" @tap="goReports">查看更多</text>
        </view>
        <view class="report-card" v-for="r in reports" :key="r.id" @tap="goReportDetail(r.id)">
          <view class="report-thumb" :style="{ background: r.gradient || 'linear-gradient(135deg, #2563eb, #60a5fa)' }">
            <uni-icons type="bars" size="24" color="rgba(255,255,255,0.8)" />
          </view>
          <view class="report-info">
            <text class="report-title">{{ r.title }}</text>
            <text class="report-meta">{{ r.source || '' }} · {{ r.year || '' }}</text>
          </view>
        </view>
        <view v-if="!reports.length" class="empty"><text class="empty-text">暂无报告</text></view>
      </view>

      <view style="height: 70px;"></view>
    </scroll-view>

    <tab-bar current="/pages/index/index" />
  </view>
</template>

<script>
import { api } from '@/utils/api.js'
import tabBar from '@/components/tab-bar.vue'

export default {
  components: { tabBar },
  data() {
    return {
      banners: [],
      communities: [],
      reports: [],
      grids: [
        { text: '报活动', icon: 'calendar', bg: '#ff6b35', url: '/pages/activity/list' },
        { text: '查报告', icon: 'bars', bg: '#2563eb', url: '/pages/report/list' },
        { text: '案例库', icon: 'star', bg: '#059669', url: '' },
        { text: '资料库', icon: 'folder', bg: '#7c3aed', url: '/pages/material/list' },
        { text: '约咨询', icon: 'chat', bg: '#d97706', url: '/pages/consult/index' }
      ]
    }
  },
  onShow() { this.loadData() },
  methods: {
    loadData() {
      api.getBanners().then(r => { if (r.code === 0) this.banners = r.data }).catch(() => {})
      api.getCommunities().then(r => { if (r.code === 0) this.communities = r.data }).catch(() => {})
      api.getReports({ page: 1, size: 3 }).then(r => { if (r.code === 0) this.reports = r.data.list || [] }).catch(() => {})
    },
    onGrid(g) {
      if (!g.url) return uni.showToast({ title: '开发中，敬请期待', icon: 'none' })
      uni.navigateTo({ url: g.url })
    },
    goReports() { uni.navigateTo({ url: '/pages/report/list' }) },
    goReportDetail(id) { uni.navigateTo({ url: `/pages/report/detail?id=${id}` }) }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; }
.header { padding: 16px 16px 8px; }
.brand { font-size: 20px; font-weight: 700; color: #1a1a2e; }
.content { height: calc(100vh - 60px); }
.banner { height: 160px; margin: 8px 16px; border-radius: 12px; overflow: hidden; }
.banner-item { height: 100%; padding: 20px; display: flex; flex-direction: column; justify-content: center; }
.banner-tag { font-size: 11px; color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; align-self: flex-start; margin-bottom: 6px; }
.banner-title { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.banner-desc { font-size: 12px; color: rgba(255,255,255,0.8); }
.grid { display: flex; flex-wrap: wrap; padding: 12px 16px; }
.grid-item { width: 20%; display: flex; flex-direction: column; align-items: center; margin-bottom: 12px; }
.grid-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
.grid-text { font-size: 12px; color: #1a1a2e; }
.section { margin: 8px 16px; }
.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-title { font-size: 16px; font-weight: 600; color: #1a1a2e; }
.section-more { font-size: 12px; color: #ff6b35; }
.community-scroll { white-space: nowrap; }
.community-list { display: flex; gap: 12px; }
.community-card { width: 100px; background: #fff; border-radius: 12px; padding: 12px 8px; display: flex; flex-direction: column; align-items: center; }
.community-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
.community-name { font-size: 13px; color: #1a1a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
.community-count { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.report-card { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; }
.report-thumb { width: 60px; height: 60px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.report-info { flex: 1; min-width: 0; }
.report-title { font-size: 14px; color: #1a1a2e; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.report-meta { font-size: 11px; color: #9ca3af; margin-top: 4px; }
.empty { padding: 30px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }
</style>
