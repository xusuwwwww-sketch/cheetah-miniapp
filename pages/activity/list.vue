<template>
  <view class="page">
    <view class="header"><text class="title">活动</text></view>

    <!-- Tab -->
    <scroll-view scroll-x class="tabs">
      <view v-for="tab in tabs" :key="tab.key" class="tab" :class="{active: activeTab===tab.key}" @tap="switchTab(tab.key)">
        <text>{{ tab.label }}</text>
      </view>
    </scroll-view>

    <!-- 搜索 -->
    <view class="search">
      <text>🔍 </text>
      <input v-model="keyword" placeholder="搜索活动..." @confirm="doSearch" class="search-input" placeholder-class="ph" />
    </view>

    <!-- 列表 -->
    <scroll-view scroll-y class="list" @scrolltolower="loadMore">
      <view v-if="loading && activities.length===0" class="empty"><text>加载中...</text></view>
      <view v-for="item in activities" :key="item.id" class="card" @tap="goDetail(item.id)">
        <view class="cover" :style="{background: item.gradient||'linear-gradient(135deg,#ff6b35,#ff9a5c)'}">
          <text class="cover-text">{{ item.icon||'LIVE' }}</text>
        </view>
        <view class="body">
          <text class="card-title">{{ item.title }}</text>
          <view class="meta">
            <text>{{ formatTime(item.start_time) }}</text>
            <text>{{ item.location }}</text>
            <text>已报{{ item.signup_count }}</text>
          </view>
          <button class="btn" :class="{outline: isFull(item)}" @tap.stop="signup(item)">
            {{ isFull(item) ? '已满额' : '立即报名' }}
          </button>
        </view>
      </view>
      <view v-if="!loading && activities.length===0" class="empty"><text>暂无活动</text></view>
      <view v-if="activities.length>0 && activities.length>=total" class="empty"><text>已全部加载</text></view>
    </scroll-view>
  </view>
</template>

<script>
import { api } from '../../utils/api.js'
export default {
  data() {
    return {
      activeTab: 'live', keyword: '',
      loading: false, activities: [], page: 1, total: 0,
      tabs: [{key:'live',label:'直播'},{key:'closed',label:'闭门会'},{key:'salon',label:'线下沙龙'},{key:'camp',label:'训练营'}]
    }
  },
  onLoad() { this.load() },
  onShow() { if(this.activities.length===0) this.load() },
  methods: {
    async load(reset=true) {
      if(reset) { this.page=1; this.activities=[] }
      this.loading = true
      try {
        const res = await api.getActivities({ type: this.activeTab, keyword: this.keyword, page: this.page, size: 20 })
        console.log('活动API响应:', JSON.stringify(res))
        if(res && res.code===0) {
          const list = res.data?.list || []
          if(reset) this.activities = list
          else this.activities.push(...list)
          this.total = res.data?.total || 0
        }
      } catch(e) { console.error('活动加载失败:', e) }
      finally { this.loading=false }
    },
    async switchTab(key) { this.activeTab=key; await this.load() },
    async doSearch() { await this.load() },
    async loadMore() { if(this.activities.length < this.total) { this.page++; await this.load(false) } },
    goDetail(id) { uni.navigateTo({url:`/pages/activity/detail?id=${id}`}) },
    signup(item) {
      if(this.isFull(item)) { uni.showToast({title:'名额已满',icon:'none'}); return }
      uni.navigateTo({url:`/pages/activity/detail?id=${item.id}`})
    },
    isFull(item) { return item.quota>0 && item.signup_count>=item.quota },
    formatTime(t) { return t ? t.replace('T',' ').substring(0,16) : '' }
  }
}
</script>

<style scoped>
.page { background: #f6f7fb; min-height: 100vh; display: flex; flex-direction: column; }
.header { height: 54px; padding: 12px 16px; background: #fff; border-bottom: 0.5px solid #e5e7eb; display: flex; align-items: center; }
.title { font-size: 17px; font-weight: 700; color: #1a1a2e; }
.tabs { white-space: nowrap; padding: 8px 14px; background: #f6f7fb; flex-shrink: 0; }
.tab { display: inline-flex; align-items: center; height: 30px; padding: 0 16px; margin-right: 8px; border-radius: 8px; background: #fff; border: 0.5px solid #e5e7eb; font-size: 13px; color: #64748b; font-weight: 600; }
.tab.active { background: #ff6b35; color: #fff; border-color: #ff6b35; }
.search { margin: 8px 14px 10px; height: 40px; padding: 0 12px; border-radius: 8px; background: #fff; border: 0.5px solid #e5e7eb; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.search-input { flex: 1; height: 38px; font-size: 14px; color: #1a1a2e; }
.ph { color: #9ca3af; }
.list { flex: 1; padding: 0 14px 80px; }
.card { background: #fff; border-radius: 8px; overflow: hidden; border: 0.5px solid #e5e7eb; margin-bottom: 10px; }
.cover { height: 110px; display: flex; align-items: center; justify-content: center; }
.cover-text { font-size: 22px; font-weight: 800; color: #fff; }
.body { padding: 12px 13px; }
.card-title { display: block; font-size: 14px; font-weight: 600; color: #1a1a2e; line-height: 1.5; }
.meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; color: #9ca3af; font-size: 11px; }
.btn { display: inline-flex; align-items: center; justify-content: center; height: 30px; padding: 0 18px; margin-top: 10px; border-radius: 999px; background: #ff6b35; color: #fff; font-size: 13px; font-weight: 700; border: none; }
.btn.outline { background: transparent; border: 1.5px solid #ff6b35; color: #ff6b35; }
.empty { padding: 30px 0; text-align: center; color: #9ca3af; font-size: 14px; }
</style>
