<template>
  <view class="page">
    <view class="header"><text class="title">行业报告</text></view>
    <scroll-view scroll-y class="list" :show-scrollbar="false">
      <view v-if="loading && list.length===0" class="loading"><text>加载中...</text></view>
      <view v-for="item in list" :key="item.id" class="card" @tap="goDetail(item.id)">
        <view class="cover" :style="{background: item.gradient}">
          <text class="cover-wm">REPORT</text>
          <text class="badge" :class="item.is_free?'free':'paid'">{{ item.is_free?'免费':'付费' }}</text>
        </view>
        <view class="info">
          <text class="name">{{ item.title }}</text>
          <view class="meta"><text>{{ item.source }}</text><text>{{ item.created_at?item.created_at.substring(0,10):'' }}</text></view>
        </view>
      </view>
      <view v-if="!loading && list.length===0" class="empty">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无报告</text>
      </view>
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
      this.loading = true
      try { const r = await api.getReports({ page: 1, size: 20 }); if (r.code === 0) this.list = r.data.list }
      catch (e) { console.error(e) } finally { this.loading = false }
    },
    goDetail(id) { uni.navigateTo({ url: `/pages/report/detail?id=${id}` }) }
  }
}
</script>
<style scoped>
.page { background: #f7f7f7; min-height: 100vh; }
.header { height: 44px; background: #fff; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; padding: 0 16px; }
.title { font-size: 16px; font-weight: 700; color: #1a1a1a; }
.list { padding: 10px 16px; }
.card { background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 12px; display: flex; gap: 12px; padding: 0; }
.cover { width: 100px; height: 80px; flex-shrink: 0; position: relative; display: flex; align-items: center; justify-content: center; }
.cover-wm { color: rgba(255,255,255,.3); font-size: 11px; font-weight: 700; }
.badge { position: absolute; top: 6px; right: 6px; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
.free { background: #e8f7ef; color: #2ecc71; }
.paid { background: #fff3ec; color: #fa5714; }
.info { flex: 1; padding: 14px 12px 14px 0; display: flex; flex-direction: column; justify-content: center; }
.name { font-size: 14px; font-weight: 600; color: #1a1a1a; line-height: 1.5; }
.meta { display: flex; gap: 8px; margin-top: 6px; color: #aaa; font-size: 11px; }
.loading { padding: 40px 0; text-align: center; color: #aaa; font-size: 13px; }
.empty { padding: 60px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 40px; }
.empty-text { font-size: 14px; color: #aaa; }
</style>
