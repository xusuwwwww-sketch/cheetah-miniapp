<template>
  <view class="page">
    <!-- Tab 切换 -->
    <view class="tabs">
      <view
        v-for="tab in tabs" :key="tab.key"
        class="tab" :class="{active: activeTab===tab.key}"
        @tap="switchTab(tab.key)"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search-box">
      <text class="search-icon-text">搜索</text>
      <input
        v-model="keyword"
        placeholder="搜索活动名称"
        placeholder-class="placeholder"
        @confirm="doSearch"
        class="search-input"
      />
    </view>

    <!-- 列表 -->
    <scroll-view scroll-y class="list" @scrolltolower="loadMore" :show-scrollbar="false">
      <!-- 加载中 -->
      <view v-if="loading && activities.length===0" class="loading">
        <text>加载中...</text>
      </view>

      <!-- 活动卡片 -->
      <view
        v-for="item in activities" :key="item.id"
        class="card"
        @tap="goDetail(item.id)"
      >
        <!-- 封面 -->
        <view class="card-cover" :style="{background: item.gradient || 'linear-gradient(135deg,#ff6b35,#ff9a5c)'}">
          <text class="card-cover-type">{{ typeLabel(item.type) }}</text>
          <view class="card-cover-mask">
            <text class="card-cover-title">{{ item.title }}</text>
          </view>
        </view>

        <!-- 内容 -->
        <view class="card-body">
          <view class="card-meta">
            <text class="meta-item">📅 {{ formatTime(item.start_time) }}</text>
            <text class="meta-item">📍 {{ item.location || '待定' }}</text>
          </view>
          <view class="card-footer">
            <text class="signup-count">{{ item.signup_count }} 人已报名</text>
            <view class="btn-wrap">
              <view class="signup-btn" :class="{disabled: isFull(item)}" @tap.stop="signup(item)">
                <text>{{ isFull(item) ? '已满额' : '报名' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && activities.length===0" class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无相关活动</text>
      </view>

      <!-- 加载完毕 -->
      <view v-if="activities.length>0 && activities.length>=total" class="load-end">
        <text>已全部加载</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { api } from '../../utils/api.js'
export default {
  data() {
    return {
      activeTab: 'live',
      keyword: '',
      loading: false,
      activities: [],
      page: 1,
      total: 0,
      tabs: [
        { key: 'live', label: '直播' },
        { key: 'closed', label: '闭门会' },
        { key: 'salon', label: '线下沙龙' },
        { key: 'camp', label: '训练营' }
      ]
    }
  },
  onLoad() { this.load() },
  onShow() {
    if (typeof this.$scope !== 'undefined' && this.$scope.getTabBar) {
      this.$scope.getTabBar().setData({ active: 1 })
    }
  },
  methods: {
    async load(reset = true) {
      if (reset) { this.page = 1; this.activities = [] }
      this.loading = true
      try {
        const params = { type: this.activeTab, page: this.page, size: 20 }
        if (this.keyword) params.keyword = this.keyword
        const res = await api.getActivities(params)
        if (res && res.code === 0) {
          const list = res.data?.list || []
          if (reset) this.activities = list
          else this.activities.push(...list)
          this.total = res.data?.total || 0
        }
      } catch (e) { console.error(e) }
      finally { this.loading = false }
    },
    async switchTab(key) { this.activeTab = key; await this.load() },
    async doSearch() { await this.load() },
    async loadMore() {
      if (!this.loading && this.activities.length < this.total) {
        this.page++; await this.load(false)
      }
    },
    goDetail(id) { uni.navigateTo({ url: `/pages/activity/detail?id=${id}` }) },
    signup(item) {
      if (this.isFull(item)) { uni.showToast({ title: '名额已满', icon: 'none' }); return }
      uni.navigateTo({ url: `/pages/activity/detail?id=${item.id}` })
    },
    isFull(item) { return item.quota > 0 && item.signup_count >= item.quota },
    typeLabel(type) {
      return { live: 'LIVE', closed: 'VIP', salon: '沙龙', camp: '训练营' }[type] || 'EVENT'
    },
    formatTime(t) {
      if (!t) return '时间待定'
      const s = t.replace('T', ' ')
      return s.substring(0, 16)
    }
  }
}
</script>

<style scoped>
.page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 56px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

/* Tab */
.tabs {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 16px;
}
.tab {
  padding: 12px 16px;
  font-size: 14px;
  color: #888;
  position: relative;
}
.tab.active {
  color: #fa5714;
  font-weight: 600;
}
.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: #fa5714;
  border-radius: 2px;
}

/* 搜索 */
.search-box {
  margin: 12px 16px;
  height: 36px;
  background: #f5f5f5;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 8px;
}
.search-icon-text { font-size: 12px; color: #999; }
.search-input { flex: 1; font-size: 14px; color: #333; height: 34px; }
.placeholder { color: #bbb; }

/* 列表 */
.list { padding: 8px 0 8px; }

/* 卡片 */
.card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 16px 12px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}

.card-cover {
  height: 140px;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px;
}
.card-cover-type {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,.9);
  background: rgba(0,0,0,.2);
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
}
.card-cover-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 14px 12px;
  background: linear-gradient(transparent, rgba(0,0,0,.5));
}
.card-cover-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  display: block;
}

.card-body { padding: 12px 14px; }
.card-meta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 10px; }
.meta-item { font-size: 12px; color: #888; }

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.signup-count { font-size: 12px; color: #aaa; }
.btn-wrap { flex-shrink: 0; }
.signup-btn {
  height: 30px;
  padding: 0 16px;
  background: #fa5714;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.signup-btn text { font-size: 13px; color: #fff; font-weight: 600; }
.signup-btn.disabled { background: #e0e0e0; }
.signup-btn.disabled text { color: #aaa; }

/* 状态 */
.loading, .load-end { padding: 20px 0; text-align: center; color: #aaa; font-size: 13px; }
.empty-state { padding: 60px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 40px; }
.empty-text { font-size: 14px; color: #aaa; }
</style>
