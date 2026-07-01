<template>
  <view class="page">
    <view class="header"><text class="title">约咨询</text></view>
    <scroll-view scroll-y :show-scrollbar="false" class="scroll">
      <view class="hero">
        <text class="hero-title">专家一对一诊断</text>
        <text class="hero-sub">猎豹出海资深顾问，为您量身定制出海方案</text>
        <view class="hero-tags">
          <text class="hero-tag">✓ 市场分析</text>
          <text class="hero-tag">✓ 竞品策略</text>
          <text class="hero-tag">✓ 投放方案</text>
        </view>
      </view>
      <view class="form-card">
        <view class="field">
          <text class="label">姓名 <text class="required">*</text></text>
          <input class="input" v-model="form.name" placeholder="请输入您的姓名" placeholder-class="ph" />
        </view>
        <view class="divider"></view>
        <view class="field">
          <text class="label">手机号 <text class="required">*</text></text>
          <input class="input" v-model="form.phone" type="number" placeholder="请输入手机号" placeholder-class="ph" />
        </view>
        <view class="divider"></view>
        <view class="field">
          <text class="label">公司名称</text>
          <input class="input" v-model="form.company" placeholder="选填" placeholder-class="ph" />
        </view>
        <view class="divider"></view>
        <view class="field">
          <text class="label">咨询主题</text>
          <picker :range="topics" @change="e=>form.topic=topics[e.detail.value]">
            <view class="input picker-row">
              <text :class="{ph: !form.topic}">{{ form.topic || '请选择' }}</text>
              <text class="picker-arrow">›</text>
            </view>
          </picker>
        </view>
      </view>
      <view class="submit-wrap">
        <view class="submit-btn" @tap="submit">
          <text>{{ submitting ? '提交中...' : '预约咨询' }}</text>
        </view>
        <text class="tip">提交后顾问将在24小时内联系您</text>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import { api } from '../../utils/api.js'
export default {
  data() {
    return {
      submitting: false,
      form: { name: '', phone: '', company: '', topic: '' },
      topics: ['市场进入策略', '广告投放优化', '产品本地化', '合规与政策', '其他']
    }
  },
  methods: {
    async submit() {
      if (!this.form.name || !this.form.phone) { uni.showToast({ title: '请填写姓名和手机号', icon: 'none' }); return }
      this.submitting = true
      try {
        const r = await api.submitConsult(this.form)
        if (r.code === 0) {
          uni.showToast({ title: '预约成功！', icon: 'success', duration: 2000 })
          this.form = { name: '', phone: '', company: '', topic: '' }
        } else {
          uni.showToast({ title: r.msg || '提交失败', icon: 'none' })
        }
      } catch (e) { uni.showToast({ title: '网络错误', icon: 'none' }) }
      finally { this.submitting = false }
    }
  }
}
</script>
<style scoped>
.page { background: #f7f7f7; min-height: 100vh; }
.header { height: 44px; background: #fff; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; padding: 0 16px; }
.title { font-size: 16px; font-weight: 700; color: #1a1a1a; }
.scroll { padding-bottom: 80px; }
.hero { background: linear-gradient(135deg, #fa5714, #ff8c42); padding: 28px 20px; color: #fff; }
.hero-title { display: block; font-size: 22px; font-weight: 800; }
.hero-sub { display: block; font-size: 13px; color: rgba(255,255,255,.85); margin-top: 6px; line-height: 1.5; }
.hero-tags { display: flex; gap: 10px; margin-top: 14px; }
.hero-tag { background: rgba(255,255,255,.2); color: #fff; font-size: 12px; padding: 4px 10px; border-radius: 12px; }
.form-card { margin: 12px 16px; background: #fff; border-radius: 12px; overflow: hidden; }
.field { padding: 14px 16px; display: flex; align-items: center; }
.label { font-size: 14px; color: #1a1a1a; width: 90px; flex-shrink: 0; }
.required { color: #fa5714; }
.input { flex: 1; font-size: 14px; color: #1a1a1a; text-align: right; }
.picker-row { flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 4px; }
.picker-arrow { color: #ccc; font-size: 16px; }
.ph { color: #bbb; }
.divider { height: 1px; background: #f5f5f5; margin: 0 16px; }
.submit-wrap { margin: 16px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.submit-btn { width: 100%; height: 48px; background: #fa5714; border-radius: 24px; display: flex; align-items: center; justify-content: center; }
.submit-btn text { color: #fff; font-size: 16px; font-weight: 700; }
.tip { font-size: 12px; color: #aaa; }
</style>
