const MATRIX = require('./utils/matrix.js');
const LinearTransform = require('./utils/linear-transform.js');
const ElementaryTransform = require('./utils/elementary-transform.js');
const QuestionBank = require('./utils/question-bank.js');
const Validator = require('./utils/validator.js');
const Drawing2D = require('./utils/drawing-2d.js');
const Drawing3D = require('./utils/drawing-3d.js');

App({
  globalData: {
    userInfo: null,
    wrongQuestions: []
  },

  onLaunch() {
    this.loadUserData();
  },

  loadUserData: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
    const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
    this.globalData.wrongQuestions = wrongQuestions;
  },

  saveUserInfo: function(userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  },

  addWrongQuestion: function(question, userAnswer, type) {
    const wrongEntry = {
      id: Date.now(),
      type: type,
      question: question,
      userAnswer: userAnswer,
      createTime: new Date().toISOString()
    };
    this.globalData.wrongQuestions.push(wrongEntry);
    wx.setStorageSync('wrongQuestions', this.globalData.wrongQuestions);
  },

  removeWrongQuestion: function(id) {
    this.globalData.wrongQuestions = this.globalData.wrongQuestions.filter(q => q.id !== id);
    wx.setStorageSync('wrongQuestions', this.globalData.wrongQuestions);
  },

  clearWrongQuestions: function() {
    this.globalData.wrongQuestions = [];
    wx.removeStorageSync('wrongQuestions');
  },

  getWrongCount: function() {
    return this.globalData.wrongQuestions.length;
  }
});