const privateConfig = require('../../config/index.js');

Page({
  data: {
    messages: [],
    inputValue: '',
    scrollTop: 0,
    isAIThinking: false,
    showFloatBtn: false,
    showBubble: true,
    bubbleText: '',
    floatBtnClass: '',
    floatIcon: '💬',
    bubbleTexts: [
      '点击我返回答题页面~',
      '有疑问随时可以问我！',
      '需要进一步讲解吗？',
      '想返回继续做题吗？',
      '有什么不懂的地方？',
      '我可以帮你分析解题思路',
      '需要复习哪个知识点？',
      '遇到难题了？我来帮你！',
      '点击悬浮球返回答题',
      '随时为你答疑解惑~',
      '还有什么想问的吗？',
      '需要我再讲一遍吗？'
    ]
  },

  onLoad: function(options) {
    this.checkAndSendQuestion();
  },

  onShow: function() {
    this.checkAndSendQuestion();
  },

  checkAndSendQuestion: function() {
    const storageData = wx.getStorageSync('aiQuestion');
    if (storageData) {
      wx.removeStorageSync('aiQuestion');
      try {
        const questionData = JSON.parse(decodeURIComponent(storageData));
        if (questionData && questionData.question) {
          this.setData({ 
            showFloatBtn: true,
            sourcePage: questionData.sourcePage,
            bubbleText: this.getRandomBubbleText()
          });
          
          // 启动悬浮球提示定时更新
          this.startBubbleTimer();
          
          if (questionData.autoSend) {
            // 将题目信息以AI回答的形式显示
            const questionText = questionData.question;
            this.addAIMessage(questionText);
            
            // 然后让AI继续分析这个问题
            setTimeout(() => {
              this.sendToAI(questionText);
            }, 800);
          }
        }
      } catch (e) {}
    }
  },

  startBubbleTimer: function() {
    // 清除之前的定时器
    if (this.bubbleTimer) {
      clearInterval(this.bubbleTimer);
    }
    // 每10秒更新一次提示
    this.bubbleTimer = setInterval(() => {
      if (this.data.showBubble && this.data.showFloatBtn) {
        this.setData({
          bubbleText: this.getRandomBubbleText()
        });
      }
    }, 10000);
  },

  stopBubbleTimer: function() {
    if (this.bubbleTimer) {
      clearInterval(this.bubbleTimer);
      this.bubbleTimer = null;
    }
  },

  sendToAI: function(questionText) {
    // 显示AI思考状态
    this.setData({ isAIThinking: true });

    // 调用中转API
    wx.request({
      url: privateConfig.chatApiUrl,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        question: questionText,
        apikey: privateConfig.chatApiKey,
        session_id: 'user_' + Date.now()
      },
      success: (res) => {
        this.setData({ isAIThinking: false });
        if (res.data && res.data.reply) {
          this.addAIMessage(res.data.reply);
        } else if (res.data && res.data.error) {
          this.addAIMessage('API错误：' + (res.data.error || '未知错误'));
        } else if (res.data && res.data.choices && res.data.choices[0]) {
          this.addAIMessage(res.data.choices[0].message.content);
        } else {
          this.addAIMessage('抱歉，小铭暂时不能回答你，请稍后重试。');
        }
      },
      fail: (err) => {
        this.setData({ isAIThinking: false });
        this.addAIMessage('网络连接失败，请检查网络后重试。错误信息：' + (err.errMsg || ''));
      }
    });
  },

  getRandomBubbleText: function() {
    const texts = this.data.bubbleTexts;
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
  },

  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  renderLatex: function(text) {
    if (!text) return '';
    
    // 处理特殊字符转义
    text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    
    // 先处理双重转义：把 \\\\ 转换为 \\
    text = text.replace(/\\\\/g, '\\');
    
    // 处理 \[...\] 块级公式
    const blockRegex = /\\\[([\s\S]*?)\\\]/g;
    text = text.replace(blockRegex, (match, formula) => {
      return '<div style="text-align:center;margin:16rpx 0;"><img src="https://latex.codecogs.com/svg.image?' + encodeURIComponent(formula.trim()) + '" style="max-width:100%;"/></div>';
    });
    
    // 处理 \(...\) 行内公式
    const inlineRegex = /\\\((.*?)\\\)/g;
    text = text.replace(inlineRegex, (match, formula) => {
      return '<img src="https://latex.codecogs.com/svg.image?' + encodeURIComponent(formula.trim()) + '" style="display:inline-block;vertical-align:middle;height:40rpx;"/>';
    });
    
    // 处理 $$...$$ 块级公式
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      return '<div style="text-align:center;margin:16rpx 0;"><img src="https://latex.codecogs.com/svg.image?' + encodeURIComponent(formula.trim()) + '" style="max-width:100%;"/></div>';
    });
    
    // 处理 $...$ 行内公式
    text = text.replace(/\$(.*?)\$/g, (match, formula) => {
      return '<img src="https://latex.codecogs.com/svg.image?' + encodeURIComponent(formula.trim()) + '" style="display:inline-block;vertical-align:middle;height:40rpx;"/>';
    });
    
    // 处理 $$...$$ 块级公式（跨行）
    text = text.replace(/\$\$\n([\s\S]*?)\n\$\$/g, (match, formula) => {
      return '<div style="text-align:center;margin:16rpx 0;"><img src="https://latex.codecogs.com/svg.image?' + encodeURIComponent(formula.trim()) + '" style="max-width:100%;"/></div>';
    });
    
    // 处理 \begin{bmatrix}...\end{bmatrix} 矩阵
    text = text.replace(/\\begin\{bmatrix\}([\s\S]*?)\\end\{bmatrix\}/g, (match, formula) => {
      return '<div style="text-align:center;margin:16rpx 0;"><img src="https://latex.codecogs.com/svg.image?\\begin{bmatrix}' + encodeURIComponent(formula.trim()) + '\\end{bmatrix}" style="max-width:100%;"/></div>';
    });
    
    // 处理 \begin{pmatrix}...\end{pmatrix} 矩阵
    text = text.replace(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g, (match, formula) => {
      return '<div style="text-align:center;margin:16rpx 0;"><img src="https://latex.codecogs.com/svg.image?\\begin{pmatrix}' + encodeURIComponent(formula.trim()) + '\\end{pmatrix}" style="max-width:100%;"/></div>';
    });
    
    // 处理换行
    text = text.replace(/\n/g, '<br/>');
    
    // 处理 Markdown 标题
    text = text.replace(/###\s+(.*)/g, '<strong style="font-size:32rpx;color:#1a73e8;display:block;margin:16rpx 0 8rpx 0;">$1</strong>');
    text = text.replace(/####\s+(.*)/g, '<strong style="font-size:28rpx;color:#1a73e8;display:block;margin:12rpx 0 6rpx 0;">$1</strong>');
    
    return text;
  },

  addAIMessage: function(content) {
    const renderedContent = this.renderLatex(content);
    const messages = this.data.messages;
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    messages.push({ type: 'ai', content: renderedContent, time: time });
    this.setData({ messages: messages, scrollTop: messages.length * 1000 });
  },

  addUserMessage: function(content) {
    const messages = this.data.messages;
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    messages.push({ type: 'user', content: content, time: time });
    this.setData({ messages: messages, scrollTop: messages.length * 1000 });
  },

  onInput: function(e) {
    this.setData({ inputValue: e.detail.value });
  },

  quickAsk: function(e) {
    const question = e.currentTarget.dataset.question;
    if (!question) return;

    this.setData({ inputValue: question }, () => {
      this.sendMessage();
    });
  },

  sendMessage: function() {
    const message = this.data.inputValue.trim();
    if (!message) return;

    this.addUserMessage(message);
    this.setData({ inputValue: '' });

    // 显示AI思考状态
    this.setData({ isAIThinking: true });

    // 调用中转API
    wx.request({
      url: privateConfig.chatApiUrl,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        question: message,
        apikey: privateConfig.chatApiKey,
        session_id: 'user_' + Date.now()
      },
      success: (res) => {
        this.setData({ isAIThinking: false });
        if (res.data && res.data.reply) {
          this.addAIMessage(res.data.reply);
        } else if (res.data && res.data.error) {
          this.addAIMessage('API错误：' + (res.data.error || '未知错误'));
        } else if (res.data && res.data.choices && res.data.choices[0]) {
          this.addAIMessage(res.data.choices[0].message.content);
        } else {
          this.addAIMessage('抱歉，小铭暂时不能回答你，请稍后重试。');
        }
      },
      fail: (err) => {
        this.setData({ isAIThinking: false });
        this.addAIMessage('网络连接失败，请检查网络后重试。错误信息：' + (err.errMsg || ''));
      }
    });
  },

  takePhoto: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        wx.showLoading({
          title: '正在识别图片...',
          mask: true
        });

        setTimeout(() => {
          wx.hideLoading();
          wx.showToast({
            title: '图片识别功能开发中',
            icon: 'none',
            duration: 2000
          });
        }, 1500);
      },
      fail: (res) => {
        wx.showToast({
          title: '拍照失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  onFloatBtnTouchStart: function(e) {
    this.isLongPress = false;
    this.setData({ floatBtnClass: 'active' });
    this.longPressTimer = setTimeout(() => {
      this.isLongPress = true;
      const newShowBubble = !this.data.showBubble;
      this.setData({
        floatIcon: '✨',
        showBubble: newShowBubble,
        bubbleText: newShowBubble ? this.getRandomBubbleText() : ''
      });
    }, 500);
  },

  onFloatBtnTouchEnd: function(e) {
    clearTimeout(this.longPressTimer);
    this.setData({
      floatBtnClass: '',
      floatIcon: '💬'
    });
  },

  onFloatBtnTap: function() {
    if (!this.isLongPress) {
      this.setData({ showBubble: false });
      const sourcePage = this.data.sourcePage;
      if (sourcePage === 'elementary-transform') {
        wx.reLaunch({
          url: '/pages/elementary-transform/practice'
        });
      } else if (sourcePage === 'linear-transform') {
        wx.reLaunch({
          url: '/pages/linear-transform/practice'
        });
      } else {
        wx.showToast({
          title: '点击发送按钮提问吧！',
          icon: 'none'
        });
      }
    }
  },

  getAIReply: function(question) {
    const q = question.toLowerCase();
    
    if (q.includes('线性变换')) {
      return '线性变换是线性代数中的核心概念，它是一种保持向量加法和标量乘法的映射。常见的线性变换包括：\n1. 旋转变换\n2. 反射变换\n3. 缩放变换\n4. 剪切变换';
    }
    if (q.includes('初等行变换') || q.includes('行变换')) {
      return '初等行变换有三种基本类型：\n1. 交换两行\n2. 某行乘以非零常数\n3. 一行加上另一行的倍数\n这些变换用于求矩阵的秩、解线性方程组等。';
    }
    if (q.includes('秩')) {
      return '矩阵的秩是线性代数中的重要概念：\n1. 秩 = 行秩 = 列秩\n2. 可通过初等行变换化为行阶梯形矩阵\n3. 非零行的个数即为秩\n4. 秩决定了线性方程组解的个数';
    }
    if (q.includes('行列式')) {
      return '行列式的计算方法：\n1. 2阶行列式：ad-bc\n2. 按行/列展开\n3. 使用初等变换化简后计算\n注意：行列式必须为方阵';
    }
    if (q.includes('逆矩阵')) {
      return '求逆矩阵的方法：\n1. 高斯-若尔当消元法\n2. 伴随矩阵法\n3. 分块矩阵法\n注意：只有方阵且行列式不为零时才有逆矩阵';
    }
    if (q.includes('矩阵') || q.includes('matrix')) {
      return '矩阵是线性代数中的基本概念，是由数排成的矩形阵列。常见的矩阵运算包括：\n1. 矩阵加法\n2. 数乘矩阵\n3. 矩阵乘法\n4. 转置矩阵\n5. 求逆矩阵';
    }
    if (q.includes('向量') || q.includes('vector')) {
      return '向量是线性代数中的基本概念，可以表示为有方向和大小的量。常见的向量运算包括：\n1. 向量加法\n2. 数乘向量\n3. 点积（内积）\n4. 叉积（外积）\n5. 向量的长度';
    }
    
    return '这个问题比较复杂，建议你查阅相关教材或咨询老师。也可以尝试：\n1. 线性变换练习\n2. 初等变换练习\n来加深理解。';
  },

  showEmoji: function() {
    wx.showToast({
      title: '表情功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  showAttachOptions: function() {
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择', '文件'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            wx.showToast({
              title: '拍照功能开发中',
              icon: 'none',
              duration: 2000
            });
            break;
          case 1:
            wx.showToast({
              title: '相册选择功能开发中',
              icon: 'none',
              duration: 2000
            });
            break;
          case 2:
            wx.showToast({
              title: '文件功能开发中',
              icon: 'none',
              duration: 2000
            });
            break;
        }
      }
    });
  },

  showMoreOptions: function() {
    wx.showActionSheet({
      itemList: ['分享', '反馈', '设置'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            wx.showToast({
              title: '分享功能开发中',
              icon: 'none',
              duration: 2000
            });
            break;
          case 1:
            wx.showToast({
              title: '反馈功能开发中',
              icon: 'none',
              duration: 2000
            });
            break;
          case 2:
            wx.showToast({
              title: '设置功能开发中',
              icon: 'none',
              duration: 2000
            });
            break;
        }
      }
    });
  }
});
