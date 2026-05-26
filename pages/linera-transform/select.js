Page({
  data: {
    dimension: 2,
    difficulty: 'easy',
    questionTypes: [
      { id: 'rotation', name: '旋转变换', icon: '⟳' },
      { id: 'reflection', name: '反射变换', icon: '↔' },
      { id: 'scaling', name: '缩放变换', icon: '⤢' },
      { id: 'shear', name: '剪切变换', icon: '⤡' },
      { id: 'projection', name: '投影变换', icon: '⤾' }
    ],
    difficulties: [
      { id: 'easy', name: '简单', color: '#27ae60' },
      { id: 'medium', name: '中等', color: '#f39c12' },
      { id: 'hard', name: '困难', color: '#e74c3c' }
    ]
  },

  onLoad: function() {},

  goBack: function() {
    wx.navigateBack();
  },

  selectDimension: function(e) {
    const dimension = parseInt(e.currentTarget.dataset.dimension);
    this.setData({ dimension: dimension });
  },

  selectDifficulty: function(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    this.setData({ difficulty: difficulty });
  },

  startPractice: function() {
    const { dimension, difficulty } = this.data;
    wx.navigateTo({
      url: `/pages/linear-transform/practice?dimension=${dimension}&difficulty=${difficulty}`
    });
  },

  showReference: function() {
    const content2d = `【旋转变换】逆时针旋转θ度
公式：x' = x·cosθ - y·sinθ
      y' = x·sinθ + y·cosθ
矩阵：[ cosθ  -sinθ ]
     [ sinθ   cosθ ]
例子：旋转90°(θ=π/2)
     [ 0  -1 ]
     [ 1   0 ]

【反射变换】关于某条直线的对称

关于X轴对称：
     [ 1   0 ]
     [ 0  -1 ]
例子：(1,2)→(1,-2)

关于Y轴对称：
     [-1   0 ]
     [ 0   1 ]
例子：(1,2)→(-1,2)

关于y=x对称：
     [ 0   1 ]
     [ 1   0 ]
例子：(1,2)→(2,1)

关于y=-x对称：
     [ 0  -1 ]
     [-1   0 ]
例子：(1,2)→(-2,-1)

【缩放变换】在x,y方向分别缩放

     [ sx   0 ]
     [  0  sy ]
sx=x方向缩放倍数
sy=y方向缩放倍数
例子：sx=2,sy=3
     (1,2)→(2,6)

【剪切变换】水平方向偏移

     [ 1   k ]
     [ 0   1 ]
k=水平偏移系数
x' = x + k·y
例子：k=0.5
     (2,1)→(2.5,1)

【投影变换】投影到某直线

投影到X轴：
     [ 1   0 ]
     [ 0   0 ]
例子：(3,4)→(3,0)

投影到Y轴：
     [ 0   0 ]
     [ 0   1 ]
例子：(3,4)→(0,4)`;

    const content3d = `【三维旋转变换】

绕X轴逆时针旋转θ：
[ 1    0      0   ]
[ 0   cosθ  -sinθ ]
[ 0   sinθ   cosθ ]

绕Y轴逆时针旋转θ：
[ cosθ   0   sinθ ]
[  0      1     0   ]
[-sinθ   0   cosθ ]

绕Z轴逆时针旋转θ：
[ cosθ  -sinθ   0 ]
[ sinθ   cosθ   0 ]
[  0      0      1 ]

【三维反射变换】

关于XY平面反射：
[ 1   0   0 ]
[ 0   1   0 ]
[ 0   0  -1 ]

关于XZ平面反射：
[ 1   0   0 ]
[ 0  -1   0 ]
[ 0   0   1 ]

关于YZ平面反射：
[-1   0   0 ]
[ 0   1   0 ]
[ 0   0   1 ]

【三维缩放变换】

     [ sx   0    0  ]
     [  0  sy    0  ]
     [  0   0   sz  ]

sx,sy,sz为x,y,z方向的缩放倍数`;

    wx.showModal({
      title: '变换矩阵参考手册',
      content: content2d,
      showCancel: true,
      cancelText: '三维',
      confirmText: '关闭',
      success: (res) => {
        if (res.cancel) {
          wx.showModal({
            title: '三维变换矩阵',
            content: content3d,
            showCancel: true,
            cancelText: '二维',
            confirmText: '关闭',
            success: (res2) => {
              if (res2.cancel) {
                this.showReference();
              }
            }
          });
        }
      }
    });
  }
});