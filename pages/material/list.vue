<template>
  <view class="page">
    <view class="header"><text class="title">服务</text></view>
    <view class="service-list">
      <view v-for="item in services" :key="item.path" class="service-item" @tap="go(item.path)">
        <view class="s-icon" :style="{background: item.color}"><text class="s-emoji">{{ item.icon }}</text></view>
        <view class="s-copy">
          <text class="s-title">{{ item.title }}</text>
          <text class="s-desc">{{ item.desc }}</text>
        </view>
        <text class="chevron">›</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      services: [
        { title: '查报告', desc: '海量行业报告，市场洞察一键查阅', icon: '📄', color: 'linear-gradient(135deg,#2563eb,#4f9dff)', path: '/pages/report/list' },
        { title: '资料库', desc: '产品操作手册、媒体指南', icon: '📁', color: 'linear-gradient(135deg,#7c3aed,#a78bfa)', path: '' },
        { title: '约咨询', desc: '1对1专家咨询，定制出海方案', icon: '💬', color: 'linear-gradient(135deg,#d97706,#fbbf24)', path: '/pages/consult/index' },
        { title: '市场诊断', desc: '快速评估目标市场机会与风险', icon: '🔍', color: 'linear-gradient(135deg,#dc2626,#fb7185)', path: '' },
        { title: '合规自查', desc: '数据隐私、广告政策一键检测', icon: '✅', color: 'linear-gradient(135deg,#0891b2,#22d3ee)', path: '' },
      ]
    }
  },
  methods: {
    go(path) {
      if(!path) { uni.showToast({title:'功能建设中',icon:'none'}); return }
      uni.navigateTo({url: path})
    }
  }
}
</script>
<style scoped>
.page{background:#f6f7fb;min-height:100vh}.header{height:54px;padding:12px 16px;background:#fff;border-bottom:0.5px solid #e5e7eb;display:flex;align-items:center}.title{font-size:17px;font-weight:700;color:#1a1a2e}.service-list{padding:12px 14px}.service-item{display:flex;align-items:center;gap:12px;background:#fff;border-radius:10px;border:0.5px solid #e5e7eb;padding:14px;margin-bottom:10px}.s-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.s-emoji{font-size:20px}.s-copy{flex:1}.s-title{display:block;font-size:15px;font-weight:700;color:#1a1a2e}.s-desc{display:block;font-size:12px;color:#9ca3af;margin-top:2px}.chevron{color:#9ca3af;font-size:20px}
</style>
