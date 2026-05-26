Page({
  data: {
    isShowModal: false,
    countdown: 0,
    timer: null,
    adVideoUrl: '',
    isVideoEnded: false,
    videoDuration: 0
  },

  onLoad() {
    const videos = [
      'https://www.w3schools.com/html/mov_bbb.mp4'
    ]
    const randomIndex = Math.floor(Math.random() * videos.length)
    const adVideoUrl = videos[randomIndex]
    this.setData({ adVideoUrl })
  },

  onVideoTimeUpdate(e) {
    const { currentTime, duration } = e.detail
    if (duration > 0) {
      const remaining = Math.ceil(duration - currentTime)
      this.setData({ countdown: remaining, videoDuration: duration })
    }
  },

  onVideoPlay() {
    console.log('视频开始播放')
  },

  onVideoError(e) {
    console.error('视频播放错误', e.detail)
  },

  onVideoEnded() {
    this.setData({ isVideoEnded: true })
    this.checkPrivacy()
  },

  skipCountdown() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
    this.setData({ isVideoEnded: true })
    this.checkPrivacy()
  },

  checkPrivacy() {
    const hasAgreedPrivacy = wx.getStorageSync('hasAgreedPrivacy')
    if (!hasAgreedPrivacy) {
      this.setData({ isShowModal: true })
    } else {
      this.goToHome()
    }
  },

  onAgree() {
    wx.setStorageSync('hasAgreedPrivacy', true)
    this.goToHome()
  },

  onRefuse() {
    wx.showModal({
      title: '提示',
      content: '您需要在同意隐私条款后才能使用小程序',
      showCancel: false,
      success: () => {
        this.setData({ isShowModal: true })
      }
    })
  },

  goToHome() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  }
})
