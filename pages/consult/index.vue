<template>
  <view class="page">
    <view class="header"><text class="title">约咨询</text></view>
    <scroll-view scroll-y class="scroll">
      <view class="hero">
        <text class="hero-title">1对1 专家咨询</text>
        <text class="hero-desc">猎豹出海资深顾问，为您量身定制出海方案</text>
      </view>
      <view class="form">
        <text class="form-title">预约咨询</text>
        <view class="field">
          <text class="label">姓名 *</text>
          <input class="input" v-model="form.name" placeholder="请输入姓名" placeholder-class="ph" />
        </view>
        <view class="field">
          <text class="label">手机号 *</text>
          <input class="input" v-model="form.phone" type="number" placeholder="请输入手机号" placeholder-class="ph" />
        </view>
        <view class="field">
          <text class="label">公司名称</text>
          <input class="input" v-model="form.company" placeholder="请输入公司名称" placeholder-class="ph" />
        </view>
        <view class="field">
          <text class="label">咨询主题</text>
          <picker :range="topics" @change="e=>form.topic=topics[e.detail.value]">
            <view class="input select">
              <text :class="{ph: !form.topic}">{{ form.topic || '请选择咨询方向' }}</text>
              <text>⌄</text>
            </view>
          </picker>
        </view>
        <button class="submit-btn" :loading="submitting" @tap="submit">提交预约</button>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import { api } from '../../utils/api.js'
export default {
  data() { return { submitting:false, form:{name:'',phone:'',company:'',topic:''}, topics:['市场进入策略','广告投放优化','产品本地化','合规与政策','其他'] } },
  methods: {
    async submit() {
      if(!this.form.name||!this.form.phone) { uni.showToast({title:'请填写姓名和手机号',icon:'none'}); return }
      this.submitting=true
      try {
        const r=await api.submitConsult(this.form)
        if(r.code===0) { uni.showToast({title:'预约成功！顾问24小时内联系您',icon:'success',duration:3000}); this.form={name:'',phone:'',company:'',topic:''} }
        else uni.showToast({title:r.msg||'提交失败',icon:'none'})
      } catch(e){ uni.showToast({title:'网络错误，请重试',icon:'none'}) } finally{this.submitting=false}
    }
  }
}
</script>
<style scoped>
.page{background:#f6f7fb;min-height:100vh}.header{height:54px;padding:12px 16px;background:#fff;border-bottom:0.5px solid #e5e7eb;display:flex;align-items:center}.title{font-size:17px;font-weight:700;color:#1a1a2e}.scroll{height:calc(100vh - 54px)}.hero{margin:12px 14px;padding:24px;border-radius:10px;background:linear-gradient(135deg,#1f2937,#ff6b35);color:#fff;text-align:center}.hero-title{display:block;font-size:22px;font-weight:800}.hero-desc{display:block;margin-top:6px;font-size:14px;color:rgba(255,255,255,.85)}.form{padding:0 14px 40px}.form-title{display:block;margin:16px 0 12px;font-size:16px;font-weight:800;color:#1a1a2e}.field{margin-bottom:14px}.label{display:block;font-size:13px;color:#6b7280;font-weight:700;margin-bottom:6px}.input{width:100%;min-height:44px;padding:0 14px;border:0.5px solid rgba(203,213,225,.95);border-radius:8px;background:#fff;font-size:14px;color:#1a1a2e}.select{display:flex;align-items:center;justify-content:space-between}.ph{color:#9ca3af}.submit-btn{width:100%;height:48px;border-radius:10px;background:#ff6b35;color:#fff;font-size:16px;font-weight:800;border:none;display:flex;align-items:center;justify-content:center;margin-top:8px}
</style>
