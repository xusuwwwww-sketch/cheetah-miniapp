<template>
  <view class="page">
    <view class="nav-bar">
      <text class="nav-title">我的</text>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 用户信息 -->
      <view class="profile-card" v-if="profile">
        <view class="avatar-wrap">
          <text class="icon-text">👤</text>
        </view>
        <text class="nickname">{{ profile.nickname || '用户' }}</text>
        <view class="badge" v-if="profile.level >= 2">
          <text class="icon-text">⭐</text>
          <text class="badge-text">LV{{ profile.level }}</text>
        </view>
      </view>

      <view class="profile-card" v-else @tap="doLogin">
        <view class="avatar-wrap">
          <text class="icon-text">👤</text>
        </view>
        <text class="nickname">点击登录</text>
      </view>

      <!-- 统计 -->
      <view class="stats" v-if="profile">
        <view class="stat-item">
          <text class="stat-num">{{ stats.signups }}</text>
          <text class="stat-label">已报名</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.favorites }}</text>
          <text class="stat-label">已收藏</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.consults }}</text>
          <text class="stat-label">咨询记录</text>
        </view>
      </view>

      <!-- 菜单 -->
      <view class="menu-card">
        <view class="menu-item" v-for="m in menus" :key="m.label" @tap="onMenu(m)">
          {{ m.icon }}
          <text class="menu-text">{{ m.label }}</text>
          <text class="icon-text">›</text>
        </view>
      </view>
      <view style="height: 70px;"></view>
    </scroll-view>

    <tab-bar current="/pages/profile/index" />
  </view>
</template>

<script>
import { api } from '@/utils/api.js'
import tabBar from '@/components/tab-bar.vue'

export default {
  components: { tabBar },
  data() {
    return {
      profile: null,
      stats: { signups: 0, favorites: 0, consults: 0 },
      menus: [
        { label: '个人信息', icon: 'person', color: '#ff6b35', action: '' },
        { label: '我的报名', icon: 'calendar', color: '#2563eb', action: '' },
        { label: '我的资料', icon: 'folder', color: '#7c3aed', action: '' },
        { label: '我的收藏', icon: 'heart', color: '#ef4444', action: '' },
        { label: '约咨询记录', icon: 'chat', color: '#d97706', action: '' },
        { label: '系统设置', icon: 'gear', color: '#6b7280', action: '' }
      ]
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
      uni.login({ provider: 'weixin', success: (res) => {
        api.login(res.code).then(r => {
          if (r.code === 0 && r.data && r.data.token) {
            uni.setStorageSync('token', r.data.token)
            this.loadProfile()
            uni.showToast({ title: '登录成功', icon: 'success' })
          }
        })
      }})
    },
    onMenu(m) { uni.showToast({ title: '开发中', icon: 'none' }) }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; }
.nav-bar { padding: 16px; padding-top: 50px; }
.nav-title { font-size: 20px; font-weight: 700; color: #1a1a2e; }
.content { height: calc(100vh - 100px); }
.profile-card { background: linear-gradient(135deg, #ff6b35, #ff9a5c); margin: 8px 16px; border-radius: 12px; padding: 24px 20px; display: flex; flex-direction: column; align-items: center; }
.avatar-wrap { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.nickname { font-size: 18px; font-weight: 600; color: #fff; }
.badge { display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.9); padding: 2px 8px; border-radius: 10px; margin-top: 6px; }
.badge-text { font-size: 11px; color: #ff6b35; font-weight: 600; }
.stats { display: flex; background: #fff; border-radius: 12px; margin: 12px 16px; padding: 16px; }
.stat-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
.stat-num { font-size: 20px; font-weight: 700; color: #1a1a2e; }
.stat-label { font-size: 12px; color: #9ca3af; margin-top: 4px; }
.menu-card { background: #fff; border-radius: 12px; margin: 12px 16px; overflow: hidden; }
.menu-item { display: flex; align-items: center; gap: 12px; padding: 16px; border-bottom: 1px solid #f3f4f6; }
.menu-item:last-child { border-bottom: none; }
.menu-text { flex: 1; font-size: 15px; color: #1a1a2e; }
</style>
