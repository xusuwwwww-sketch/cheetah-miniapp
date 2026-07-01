<template>
  <view class="page">
    <!-- 顶部 -->
    <view class="header">
      <text class="brand">🐆 猎豹出海工具箱</text>
    </view>

    <!-- 轮播图 -->
    <view class="banner-wrap">
      <swiper class="banner" circular autoplay interval="3500" indicator-dots>
        <swiper-item v-for="item in banners" :key="item.id">
          <view class="banner-card" :style="{background: item.gradient}">
            <text class="banner-tag">{{ item.tag }}</text>
            <text class="banner-title">{{ item.title }}</text>
            <text class="banner-desc">{{ item.description }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 5大功能入口 -->
    <view class="entries">
      <view class="entry" v-for="e in entries" :key="e.key" @tap="goPage(e.path)">
        <view class="entry-icon" :style="{background: e.color}">
          <text class="entry-emoji">{{ e.icon }}</text>
        </view>
        <text class="entry-label">{{ e.label }}</text>
      </view>
    </view>

    <!-- 热门社群 -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-title">热门社群</text>
      </view>
      <scroll-view scroll-x class="community-scroll">
        <view class="community-card" v-for="item in communities" :key="item.id">
          <view class="cc-dot" :style="{background: item.icon_color || '#fff0ea'}"></view>
          <text class="cc-title">{{ item.title }}</text>
          <text class="cc-desc">{{ item.description }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 精选报告 -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-title">精选报告</text>
        <text class="more" @tap="goPage('/pages/report/list')">更多 ›</text>
      </view>
      <view class="report-card" v-for="item in reports" :key="item.id" @tap="goPage('/pages/report/detail?id='+item.id)">
        <view class="report-cover" :style="{background: item.gradient}">
          <text class="report-wm">REPORT</text>
          <text class="report-badge" :class="item.is_free ? 'free' : 'vip'">{{ item.is_free ? '免费' : '付费' }}</text>
        </view>
        <view class="report-body">
          <text class="report-title">{{ item.title }}</text>
          <view class="report-meta">
            <text>{{ item.source }}</text>
            <text>{{ item.created_at ? item.created_at.substring(0,10) : '' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航占位 -->
    <view style="height: 70px;"></view>

    <!-- 底部 Tab -->
    <view class="tab-bar">
      <view class="tab" :class="{active: true}">
        <text class="tab-icon">🏠</text>
        <text class="tab-label">首页</text>
      </view>
      <view class="tab" @tap="goPage('/pages/activity/list')">
        <text class="tab-icon">📅</text>
        <text class="tab-label">活动</text>
      </view>
      <view class="tab" @tap="goPage('/pages/material/list')">
        <text class="tab-icon">⚡</text>
        <text class="tab-label">服务</text>
      </view>
      <view class="tab" @tap="goPage('/pages/profile/index')">
        <text class="tab-icon">👤</text>
        <text class="tab-label">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '../../utils/api.js'
export default {
  data() {
    return {
      banners: [],
      communities: [],
      reports: [],
      entries: [
        { key: 'activity', label: '报活动', icon: '📅', color: 'linear-gradient(135deg,#ff6b35,#ff8b5f)', path: '/pages/activity/list' },
        { key: 'report', label: '查报告', icon: '📄', color: 'linear-gradient(135deg,#2563eb,#4f9dff)', path: '/pages/report/list' },
        { key: 'case', label: '案例库', icon: '💼', color: 'linear-gradient(135deg,#059669,#2dd4bf)', path: '/pages/material/list' },
        { key: 'material', label: '资料库', icon: '📁', color: 'linear-gradient(135deg,#7c3aed,#a78bfa)', path: '/pages/material/list' },
        { key: 'consult', label: '约咨询', icon: '💬', color: 'linear-gradient(135deg,#d97706,#fbbf24)', path: '/pages/consult/index' },
      ]
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const [b, c, r] = await Promise.all([
          api.getBanners(),
          api.getCommunities(),
          api.getReports({ page: 1, size: 3 })
        ])
        if (b.code === 0) this.banners = b.data
        if (c.code === 0) this.communities = c.data
        if (r.code === 0) this.reports = r.data.list
      } catch(e) {
        console.error('加载数据失败:', e)
      }
    },
    goPage(path) {
      const tabPaths = ['/pages/index/index', '/pages/activity/list', '/pages/material/list', '/pages/profile/index']
      if (tabPaths.includes(path)) {
        uni.switchTab({ url: path })
      } else {
        uni.navigateTo({ url: path })
      }
    }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; }
.header { height: 54px; padding: 12px 16px; background: #fff; border-bottom: 0.5px solid #e5e7eb; display: flex; align-items: center; }
.brand { font-size: 16px; font-weight: 800; color: #1a1a2e; }
.banner-wrap { padding: 12px 14px 4px; }
.banner { height: 150px; border-radius: 8px; overflow: hidden; }
.banner-card { height: 150px; padding: 20px; display: flex; flex-direction: column; justify-content: center; border-radius: 8px; }
.banner-tag { display: inline-block; background: rgba(255,255,255,.25); color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 10px; margin-bottom: 8px; width: fit-content; }
.banner-title { color: #fff; font-size: 20px; font-weight: 800; line-height: 1.3; }
.banner-desc { color: rgba(255,255,255,.8); font-size: 13px; margin-top: 4px; }
.entries { display: flex; justify-content: space-between; padding: 16px 14px; }
.entry { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 20%; }
.entry-icon { width: 46px; height: 46px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.entry-emoji { font-size: 20px; }
.entry-label { font-size: 11px; color: #4b5563; font-weight: 600; }
.section { padding: 0 14px 16px; }
.section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-title { font-size: 17px; font-weight: 700; color: #1a1a2e; }
.more { font-size: 12px; color: #9ca3af; }
.community-scroll { white-space: nowrap; }
.community-card { display: inline-block; width: 130px; padding: 12px; background: #fff; border-radius: 8px; margin-right: 10px; border: 0.5px solid #e5e7eb; vertical-align: top; }
.cc-dot { width: 32px; height: 32px; border-radius: 8px; margin-bottom: 8px; }
.cc-title { display: block; font-size: 13px; font-weight: 600; color: #1a1a2e; }
.cc-desc { display: block; font-size: 11px; color: #9ca3af; margin-top: 2px; }
.report-card { background: #fff; border-radius: 8px; overflow: hidden; border: 0.5px solid #e5e7eb; margin-bottom: 10px; }
.report-cover { position: relative; height: 100px; display: flex; align-items: center; justify-content: center; }
.report-wm { color: rgba(255,255,255,.3); font-size: 14px; font-weight: 700; }
.report-badge { position: absolute; top: 8px; right: 8px; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; color: #fff; }
.free { background: #10b981; }
.vip { background: #ff6b35; }
.report-body { padding: 12px; }
.report-title { display: block; font-size: 14px; font-weight: 600; color: #1a1a2e; line-height: 1.5; }
.report-meta { display: flex; gap: 8px; margin-top: 4px; color: #9ca3af; font-size: 11px; }
.tab-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 60px; background: rgba(255,255,255,.96); border-top: 0.5px solid #e5e7eb; display: flex; align-items: center; justify-content: space-around; padding: 6px 0; }
.tab { display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1; }
.tab.active .tab-icon, .tab.active .tab-label { color: #ff6b35; }
.tab-icon { font-size: 20px; }
.tab-label { font-size: 10px; color: #9ca3af; }
</style>
