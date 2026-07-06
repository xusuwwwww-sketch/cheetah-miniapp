<template>
  <view class="page">
    <!-- 顶部品牌 -->

    <scroll-view scroll-y class="content">
      <!-- 轮播 -->
      <swiper class="banner" autoplay circular :interval="4000" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#fff">
        <swiper-item v-for="(b, i) in banners" :key="i">
          <view class="banner-item" :style="{ background: b.gradient || 'linear-gradient(135deg, #ff6b35, #ff9a5c)' }">
            <image v-if="b.cover_url" :src="b.cover_url" class="banner-cover-img" mode="aspectFill" />
            <view v-else class="banner-text-wrap">
              <text class="banner-tag" v-if="b.tag">{{ b.tag }}</text>
              <text class="banner-title">{{ b.title }}</text>
              <text class="banner-desc" v-if="b.description">{{ b.description }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <!-- 功能入口 -->
      <view class="grid">
        <view class="grid-item" v-for="(g, i) in grids" :key="i" @tap="onGrid(g)">
          <view class="grid-icon" :style="{ background: g.bg }">
            <image class="grid-svg" :src="g.icon" mode="aspectFit" />
          </view>
          <text class="grid-text">{{ g.text }}</text>
        </view>
      </view>

      <!-- 热门社群 -->
      <view class="section">
        <view class="section-head"><text class="section-title">热门社群</text></view>
        <scroll-view scroll-x class="community-scroll">
          <view class="community-list">
            <view class="community-card" v-for="c in communities" :key="c.id" @tap="openQR(c)">
              <view class="community-avatar">
                <image class="community-icon-img" src="data:image/svg+xml;base64,PHN2ZyB0PSIxNzgzMzI1MDY2NzM5IiB2aWV3Qm94PSIwIDAgMTA1NSAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTc5LjEwNzE4OCA4OTkuNjkxMTg2YTM1OC4xNDU4MzcgMzU4LjE0NTgzNyAwIDAgMS04LjE3MjQ1NSA3NS43MTUzOTUgMzI0LjczNDkxNiAzMjQuNzM0OTE2IDAgMCAxLTEzLjk0MTI0NyA0OC4wNzMyNjZIODUuNjM1MTA2YTEwMy4zNTc1MjMgMTAzLjM1NzUyMyAwIDAgMS0xNC42NjIzNDYgMCA4NC44NDkzMTYgODQuODQ5MzE2IDAgMCAxLTY5LjcwNjIzNy05OC4zMDk4MyA0NTAuNjg2ODc1IDQ1MC42ODY4NzUgMCAwIDEgMjczLjA1NjE1NS0zMzkuODc3OTk1IDMzNS4wNzA2NjkgMzM1LjA3MDY2OSAwIDAgMS01MC40NzY5My00MS4zNDMwMSAzNTYuNDYzMjcyIDM1Ni40NjMyNzIgMCAwIDEgMzU1LjI2MTQ0IDM1Ni45NDQwMDV6IiBmaWxsPSIjZmZlMGNjIi8+PHBhdGggZD0iTTg4Ny45Nzc5MjcgNDk0LjY3MzkxNGEyNC4wMzY2MzMgMjQuMDM2NjMzIDAgMCAxLTEzLjIyMDE0OS0zLjg0NTg2MSAyNC4wMzY2MzMgMjQuMDM2NjMzIDAgMCAxLTYuNzMwMjU3LTMzLjE3MDU1NCAyMTIuNDgzODM5IDIxMi40ODM4MzkgMCAwIDAtMjEyLjQ4MzgzOS0zMjYuMTc3MTE1IDI0LjAzNjYzMyAyNC4wMzY2MzMgMCAwIDEtMjcuNjQyMTI4LTE5LjcxMDAzOSAyNC4wMzY2MzMgMjQuMDM2NjMzIDAgMCAxIDE5LjcxMDAzOS0yNy42NDIxMjggMjYwLjMxNjczOSAyNjAuMzE2NzM5IDAgMCAxIDI2MC41NTcxMDYgMzk5LjcyOTIxMiAyNC4wMzY2MzMgMjQuMDM2NjMzIDAgMCAxLTIwLjE5MDc3MiAxMC44MTY0ODV6TTk4MS43MjA3OTcgOTE1LjMxNDk5N2gtMTIxLjYyNTM2NWEyNC4wMzY2MzMgMjQuMDM2NjMzIDAgMSAxIDAtNDguMDczMjY2aDEyMS42MjUzNjVhMjUuNDc4ODMxIDI1LjQ3ODgzMSAwIDAgMCAyNS43MTkxOTctMjUuNDc4ODMyIDEwLjgxNjQ4NSAxMC44MTY0ODUgMCAwIDAgMC0yLjY0NDAyOXYtMy4zNjUxMjlhMzE3Ljc2NDI5MyAzMTcuNzY0MjkzIDAgMCAwLTEyNi45MTM0MjQtMjAxLjQyNjk4NyAyNC4wMzY2MzMgMjQuMDM2NjMzIDAgMSAxIDI4LjM2MzIyOC0zOC42OTg5OCAzNjUuMzU2ODI3IDM2NS4zNTY4MjcgMCAwIDEgMTQ2LjE0MjczIDIzMy44NzY0NDJ2MTIuMjU4NjgzYTczLjU1MjA5OCA3My41NTIwOTggMCAwIDEtNzMuMzExNzMxIDczLjU1MjA5OHoiIGZpbGw9IiNmZjZiMzUiLz48cGF0aCBkPSJNODA4LjE3NjMwNCAxMDIzLjQ3OTg0N0g4NS42MzUxMDZhNTAuMjM2NTY0IDUwLjIzNjU2NCAwIDAgMS0xNC40MjE5OCAwIDgyLjkyNjM4NSA4Mi45MjYzODUgMCAwIDEtNTUuMjg0MjU3LTM0LjYxMjc1MiA4NC4xMjgyMTcgODQuMTI4MjE3IDAgMCAxLTE0LjY2MjM0Ni02My40NTY3MTIgNDUxLjY0ODM0IDQ1MS42NDgzNCAwIDAgMSAyNzMuMDU2MTU1LTM0MC4xMTgzNjEgMzIzLjc3MzQ1MSAzMjMuNzczNDUxIDAgMCAxLTkzLjk4MzIzNy05NC43MDQzMzYgMzE3LjA0MzE5NCAzMTcuMDQzMTk0IDAgMSAxIDQ0MS41NTI5NTUgOTIuMzAwNjcybC0yLjg4NDM5NiAxLjkyMjkzMWE0NTMuODExNjM3IDQ1My44MTE2MzcgMCAwIDEgMjczLjI5NjUyMSAzNDAuMzU4NzI4IDEwMy4zNTc1MjMgMTAzLjM1NzUyMyAwIDAgMSAxLjIwMTgzMSAxNC42NjIzNDYgODUuMzMwMDQ4IDg1LjMzMDA0OCAwIDAgMS04NS4zMzAwNDggODMuNjQ3NDg0eiBtLTcyMi41NDExOTgtNDguMDczMjY2aDcyMi41NDExOThhMzcuMDE2NDE1IDM3LjAxNjQxNSAwIDAgMCAzNy4yNTY3ODItMzcuMDE2NDE2IDU5LjEzMDExOCA1OS4xMzAxMTggMCAwIDAgMC02LjI0OTUyNCA0MDMuMzM0NzA3IDQwMy4zMzQ3MDcgMCAwIDAtMjQzLjk3MTgyOS0zMDMuMzQyMzEzIDQ4LjA3MzI2NyA0OC4wNzMyNjcgMCAwIDEtMjYuNjgwNjYzLTYyLjk3NTk3OSA0OC4wNzMyNjcgNDguMDczMjY3IDAgMCAxIDE0LjkwMjcxMy0xOS43MTAwNCAxMy43MDA4ODEgMTMuNzAwODgxIDAgMCAxIDMuNjA1NDk1LTIuODg0Mzk2QTI2OS4yMTAyOTMgMjY5LjIxMDI5MyAwIDEgMCAzMDEuMjQzNzA3IDkxLjA5ODg0YTI2OS4yMTAyOTMgMjY5LjIxMDI5MyAwIDAgMCAwIDQ1Mi4xMjkwNzMgNDguMDczMjY3IDQ4LjA3MzI2NyAwIDAgMSAxMy45NDEyNDcgNjcuMzAyNTc0IDQ4LjA3MzI2NyA0OC4wNzMyNjcgMCAwIDEtMjEuODczMzM2IDE4LjAyNzQ3NUE0MDIuODUzOTc1IDQwMi44NTM5NzUgMCAwIDAgNDkuMDk5NDIzIDkzMi4zODEwMDdhMzYuMDU0OTUgMzYuMDU0OTUgMCAwIDAgNi40ODk4OTEgMjcuNDAxNzYyIDM2LjUzNTY4MyAzNi41MzU2ODMgMCAwIDAgMjQuMDM2NjM0IDE1LjE0MzA3OSAyOC4zNjMyMjcgMjguMzYzMjI3IDAgMCAwIDYuMDA5MTU4IDAuNDgwNzMzeiIgZmlsbD0iI2ZmNmIzNSIvPjwvc3ZnPg==" mode="aspectFit" />
              </view>
              <text class="community-name">{{ c.title }}</text>
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
            <text class="icon-text">📊</text>
          </view>
          <view class="report-info">
            <text class="report-title">{{ r.title }}</text>
            <text class="report-meta">{{ r.source || '' }} · {{ r.year || '' }}</text>
          </view>
        </view>
        <view v-if="!reports.length" class="empty"><text class="empty-text">暂无报告</text></view>
      </view>

      <view style="height: 80px;"></view>
    </scroll-view>

    <!-- 社群二维码弹窗 -->
    <view class="popup-mask" v-if="showQR && selectedCommunity" @tap="showQR = false">
      <view class="qr-box" @tap.stop>
        <view class="qr-close" @tap="showQR = false">✕</view>
        <text class="qr-title">{{ selectedCommunity.title }}</text>
        <text class="qr-desc">长按二维码识别加入</text>
        <image :src="selectedCommunity.qr_url" class="qr-img" mode="aspectFit" />
        <text class="qr-hint">长按图片 → 识别图中二维码</text>
      </view>
    </view>

    <!-- 启动弹窗 -->
    <view class="popup-mask" v-if="showPopup && popup" @tap="closePopup">
      <view class="popup-box" @tap.stop>
        <!-- 关闭按钮 -->
        <view class="popup-close" @tap="closePopup">✕</view>

        <!-- 封面图 -->
        <view class="popup-cover" :style="{ background: popup.gradient || 'linear-gradient(135deg, #ff6b35, #ff9a5c)' }">
          <image v-if="popup.cover_url" :src="popup.cover_url" class="popup-cover-img" mode="aspectFill" />
          <view v-else class="popup-cover-text">
            <text class="popup-title-big">{{ popup.title }}</text>
          </view>
        </view>

        <!-- 内容区 -->
        <view class="popup-content">
          <text class="popup-title">{{ popup.title }}</text>
          <text class="popup-desc" v-if="popup.description">{{ popup.description }}</text>

          <!-- 今日不再提醒 -->
          <view class="popup-remind" @tap="popupNoRemind = !popupNoRemind" v-if="popup.show_once">
            <view :class="['remind-check', { checked: popupNoRemind }]">
              <text v-if="popupNoRemind" class="check-icon">✓</text>
            </view>
            <text class="remind-text">今日内不再提醒</text>
          </view>

          <!-- 按钮 -->
          <view class="popup-btn" @tap="onPopupAction">
            <text class="popup-btn-text">{{ popup.btn_text || '立即查看' }}</text>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() {
    return {
      banners: [],
      selectedCommunity: null,
      showQR: false,
      popup: null,
      showPopup: false,
      popupNoRemind: false,
      communities: [],
      reports: [],
      grids: [
        { text: '报活动', icon: 'data:image/png;base64,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', bg: '#ff6b35', url: '/pages/activity/list' },
        { text: '查报告', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHoiLz48cG9seWxpbmUgcG9pbnRzPSIxNCAyIDE0IDggMjAgOCIvPjxsaW5lIHgxPSIxNiIgeTE9IjEzIiB4Mj0iOCIgeTI9IjEzIi8+PGxpbmUgeDE9IjE2IiB5MT0iMTciIHgyPSI4IiB5Mj0iMTciLz48L3N2Zz4=', bg: '#2563eb', url: '/pages/material/list?type=report' },
        { text: '案例库', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjIiIHk9IjciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjIiLz48cGF0aCBkPSJNMTYgN1Y1YTIgMiAwIDAgMC0yLTJoLTRhMiAyIDAgMCAwLTIgMnYyIi8+PGxpbmUgeDE9IjEyIiB5MT0iMTIiIHgyPSIxMiIgeTI9IjE2Ii8+PGxpbmUgeDE9IjEwIiB5MT0iMTQiIHgyPSIxNCIgeTI9IjE0Ii8+PC9zdmc+', bg: '#059669', url: '/pages/material/list?type=case' },
        { text: '资料库', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxOWEyIDIgMCAwIDEtMiAySDRhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoNWwyIDNoOWEyIDIgMCAwIDEgMiAyeiIvPjwvc3ZnPg==', bg: '#7c3aed', url: '/pages/material/list' },
        { text: '约咨询', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNWEyIDIgMCAwIDEtMiAySDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnoiLz48L3N2Zz4=', bg: '#d97706', url: '/pages/consult/index' }
      ]
    }
  },
  onShow() {
    this.loadData()
    this.checkPopup()
  },
  methods: {
    loadData() {
      api.getBanners().then(r => { if (r.code === 0) this.banners = r.data }).catch(() => {})
      api.getCommunities().then(r => { if (r.code === 0) this.communities = r.data }).catch(() => {})
      api.getReports({ page: 1, size: 3 }).then(r => { if (r.code === 0) this.reports = r.data.list || [] }).catch(() => {})
    },
    onGrid(g) {
      if (!g.url) return uni.showToast({ title: '开发中，敬请期待', icon: 'none' })
      // tabBar 页面必须用 switchTab
      const tabPages = ['/pages/activity/list', '/pages/material/list', '/pages/profile/index', '/pages/consult/index']
      const baseUrl = g.url.split('?')[0]
      if (tabPages.includes(baseUrl)) {
        if (g.url.includes('/pages/material/list')) {
          const type = g.url.includes('type=') ? g.url.split('type=')[1] : 'material'
          uni.setStorageSync('serviceTab', type)
        }
        uni.switchTab({ url: baseUrl })
      } else {
        uni.navigateTo({ url: g.url })
      }
    },
    goReports() {
      uni.setStorageSync('serviceTab', 'report')
      uni.switchTab({ url: '/pages/material/list' })
    },
    goReportDetail(id) { uni.navigateTo({ url: `/pages/material/detail?id=${id}&type=report` }) },
    openQR(community) {
      if (!community.qr_url) return uni.showToast({ title: '二维码暂未配置', icon: 'none' })
      this.selectedCommunity = community
      this.showQR = true
    },
    checkPopup() {
      api.getPopup().then(r => {
        if (r.code === 0 && r.data) {
          const p = r.data
          // 今日不再提醒逻辑
          if (p.show_once) {
            const key = `popup_seen_${p.id}_${new Date().toDateString()}`
            if (uni.getStorageSync(key)) return
          }
          this.popup = p
          this.showPopup = true
          this.popupNoRemind = false
        }
      }).catch(() => {})
    },
    closePopup() {
      if (this.popupNoRemind && this.popup?.show_once) {
        const key = `popup_seen_${this.popup.id}_${new Date().toDateString()}`
        uni.setStorageSync(key, 1)
      }
      this.showPopup = false
    },
    onPopupAction() {
      this.closePopup()
      const p = this.popup
      if (!p) return
      if (p.link_type === 'activity' && p.link_id) uni.navigateTo({ url: `/pages/activity/detail?id=${p.link_id}` })
      else if (p.link_type === 'report' && p.link_id) uni.navigateTo({ url: `/pages/material/detail?id=${p.link_id}&type=report` })
      else if (['material', 'case'].includes(p.link_type) && p.link_id) uni.navigateTo({ url: `/pages/material/detail?id=${p.link_id}&type=${p.link_type}` })
      else if (p.link_type === 'url' && p.link_url) uni.navigateTo({ url: p.link_url })
    }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
.content { flex: 1; overflow: hidden; }
.banner { height: 160px; margin: 8px 16px; border-radius: 12px; overflow: hidden; }
.banner-item { height: 100%; position: relative; overflow: hidden; }
.banner-cover-img { width: 100%; height: 100%; }
.banner-text-wrap { padding: 20px; display: flex; flex-direction: column; justify-content: center; height: 100%; box-sizing: border-box; }
.banner-tag { font-size: 12px; color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; align-self: flex-start; margin-bottom: 6px; }
.banner-title { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.banner-desc { font-size: 12px; color: rgba(255,255,255,0.8); }
.grid { display: flex; flex-wrap: wrap; padding: 12px 16px; }
.grid-item { width: 20%; display: flex; flex-direction: column; align-items: center; margin-bottom: 12px; }
.grid-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
.grid-svg { width: 28px; height: 28px; }
.grid-text { font-size: 12px; color: #1a1a2e; }
.section { margin: 8px 16px; }
.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-title { font-size: 16px; font-weight: 600; color: #1a1a2e; }
.section-more { font-size: 12px; color: #ff6b35; }
.community-scroll { white-space: nowrap; }
.community-list { display: flex; gap: 12px; }
.community-card { width: 80px; flex-shrink: 0; background: #fff; border-radius: 12px; padding: 12px 8px; display: flex; flex-direction: column; align-items: center; min-height: 80px; justify-content: center; }
.community-avatar { width: 40px; height: 40px; border-radius: 50%; background: #fff3ee; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
.community-icon-img { width: 20px; height: 20px; }
.community-name { font-size: 12px; color: #1a1a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center; }
.report-card { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; }
.report-thumb { width: 80px; height: 80px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.report-info { flex: 1; min-width: 0; }
.report-title { font-size: 14px; color: #1a1a2e; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.report-meta { font-size: 12px; color: #9ca3af; margin-top: 4px; }
.empty { padding: 30px; text-align: center; }
.empty-text { font-size: 14px; color: #9ca3af; }

/* 弹窗样式 */
.popup-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
.popup-box { background: #fff; border-radius: 16px; width: 100%; max-width: 320px; overflow: hidden; position: relative; }
.popup-close { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; background: rgba(0,0,0,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 10; font-size: 14px; color: #fff; }
.popup-cover { height: 200px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.popup-cover-img { width: 100%; height: 100%; }
.popup-cover-text { padding: 20px; text-align: center; }
.popup-title-big { font-size: 22px; font-weight: 700; color: #fff; line-height: 1.4; }
.popup-content { padding: 16px; }
.popup-title { font-size: 16px; font-weight: 700; color: #1a1a2e; display: block; margin-bottom: 6px; }
.popup-desc { font-size: 13px; color: #6b7280; line-height: 1.6; display: block; margin-bottom: 14px; }
.popup-remind { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
.remind-check { width: 18px; height: 18px; border: 1.5px solid #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.remind-check.checked { background: #ff6b35; border-color: #ff6b35; }
.check-icon { font-size: 12px; color: #fff; }
.remind-text { font-size: 13px; color: #9ca3af; }
.popup-btn { background: #ff6b35; border-radius: 10px; padding: 13px; text-align: center; }
.popup-btn-text { color: #fff; font-size: 15px; font-weight: 600; }

/* 社群二维码弹窗 */
.qr-box { background: #fff; border-radius: 16px; padding: 24px 20px; width: 280px; display: flex; flex-direction: column; align-items: center; position: relative; }
.qr-close { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #6b7280; }
.qr-title { font-size: 17px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
.qr-desc { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
.qr-img { width: 200px; height: 200px; border-radius: 8px; }
.qr-hint { font-size: 12px; color: #9ca3af; margin-top: 12px; }

</style>
