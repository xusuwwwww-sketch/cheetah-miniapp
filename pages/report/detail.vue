<template>
  <view class="page">
    <view class="back-bar">
      <button class="back" @tap="back">‹</button>
      <text class="bar-title">报告详情</text>
    </view>
    <scroll-view scroll-y class="scroll" v-if="report">
      <view class="cover" :style="{background: report.gradient}">
        <text style="color:rgba(255,255,255,.3);font-size:18px;font-weight:700">REPORT</text>
      </view>
      <view class="info">
        <text class="detail-title">{{ report.title }}</text>
        <view class="tags">
          <text class="tag">{{ report.source }}</text>
          <text class="tag">{{ report.created_at?report.created_at.substring(0,10):'' }}</text>
          <text class="tag" :class="report.is_free?'free':'vip'">{{ report.is_free?'免费':'付费' }}</text>
        </view>
        <text class="summary" v-if="report.summary">{{ report.summary }}</text>
      </view>
    </scroll-view>
    <view class="cta" v-if="report">
      <button class="cta-btn" @tap="download">{{ report.is_free?'免费下载':'购买报告' }}</button>
    </view>
  </view>
</template>
<script>
import { api } from '../../utils/api.js'
export default {
  data() { return { report: null } },
  onLoad(opts) { if(opts.id) this.load(opts.id) },
  methods: {
    async load(id) { try { const r=await api.getReportDetail(id); if(r.code===0) this.report=r.data } catch(e){console.error(e)} },
    back() { uni.navigateBack() },
    download() { uni.showToast({title:'请先完善基本信息后下载',icon:'none'}) }
  }
}
</script>
<style scoped>
.page{background:#f6f7fb;min-height:100vh}.back-bar{position:fixed;top:0;left:0;right:0;z-index:99;height:54px;padding:12px 14px;background:rgba(255,255,255,.96);border-bottom:0.5px solid #e5e7eb;display:flex;align-items:center}.back{width:28px;height:28px;border-radius:8px;background:#f3f4f6;color:#1a1a2e;font-size:28px;line-height:26px;display:flex;align-items:center;justify-content:center;border:none;padding:0}.bar-title{position:absolute;left:50%;transform:translateX(-50%);font-size:16px;font-weight:700;color:#1a1a2e}.scroll{margin-top:54px;padding-bottom:70px}.cover{height:150px;display:flex;align-items:center;justify-content:center}.info{background:#fff;padding:16px 14px}.detail-title{display:block;font-size:20px;font-weight:800;color:#1a1a2e;line-height:1.4}.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.tag{padding:4px 10px;border-radius:5px;background:#f6f7fb;color:#64748b;font-size:12px}.free{background:#ecfdf5;color:#059669}.vip{background:#fff7ed;color:#ff6b35}.summary{display:block;margin-top:12px;font-size:14px;color:#6b7280;line-height:1.7}.cta{position:fixed;bottom:0;left:0;right:0;padding:12px 14px;background:rgba(255,255,255,.96);border-top:0.5px solid #e5e7eb}.cta-btn{width:100%;height:48px;border-radius:10px;background:#ff6b35;color:#fff;font-size:16px;font-weight:800;border:none;display:flex;align-items:center;justify-content:center}
</style>
