<template>
  <view class="page">
    <scroll-view scroll-y style="height: 100vh;">
      <view class="form-card">
        <view class="form-item">
          <text class="label">昵称</text>
          <input class="input" v-model="form.nickname" placeholder="请输入昵称" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="divider" />
        <view class="form-item">
          <text class="label">姓名</text>
          <input class="input" v-model="form.name" placeholder="请输入真实姓名" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="divider" />
        <view class="form-item">
          <text class="label">手机号</text>
          <input class="input" type="tel" v-model="form.phone" placeholder="请输入手机号" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="divider" />
        <view class="form-item">
          <text class="label">行业</text>
          <input class="input" v-model="form.industry" placeholder="如：跨境电商、游戏出海" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="divider" />
        <view class="form-item">
          <text class="label">职位</text>
          <input class="input" v-model="form.position" placeholder="如：市场总监" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="divider" />
        <view class="form-item">
          <text class="label">公司</text>
          <input class="input" v-model="form.company" placeholder="请输入公司名称" placeholder-style="color:#c0c4cc;" />
        </view>
        <view class="divider" />
        <view class="form-item">
          <text class="label">邮箱</text>
          <input class="input" type="email" v-model="form.email" placeholder="请输入邮箱" placeholder-style="color:#c0c4cc;" />
        </view>
      </view>
      <view class="btn-wrap">
        <view class="save-btn" @tap="onSave"><text class="save-text">保存</text></view>
      </view>
      <view style="height: 60px;"></view>
    </scroll-view>
  </view>
</template>
<script>
import { api } from '@/utils/api.js'
export default {
  data() { return { form: {} } },
  onLoad() {
    api.getProfile().then(r => { if (r.code === 0) this.form = { ...r.data } }).catch(() => {})
  },
  methods: {
    onSave() {
      uni.showLoading({ title: '保存中...' })
      api.updateBasic(this.form).then(r => {
        uni.hideLoading()
        if (r.code === 0) { uni.showToast({ title: '保存成功', icon: 'success' }); setTimeout(() => uni.navigateBack(), 1000) }
        else uni.showToast({ title: r.msg || '保存失败', icon: 'none' })
      }).catch(() => { uni.hideLoading(); uni.showToast({ title: '网络异常', icon: 'none' }) })
    }
  }
}
</script>
<style scoped>
.page { background: #f6f7fb; }
.form-card { background: #fff; border-radius: 12px; margin: 16px; overflow: hidden; }
.form-item { display: flex; align-items: center; padding: 14px 16px; }
.label { font-size: 14px; color: #6b7280; width: 60px; flex-shrink: 0; }
.input { flex: 1; font-size: 14px; color: #1a1a2e; height: 24px; }
.divider { height: 1px; background: #f6f7fb; margin: 0 16px; }
.btn-wrap { padding: 0 16px; }
.save-btn { background: #ff6b35; border-radius: 10px; padding: 14px; text-align: center; }
.save-text { color: #fff; font-size: 16px; font-weight: 600; }
</style>
