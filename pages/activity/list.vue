<template>
  <view class="page">
    <view class="header"><text class="title">活动</text></view>

    <scroll-view scroll-x class="tabs" :show-scrollbar="false">
      <view v-for="tab in tabs" :key="tab.key" class="tab" :class="{active: activeTab===tab.key}" @tap="switchTab(tab.key)">
        <text>{{ tab.label }}</text>
      </view>
    </scroll-view>

    <view class="search">
      <text class="search-icon">🔍</text>
      <input v-model="keyword" placeholder="搜索活动..." @confirm="doSearch" class="search-input" placeholder-class="ph" />
    </view>

    <scroll-view scroll-y class="list" @scrolltolower="loadMore" :show-scrollbar="false">
      <view v-if="loading && activities.length===0" class="empty"><text>加载中...</text></view>

      <view v-for="item in activities" :key="item.id" class="card" @tap="goDetail(item.id)">
        <view class="cover" :style="{background: item.gradient || 'linear-gradient(135deg,#ff6b35,#ff9a5c)'}">
          <text class="icon-text">{{ item.icon || 'LIVE' }}</text>
          <view class="cover-overlay">
            <text class="cover-title">{{ item.title }}</text>
          </view>
        </view>
        <view class="body">
          <view class="info-row">
            <text class="time">🕐 {{ formatTime(item.start_time) }}</text>
            <text class="loc">📍 {{ item.location }}</text>
          </view>
          <view class="info-row">
            <text class="count">已报名 {{ item.signup_count }} 人</text>
            <view class="quota-tag" v-if="item.quota > 0">
              <text>限额 {{ item.quota }}</text>
            </view>
          </view>
          <button class="btn" :class="{full: isFull(item)}" @tap.stop="signup(item)">
            {{ isFull(item) ? '名额已满' : '立即报名 →' }}
          </button>
        </view>
      </view>

      <view v-if="!loading && activities.length===0" class="empty"><text>暂无相关活动</text></view>
      <view v-if="activities.length>0 && activities.length>=total && total>0" class="end"><text>· 已全部加载 ·</text></view>
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
      tabs: [
        {key:'live', label:'🎙 直播'},
        {key:'closed', label:'🔒 闭门会'},
        {key:'salon', label:'☕ 线下沙龙'},
        {key:'camp', label:'🚀 训练营'}
      ]
    }
  },
  onLoad() { this.load() },
  methods: {
    async load(reset=true) {
      if(reset) { this.page=1; this.activities=[] }
      this.loading = true
      try {
        const params = { type: this.activeTab, page: this.page, size: 20 }
        if(this.keyword) params.keyword = this.keyword
        const res = await api.getActivities(params)
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
    async loadMore() {
      if(!this.loading && this.activities.length < this.total) {
        this.page++; await this.load(false)
      }
    },
    goDetail(id) { uni.navigateTo({url:`/pages/activity/detail?id=${id}`}) },
    signup(item) {
      if(this.isFull(item)) { uni.showToast({title:'名额已满',icon:'none'}); return }
      uni.navigateTo({url:`/pages/activity/detail?id=${item.id}`})
    },
    isFull(item) { return item.quota>0 && item.signup_count>=item.quota },
    formatTime(t) {
      if(!t) return '时间待定'
      return t.replace('T',' ').substring(0,16)
    }
  }
}
</script>

<style scoped>
.page { background: #f5f5f7; min-height: 100vh; }
.header { height: 54px; padding: 12px 16px; background: #fff; border-bottom: 0.5px solid #e5e7eb; display: flex; align-items: center; }
.title { font-size: 18px; font-weight: 800; color: #1a1a2e; }

.tabs { white-space: nowrap; padding: 10px 14px 6px; background: #fff; }
.tab { display: inline-flex; align-items: center; height: 34px; padding: 0 16px; margin-right: 8px; border-radius: 10px; background: #f3f4f6; color: #64748b; font-size: 13px; font-weight: 600; }
.tab.active { background: #ff6b35; color: #fff; }

.search { margin: 10px 14px; height: 42px; padding: 0 14px; border-radius: 10px; background: #fff; border: 0.5px solid #e5e7eb; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.04); }
.search-icon { font-size: 15px; }
.search-input { flex: 1; height: 40px; font-size: 14px; color: #1a1a2e; }
.ph { color: #c4c9d4; }

.list { height: calc(100vh - 54px - 56px - 62px); padding: 0 14px 20px; }

.card { background: #fff; border-radius: 14px; overflow: hidden; margin-bottom: 14px; box-shadow: 0 4px 16px rgba(0,0,0,.06); }
.cover { height: 130px; position: relative; display: flex; align-items: center; justify-content: center; }
.icon-text { font-size: 32px; font-weight: 900; color: rgba(255,255,255,.3); letter-spacing: 2px; }
.cover-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 14px; background: linear-gradient(transparent, rgba(0,0,0,.45)); }
.cover-title { color: #fff; font-size: 15px; font-weight: 700; line-height: 1.4; display: block; }

.body { padding: 12px 14px 14px; }
.info-row { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
.time { font-size: 12px; color: #6b7280; }
.loc { font-size: 12px; color: #6b7280; }
.count { font-size: 12px; color: #9ca3af; flex: 1; }
.quota-tag { padding: 2px 8px; background: #fff7ed; border-radius: 4px; }
.quota-tag text { font-size: 11px; color: #ff6b35; }

.btn { display: flex; align-items: center; justify-content: center; width: 100%; height: 40px; margin-top: 10px; border-radius: 10px; background: linear-gradient(135deg, #ff6b35, #ff8b5f); color: #fff; font-size: 14px; font-weight: 700; border: none; }
.btn.full { background: #f3f4f6; color: #9ca3af; }

.empty { padding: 40px 0; text-align: center; color: #9ca3af; font-size: 14px; }
.end { padding: 16px 0; text-align: center; color: #c4c9d4; font-size: 12px; }
</style>
