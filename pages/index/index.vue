<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="nav-title">🐆 猎豹出海工具箱</text>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <!-- 轮播图 -->
      <view class="banner-section">
        <swiper
          class="banner-swiper"
          circular
          :autoplay="true"
          :interval="4000"
          indicator-dots
          indicator-color="rgba(255,255,255,.4)"
          indicator-active-color="#fff"
        >
          <swiper-item v-for="item in banners" :key="item.id">
            <view class="banner-item" :style="{background: item.gradient || 'linear-gradient(135deg,#fa5714,#ff8c42)'}">
              <view class="banner-content">
                <text class="banner-tag" v-if="item.tag">{{ item.tag }}</text>
                <text class="banner-title">{{ item.title }}</text>
                <text class="banner-desc" v-if="item.description">{{ item.description }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 功能入口 -->
      <view class="section">
        <view class="entry-grid">
          <view
            v-for="e in entries" :key="e.key"
            class="entry-item"
            @tap="goPage(e)"
          >
            <view class="entry-icon-wrap" :style="{background: e.bg}">
              <text class="entry-icon">{{ e.icon }}</text>
            </view>
            <text class="entry-label">{{ e.label }}</text>
          </view>
        </view>
      </view>

      <!-- 热门社群 -->
      <view class="section" v-if="communities.length > 0">
        <view class="section-header">
          <text class="section-title">热门社群</text>
          <text class="section-more">查看全部 ›</text>
        </view>
        <scroll-view scroll-x class="community-scroll" :show-scrollbar="false">
          <view class="community-list">
            <view
              v-for="item in communities" :key="item.id"
              class="community-card"
            >
              <view class="community-icon" :style="{background: item.icon_color || '#fff3ec'}">
                <text class="community-emoji">👥</text>
              </view>
              <text class="community-name">{{ item.title }}</text>
              <text class="community-count">{{ item.description }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 精选报告 -->
      <view class="section" v-if="reports.length > 0">
        <view class="section-header">
          <text class="section-title">精选报告</text>
          <text class="section-more" @tap="goPage({path:'/pages/report/list'})">更多 ›</text>
        </view>
        <view
          v-for="item in reports" :key="item.id"
          class="report-card"
          @tap="goPage({path:'/pages/report/detail', query: '?id='+item.id})"
        >
          <view class="report-cover" :style="{background: item.gradient || 'linear-gradient(135deg,#1a3a5f,#2d6a9f)'}">
            <text class="report-cover-text">REPORT</text>
            <view class="report-badge-wrap">
              <text class="report-badge" :class="item.is_free ? 'free' : 'paid'">
                {{ item.is_free ? '免费' : '付费' }}
              </text>
            </view>
          </view>
          <view class="report-info">
            <text class="report-title">{{ item.title }}</text>
            <view class="report-meta">
              <text class="report-source">{{ item.source }}</text>
              <text class="report-date">{{ item.created_at ? item.created_at.substring(0,10) : '' }}</text>
            </view>
          </view>
        </view>
      </view>

      <view style="height: 20px;"></view>
    </scroll-view>
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
        { key: 'activity', label: '报活动', icon: '📅', bg: '#fff3ec', isTab: true, path: '/pages/activity/list' },
        { key: 'report', label: '查报告', icon: '📄', bg: '#ecf3ff', path: '/pages/report/list' },
        { key: 'case', label: '案例库', icon: '💼', bg: '#ecfff3', path: '' },
        { key: 'material', label: '资料库', icon: '📁', bg: '#f3ecff', path: '' },
        { key: 'consult', label: '约咨询', icon: '💬', bg: '#fffaec', path: '/pages/consult/index' },
      ]
    }
  },
  onLoad() { this.loadData() },
  methods: {
    async loadData() {
      try {
        const [b, c, r] = await Promise.all([
          api.getBanners(),
          api.getCommunities(),
          api.getReports({ page: 1, size: 3 })
        ])
        if (b.code === 0) this.banners = b.data
        if (c.code === 0) this.communities = c.data.slice(0, 5)
        if (r.code === 0) this.reports = r.data.list
      } catch (e) { console.error(e) }
    },
    goPage(item) {
      if (!item.path) { uni.showToast({ title: '功能建设中', icon: 'none' }); return }
      if (item.isTab) {
        uni.switchTab({ url: item.path })
      } else {
        const url = item.query ? item.path + item.query : item.path
        uni.navigateTo({ url })
      }
    }
  }
}
</script>

<style scoped>
.page { background: #f7f7f7; min-height: 100vh; }

.nav-bar {
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 16px;
}
.nav-title { font-size: 16px; font-weight: 700; color: #1a1a1a; }

.scroll-content { height: calc(100vh - 44px); padding-bottom: 60px; }

.banner-section { padding: 12px 16px 0; }
.banner-swiper { height: 150px; border-radius: 12px; overflow: hidden; }
.banner-item { height: 150px; padding: 20px; display: flex; align-items: flex-end; }
.banner-content { flex: 1; }
.banner-tag {
  display: inline-block;
  background: rgba(255,255,255,.25);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-bottom: 6px;
}
.banner-title { display: block; color: #fff; font-size: 18px; font-weight: 700; line-height: 1.3; }
.banner-desc { display: block; color: rgba(255,255,255,.8); font-size: 12px; margin-top: 4px; }

.section { background: #fff; margin: 10px 0; padding: 16px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.section-title { font-size: 16px; font-weight: 700; color: #1a1a1a; }
.section-more { font-size: 12px; color: #fa5714; }

.entry-grid { display: flex; justify-content: space-between; }
.entry-item { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 20%; }
.entry-icon-wrap { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.entry-icon { font-size: 22px; }
.entry-label { font-size: 12px; color: #555; font-weight: 500; }

.community-scroll { overflow: hidden; }
.community-list { display: flex; gap: 10px; padding: 0 2px; white-space: nowrap; }
.community-card {
  display: inline-flex;
  flex-direction: column;
  width: 110px;
  padding: 12px;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.community-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
.community-emoji { font-size: 18px; }
.community-name { font-size: 13px; font-weight: 600; color: #1a1a1a; line-height: 1.4; }
.community-count { font-size: 11px; color: #aaa; margin-top: 3px; }

.report-card { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
.report-card:last-child { border-bottom: none; padding-bottom: 0; }
.report-cover {
  width: 90px;
  height: 70px;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.report-cover-text { color: rgba(255,255,255,.3); font-size: 11px; font-weight: 700; }
.report-badge-wrap { position: absolute; top: 5px; right: 5px; }
.report-badge { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
.free { background: #e8f7ef; color: #2ecc71; }
.paid { background: #fff3ec; color: #fa5714; }
.report-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.report-title { font-size: 14px; font-weight: 600; color: #1a1a1a; line-height: 1.5; }
.report-meta { display: flex; gap: 8px; margin-top: 6px; }
.report-source, .report-date { font-size: 11px; color: #aaa; }
</style>
