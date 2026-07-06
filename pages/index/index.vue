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
        { text: '报活动', icon: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzgzMzMxNjg5NzkwIiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNOTg0IDEyNEg3NTMuOTFsMC41OSAxMDUuNzJjMC4xNSAyNy42MS0yMi4xMSA1MC4xMi00OS43MiA1MC4yOGgtMC4yOGMtMjcuNDggMC00OS44NC0yMi4yLTQ5Ljk5LTQ5LjcybC0wLjYtMTA2LjI4aC0yODRsMC41OSAxMDUuNzJjMC4xNSAyNy42MS0yMi4xMSA1MC4xMi00OS43MiA1MC4yOGgtMC4yOGMtMjcuNDggMC00OS44NC0yMi4yLTQ5Ljk5LTQ5LjcybC0wLjYtMTA2LjI4SDQwYy0yMi4wOSAwLTQwIDE3LjkxLTQwIDQwdjgyMGMwIDIyLjA5IDE3LjkxIDQwIDQwIDQwaDk0NGMyMi4wOSAwIDQwLTE3LjkxIDQwLTQwVjE2NGMwLTIyLjA5LTE3LjkxLTQwLTQwLTQwek01OTIuMTMgNzk3Ljc0bC0zNjAgMC45NmgtMC4xNGMtMjcuNTUgMC00OS45Mi0yMi4zLTUwLTQ5Ljg3LTAuMDctMjcuNjEgMjIuMjUtNTAuMDYgNDkuODctNTAuMTNsMzYwLTAuOTZoMC4xNGMyNy41NSAwIDQ5LjkyIDIyLjMgNTAgNDkuODcgMC4wNyAyNy42MS0yMi4yNSA1MC4wNS00OS44NyA1MC4xM3pNNzkyLjA5IDU2OS4zbC01NjAgMC45NkgyMzJjLTI3LjU3IDAtNDkuOTUtMjIuMzMtNTAtNDkuOTEtMC4wNS0yNy42MSAyMi4zLTUwLjA0IDQ5LjkxLTUwLjA5bDU2MC0wLjk2aDAuMDljMjcuNTcgMCA0OS45NSAyMi4zMyA1MCA0OS45MSAwLjA1IDI3LjYyLTIyLjMgNTAuMDQtNDkuOTEgNTAuMDl6TTM3MCAxMjRIMjcwVjUwYzAtMjcuNjEgMjIuMzktNTAgNTAtNTBzNTAgMjIuMzkgNTAgNTB2NzR6TTc1My4wOSAxMjRoLTEwMFY1MGMwLTI3LjYxIDIyLjM5LTUwIDUwLTUwczUwIDIyLjM5IDUwIDUwdjc0eiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', bg: 'linear-gradient(135deg, #ff6b35, #ff9a5c)', url: '/pages/activity/list' },
        { text: '查报告', icon: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzgzMzMxNjE3Mzk2IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODI3LjM0IDM1OC43MVY2My45NGMwLTI3LjYxLTIyLjM5LTUwLTUwLTUwaC02MjBjLTI3LjYxIDAtNTAgMjIuMzktNTAgNTB2ODA3Ljg4YzAgMjcuNjEgMjIuMzkgNTAgNTAgNTBoMTA2LjE5YzEzLjI1IDAgMjUuOTYtNS4yNiAzNS4zMy0xNC42Mmw1MTMuODEtNTEzLjExYTQ5Ljk3NCA0OS45NzQgMCAwIDAgMTQuNjctMzUuMzh6TTQ0NC41MiA1MjhIMjkyLjM0Yy0yNy42MSAwLTUwLTIyLjM5LTUwLTUwczIyLjM5LTUwIDUwLTUwaDE1Mi4xN2MyNy42MSAwIDUwIDIyLjM5IDUwIDUwcy0yMi4zOCA1MC00OS45OSA1MHogbTc2LjA4LTEzNEgyOTIuMzRjLTI3LjYxIDAtNTAtMjIuMzktNTAtNTBzMjIuMzktNTAgNTAtNTBINTIwLjZjMjcuNjEgMCA1MCAyMi4zOSA1MCA1MHMtMjIuMzggNTAtNTAgNTB6IG0xMjEuNzQtMTM0LjAxaC0zNTBjLTI3LjYxIDAtNTAtMjIuMzktNTAtNTBzMjIuMzktNTAgNTAtNTBoMzUwYzI3LjYxIDAgNTAgMjIuMzkgNTAgNTBzLTIyLjM4IDUwLTUwIDUwek05MDIuMDEgNTY4LjQxbC04My43LTgzLjdjLTE5LjUzLTE5LjUzLTUxLjE4LTE5LjUyLTcwLjcxIDBMMzkxLjMgODQxYTUwLjAxIDUwLjAxIDAgMCAwLTE0LjE3IDQyLjIxbDEwLjE4IDczLjUyYzMuMDcgMjIuMTcgMjAuNSAzOS42IDQyLjY3IDQyLjY3bDczLjUyIDEwLjE4YzIuMjkgMC4zMiA0LjU4IDAuNDcgNi44NiAwLjQ3IDEzLjE3IDAgMjUuOTEtNS4yIDM1LjM1LTE0LjY0bDM1Ni4zLTM1Ni4zYzE5LjUzLTE5LjUyIDE5LjUzLTUxLjE3IDAtNzAuN3oiIGZpbGw9IndoaXRlIi8+PC9zdmc+', bg: 'linear-gradient(135deg, #2563eb, #60a5fa)', url: '/pages/material/list?type=report' },
        { text: '案例库', icon: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzgzMzMyMDgxODM0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMTUxLjY3IDI3Ni4wOWwzNDMuMDEgMTY0LjM4YTM5Ljk3NyAzOS45NzcgMCAwIDAgMzQuNTcgMGwzNDMuMDEtMTY0LjM4YzMwLjI4LTE0LjUxIDMwLjI4LTU3LjYzIDAtNzIuMTRsLTM0My0xNjQuMzlhMzkuOTc3IDM5Ljk3NyAwIDAgMC0zNC41NyAwTDE1MS42NyAyMDMuOTVjLTMwLjI5IDE0LjUxLTMwLjI5IDU3LjYzIDAgNzIuMTR6TTEwMjIgNzY5LjE5di0zNzZjMC0yOS40NC0zMC43NC00OC44LTU3LjI5LTM2LjA3TDU5MS4zNSA1MzYuMDVhMzkuOTk2IDM5Ljk5NiAwIDAgMC0yMi43MSAzNi4wN3YzNzZjMCAyOS40NCAzMC43NCA0OC44IDU3LjI5IDM2LjA3bDM3My4zNi0xNzguOTNhMzkuOTk2IDM5Ljk5NiAwIDAgMCAyMi43MS0zNi4wN3pNNDU1LjM2IDk0OC4zMnYtMzc2YzAtMTUuMzktOC44My0yOS40Mi0yMi43MS0zNi4wN0w1OS4yOSAzNTcuMzJDMzIuNzQgMzQ0LjYgMiAzNjMuOTUgMiAzOTMuMzl2Mzc2YzAgMTUuMzkgOC44MyAyOS40MiAyMi43MSAzNi4wN2wzNzMuMzYgMTc4LjkzYzI2LjU2IDEyLjcyIDU3LjI5LTYuNjMgNTcuMjktMzYuMDd6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==', bg: 'linear-gradient(135deg, #059669, #34d399)', url: '/pages/material/list?type=case' },
        { text: '资料库', icon: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzgzMzMyMTI4MzMwIiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTU3LjQyIDg2MS4wOWE5OS45OTQgOTkuOTk0IDAgMCAxLTkwLjg0IDBMMTQ4LjYzIDY5OWEzMC4wMiAzMC4wMiAwIDAgMC0yNy4yNSAwbC02Ni45NSAzNC4xM2MtMjEuODMgMTEuMTMtMjEuODMgNDIuMzIgMCA1My40NWw0NDMuOTUgMjI2LjMzYTMwLjAyIDMwLjAyIDAgMCAwIDI3LjI1IDBsNDQzLjk1LTIyNi4zM2MyMS44My0xMS4xMyAyMS44My00Mi4zMiAwLTUzLjQ1TDkwMi42MiA2OTlhMzAuMDIgMzAuMDIgMCAwIDAtMjcuMjUgMEw1NTcuNDIgODYxLjA5ek00OTguMzcgNTE3LjJMNTQuNDMgMjkwLjg3Yy0yMS44My0xMS4xMy0yMS44My00Mi4zMiAwLTUzLjQ1TDQ5OC4zNyAxMS4wOWEzMC4wMiAzMC4wMiAwIDAgMSAyNy4yNSAwbDQ0My45NSAyMjYuMzNjMjEuODMgMTEuMTMgMjEuODMgNDIuMzIgMCA1My40NUw1MjUuNjMgNTE3LjJhMzAuMDQzIDMwLjA0MyAwIDAgMS0yNy4yNiAweiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNNTU3LjQyIDYxMy4yM2ExMDAgMTAwIDAgMCAxLTkwLjg0IDBMMTQ4LjYzIDQ1MS4xNGEzMC4wMiAzMC4wMiAwIDAgMC0yNy4yNSAwbC02Ni45NSAzNC4xM2MtMjEuODMgMTEuMTMtMjEuODMgNDIuMzIgMCA1My40NWw0NDMuOTUgMjI2LjMzYTMwLjAyIDMwLjAyIDAgMCAwIDI3LjI1IDBsNDQzLjk1LTIyNi4zM2MyMS44My0xMS4xMyAyMS44My00Mi4zMiAwLTUzLjQ1bC02Ni45NS0zNC4xM2EzMC4wMiAzMC4wMiAwIDAgMC0yNy4yNSAwTDU1Ny40MiA2MTMuMjN6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==', bg: 'linear-gradient(135deg, #7c3aed, #a78bfa)', url: '/pages/material/list' },
        { text: '约咨询', icon: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzgzMzMxNzI0NDQzIiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODcyIDE3LjNIMTUyYy04Mi43IDAtMTUwIDY3LjMtMTUwIDE1MHY0OTAuM2MwIDgyLjcgNjcuMyAxNTAgMTUwIDE1MGgxMTguNmwxNjkuMiAxNjkuMmMxOS4zIDE5LjMgNDUgMjkuOSA3Mi4zIDI5LjkgMjcuMyAwIDUzLTEwLjYgNzIuMy0yOS45bDE2OS4yLTE2OS4ySDg3MmM4Mi43IDAgMTUwLTY3LjMgMTUwLTE1MFYxNjcuM2MwLTgyLjctNjcuMy0xNTAtMTUwLTE1MHpNMjQ5IDQ4MC44Yy00NC4yIDAtODAtMzUuOC04MC04MHMzNS44LTgwIDgwLTgwIDgwIDM1LjggODAgODAtMzUuOSA4MC04MCA4MHogbTI2MyAwYy00NC4yIDAtODAtMzUuOC04MC04MHMzNS44LTgwIDgwLTgwIDgwIDM1LjggODAgODAtMzUuOCA4MC04MCA4MHogbTI2MyAwYy00NC4yIDAtODAtMzUuOC04MC04MHMzNS44LTgwIDgwLTgwIDgwIDM1LjggODAgODAtMzUuOCA4MC04MCA4MHoiIGZpbGw9IndoaXRlIi8+PC9zdmc+', bg: 'linear-gradient(135deg, #d97706, #fbbf24)', url: '/pages/consult/index' }
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
.grid-svg { width: 20px; height: 20px; }
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
