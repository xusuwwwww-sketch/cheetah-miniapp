<template>
  <view class="page">
    <scroll-view scroll-y style="min-height: 100vh;">
      <!-- 顶部说明 -->
      <view class="page-header">
        <text class="page-title">预约出海顾问</text>
        <text class="page-desc">填写以下信息，专属顾问将在24小时内与您联系</text>
      </view>

      <!-- 表单卡片 -->
      <view class="form-card">
        <view class="form-item">
          <view class="label-row">
            <text class="label">姓名</text>
            <text class="req-tag">必填</text>
          </view>
          <input class="input" placeholder="请输入您的姓名" v-model="form.name" placeholder-style="color:#c0c4cc;font-size:14px;" />
          <text v-if="errors.name" class="field-error">{{ errors.name }}</text>
        </view>
        <view class="divider" />

        <view class="form-item">
          <view class="label-row">
            <text class="label">手机号</text>
            <text class="req-tag">必填</text>
          </view>
          <input class="input" type="tel" placeholder="请输入手机号" v-model="form.phone" placeholder-style="color:#c0c4cc;font-size:14px;" />
          <text v-if="errors.phone" class="field-error">{{ errors.phone }}</text>
        </view>
        <view class="divider" />

        <view class="form-item">
          <view class="label-row">
            <text class="label">所在行业</text>
            <text class="req-tag">必填</text>
          </view>
          <input class="input" placeholder="如：跨境电商、独立站、游戏出海" v-model="form.industry" placeholder-style="color:#c0c4cc;font-size:14px;" />
          <text v-if="errors.industry" class="field-error">{{ errors.industry }}</text>
        </view>
        <view class="divider" />

        <view class="form-item">
          <view class="label-row">
            <text class="label">职位</text>
            <text class="opt-tag">选填</text>
          </view>
          <input class="input" placeholder="如：市场总监、创始人" v-model="form.position" placeholder-style="color:#c0c4cc;font-size:14px;" />
        </view>
        <view class="divider" />

        <view class="form-item">
          <view class="label-row">
            <text class="label">公司名称</text>
            <text class="req-tag">必填</text>
          </view>
          <input class="input" placeholder="请输入公司名称" v-model="form.company" placeholder-style="color:#c0c4cc;font-size:14px;" />
          <text v-if="errors.company" class="field-error">{{ errors.company }}</text>
        </view>
        <view class="divider" />

        <view class="form-item">
          <view class="label-row">
            <text class="label">月推广预算</text>
            <text class="req-tag">必填</text>
          </view>
          <input class="input" placeholder="如：5万以内 / 5-20万 / 20万以上" v-model="form.budget_info" placeholder-style="color:#c0c4cc;font-size:14px;" />
          <text v-if="errors.budget_info" class="field-error">{{ errors.budget_info }}</text>
        </view>
      </view>

      <!-- 大文本字段单独成卡片 -->
      <view class="form-card" style="margin-top: 12px;">
        <view class="form-item">
          <view class="label-row">
            <text class="label">核心需求</text>
            <text class="req-tag">必填</text>
          </view>
          <textarea class="textarea" placeholder="简述您的核心需求，如：希望进入东南亚市场、提升广告ROAS等" v-model="form.core_need" placeholder-style="color:#c0c4cc;font-size:14px;" />
          <text v-if="errors.core_need" class="field-error">{{ errors.core_need }}</text>
          <text v-if="errors.core_need" class="field-error">{{ errors.core_need }}</text>
        </view>
        <view class="divider" />

        <view class="form-item">
          <view class="label-row">
            <text class="label">当前最大痛点</text>
            <text class="opt-tag">选填</text>
          </view>
          <textarea class="textarea" placeholder="如：流量贵、转化低、不懂本地化运营等" v-model="form.pain_point" placeholder-style="color:#c0c4cc;font-size:14px;" />
        </view>
      </view>

      <!-- 提交 -->
      <view class="submit-wrap">
        <view class="submit-btn" @tap="onSubmit">
          <text class="submit-text">提交预约</text>
        </view>
        <text class="hint">已有 2,000+ 品牌通过猎豹顾问加速出海</text>
      </view>

      <view style="height: 60px;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'
export default {
  data() {
    return {
      form: { name: '', phone: '', industry: '', position: '', company: '', budget_info: '', core_need: '', pain_point: '' },
      errors: {}
    }
  },
  methods: {
    onSubmit() {
      const checks = [
        [!this.form.name, '请填写姓名'],
        [!this.form.phone, '请填写手机号'],
        [this.form.phone && !/^(1[3-9]\d{9}|\+?\d{7,15})$/.test(this.form.phone), '手机号格式不正确'],
        [!this.form.industry, '请填写所在行业'],
        [!this.form.company, '请填写公司名称'],
        [!this.form.budget_info, '请填写月推广预算'],
        [!this.form.core_need, '请填写核心需求'],
      ]
      for (const [fail, msg] of checks) {
        if (fail) return uni.showToast({ title: msg, icon: 'none' })
      }
      uni.showLoading({ title: '提交中...' })
      api.submitConsult(this.form).then(r => {
        uni.hideLoading()
        if (r.code === 0) {
          this.form = { name: '', phone: '', industry: '', position: '', company: '', budget_info: '', core_need: '', pain_point: '' }
          uni.navigateTo({ url: '/pages/consult/success' })
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
.page-header { padding: 20px 16px 12px; }
.page-title { font-size: 18px; font-weight: 700; color: #1a1a2e; display: block; margin-bottom: 4px; }
.page-desc { font-size: 13px; color: #6b7280; display: block; line-height: 1.5; }

.form-card {
  background: #ffffff;
  border-radius: 12px;
  margin: 0 16px;
  overflow: hidden;
}
.form-item { padding: 14px 16px; }
.label-row { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.label { font-size: 14px; color: #1a1a2e; font-weight: 500; }
.req-tag { font-size: 12px; color: #ff6b35; background: #fff3ee; padding: 1px 6px; border-radius: 4px; }
.opt-tag { font-size: 12px; color: #9ca3af; background: #f3f4f6; padding: 1px 6px; border-radius: 4px; }

.input {
  width: 100%;
  height: 40px;
  background: #f6f7fb;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #1a1a2e;
  border: none;
  box-sizing: border-box;
}
.textarea {
  width: 100%;
  background: #f6f7fb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: #1a1a2e;
  height: 88px;
  border: none;
  box-sizing: border-box;
  line-height: 1.5;
}
.divider { height: 1px; background: #f3f4f6; margin: 0 16px; }

.submit-wrap { padding: 20px 16px 0; }
.submit-btn {
  background: #ff6b35;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}
.submit-text { color: #fff; font-size: 16px; font-weight: 600; }
.hint { font-size: 12px; color: #9ca3af; text-align: center; display: block; margin-top: 10px; }
.field-error { font-size: 12px; color: #ef4444; margin-top: 4px; display: block; }
</style>
