<template>
  <view class="page">
    <scroll-view scroll-y style="height: 100vh;">
      <view class="form-wrap">
        <text class="page-title">填写信息免费下载</text>
        <text class="page-desc">填写以下信息，即可免费下载全部资料</text>

        <view class="form-item">
          <text class="label">姓名 <text class="req">*</text></text>
          <input class="input" placeholder="请输入姓名" v-model="form.name" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="form-item">
          <text class="label">手机号 <text class="req">*</text></text>
          <input class="input" type="tel" placeholder="请输入手机号" v-model="form.phone" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="form-item">
          <text class="label">所在行业 <text class="req">*</text></text>
          <input class="input" placeholder="如：跨境电商、游戏出海" v-model="form.industry" placeholder-style="color:#c0c4cc;" />
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
          <textarea class="textarea" placeholder="简述核心需求" v-model="form.core_need" placeholder-style="color:#c0c4cc;" />
        </view>

        <view class="submit-btn" @tap="onSubmit">
          <text class="submit-text">{{ submitting ? '提交中...' : '立即下载' }}</text>
        </view>
      </view>
      <view style="height: 40px;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() {
    return {
      materialId: '',
      materialType: 'material',
      submitting: false,
      form: { name: '', phone: '', industry: '', position: '', company: '', budget_info: '', core_need: '' }
    }
  },
  onLoad(e) {
    this.materialId = e.id || ''
    this.materialType = e.type || 'material'
  },
  methods: {
    onSubmit() {
      const { name, phone, industry, company, budget_info, core_need } = this.form
      if (!name) return uni.showToast({ title: '请填写姓名', icon: 'none' })
      if (!phone) return uni.showToast({ title: '请填写手机号', icon: 'none' })
      if (!/^(1[3-9]\d{9}|\+?\d{7,15})$/.test(phone)) return uni.showToast({ title: '手机号格式不正确', icon: 'none' })
      if (!/^(1[3-9]\d{9}|\+?\d{7,15}$)/.test(phone)) return uni.showToast({ title: '手机号格式不正确', icon: 'none' })
      if (!industry) return uni.showToast({ title: '请填写所在行业', icon: 'none' })
      if (!company) return uni.showToast({ title: '请填写公司名称', icon: 'none' })
      if (!budget_info) return uni.showToast({ title: '请填写月推广预算', icon: 'none' })
      if (!core_need) return uni.showToast({ title: '请填写核心需求', icon: 'none' })

      this.submitting = true
      uni.showLoading({ title: '提交中...' })
      api.updateBasic(this.form).then(r => {
        if (r.code === 0) {
          api.submitConsult({ ...this.form, topic: '下载资料留资' }).catch(() => {})
          uni.hideLoading()
          this.submitting = false
          uni.showToast({ title: '信息已完善', icon: 'success' })
          // 返回详情页并触发下载
          setTimeout(() => {
            uni.navigateBack()
            // 通过 storage 通知详情页触发下载
            uni.setStorageSync('trigger_download', this.materialId)
          }, 800)
        } else {
          uni.hideLoading()
          this.submitting = false
          uni.showToast({ title: r.msg || '提交失败', icon: 'none' })
        }
      }).catch(() => {
        uni.hideLoading()
        this.submitting = false
        uni.showToast({ title: '网络异常', icon: 'none' })
      })
    }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; }
.form-wrap { padding: 16px; }
.page-title { font-size: 20px; font-weight: 700; color: #1a1a2e; display: block; margin-bottom: 4px; }
.page-desc { font-size: 13px; color: #6b7280; display: block; margin-bottom: 20px; }
.form-item { margin-bottom: 16px; }
.label { font-size: 14px; color: #1a1a2e; font-weight: 500; margin-bottom: 8px; display: block; }
.req { color: #ef4444; }
.opt { color: #9ca3af; font-size: 12px; font-weight: 400; }
.input { display: block; background: #ffffff; border: 1rpx solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #1a1a2e; height: 44px; line-height: 20px; }
.textarea { display: block; background: #ffffff; border: 1rpx solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #1a1a2e; height: 88px; line-height: 20px; width: 100%; }
.submit-btn { background: #ff6b35; border-radius: 10px; padding: 15px; text-align: center; margin-top: 8px; }
.submit-text { color: #fff; font-size: 16px; font-weight: 600; }
</style>
