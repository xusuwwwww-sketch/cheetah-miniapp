Component({
  data: { active: 0 },
  methods: {
    switchTab(e) {
      const idx = e.currentTarget.dataset.index
      const list = [
        '/pages/index/index',
        '/pages/activity/list',
        '/pages/material/list',
        '/pages/profile/index'
      ]
      this.setData({ active: idx })
      wx.switchTab({ url: list[idx] })
    }
  }
})
