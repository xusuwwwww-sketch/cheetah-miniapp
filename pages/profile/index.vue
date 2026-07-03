<template>
  <view class="page">
    <scroll-view scroll-y style="height: 100vh;">

      <!-- 用户信息卡片 -->
      <view class="profile-card" v-if="profile">
        <view class="avatar-wrap">
          <image v-if="profile.avatar" :src="profile.avatar" class="avatar-img" mode="aspectFill" />
          <text v-else class="avatar-placeholder">{{ (profile.nickname || '用').slice(0,1) }}</text>
        </view>
        <view class="profile-info">
          <text class="nickname">{{ profile.nickname || profile.name || '猎豹用户' }}</text>
          <view class="level-badge">
            <text class="level-text">{{ levelLabel }}</text>
          </view>
        </view>
      </view>

      <!-- 未登录 -->
      <view class="profile-card login-card" v-else @tap="doLogin">
        <view class="avatar-wrap">
          <text class="avatar-placeholder">?</text>
        </view>
        <view class="profile-info">
          <text class="nickname">点击登录</text>
          <text class="login-hint">登录后享受完整功能</text>
        </view>
        <text class="arrow">›</text>
      </view>

      <!-- 统计（已登录才显示） -->
      <view class="stats-card" v-if="profile">
        <view class="stat-item" @tap="goPage('signups')">
          <text class="stat-num">{{ stats.signups }}</text>
          <text class="stat-label">已报名</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="goPage('favorites')">
          <text class="stat-num">{{ stats.favorites }}</text>
          <text class="stat-label">已收藏</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="goPage('consults')">
          <text class="stat-num">{{ stats.consults }}</text>
          <text class="stat-label">咨询记录</text>
        </view>
      </view>

      <!-- 菜单列表 -->
      <view class="menu-section">
        <view class="menu-item" v-for="m in menus" :key="m.key" @tap="onMenu(m)">
          <view class="menu-icon-wrap" :style="{ background: m.bg }">
            <image class="menu-icon-img" :src="m.icon" mode="aspectFit" />
          </view>
          <text class="menu-label">{{ m.label }}</text>
          <text class="menu-arrow">›</text>
        </view>
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
      profile: null,
      stats: { signups: 0, favorites: 0, consults: 0 },
      menus: [
        { key: 'profile',   label: '个人信息',   icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmY2YjM1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiLz48L3N2Zz4=', bg: '#fff3ee', requireLogin: true },
        { key: 'signups',   label: '我的报名',   icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjU2M2ViIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iNCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIvPjxsaW5lIHgxPSIxNiIgeTE9IjIiIHgyPSIxNiIgeTI9IjYiLz48bGluZSB4MT0iOCIgeTE9IjIiIHgyPSI4IiB5Mj0iNiIvPjxsaW5lIHgxPSIzIiB5MT0iMTAiIHgyPSIyMSIgeTI9IjEwIi8+PGxpbmUgeDE9IjgiIHkxPSIxNCIgeDI9IjE2IiB5Mj0iMTQiLz48L3N2Zz4=', bg: '#eef3ff', requireLogin: true },
        { key: 'downloads', label: '我的资料',   icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjN2MzYWVkIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTQiLz48cG9seWxpbmUgcG9pbnRzPSI3IDEwIDEyIDE1IDE3IDEwIi8+PGxpbmUgeDE9IjEyIiB5MT0iMTUiIHgyPSIxMiIgeTI9IjMiLz48L3N2Zz4=', bg: '#f3eeff', requireLogin: true },
        { key: 'favorites', label: '我的收藏',   icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2VmNDQ0NCIgc3Ryb2tlPSIjZWY0NDQ0IiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggZD0iTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTIgNS42N2wtMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OCA3Ljc4bDEuMDYgMS4wNkwxMiAyMS4yM2w3Ljc4LTcuNzggMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAgMC03Ljc4eiIvPjwvc3ZnPg==', bg: '#fef2f2', requireLogin: true },
        { key: 'consults',  label: '约咨询记录', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDU5NjY5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyeiIvPjxsaW5lIHgxPSI5IiB5MT0iMTAiIHgyPSIxNSIgeTI9IjEwIi8+PGxpbmUgeDE9IjEyIiB5MT0iNyIgeDI9IjEyIiB5Mj0iMTMiLz48L3N2Zz4=', bg: '#ecfdf5', requireLogin: true },
      ]
    }
  },
  computed: {
    levelLabel() {
      const l = this.profile?.level || 1
      return { 1: '普通用户', 2: '信息已完善', 3: '深度用户' }[l] || '普通用户'
    }
  },
  onShow() { this.loadProfile() },
  methods: {
    loadProfile() {
      const token = uni.getStorageSync('token')
      if (!token) { this.profile = null; return }
      api.getProfile().then(r => {
        this.profile = r.code === 0 ? r.data : null
        if (this.profile) this.loadStats()
      }).catch(() => { this.profile = null })
    },
    loadStats() {
      api.getSignups().then(r => { this.stats.signups = r.code === 0 ? (r.data || []).length : 0 }).catch(() => {})
      api.getFavorites().then(r => { this.stats.favorites = r.code === 0 ? (r.data || []).length : 0 }).catch(() => {})
      api.getConsults().then(r => { this.stats.consults = r.code === 0 ? (r.data || []).length : 0 }).catch(() => {})
    },
    doLogin() {
      uni.showLoading({ title: '登录中...' })
      uni.login({
        provider: 'weixin',
        success: (res) => {
          api.login(res.code).then(r => {
            uni.hideLoading()
            if (r.code === 0 && r.data?.token) {
              uni.setStorageSync('token', r.data.token)
              this.loadProfile()
              uni.showToast({ title: '登录成功', icon: 'success' })
            } else {
              this.devLogin()
            }
          }).catch(() => { uni.hideLoading(); this.devLogin() })
        },
        fail: () => { uni.hideLoading(); this.devLogin() }
      })
    },
    devLogin() {
      uni.showLoading({ title: '登录中...' })
      api.login('dev_test_code_001').then(r => {
        uni.hideLoading()
        if (r.code === 0 && r.data?.token) {
          uni.setStorageSync('token', r.data.token)
          this.loadProfile()
          uni.showToast({ title: '登录成功', icon: 'success' })
        } else {
          uni.showToast({ title: '登录失败，请检查后端连接', icon: 'none' })
        }
      }).catch(() => { uni.hideLoading(); uni.showToast({ title: '无法连接服务器', icon: 'none' }) })
    },
    onMenu(m) {
      if (m.requireLogin && !this.profile) {
        return uni.showToast({ title: '请先登录', icon: 'none' })
      }
      this.goPage(m.key)
    },
    goPage(key) {
      const routes = {
        profile:   '/pages/profile/edit',
        signups:   '/pages/profile/signups',
        downloads: '/pages/profile/downloads',
        favorites: '/pages/profile/favorites',
        consults:  '/pages/profile/consults',
      }
      if (routes[key]) {
        uni.navigateTo({ url: routes[key] })
      } else {
        uni.showToast({ title: '开发中', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; }

.profile-card { background: linear-gradient(135deg, #ff6b35, #ff9a5c); margin: 0 16px 12px; border-radius: 12px; padding: 20px 16px; display: flex; align-items: center; gap: 14px; }
.login-card { cursor: pointer; }
.avatar-wrap { width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.avatar-img { width: 100%; height: 100%; }
.avatar-placeholder { font-size: 22px; color: #fff; font-weight: 700; }
.profile-info { flex: 1; }
.nickname { font-size: 18px; font-weight: 700; color: #fff; display: block; margin-bottom: 4px; }
.level-badge { display: inline-flex; background: rgba(255,255,255,0.25); border-radius: 10px; padding: 2px 8px; }
.level-text { font-size: 12px; color: rgba(255,255,255,0.9); }
.login-hint { font-size: 13px; color: rgba(255,255,255,0.8); display: block; margin-top: 2px; }
.arrow { font-size: 20px; color: rgba(255,255,255,0.7); }

.stats-card { background: #fff; border-radius: 12px; margin: 0 16px 12px; padding: 16px; display: flex; }
.stat-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-num { font-size: 22px; font-weight: 700; color: #1a1a2e; }
.stat-label { font-size: 12px; color: #9ca3af; }
.stat-divider { width: 1px; background: #f3f4f6; }

.menu-section { background: #fff; border-radius: 12px; margin: 0 16px; overflow: hidden; }
.menu-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f6f7fb; }
.menu-item:last-child { border-bottom: none; }
.menu-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.menu-icon-img { width: 20px; height: 20px; }
.menu-label { flex: 1; font-size: 15px; color: #1a1a2e; font-weight: 500; }
.menu-arrow { font-size: 18px; color: #c0c4cc; }
</style>
