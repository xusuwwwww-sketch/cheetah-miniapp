<template>
  <view class="page">
    <view class="header"><text class="title">行业报告</text></view>
    <scroll-view scroll-y class="list">
      <view v-if="loading && list.length===0" class="empty"><text>加载中...</text></view>
      <view v-for="item in list" :key="item.id" class="card" @tap="goDetail(item.id)">
        <view class="cover" :style="{background: item.gradient}">
          <text class="wm">REPORT</text>
          <text class="badge" :class="item.is_free?'free':'vip'">{{ item.is_free?'免费':'付费' }}</text>
        </view>
        <view class="body">
          <text class="card-title">{{ item.title }}</text>
          <view class="meta"><text>{{ item.source }}</text><text>{{ item.created_at?item.created_at.substring(0,10):'' }}</text></view>
        </view>
      </view>
      <view v-if="!loading && list.length===0" class="empty"><text>暂无报告</text></view>
    </scroll-view>
  </view>
</template>
<script>
import { api } from '../../utils/api.js'
export default {
  data() { return { loading: false, list: [] } },
  onLoad() { this.load() },
  methods: {
    async load() {
      this.loading=true
      try { const r=await api.getReports({page:1,size:20}); if(r.code===0) this.list=r.data.list } catch(e){console.error(e)} finally{this.loading=false}
    },
    goDetail(id) { uni.navigateTo({url:`/pages/report/detail?id=${id}`}) }
  }
}
</script>
<style scoped>
.page{background:#f6f7fb;min-height:100vh}.header{height:54px;padding:12px 16px;background:#fff;border-bottom:0.5px solid #e5e7eb;display:flex;align-items:center}.title{font-size:17px;font-weight:700;color:#1a1a2e}.list{height:calc(100vh - 54px);padding:12px 14px}.card{background:#fff;border-radius:8px;overflow:hidden;border:0.5px solid #e5e7eb;margin-bottom:10px}.cover{position:relative;height:100px;display:flex;align-items:center;justify-content:center}.wm{color:rgba(255,255,255,.3);font-size:14px;font-weight:700}.badge{position:absolute;top:8px;right:8px;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;color:#fff}.free{background:#10b981}.vip{background:#ff6b35}.body{padding:12px}.card-title{display:block;font-size:14px;font-weight:600;color:#1a1a2e;line-height:1.5}.meta{display:flex;gap:8px;margin-top:4px;color:#9ca3af;font-size:11px}.empty{padding:40px 0;text-align:center;color:#9ca3af;font-size:14px}
</style>
