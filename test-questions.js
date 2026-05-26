// 生成测试题目数据
const testQuestions = [
  {
    id: '1',
    type: '线性变换-2D',
    difficulty: '简单',
    authorName: '***',
    authorEmail: '***@***.***',
    content: '求将向量 (1, 0) 变换为 (2, 3) 的线性变换矩阵',
    answer: '[[2, 3], [0, 0]]',
    createTime: new Date().toLocaleString()
  },
  {
    id: '2',
    type: '线性变换-3D',
    difficulty: '中等',
    authorName: '***',
    authorEmail: '***@***.***',
    content: '求绕x轴旋转90度的旋转矩阵',
    answer: '[[1, 0, 0], [0, 0, -1], [0, 1, 0]]',
    createTime: new Date().toLocaleString()
  },
  {
    id: '3',
    type: '初等变换',
    difficulty: '困难',
    authorName: '***',
    authorEmail: '***@***.***',
    content: '将矩阵 [[1, 2], [3, 4]] 化为行最简形',
    answer: '行最简形为 [[1, 0], [0, 1]]',
    createTime: new Date().toLocaleString()
  }
];

// 保存到本地存储
wx.setStorageSync('questionSubmissions', testQuestions);
console.log('测试题目已生成');
console.log('共生成', testQuestions.length, '道题目');