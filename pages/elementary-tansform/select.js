Page({
  data: {
    matrixSize: 3,
    target: 'echelon',
    targets: [
      { id: 'echelon', name: '行阶梯形', desc: '化简为行阶梯形矩阵' },
      { id: 'reduced', name: '行最简形', desc: '化简为行最简形矩阵' }
    ],
    sizes: [2, 3, 4]
  },

  onLoad: function() {},

  goBack: function() {
    wx.navigateBack();
  },

  selectSize: function(e) {
    const size = parseInt(e.currentTarget.dataset.size);
    this.setData({ matrixSize: size });
  },

  selectTarget: function(e) {
    const target = e.currentTarget.dataset.target;
    this.setData({ target: target });
  },

  startPractice: function() {
    const { matrixSize, target } = this.data;
    wx.navigateTo({
      url: `/pages/elementary-transform/practice?size=${matrixSize}&target=${target}`
    });
  }
});