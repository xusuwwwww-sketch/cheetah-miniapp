<template name="tab-bar">
  <view class="tab-bar">
    <view class="tab-item" v-for="(item, i) in tabs" :key="i" @tap="switchTab(item.path)">
      <uni-icons :type="item.icon" :size="22" :color="current === item.path ? '#ff6b35' : '#9ca3af'" />
      <text :class="['tab-text', { active: current === item.path }]">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: { current: { type: String, default: '' } },
  data() { return { tabs: [
    { text: '首页', icon: 'home', path: '/pages/index/index' },
    { text: '活动', icon: 'calendar', path: '/pages/activity/list' },
    { text: '服务', icon: 'grid', path: '/pages/material/list' },
    { text: '我的', icon: 'person', path: '/pages/profile/index' }
  ]}},
  methods: { switchTab(path) { uni.switchTab({ url: path }) } }
}
</script>

<style scoped>
.tab-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 50px; background: #fff; display: flex; border-top: 1rpx solid #e5e7eb; padding-bottom: env(safe-area-inset-bottom); z-index: 999; }
.tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.tab-text { font-size: 10px; color: #9ca3af; margin-top: 2px; }
.tab-text.active { color: #ff6b35; }
</style>
