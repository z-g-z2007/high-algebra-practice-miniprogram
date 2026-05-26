Component({
  methods: {
    switchTab0() {
      wx.switchTab({ url: '/pages/index/index' })
    },
    switchTab1() {
      wx.switchTab({ url: '/pages/ai-assistant/index' })
    },
    switchTab2() {
      wx.switchTab({ url: '/pages/question-bank/index' })
    },
    switchTab3() {
      wx.switchTab({ url: '/pages/profile/index' })
    }
  }
})
