Page({
  data: {
    questions: [],
    questionTypes: ['全部', '线性变换-2D', '线性变换-3D', '初等变换'],
    difficultyLevels: ['全部', '简单', '中等', '困难'],
    typeIndex: 0,
    difficultyIndex: 0,
    showAnswerModal: false,
    selectedQuestion: null
  },

  onLoad: function() {
    this.loadAllQuestions();
  },

  onShow: function() {
    this.loadAllQuestions();
  },

  loadAllQuestions: function() {
    // 加载用户投稿题目
    const submissions = wx.getStorageSync('questionSubmissions') || [];
    
    // 加载系统预设题目
    const privateConfig = require('../../config/index.js');
const QuestionBank = require('../../utils/question-bank.js');
    const systemQuestions = this.convertSystemQuestions(QuestionBank);
    
    // 合并所有题目
    const allQuestions = submissions.concat(systemQuestions);
    this.setData({ questions: allQuestions });
  },

  convertSystemQuestions: function(QuestionBank) {
    const systemQuestions = [];
    const levelMap = { 'easy': '简单', 'medium': '中等', 'hard': '困难' };
    
    // 转换线性变换-2D题目
    if (QuestionBank.linear2D) {
      Object.keys(QuestionBank.linear2D).forEach(diffKey => {
        const questions = QuestionBank.linear2D[diffKey];
        if (Array.isArray(questions)) {
          questions.forEach(q => {
            systemQuestions.push({
              id: q.id,
              type: '线性变换-2D',
              difficulty: levelMap[q.difficulty] || q.difficulty || '简单',
              authorName: privateConfig.defaultAuthorName,
              authorEmail: '',
              content: q.description,
              answer: JSON.stringify(q.matrix),
              createTime: '系统预设',
              systemQuestion: true,
              originalVector: q.originalVector,
              expectedVector: q.expectedVector,
              matrix: q.matrix
            });
          });
        }
      });
    }
    
    // 转换线性变换-3D题目
    if (QuestionBank.linear3D) {
      Object.keys(QuestionBank.linear3D).forEach(diffKey => {
        const questions = QuestionBank.linear3D[diffKey];
        if (Array.isArray(questions)) {
          questions.forEach(q => {
            systemQuestions.push({
              id: q.id,
              type: '线性变换-3D',
              difficulty: levelMap[q.difficulty] || q.difficulty || '简单',
              authorName: privateConfig.defaultAuthorName,
              authorEmail: '',
              content: q.description,
              answer: JSON.stringify(q.matrix),
              createTime: '系统预设',
              systemQuestion: true,
              originalVector: q.originalVector,
              expectedVector: q.expectedVector,
              matrix: q.matrix
            });
          });
        }
      });
    }
    
    // 转换初等变换题目
    if (QuestionBank.elementary) {
      ['size2', 'size3', 'size4'].forEach(sizeKey => {
        if (QuestionBank.elementary[sizeKey]) {
          QuestionBank.elementary[sizeKey].forEach(q => {
            systemQuestions.push({
              id: q.id,
              type: '初等变换',
              difficulty: levelMap[q.difficulty] || q.difficulty || '中等',
              authorName: privateConfig.defaultAuthorName,
              authorEmail: '',
              content: q.description,
              answer: q.target,
              createTime: '系统预设',
              systemQuestion: true
            });
          });
        }
      });
    }
    
    return systemQuestions;
  },

  onTypeChange: function(e) {
    this.setData({ typeIndex: e.detail.value });
  },

  onDifficultyChange: function(e) {
    this.setData({ difficultyIndex: e.detail.value });
  },

  getDifficultyColor: function(difficulty) {
    switch(difficulty) {
      case '简单': return '#10b981';
      case '中等': return '#f59e0b';
      case '困难': return '#ef4444';
      default: return '#6b7280';
    }
  },

  viewAnswer: function(e) {
    const question = e.currentTarget.dataset.question;
    this.setData({
      showAnswerModal: true,
      selectedQuestion: question
    });
  },

  toggleAnswerModal: function() {
    this.setData({ showAnswerModal: false, selectedQuestion: null });
  },

  deleteQuestion: function(e) {
    const id = e.currentTarget.dataset.id;
    const questions = this.data.questions;
    const index = questions.findIndex(q => q.id === id);
    
    if (index !== -1 && !questions[index].systemQuestion) {
      wx.showModal({
        title: '删除确认',
        content: '确定要删除这道题目吗？',
        success: (res) => {
          if (res.confirm) {
            // 从本地存储中删除
            const submissions = wx.getStorageSync('questionSubmissions') || [];
            const subIndex = submissions.findIndex(s => s.id === id);
            if (subIndex !== -1) {
              submissions.splice(subIndex, 1);
              wx.setStorageSync('questionSubmissions', submissions);
            }
            
            // 从页面数据中删除
            questions.splice(index, 1);
            this.setData({ questions: questions });
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
        }
      });
    }
  },

  startPractice: function(e) {
    const question = e.currentTarget.dataset.question;
    
    if (question.type.includes('线性变换')) {
      const dimension = question.type.includes('2D') ? 2 : 3;
      wx.navigateTo({
        url: `/pages/linear-transform/practice?questionId=${question.id}&dimension=${dimension}`
      });
    } else if (question.type === '初等变换') {
      wx.navigateTo({
        url: `/pages/elementary-transform/practice?questionId=${question.id}`
      });
    }
  },

  goToContribute: function() {
    wx.navigateTo({
      url: '/pages/contribute/index'
    });
  }
});
