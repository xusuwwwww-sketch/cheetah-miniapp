<template>
  <view class="page">
    <view class="content">
      <view class="icon-wrap">
        <text class="icon">✅</text>
      </view>
      <text class="title">预约成功！</text>
      <text class="desc">您的专属出海顾问将在 24 小时内联系您</text>
      <text class="desc-sub">请保持手机畅通，我们会尽快安排 1v1 深度沟通</text>

      <view class="info-card">
        <view class="info-row">
          <text class="info-icon">📞</text>
          <text class="info-text">顾问将通过您预留的手机号联系</text>
        </view>
        <view class="info-row">
          <text class="info-icon">⏱</text>
          <text class="info-text">工作日 9:00 - 18:00 优先响应</text>
        </view>
        <view class="info-row">
          <text class="info-icon">📋</text>
          <text class="info-text">您也可在「我的 → 约咨询记录」查看状态</text>
        </view>
      </view>

      <view class="btn-group">
        <view class="btn-primary" @tap="goHome">
          <text class="btn-text">返回首页</text>
        </view>
        <view class="btn-secondary" @tap="goRecord">
          <text class="btn-text-gray">查看咨询记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goHome() { uni.switchTab({ url: '/pages/index/index' }) },
    goRecord() { uni.navigateTo({ url: '/pages/profile/consults' }) }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.content { padding: 40px 24px; display: flex; flex-direction: column; align-items: center; text-align: center; }
.icon-wrap { width: 80px; height: 80px; background: #ecfdf5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.icon { font-size: 40px; }
.title { font-size: 24px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; }
.desc { font-size: 15px; color: #6b7280; line-height: 1.6; margin-bottom: 4px; }
.desc-sub { font-size: 13px; color: #9ca3af; line-height: 1.6; margin-bottom: 28px; }
.info-card { background: #fff; border-radius: 12px; padding: 16px; width: 100%; margin-bottom: 28px; }
.info-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f6f7fb; }
.info-row:last-child { border-bottom: none; }
.info-icon { font-size: 18px; flex-shrink: 0; }
.info-text { font-size: 13px; color: #6b7280; line-height: 1.5; text-align: left; }
.btn-group { width: 100%; display: flex; flex-direction: column; gap: 12px; }
.btn-primary { background: #ff6b35; border-radius: 10px; padding: 14px; text-align: center; }
.btn-text { color: #fff; font-size: 16px; font-weight: 600; }
.btn-secondary { background: #fff; border-radius: 10px; padding: 14px; text-align: center; border: 1px solid #e5e7eb; }
.btn-text-gray { color: #6b7280; font-size: 15px; }
</style>
