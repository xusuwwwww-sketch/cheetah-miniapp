<template>
  <view class="page">
    <view class="user-card">
      <view class="avatar"><text class="avatar-text">{{ initial }}</text></view>
      <view class="user-info">
        <text class="user-name">{{ userInfo ? (userInfo.name || userInfo.nickname || '出海从业者') : '出海从业者' }}</text>
        <text class="user-desc">{{ isLoggedIn ? (userInfo?.company || '点击完善信息') : '登录解锁更多功能' }}</text>
      </view>
      <view v-if="!isLoggedIn" class="login-btn" @tap="login"><text>登录</text></view>
    </view>
    <view class="group">
      <view v-for="item in menus" :key="item.label" class="menu-item" @tap="handleMenu(item)">
        <text class="menu-icon">{{ item.icon }}</text>
        <text class="menu-label">{{ item.label }}</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '../../utils/api.js'
export default {
  data() {
    return {
      isLoggedIn: false, userInfo: null,
      menus: [
        { label: '我的报名', icon: '📅' },
        { label: '我的资料', icon: '📁' },
        { label: '我的收藏', icon: '⭐' },
        { label: '约咨询记录', icon: '💬' },
        { label: '系统设置', icon: '⚙️' }
      ]
    }
  },
  computed: { initial() { return this.userInfo?.name?.[0] || '我' } },
  onShow() { this.checkLogin() },
  methods: {
    async checkLogin() {
      const token = uni.getStorageSync('token')
      if (token) { this.isLoggedIn = true; try { const r = await api.getProfile(); if (r.code === 0) this.userInfo = r.data } catch(e) {} }
    },
    login() {
      uni.login({ provider: 'weixin', success: async res => {
        try {
          const r = await api.login(res.code)
          if (r.code === 0) { uni.setStorageSync('token', r.data.token); this.isLoggedIn = true; this.userInfo = r.data.user; uni.showToast({ title: '登录成功', icon: 'success' }) }
        } catch(e) { uni.showToast({ title: '登录失败', icon: 'none' }) }
      }, fail: () => {} })
    },
    handleMenu() {
      if (!this.isLoggedIn) { uni.showToast({ title: '请先登录', icon: 'none' }); return }
      uni.showToast({ title: '功能建设中', icon: 'none' })
    }
  }
}
</script>
<style scoped>
.page { background: #f7f7f7; min-height: 100vh; padding-bottom: 60px; }
.user-card { background: #fff; padding: 24px 16px; display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.avatar { width: 60px; height: 60px; border-radius: 30px; background: #fa5714; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.avatar-text { font-size: 24px; color: #fff; font-weight: 700; }
.user-info { flex: 1; }
.user-name { display: block; font-size: 18px; font-weight: 700; color: #1a1a1a; }
.user-desc { display: block; font-size: 13px; color: #aaa; margin-top: 3px; }
.login-btn { height: 32px; padding: 0 16px; background: #fa5714; border-radius: 16px; display: flex; align-items: center; }
.login-btn text { font-size: 13px; color: #fff; font-weight: 600; }
.group { margin: 0 16px; background: #fff; border-radius: 12px; overflow: hidden; }
.menu-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f5f5f5; }
.menu-item:last-child { border-bottom: none; }
.menu-icon { font-size: 18px; width: 24px; text-align: center; }
.menu-label { flex: 1; font-size: 15px; color: #1a1a1a; }
.menu-arrow { color: #ccc; font-size: 18px; }
</style>
