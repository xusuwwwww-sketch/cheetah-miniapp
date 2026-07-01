<template>
  <view class="page">
    <view class="header"><text class="title">我的</text></view>
    <view class="profile-card">
      <view class="avatar"><text>{{ initial }}</text></view>
      <view>
        <text class="name">{{ userInfo ? (userInfo.name||userInfo.nickname||'出海从业者') : '出海从业者' }}</text>
        <text class="desc">{{ isLoggedIn ? (userInfo?.company||'点击完善信息') : '点击登录，解锁更多权益' }}</text>
      </view>
    </view>
    <view class="menu-list">
      <view class="menu-item" @tap="login">
        <text class="m-icon">微</text>
        <text class="m-text">{{ isLoggedIn ? '已登录' : '微信登录' }}</text>
        <text class="chevron">›</text>
      </view>
    </view>
    <view class="menu-list">
      <view v-for="item in menus" :key="item.label" class="menu-item" @tap="toast(item.label)">
        <text class="m-icon">{{ item.icon }}</text>
        <text class="m-text">{{ item.label }}</text>
        <text class="chevron">›</text>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '../../utils/api.js'
export default {
  data() { return { isLoggedIn: false, userInfo: null, menus: [{label:'我的报名',icon:'📅'},{label:'我的资料',icon:'📁'},{label:'我的收藏',icon:'⭐'},{label:'约咨询记录',icon:'💬'}] } },
  computed: { initial() { return this.userInfo?.name?.[0] || '我' } },
  onShow() { this.checkLogin() },
  methods: {
    async checkLogin() {
      const token = uni.getStorageSync('token')
      if(token) { this.isLoggedIn=true; try { const r=await api.getProfile(); if(r.code===0) this.userInfo=r.data } catch(e){} }
    },
    login() {
      if(this.isLoggedIn) { uni.showToast({title:'已登录',icon:'none'}); return }
      uni.login({ provider:'weixin', success: async res => {
        try { const r=await api.login(res.code); if(r.code===0){ uni.setStorageSync('token',r.data.token); this.isLoggedIn=true; this.userInfo=r.data.user; uni.showToast({title:'登录成功',icon:'success'}) } }
        catch(e){ uni.showToast({title:'登录失败',icon:'none'}) }
      }, fail: ()=>uni.showToast({title:'取消登录',icon:'none'}) })
    },
    toast(label) { if(!this.isLoggedIn){ uni.showToast({title:'请先登录',icon:'none'}); return } uni.showToast({title:`${label}建设中`,icon:'none'}) }
  }
}
</script>
<style scoped>
.page{background:#f6f7fb;min-height:100vh}.header{height:54px;padding:12px 16px;background:#fff;border-bottom:0.5px solid #e5e7eb;display:flex;align-items:center}.title{font-size:17px;font-weight:700;color:#1a1a2e}.profile-card{margin:12px 14px;padding:20px;border-radius:10px;background:linear-gradient(135deg,#1f2937,#ff6b35);color:#fff;display:flex;align-items:center;gap:14px}.avatar{width:56px;height:56px;border-radius:10px;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;flex-shrink:0}.name{display:block;font-size:18px;font-weight:800}.desc{display:block;font-size:12px;color:rgba(255,255,255,.8);margin-top:2px}.menu-list{margin:10px 14px;background:#fff;border-radius:10px;overflow:hidden;border:0.5px solid #e5e7eb}.menu-item{display:flex;align-items:center;gap:12px;padding:14px;border-bottom:0.5px solid #f3f4f6}.menu-item:last-child{border-bottom:none}.m-icon{font-size:16px;width:24px;text-align:center}.m-text{flex:1;font-size:15px;color:#1a1a2e}.chevron{color:#9ca3af;font-size:20px}
</style>
