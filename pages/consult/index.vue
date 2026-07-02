<template>
  <view class="page">
    <scroll-view scroll-y class="content">
      <view class="form-card">
        <text class="form-title">预约顾问咨询</text>
        <text class="form-subtitle">填写信息，24小时内专属顾问与您联系</text>

        <view class="form-item">
          <text class="form-label">姓名 <text class="required">*</text></text>
          <input class="form-input" placeholder="请输入姓名" v-model="form.name" />
        </view>
        <view class="form-item">
          <text class="form-label">行业 <text class="required">*</text></text>
          <input class="form-input" placeholder="如：跨境电商、独立站、游戏出海" v-model="form.industry" />
        </view>
        <view class="form-item">
          <text class="form-label">职位</text>
          <input class="form-input" placeholder="如：市场总监、创始人（选填）" v-model="form.position" />
        </view>
        <view class="form-item">
          <text class="form-label">公司名称 <text class="required">*</text></text>
          <input class="form-input" placeholder="请输入公司名称" v-model="form.company" />
        </view>
        <view class="form-item">
          <text class="form-label">月推广预算 <text class="required">*</text></text>
          <input class="form-input" placeholder="如：5万以内、5-20万、20万以上" v-model="form.budget_info" />
        </view>
        <view class="form-item">
          <text class="form-label">核心需求 <text class="required">*</text></text>
          <textarea class="form-textarea" placeholder="简述您的核心需求，如：希望进入东南亚市场、优化广告ROAS等" v-model="form.core_need" />
        </view>
        <view class="form-item">
          <text class="form-label">当前最大痛点</text>
          <textarea class="form-textarea" placeholder="如：流量贵、转化低、不懂本地化（选填）" v-model="form.pain_point" />
        </view>

        <view class="submit-btn" @tap="onSubmit">
          <text class="submit-text">提交预约</text>
        </view>
        <text class="hint">已有 2,000+ 品牌通过猎豹顾问加速出海</text>
      </view>

      <view style="height: 80px;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() {
    return {
      form: { name: '', industry: '', position: '', company: '', budget_info: '', core_need: '', pain_point: '' }
    }
  },
  methods: {
    onSubmit() {
      const { name, industry, company, budget_info, core_need } = this.form
      if (!name) return uni.showToast({ title: '请填写姓名', icon: 'none' })
      if (!industry) return uni.showToast({ title: '请填写行业', icon: 'none' })
      if (!company) return uni.showToast({ title: '请填写公司名称', icon: 'none' })
      if (!budget_info) return uni.showToast({ title: '请填写月推广预算', icon: 'none' })
      if (!core_need) return uni.showToast({ title: '请填写核心需求', icon: 'none' })

      uni.showLoading({ title: '提交中...' })
      api.submitConsult(this.form).then(r => {
        uni.hideLoading()
        if (r.code === 0) {
          uni.showToast({ title: '预约成功！', icon: 'success' })
          this.form = { name: '', industry: '', position: '', company: '', budget_info: '', core_need: '', pain_point: '' }
        } else {
          uni.showToast({ title: r.msg || '提交失败', icon: 'none' })
        }
      }).catch(() => {
        uni.hideLoading()
        uni.showToast({ title: '网络异常，请重试', icon: 'none' })
      })
    }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; }
.content { height: 100vh; }
.form-card { background: #fff; margin: 16px; border-radius: 12px; padding: 24px 20px; }
.form-title { font-size: 20px; font-weight: 700; color: #1a1a2e; display: block; margin-bottom: 6px; }
.form-subtitle { font-size: 13px; color: #6b7280; display: block; margin-bottom: 24px; }
.form-item { margin-bottom: 16px; }
.form-label { font-size: 13px; color: #1a1a2e; font-weight: 500; margin-bottom: 6px; display: block; }
.required { color: #ef4444; margin-left: 2px; }
.form-input { background: #f6f7fb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; font-size: 14px; width: 100%; box-sizing: border-box; }
.form-textarea { background: #f6f7fb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; font-size: 14px; height: 88px; width: 100%; box-sizing: border-box; }
.submit-btn { background: #ff6b35; border-radius: 8px; padding: 14px; text-align: center; margin-top: 24px; }
.submit-text { color: #fff; font-size: 16px; font-weight: 600; }
.hint { font-size: 12px; color: #9ca3af; text-align: center; display: block; margin-top: 12px; }
</style>
