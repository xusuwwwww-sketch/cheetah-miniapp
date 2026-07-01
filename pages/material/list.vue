<template>
  <view class="page">
    <view class="header"><text class="title">服务</text></view>
    <view class="list">
      <view v-for="item in services" :key="item.key" class="item" @tap="go(item)">
        <view class="icon-wrap" :style="{background: item.bg}"><text class="icon">{{ item.icon }}</text></view>
        <view class="info">
          <text class="name">{{ item.title }}</text>
          <text class="desc">{{ item.desc }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      services: [
        { key: 'report', title: '行业报告', desc: '海量报告，市场洞察一键查阅', icon: '📄', bg: '#ecf3ff', path: '/pages/report/list' },
        { key: 'consult', title: '约咨询', desc: '1对1专家咨询，定制出海方案', icon: '💬', bg: '#fffaec', path: '/pages/consult/index' },
        { key: 'case', title: '案例库', desc: '精选出海成功案例', icon: '💼', bg: '#ecfff3', path: '' },
        { key: 'material', title: '资料库', desc: '产品手册、媒体指南', icon: '📁', bg: '#f3ecff', path: '' },
        { key: 'diagnose', title: '市场诊断', desc: '快速评估目标市场机会', icon: '🔍', bg: '#ffecec', path: '' },
      ]
    }
  },
  methods: {
    go(item) {
      if (!item.path) { uni.showToast({ title: '功能建设中', icon: 'none' }); return }
      uni.navigateTo({ url: item.path })
    }
  }
}
</script>
<style scoped>
.page { background: #f7f7f7; min-height: 100vh; }
.header { height: 44px; background: #fff; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; padding: 0 16px; }
.title { font-size: 16px; font-weight: 700; color: #1a1a1a; }
.list { margin: 10px 16px; background: #fff; border-radius: 12px; overflow: hidden; }
.item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f5f5f5; }
.item:last-child { border-bottom: none; }
.icon-wrap { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon { font-size: 20px; }
.info { flex: 1; }
.name { display: block; font-size: 15px; font-weight: 600; color: #1a1a1a; }
.desc { display: block; font-size: 12px; color: #aaa; margin-top: 2px; }
.arrow { color: #ccc; font-size: 18px; }
</style>
