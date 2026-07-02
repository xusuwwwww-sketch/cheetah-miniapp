<template>
  <view class="page">
    <scroll-view scroll-y style="height: 100vh;">
      <view class="header">
        <text class="title">预约顾问咨询</text>
        <text class="subtitle">填写信息，24小时内专属顾问与您联系</text>
      </view>

      <view class="form-wrap">
        <view class="form-item">
          <text class="label">姓名 <text class="req">*</text></text>
          <input class="input" placeholder="请输入姓名" v-model="form.name" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="form-item">
          <text class="label">行业 <text class="req">*</text></text>
          <input class="input" placeholder="如：跨境电商、独立站、游戏出海" v-model="form.industry" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="form-item">
          <text class="label">职位 <text class="opt">（选填）</text></text>
          <input class="input" placeholder="如：市场总监、创始人" v-model="form.position" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="form-item">
          <text class="label">公司名称 <text class="req">*</text></text>
          <input class="input" placeholder="请输入公司名称" v-model="form.company" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="form-item">
          <text class="label">月推广预算 <text class="req">*</text></text>
          <input class="input" placeholder="如：5万以内 / 5-20万 / 20万以上" v-model="form.budget_info" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="form-item">
          <text class="label">核心需求 <text class="req">*</text></text>
          <textarea class="textarea" placeholder="简述核心需求，如：希望进入东南亚市场、提升ROAS等" v-model="form.core_need" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="form-item">
          <text class="label">当前最大痛点 <text class="opt">（选填）</text></text>
          <textarea class="textarea" placeholder="如：流量贵、转化低、不懂本地化" v-model="form.pain_point" placeholder-style="color:#c0c4cc;" />
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
      if (!this.form.name) return uni.showToast({ title: '请填写姓名', icon: 'none' })
      if (!this.form.industry) return uni.showToast({ title: '请填写行业', icon: 'none' })
      if (!this.form.company) return uni.showToast({ title: '请填写公司名称', icon: 'none' })
      if (!this.form.budget_info) return uni.showToast({ title: '请填写月推广预算', icon: 'none' })
      if (!this.form.core_need) return uni.showToast({ title: '请填写核心需求', icon: 'none' })

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
.page { background: #f6f7fb; }
.header { padding: 20px 16px 0; }
.title { font-size: 20px; font-weight: 700; color: #1a1a2e; display: block; margin-bottom: 4px; }
.subtitle { font-size: 13px; color: #6b7280; display: block; }
.form-wrap { padding: 16px; }
.form-item { margin-bottom: 16px; }
.label { font-size: 14px; color: #1a1a2e; font-weight: 500; margin-bottom: 8px; display: block; }
.req { color: #ef4444; font-size: 14px; }
.opt { color: #9ca3af; font-size: 12px; font-weight: 400; }
.input {
  display: block;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #1a1a2e;
  height: 44px;
  line-height: 20px;
}
.textarea {
  display: block;
  background: #ffffff;
  border: 1rpx solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #1a1a2e;
  height: 88px;
  line-height: 20px;
  width: 100%;
}
.submit-btn {
  background: #ff6b35;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  margin-top: 8px;
}
.submit-text { color: #fff; font-size: 16px; font-weight: 600; }
.hint { font-size: 12px; color: #9ca3af; text-align: center; display: block; margin-top: 12px; }
</style>
