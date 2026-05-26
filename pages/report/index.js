Page({
  data: {
    totalPractice: 5,
    correctRate: 80,
    wrongCount: 1,
    consecutiveDays: 2,
    wrongQuestions: [
      {
        id: 1,
        type: '线性变换练习',
        question: '已知矩阵 A = [[1, 2], [3, 4]]，求其特征值和对应的特征向量。',
        time: '今天 14:30',
        status: '未复习'
      }
    ]
  },

  onLoad: function() {
    this.loadPracticeData();
  },

  onShow: function() {
    this.loadPracticeData();
  },

  loadPracticeData: function() {
    // 这里可以从本地存储或后端API获取真实数据
    // 目前使用模拟数据
    console.log('加载练习数据');
    
    // 模拟从本地存储获取数据
    const practiceData = wx.getStorageSync('practiceData');
    
    // 如果有本地存储数据，使用本地存储数据；否则使用默认数据
    if (practiceData) {
      this.setData({
        totalPractice: practiceData.totalPractice || 0,
        correctRate: practiceData.correctRate || 0,
        wrongCount: practiceData.wrongCount || 0,
        consecutiveDays: practiceData.consecutiveDays || 0,
        wrongQuestions: practiceData.wrongQuestions || []
      });
    }
  },

  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 可以添加更多功能，比如：
  // 1. 查看详细练习记录
  // 2. 导出报告
  // 3. 分享成绩
  // 4. 查看历史趋势



  // 导出报告
  exportReport: function() {
    wx.showToast({
      title: '导出功能开发中',
      icon: 'none'
    });
  },

  // 分享成绩
  shareScore: function() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  // 重做错题
  redoQuestion: function(e) {
    const questionId = e.currentTarget.dataset.id;
    const questionType = e.currentTarget.dataset.type;
    
    console.log('重做错题:', questionId, questionType);
    
    // 根据错题类型跳转到对应练习页面
    if (questionType.indexOf('线性变换') !== -1) {
      wx.navigateTo({
        url: '/pages/linear-transform/practice?questionId=' + questionId
      });
    } else if (questionType.indexOf('初等变换') !== -1) {
      wx.navigateTo({
        url: '/pages/elementary-transform/practice?questionId=' + questionId
      });
    } else {
      wx.showToast({
        title: '暂不支持该类型题目重做',
        icon: 'none'
      });
    }
  },

  // 跳转到首页
  goToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
