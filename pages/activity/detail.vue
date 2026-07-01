<template>
  <view class="page">
    <view class="back-bar">
      <button class="back" @tap="back">‹</button>
      <text class="bar-title">活动详情</text>
    </view>
    <scroll-view scroll-y class="scroll" v-if="activity">
      <view class="cover" :style="{background: activity.gradient||'linear-gradient(135deg,#ff6b35,#ff9a5c)'}">
        <text class="cover-text">{{ activity.icon||'LIVE' }}</text>
        <text class="cover-title">{{ activity.title }}</text>
      </view>
      <view class="info">
        <text class="detail-title">{{ activity.title }}</text>
        <view class="tags">
          <text class="tag">{{ formatTime(activity.start_time) }}</text>
          <text class="tag">{{ activity.location }}</text>
          <text class="tag">{{ activity.organizer }}</text>
          <text class="tag">已报{{ activity.signup_count }}人</text>
        </view>
      </view>
      <view class="content" v-if="activity.description">
        <text class="content-title">活动介绍</text>
        <text class="content-text">{{ activity.description }}</text>
      </view>
    </scroll-view>
    <view class="cta" v-if="activity">
      <button class="cta-btn" @tap="signup">{{ isFull ? '已满额' : '立即报名' }}</button>
    </view>
  </view>
</template>
<script>
import { api } from '../../utils/api.js'
export default {
  data() { return { activity: null } },
  computed: { isFull() { return this.activity && this.activity.quota>0 && this.activity.signup_count>=this.activity.quota } },
  onLoad(opts) { if(opts.id) this.load(opts.id) },
  methods: {
    async load(id) {
      try { const r = await api.getActivityDetail(id); if(r.code===0) this.activity=r.data } catch(e) { console.error(e) }
    },
    back() { uni.navigateBack() },
    formatTime(t) { return t ? t.replace('T',' ').substring(0,16) : '' },
    signup() {
      if(this.isFull) { uni.showToast({title:'名额已满',icon:'none'}); return }
      uni.showToast({title:'报名成功！',icon:'success'})
    }
  }
}
</script>
<style scoped>
.page{background:#f6f7fb;min-height:100vh;display:flex;flex-direction:column}
.back-bar{position:fixed;top:0;left:0;right:0;z-index:99;height:54px;padding:12px 14px;background:rgba(255,255,255,.96);border-bottom:0.5px solid #e5e7eb;display:flex;align-items:center}
.back{width:28px;height:28px;border-radius:8px;background:#f3f4f6;color:#1a1a2e;font-size:28px;line-height:26px;display:flex;align-items:center;justify-content:center;border:none;padding:0}
.bar-title{position:absolute;left:50%;transform:translateX(-50%);font-size:16px;font-weight:700;color:#1a1a2e}
.scroll{margin-top:54px;padding-bottom:70px}
.cover{height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
.cover-text{font-size:28px;font-weight:800;color:#fff}
.cover-title{font-size:16px;font-weight:700;color:rgba(255,255,255,.9);text-align:center;padding:0 20px}
.info{background:#fff;padding:16px 14px}
.detail-title{display:block;font-size:20px;font-weight:800;color:#1a1a2e;line-height:1.4}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.tag{padding:4px 10px;border-radius:5px;background:#f6f7fb;color:#64748b;font-size:12px}
.content{margin:10px 14px;padding:16px;background:#fff;border-radius:8px;border:0.5px solid #e5e7eb}
.content-title{display:block;font-size:16px;font-weight:800;color:#1a1a2e;margin-bottom:10px}
.content-text{display:block;font-size:14px;color:#6b7280;line-height:1.8}
.cta{position:fixed;bottom:0;left:0;right:0;padding:12px 14px;background:rgba(255,255,255,.96);border-top:0.5px solid #e5e7eb}
.cta-btn{width:100%;height:48px;border-radius:10px;background:#ff6b35;color:#fff;font-size:16px;font-weight:800;border:none;display:flex;align-items:center;justify-content:center}
</style>
