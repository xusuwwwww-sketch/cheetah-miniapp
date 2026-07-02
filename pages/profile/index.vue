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
        { key: 'profile',   label: '个人信息',   icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+', bg: '#fff3ee', requireLogin: true },
        { key: 'signups',   label: '我的报名',   icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjQiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiLz48bGluZSB4MT0iMTYiIHkxPSIyIiB4Mj0iMTYiIHkyPSI2Ii8+PGxpbmUgeDE9IjgiIHkxPSIyIiB4Mj0iOCIgeTI9IjYiLz48bGluZSB4MT0iMyIgeTE9IjEwIiB4Mj0iMjEiIHkyPSIxMCIvPjxsaW5lIHgxPSI4IiB5MT0iMTQiIHgyPSIxNiIgeTI9IjE0Ii8+PC9zdmc+', bg: '#eef3ff', requireLogin: true },
        { key: 'downloads', label: '我的资料',   icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00Ii8+PHBvbHlsaW5lIHBvaW50cz0iNyAxMCAxMiAxNSAxNyAxMCIvPjxsaW5lIHgxPSIxMiIgeTE9IjE1IiB4Mj0iMTIiIHkyPSIzIi8+PC9zdmc+', bg: '#f3eeff', requireLogin: true },
        { key: 'favorites', label: '我的收藏',   icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMC44NCA0LjYxYTUuNSA1LjUgMCAwIDAtNy43OCAwTDEyIDUuNjdsLTEuMDYtMS4wNmE1LjUgNS41IDAgMCAwLTcuNzggNy43OGwxLjA2IDEuMDZMMTIgMjEuMjNsNy43OC03Ljc4IDEuMDYtMS4wNmE1LjUgNS41IDAgMCAwIDAtNy43OHoiLz48L3N2Zz4=', bg: '#fff9ec', requireLogin: true },
        { key: 'consults',  label: '约咨询记录', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNWEyIDIgMCAwIDEtMiAySDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnoiLz48bGluZSB4MT0iOSIgeTE9IjEwIiB4Mj0iMTUiIHkyPSIxMCIvPjxsaW5lIHgxPSIxMiIgeTE9IjciIHgyPSIxMiIgeTI9IjEzIi8+PC9zdmc+', bg: '#ecfff3', requireLogin: true },
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
.level-text { font-size: 11px; color: rgba(255,255,255,0.9); }
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
