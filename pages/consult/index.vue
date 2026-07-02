<template>
  <view class="page">
    <view class="nav-bar">
      <text class="icon-text">‹</text>
      <text class="nav-title">约咨询</text>
      <view style="width: 20px;"></view>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 服务亮点 -->
      <view class="intro-card">
        <text class="intro-title">猎豹出海专业咨询</text>
        <text class="intro-desc">为企业出海提供全链路解决方案</text>
      </view>

      <view class="features">
        <view class="feature-item" v-for="f in features" :key="f.title">
          <view class="feature-icon" :style="{ background: f.bg }">
            {{ f.icon }}
          </view>
          <view class="feature-info">
            <text class="feature-title">{{ f.title }}</text>
            <text class="feature-desc">{{ f.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 服务流程 -->
      <view class="section">
        <text class="section-title">服务流程</text>
        <view class="steps">
          <view class="step-item" v-for="(s, i) in steps" :key="i">
            <view class="step-num">{{ i + 1 }}</view>
            <text class="step-title">{{ s }}</text>
          </view>
        </view>
      </view>
      <view style="height: 90px;"></view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <view class="btn" @tap="showModal = true">
        <text class="icon-text">💬</text>
        <text class="btn-text">  立即预约</text>
      </view>
    </view>

    <!-- 表单弹窗 -->
    <view class="modal-mask" v-if="showModal" @tap="showModal = false">
      <view class="modal" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">预约咨询</text>
          <text class="icon-text" @tap="showModal = false">✕</text>
        </view>
        <view class="form">
          <view class="form-item">
            <text class="form-label">姓名</text>
            <input class="form-input" placeholder="请输入姓名" v-model="form.name" />
          </view>
          <view class="form-item">
            <text class="form-label">手机号</text>
            <input class="form-input" type="number" placeholder="请输入手机号" v-model="form.phone" />
          </view>
          <view class="form-item">
            <text class="form-label">公司</text>
            <input class="form-input" placeholder="请输入公司名称" v-model="form.company" />
          </view>
          <view class="form-item">
            <text class="form-label">咨询主题</text>
            <input class="form-input" placeholder="如：东南亚市场进入策略" v-model="form.topic" />
          </view>
          <view class="form-item">
            <text class="form-label">备注</text>
            <textarea class="form-textarea" placeholder="补充说明（选填）" v-model="form.note" />
          </view>
          <view class="btn" @tap="onSubmit"><text class="btn-text">提交预约</text></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() {
    return {
      showModal: false,
      form: { name: '', phone: '', company: '', topic: '', note: '' },
      features: [
        { title: '市场分析', desc: '目标市场洞察与机会评估', icon: '📊', bg: '#ff6b35' },
        { title: '竞品对标', desc: '竞争格局深度拆解', icon: '🔍', bg: '#2563eb' },
        { title: '广告策略', desc: '获客渠道与投放优化', icon: '🎯', bg: '#059669' },
        { title: '内容营销', desc: '品牌内容与社媒运营', icon: '✍️', bg: '#d97706' }
      ],
      steps: ['需求沟通', '方案定制', '深度咨询', '持续跟踪']
    }
  },
  methods: {
    onSubmit() {
      const { name, phone, company, topic } = this.form
      if (!name || !phone || !topic) return uni.showToast({ title: '请填写必填项', icon: 'none' })
      api.submitConsult(this.form).then(r => {
        if (r.code === 0) { uni.showToast({ title: '预约成功', icon: 'success' }); this.showModal = false; this.form = { name: '', phone: '', company: '', topic: '', note: '' } }
        else uni.showToast({ title: r.msg || '提交失败', icon: 'none' })
      }).catch(() => { uni.showToast({ title: '网络异常', icon: 'none' }) })
    },
    goBack() { uni.navigateBack() }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; }
.nav-bar { padding: 16px; padding-top: 50px; display: flex; align-items: center; justify-content: space-between; }
.nav-title { font-size: 17px; font-weight: 600; color: #1a1a2e; }
.content { height: calc(100vh - 110px); }
.intro-card { background: linear-gradient(135deg, #ff6b35, #ff9a5c); margin: 8px 16px; border-radius: 12px; padding: 24px 20px; }
.intro-title { font-size: 20px; font-weight: 700; color: #fff; }
.intro-desc { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 6px; }
.features { display: flex; flex-wrap: wrap; padding: 12px 16px; gap: 10px; }
.feature-item { width: calc(50% - 5px); background: #fff; border-radius: 12px; padding: 16px; display: flex; align-items: flex-start; gap: 10px; }
.feature-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.feature-title { font-size: 14px; font-weight: 600; color: #1a1a2e; }
.feature-desc { font-size: 12px; color: #6b7280; margin-top: 2px; }
.section { margin: 12px 16px; }
.section-title { font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
.steps { display: flex; justify-content: space-between; background: #fff; border-radius: 12px; padding: 16px; }
.step-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
.step-num { width: 28px; height: 28px; border-radius: 50%; background: #ff6b35; color: #fff; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
.step-title { font-size: 12px; color: #1a1a2e; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: #fff; border-top: 1px solid #e5e7eb; padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
.btn { background: #ff6b35; border-radius: 8px; padding: 14px; text-align: center; display: flex; align-items: center; justify-content: center; margin-top: 16px; }
.btn-text { color: #fff; font-size: 16px; font-weight: 600; }
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: flex-end; }
.modal { background: #fff; border-radius: 16px 16px 0 0; width: 100%; padding: 20px; padding-bottom: calc(20px + env(safe-area-inset-bottom)); max-height: 85vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.modal-title { font-size: 18px; font-weight: 600; color: #1a1a2e; }
.form-item { margin-bottom: 16px; }
.form-label { font-size: 13px; color: #1a1a2e; font-weight: 500; margin-bottom: 6px; display: block; }
.form-input { background: #f6f7fb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; font-size: 14px; }
.form-textarea { background: #f6f7fb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; font-size: 14px; height: 80px; width: 100%; }
</style>
