const privateConfig = require('../../config/index.js');

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    showLoginModal: false,
    showQuestionModal: false,
    questionTypes: ['线性变换-2D', '线性变换-3D', '初等变换'],
    questionTypeIndex: 0,
    difficultyLevels: ['简单', '中等', '困难'],
    difficultyIndex: 0,
    authorName: '',
    authorEmail: '',
    questionContent: '',
    questionAnswer: ''
  },

  onLoad: function() {
    this.checkLoginStatus();
  },

  onShow: function() {
    this.checkLoginStatus();
  },

  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.isLoggedIn) {
      this.setData({
        isLoggedIn: true,
        userInfo: userInfo
      });
    } else {
      this.setData({
        isLoggedIn: false,
        userInfo: null
      });
    }
  },

  toggleLoginModal: function() {
    if (this.data.isLoggedIn) {
      this.handleLogout();
      return;
    }
    this.setData({
      showLoginModal: !this.data.showLoginModal
    });
  },

  toggleQuestionModal: function() {
    wx.navigateTo({
      url: '/pages/contribute/index'
    });
  },



  onQuestionTypeChange: function(e) {
    this.setData({ questionTypeIndex: e.detail.value });
  },

  onDifficultyChange: function(e) {
    this.setData({ difficultyIndex: e.detail.value });
  },

  wechatLogin: function() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = {
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          gender: res.userInfo.gender,
          country: res.userInfo.country,
          province: res.userInfo.province,
          city: res.userInfo.city,
          isLoggedIn: true,
          loginType: 'wechat'
        };
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          isLoggedIn: true,
          userInfo: userInfo,
          showLoginModal: false
        });
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '授权失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  phoneLogin: function() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.showModal({
            title: '手机号登录',
            content: '即将获取您的手机号',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.getPhoneNumber({
                  code: res.code,
                  success: (phoneRes) => {
                    const userInfo = {
                      nickName: '手机用户',
                      avatarUrl: '',
                      phoneNumber: phoneRes.phoneNumber,
                      isLoggedIn: true,
                      loginType: 'phone'
                    };
                    wx.setStorageSync('userInfo', userInfo);
                    this.setData({
                      isLoggedIn: true,
                      userInfo: userInfo,
                      showLoginModal: false
                    });
                    wx.showToast({
                      title: '登录成功',
                      icon: 'success'
                    });
                  },
                  fail: (err) => {
                    wx.showToast({
                      title: '获取手机号失败',
                      icon: 'none'
                    });
                  }
                });
              }
            }
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  onAuthorNameInput: function(e) {
    this.setData({ authorName: e.detail.value });
  },

  onAuthorEmailInput: function(e) {
    this.setData({ authorEmail: e.detail.value });
  },

  onQuestionContentInput: function(e) {
    this.setData({ questionContent: e.detail.value });
  },

  onQuestionAnswerInput: function(e) {
    this.setData({ questionAnswer: e.detail.value });
  },

  handleSubmit: function() {
    const { account, password, confirmPassword, loginType } = this.data;

    if (!account || !password) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (loginType === 'register' && password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      });
      return;
    }

    if (loginType === 'register') {
      const users = wx.getStorageSync('users') || [];
      const exists = users.some(u => u.account === account);
      if (exists) {
        wx.showToast({
          title: '账号已存在',
          icon: 'none'
        });
        return;
      }
      users.push({ account, password });
      wx.setStorageSync('users', users);
    } else {
      const users = wx.getStorageSync('users') || [];
      const user = users.find(u => u.account === account && u.password === password);
      if (!user) {
        wx.showToast({
          title: '账号或密码错误',
          icon: 'none'
        });
        return;
      }
    }

    const userInfo = {
      account: account,
      nickName: account,
      isLoggedIn: true
    };
    wx.setStorageSync('userInfo', userInfo);

    this.setData({
      isLoggedIn: true,
      userInfo: userInfo,
      showLoginModal: false
    });

    wx.showToast({
      title: loginType === 'login' ? '登录成功' : '注册成功',
      icon: 'success'
    });
  },

  handleLogout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const userInfo = wx.getStorageSync('userInfo') || {};
          userInfo.isLoggedIn = false;
          wx.setStorageSync('userInfo', userInfo);
          this.setData({
            isLoggedIn: false,
            userInfo: null
          });
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  handleSubmitQuestion: function() {
    const { authorName, authorEmail, questionContent, questionAnswer, questionTypes, questionTypeIndex, difficultyLevels, difficultyIndex } = this.data;

    if (!authorName || !authorEmail || !questionContent || !questionAnswer) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      wx.showToast({
        title: '请输入有效的邮箱地址',
        icon: 'none'
      });
      return;
    }

    const submissions = wx.getStorageSync('questionSubmissions') || [];
    submissions.unshift({
      id: Date.now().toString(),
      type: questionTypes[questionTypeIndex],
      difficulty: difficultyLevels[difficultyIndex],
      authorName: authorName,
      authorEmail: authorEmail,
      content: questionContent,
      answer: questionAnswer,
      createTime: new Date().toLocaleString()
    });
    wx.setStorageSync('questionSubmissions', submissions);

    this.setData({
      showQuestionModal: false,
      authorName: '',
      authorEmail: '',
      questionContent: '',
      questionAnswer: '',
      questionTypeIndex: 0,
      difficultyIndex: 0
    });

    wx.showToast({
      title: '提交成功',
      icon: 'success'
    });
  },

  showAboutUs: function() {
    wx.showModal({
      title: '关于我们',
      content: '线性代数练习是一款专注于线性代数学习的微信小程序。\n\n我们致力于为学生提供优质的线性代数学习体验，通过互动练习和AI答疑帮助用户更好地掌握线性代数的核心概念。\n\n版本：v1.0.0',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  showHelpCenter: function() {
    wx.showModal({
      title: '帮助中心',
      content: '【线性变换】\n1. 选择维度和难度\n2. 根据图形输入对应的变换矩阵\n3. 点击提交查看答案\n\n【初等变换】\n1. 选择矩阵大小和目标类型\n2. 选择初等变换类型\n3. 输入倍数并执行操作\n4. 点击检查完成\n\n如有其他问题，请联系我们。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  showPrivacyPolicy: function() {
    wx.showModal({
      title: '隐私政策',
      content: '【信息收集】\n我们仅收集您在使用小程序过程中主动提交的信息，包括：\n- 账号信息（仅用于登录功能）\n- 题目投稿内容\n\n【信息使用】\n- 您的账号信息仅用于身份验证\n- 题目投稿将经过审核后加入题库\n\n【信息保护】\n我们承诺保护您的个人信息安全，不会将您的信息泄露给第三方。\n\n如有任何疑问，请联系我们。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  showUserAgreement: function() {
    wx.showModal({
      title: '用户协议',
      content: '【服务说明】\n线性代数练习小程序所有权归开发者所有，仅供学习交流使用。\n\n【使用规范】\n1. 请勿使用本小程序进行任何违法活动\n2. 请勿恶意提交无效或重复的题目\n3. 请尊重其他用户，文明交流\n\n【免责声明】\n本小程序仅供学习参考，不对其内容的准确性做任何保证。使用本小程序即表示您同意本协议。\n\n如有争议，最终解释权归开发者所有。',
      showCancel: false,
      confirmText: '同意'
    });
  },

  checkForUpdate: function() {
    wx.showToast({
      title: '已是最新版本',
      icon: 'success',
      duration: 2000
    });
  },

  contactUs: function() {
    wx.showModal({
      title: '联系我们',
      content: '如有任何问题或建议，欢迎通过以下方式联系我们：\n\n邮箱：' + privateConfig.contactEmail + '\n\n我们将在收到反馈后尽快回复您。\n\n感谢您的支持！',
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
