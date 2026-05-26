const QuestionBank = require('../../utils/question-bank.js');
const Drawing2D = require('../../utils/drawing-2d.js');
const Drawing3D = require('../../utils/drawing-3d.js');

Page({
  data: {
    dimension: 2,
    difficulty: 'easy',
    question: null,
    userAnswer: [],
    showResult: false,
    isCorrect: false,
    showHint: false,
    canvasWidth: 300,
    canvasHeight: 300,
    transformedVector: null,
    canvas2D: null,
    canvas3D: null,
    showKeyboard: false,
    selectedRow: -1,
    selectedCol: -1,
    keyboardStepField: '',
    keyboardTitle: '',
    keyboardValue: '',
    showCalcProcess: false,
    calculationSteps: [],
    userCalcProcess: '',
    showAnswerModal: false,
    answerMatrix: [],
    answerResult: [],
    calcInputs: {
      a11: '',
      a12: '',
      a13: '',
      a21: '',
      a22: '',
      a23: '',
      a31: '',
      a32: '',
      a33: '',
      v1_row1: '',
      v2_row1: '',
      v3_row1: '',
      v1_row2: '',
      v2_row2: '',
      v3_row2: '',
      v1_row3: '',
      v2_row3: '',
      v3_row3: '',
      row1_result: '',
      row2_result: '',
      row3_result: '',
      result_x: '',
      result_y: '',
      result_z: ''
    },
    showBubble: true,
    bubbleText: '',
    floatBtnClass: '',
    floatIcon: '💬',
    currentStatus: 'normal',
    bubbleTexts: {
      normal: [
        '有什么问题想问我吗？',
        '需要我帮你解答吗？',
        '遇到困难了？我可以帮忙！',
        '随时为你解答疑惑~',
        '有不懂的地方可以问我哦！',
        '准备好提问了吗？',
        '我在这里随时待命！',
        '有什么我能帮到你的？',
        '需要老师帮忙讲解吗？',
        '遇到难题了？一起来看看！'
      ],
      error: [
        '发现错误答案，点击我获取帮助！',
        '有答案做错了，需要讲解吗？',
        '这里好像有问题，让我来帮你分析！',
        '出错了？点击获取详细解答~',
        '答案不太对，我来帮你指正！',
        '遇到困难了？我来帮你梳理思路！'
      ],
      warning: [
        '还有空格没填哦！',
        '继续加油，还差一点！',
        '快完成了，再检查一下吧！',
        '接近目标了，继续努力！',
        '离正确答案只差一点点！'
      ],
      success: [
        '太棒了！完成啦！',
        '做得非常好！',
        '恭喜你完成了！',
        '完美！继续保持！',
        '太厉害了！全部正确！'
      ]
    }
  },

  onLoad: function(options) {
    const { dimension, difficulty, questionId } = options;
    this.setData({
      dimension: parseInt(dimension) || 2,
      difficulty: difficulty || 'easy'
    });
    
    this.initCanvas();
    
    if (questionId) {
      this.loadSpecificQuestion(questionId);
    } else {
      this.generateQuestion();
    }
  },

  loadSpecificQuestion: function(questionId) {
    let foundQuestion = null;

    // 如果是用户投稿的题目（以sub_开头）
    if (questionId.startsWith('sub_')) {
      const submissions = wx.getStorageSync('questionSubmissions') || [];
      foundQuestion = submissions.find(item => item.id === questionId);
      if (foundQuestion) {
        const dimension = foundQuestion.type.includes('2D') ? 2 : 3;
        this.setData({ dimension: dimension });
      }
    }

    // 搜索线性变换-2D题目
    if (!foundQuestion && QuestionBank.linear2D) {
      for (let diff in QuestionBank.linear2D) {
        if (QuestionBank.linear2D[diff]) {
          const q = QuestionBank.linear2D[diff].find(item => item.id === questionId);
          if (q) {
            foundQuestion = q;
            this.setData({ dimension: 2 });
            break;
          }
        }
      }
    }

    // 搜索线性变换-3D题目
    if (!foundQuestion && QuestionBank.linear3D) {
      for (let diff in QuestionBank.linear3D) {
        if (QuestionBank.linear3D[diff]) {
          const q = QuestionBank.linear3D[diff].find(item => item.id === questionId);
          if (q) {
            foundQuestion = q;
            this.setData({ dimension: 3 });
            break;
          }
        }
      }
    }

    if (foundQuestion) {
      this.setData({
        question: foundQuestion,
        userAnswer: [],
        showResult: false,
        isCorrect: false,
        showHint: false
      });
      this.updateCanvas();
    } else {
      this.generateQuestion();
    }
  },

  onShow: function() {
    if (this.data.canvas2D) {
      this.updateCanvas();
    }
  },

  onReady: function() {
    this.initCanvas();
  },

  initCanvas: function() {
    const sysInfo = wx.getSystemInfoSync();
    const canvasWidth = sysInfo.windowWidth;
    const canvasHeight = canvasWidth;

    this.setData({
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight
    });

    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('#drawingCanvas').fields({ node: true, size: true }).exec((res) => {
        if (res[0] && res[0].node) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = sysInfo.pixelRatio;
          
          canvas.width = canvasWidth * dpr;
          canvas.height = canvasHeight * dpr;
          ctx.scale(dpr, dpr);
          
          // 清除之前的绘图工具引用
          this.data.canvas2D = null;
          this.data.canvas3D = null;
          
          if (this.data.dimension === 2) {
            Drawing2D.init(canvas, canvasWidth, canvasHeight);
            this.data.canvas2D = Drawing2D;
            if (this.data.question) {
              const vectors = [];
              if (this.data.question.originalVector) {
                vectors.push(this.data.question.originalVector);
              }
              Drawing2D.autoScale(this.data.question.matrix, vectors);
            }
            this.updateCanvas();
          } else {
            Drawing3D.init(canvas, canvasWidth, canvasHeight);
            Drawing3D.setRotation({ x: 0.3, y: 0.6, z: 0.1 });
            this.data.canvas3D = Drawing3D;
            this.updateCanvas();
          }
        }
      });
    }, 150);
  },

  updateCanvas: function() {
    if (this.data.dimension === 2 && this.data.canvas2D) {
      const drawing = this.data.canvas2D;
      drawing.clear();

      const vectors = [];
      let matrix = this.data.question ? this.data.question.matrix : null;
      if (this.data.question && this.data.question.originalVector) {
        vectors.push(this.data.question.originalVector);
      }
      if (this.data.transformedVector) {
        vectors.push(this.data.transformedVector);
      }
      const userAnswer = this.data.userAnswer;
      const hasUserInput = userAnswer && userAnswer.some(row => row.some(val => val !== '' && val !== null && val !== undefined));
      if (hasUserInput) {
        matrix = userAnswer.map(row => row.map(val => parseFloat(val) || 0));
        drawing.autoScale(matrix, vectors);
      }

      drawing.drawGrid();
      drawing.drawAxes();
      
      if (this.data.question && this.data.question.originalVector) {
        const vec = this.data.question.originalVector;
        drawing.drawVector(vec[0], vec[1], '#9b59b6', 3);
      }
      
      if (this.data.transformedVector) {
        drawing.drawVector(this.data.transformedVector[0], this.data.transformedVector[1], '#f39c12', 3);
      }
    } else if (this.data.dimension === 3 && this.data.canvas3D) {
      const drawing = this.data.canvas3D;
      drawing.clear();

      const vectors = [];
      let matrix = this.data.question ? this.data.question.matrix : null;
      if (this.data.question && this.data.question.originalVector) {
        vectors.push(this.data.question.originalVector);
      }
      if (this.data.transformedVector) {
        vectors.push(this.data.transformedVector);
      }
      const userAnswer = this.data.userAnswer;
      const hasUserInput = userAnswer && userAnswer.some(row => row.some(val => val !== '' && val !== null && val !== undefined));
      if (hasUserInput) {
        matrix = userAnswer.map(row => row.map(val => parseFloat(val) || 0));
        drawing.autoScale(matrix, vectors);
      }

      drawing.drawGrid();
      drawing.drawAxes();
      
      if (this.data.question && this.data.question.originalVector) {
        const vec = this.data.question.originalVector;
        drawing.drawVector(vec[0], vec[1], vec[2] || 0, '#9b59b6');
      }
      
      if (this.data.transformedVector) {
        drawing.drawVector(this.data.transformedVector[0], this.data.transformedVector[1], this.data.transformedVector[2], '#f39c12');
      }
    }
  },

  generateQuestion: function() {
    const { dimension, difficulty } = this.data;
    const question = QuestionBank.getRandomQuestion('linear', dimension, difficulty);

    if (!question) {
      wx.showToast({ title: '题目加载失败', icon: 'none' });
      return;
    }

    const size = dimension;
    const userAnswer = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push('');
      }
      userAnswer.push(row);
    }

    this.setData({
      question: question,
      userAnswer: userAnswer,
      showResult: false,
      isCorrect: false,
      showHint: false,
      transformedVector: null,
      bubbleText: this.getRandomBubbleText('normal'),
      currentStatus: 'normal'
    });

    this.updateCanvas();
    this.startBubbleTimer();
  },

  getRandomBubbleText: function(status) {
    const texts = this.data.bubbleTexts[status] || this.data.bubbleTexts.normal;
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
  },

  startBubbleTimer: function() {
    if (this.bubbleTimer) {
      clearInterval(this.bubbleTimer);
    }
    this.bubbleTimer = setInterval(() => {
      if (this.data.showBubble) {
        this.setData({
          bubbleText: this.getRandomBubbleText(this.data.currentStatus)
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

  onCellTap: function(e) {
    const { row, col } = e.currentTarget.dataset;
    this.setData({
      showKeyboard: true,
      selectedRow: row,
      selectedCol: col,
      keyboardStepField: '',
      keyboardTitle: '矩阵元素输入',
      keyboardValue: this.data.userAnswer[row][col] || ''
    });
  },

  onCalcInputTap: function(e) {
    const { step } = e.currentTarget.dataset;
    const currentValue = this.data.calcInputs[step] || '';
    this.setData({
      showKeyboard: true,
      selectedRow: -1,
      selectedCol: -1,
      keyboardStepField: step,
      keyboardTitle: '输入数值',
      keyboardValue: currentValue
    });
  },

  onStepInputFocus: function(e) {
    const { step } = e.currentTarget.dataset;
    const currentValue = this.data.calcInputs[step] || '';
    this.setData({
      showKeyboard: true,
      selectedRow: -1,
      selectedCol: -1,
      keyboardStepField: step,
      keyboardTitle: '输入数值',
      keyboardValue: currentValue
    });
    wx.createSelectorQuery().select('.focus-helper').boundingClientRect().exec((res) => {});
  },

  onInputBlur: function() {},

  onKeyInput: function(e) {
    const value = e.currentTarget.dataset.value;
    let current = this.data.keyboardValue || '';
    if (current === '0' && value !== '.') {
      current = value;
    } else if (value === '.' && current.includes('.')) {
      return;
    } else if (value === '-' && current.includes('-')) {
      return;
    } else {
      current = current + value;
    }
    this.setData({ keyboardValue: current });

    if (this.data.keyboardStepField) {
      const calcInputs = { ...this.data.calcInputs };
      calcInputs[this.data.keyboardStepField] = current;
      this.setData({ calcInputs: calcInputs });
    } else if (this.data.selectedRow >= 0 && this.data.selectedCol >= 0) {
      const userAnswer = this.data.userAnswer.map(r => [...r]);
      userAnswer[this.data.selectedRow][this.data.selectedCol] = current;
      this.setData({ userAnswer: userAnswer });
    }
  },

  onKeyClear: function() {
    this.setData({ keyboardValue: '' });
    if (this.data.keyboardStepField) {
      const calcInputs = { ...this.data.calcInputs };
      calcInputs[this.data.keyboardStepField] = '';
      this.setData({ calcInputs: calcInputs });
    } else if (this.data.selectedRow >= 0 && this.data.selectedCol >= 0) {
      const userAnswer = this.data.userAnswer.map(r => [...r]);
      userAnswer[this.data.selectedRow][this.data.selectedCol] = '';
      this.setData({ userAnswer: userAnswer });
    }
  },

  onKeyBackspace: function() {
    let current = this.data.keyboardValue || '';
    if (current.length > 0) {
      current = current.slice(0, -1);
    }
    this.setData({ keyboardValue: current });

    if (this.data.keyboardStepField) {
      const calcInputs = { ...this.data.calcInputs };
      calcInputs[this.data.keyboardStepField] = current;
      this.setData({ calcInputs: calcInputs });
    } else if (this.data.selectedRow >= 0 && this.data.selectedCol >= 0) {
      const userAnswer = this.data.userAnswer.map(r => [...r]);
      userAnswer[this.data.selectedRow][this.data.selectedCol] = current;
      this.setData({ userAnswer: userAnswer });
    }
  },

  onKeyConfirm: function() {
    this.setData({ showKeyboard: false });
    if (!this.data.keyboardStepField && this.data.selectedRow >= 0) {
      this.calculateResult();
    }
  },

  onCellInput: function(e) {
    const { row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    const userAnswer = this.data.userAnswer;
    userAnswer[row][col] = value;
    this.setData({ userAnswer: userAnswer });
    this.calculateResult();
  },

  calculateResult: function() {
    const { question, userAnswer, dimension } = this.data;
    if (!question) return;

    let matrix = userAnswer.map(row => row.map(val => parseFloat(val) || 0));
    const originalVector = question.originalVector || [1, 0];

    if (dimension === 2) {
      const x = originalVector[0];
      const y = originalVector[1];
      const tx = matrix[0][0] * x + matrix[0][1] * y;
      const ty = matrix[1][0] * x + matrix[1][1] * y;
      this.setData({ transformedVector: [tx, ty] });
    } else {
      let v;
      if (originalVector.length === 3) {
        v = originalVector;
      } else {
        v = originalVector.concat(0);
      }
      const tx = matrix[0][0] * v[0] + matrix[0][1] * v[1] + matrix[0][2] * v[2];
      const ty = matrix[1][0] * v[0] + matrix[1][1] * v[1] + matrix[1][2] * v[2];
      const tz = matrix[2][0] * v[0] + matrix[2][1] * v[1] + matrix[2][2] * v[2];
      this.setData({ transformedVector: [tx, ty, tz] });
    }

    this.updateCanvas();
  },

  f: function(val) {
    if (val === 0) return ' 0';
    const str = val.toFixed(2);
    if (val > 0) return ' ' + str;
    return str;
  },

  toggleCalcProcess: function() {
    const newShow = !this.data.showCalcProcess;
    if (newShow && this.data.calculationSteps.length === 0) {
      this.generateExampleSteps();
    }
    this.setData({ showCalcProcess: newShow });
  },

  onCalcProcessInput: function(e) {
    this.setData({ userCalcProcess: e.detail.value });
  },

  onStepInput: function(e) {
    const step = e.currentTarget.dataset.step;
    const value = e.detail.value;
    const calcInputs = this.data.calcInputs;
    calcInputs[step] = value;
    this.setData({ calcInputs: calcInputs });
  },

  generateExampleSteps: function() {
    const { question, userAnswer, dimension } = this.data;
    if (!question) return;

    let matrix = userAnswer.map(row => row.map(val => parseFloat(val) || 0));
    const originalVector = question.originalVector || [1, 0];
    const steps = [];

    steps.push({ text: '原向量 v', isLabel: true });
    if (dimension === 2) {
      const x = originalVector[0];
      const y = originalVector[1];
      steps.push({ text: `    v = ( ${x} , ${y} )ᵀ`, isResult: true });

      const a11 = matrix[0][0], a12 = matrix[0][1];
      const a21 = matrix[1][0], a22 = matrix[1][1];

      steps.push({ text: '变换矩阵 A', isLabel: true });
      steps.push({ text: '    ┌              ┐', isResult: true });
      steps.push({ text: `    │ ${this.f(a11)}  ${this.f(a12)} │`, isResult: true });
      steps.push({ text: `    │ ${this.f(a21)}  ${this.f(a22)} │`, isResult: true });
      steps.push({ text: '    └              ┘', isResult: true });

      steps.push({ text: '计算 A·v', isLabel: true });
      steps.push({ text: '    ┌              ┐   ┌        ┐', isResult: true });
      steps.push({ text: `    │ ${this.f(a11)}  ${this.f(a12)} │   │   ${x}   │`, isResult: true });
      steps.push({ text: `    │ ${this.f(a21)}  ${this.f(a22)} │ × │   ${y}   │`, isResult: true });
      steps.push({ text: '    └              ┘   └        ┘', isResult: true });

      const tx = a11 * x + a12 * y;
      const ty = a21 * x + a22 * y;

      steps.push({ text: '', isLabel: false });
      steps.push({ text: '    第一行：' + this.f(a11) + '×' + x + ' + ' + this.f(a12) + '×' + y, isLabel: true });
      steps.push({ text: '         = ' + (a11 * x).toFixed(2) + ' + ' + (a12 * y).toFixed(2), isResult: true });
      steps.push({ text: '         = ' + tx.toFixed(2), isResult: true });

      steps.push({ text: '', isLabel: false });
      steps.push({ text: '    第二行：' + this.f(a21) + '×' + x + ' + ' + this.f(a22) + '×' + y, isLabel: true });
      steps.push({ text: '         = ' + (a21 * x).toFixed(2) + ' + ' + (a22 * y).toFixed(2), isResult: true });
      steps.push({ text: '         = ' + ty.toFixed(2), isResult: true });

      steps.push({ text: '', isLabel: false });
      steps.push({ text: '变换结果', isLabel: true });
      steps.push({ text: `    v' = ( ${tx.toFixed(2)} , ${ty.toFixed(2)} )ᵀ`, isResult: true });

      this.setData({ transformedVector: [tx, ty] });

    } else {
      let v;
      if (originalVector.length === 3) {
        v = originalVector;
      } else {
        v = originalVector.concat(0);
      }

      const a11 = matrix[0][0], a12 = matrix[0][1], a13 = matrix[0][2];
      const a21 = matrix[1][0], a22 = matrix[1][1], a23 = matrix[1][2];
      const a31 = matrix[2][0], a32 = matrix[2][1], a33 = matrix[2][2];

      steps.push({ text: `    v = ( ${v[0]} , ${v[1]} , ${v[2]} )ᵀ`, isResult: true });

      steps.push({ text: '变换矩阵 A', isLabel: true });
      steps.push({ text: '    ┌                       ┐', isResult: true });
      steps.push({ text: `    │ ${this.f(a11)}  ${this.f(a12)}  ${this.f(a13)} │`, isResult: true });
      steps.push({ text: `    │ ${this.f(a21)}  ${this.f(a22)}  ${this.f(a23)} │`, isResult: true });
      steps.push({ text: `    │ ${this.f(a31)}  ${this.f(a32)}  ${this.f(a33)} │`, isResult: true });
      steps.push({ text: '    └                       ┘', isResult: true });

      const tx = a11 * v[0] + a12 * v[1] + a13 * v[2];
      const ty = a21 * v[0] + a22 * v[1] + a23 * v[2];
      const tz = a31 * v[0] + a32 * v[1] + a33 * v[2];

      steps.push({ text: '计算 A·v', isLabel: true });
      steps.push({ text: '    第一行：' + this.f(a11) + '×' + v[0] + ' + ' + this.f(a12) + '×' + v[1] + ' + ' + this.f(a13) + '×' + v[2], isLabel: true });
      steps.push({ text: '         = ' + (a11 * v[0]).toFixed(2) + ' + ' + (a12 * v[1]).toFixed(2) + ' + ' + (a13 * v[2]).toFixed(2), isResult: true });
      steps.push({ text: '         = ' + tx.toFixed(2), isResult: true });

      steps.push({ text: '', isLabel: false });
      steps.push({ text: '    第二行：' + this.f(a21) + '×' + v[0] + ' + ' + this.f(a22) + '×' + v[1] + ' + ' + this.f(a23) + '×' + v[2], isLabel: true });
      steps.push({ text: '         = ' + (a21 * v[0]).toFixed(2) + ' + ' + (a22 * v[1]).toFixed(2) + ' + ' + (a23 * v[2]).toFixed(2), isResult: true });
      steps.push({ text: '         = ' + ty.toFixed(2), isResult: true });

      steps.push({ text: '', isLabel: false });
      steps.push({ text: '    第三行：' + this.f(a31) + '×' + v[0] + ' + ' + this.f(a32) + '×' + v[1] + ' + ' + this.f(a33) + '×' + v[2], isLabel: true });
      steps.push({ text: '         = ' + (a31 * v[0]).toFixed(2) + ' + ' + (a32 * v[1]).toFixed(2) + ' + ' + (a33 * v[2]).toFixed(2), isResult: true });
      steps.push({ text: '         = ' + tz.toFixed(2), isResult: true });

      steps.push({ text: '', isLabel: false });
      steps.push({ text: '变换结果', isLabel: true });
      steps.push({ text: `    v' = ( ${tx.toFixed(2)} , ${ty.toFixed(2)} , ${tz.toFixed(2)} )ᵀ`, isResult: true });

      this.setData({ transformedVector: [tx, ty, tz] });
    }

    this.setData({ calculationSteps: steps });
  },

  checkAnswer: function() {
    const { question, userAnswer, dimension, calcInputs } = this.data;
    if (!question) return;

    const correctMatrix = question.matrix;
    const inputVector = question.inputVector || [1, 0, 0].slice(0, dimension);
    
    // 计算每个矩阵单元格的状态
    const cellStates = [];
    let matrixHasError = false;
    let matrixHasEmpty = false;

    for (let i = 0; i < dimension; i++) {
      cellStates[i] = [];
      for (let j = 0; j < dimension; j++) {
        const userVal = userAnswer[i][j];
        const correctVal = correctMatrix[i][j];
        
        if (!userVal || userVal.trim() === '') {
          cellStates[i][j] = 'empty';
          matrixHasEmpty = true;
        } else {
          const numVal = parseFloat(userVal);
          if (isNaN(numVal) || Math.abs(numVal - correctVal) > 0.01) {
            cellStates[i][j] = 'error';
            matrixHasError = true;
          } else {
            cellStates[i][j] = 'correct';
          }
        }
      }
    }

    // 检查计算过程
    const calcStates = {};
    let calcHasError = false;
    let calcHasEmpty = false;
    
    for (let i = 1; i <= dimension; i++) {
      for (let j = 1; j <= dimension; j++) {
        const key = `a${i}${j}`;
        const userVal = calcInputs[key];
        const correctVal = correctMatrix[i-1][j-1];
        
        if (!userVal || userVal.trim() === '') {
          calcStates[key] = 'empty';
          calcHasEmpty = true;
        } else {
          const numVal = parseFloat(userVal);
          if (isNaN(numVal) || Math.abs(numVal - correctVal) > 0.01) {
            calcStates[key] = 'error';
            calcHasError = true;
          } else {
            calcStates[key] = 'correct';
          }
        }
      }
    }

    // 检查变换结果
    const resultStates = {};
    let resultHasError = false;
    let resultHasEmpty = false;
    
    // 计算正确的变换结果
    const correctResult = [];
    for (let i = 0; i < dimension; i++) {
      let sum = 0;
      for (let j = 0; j < dimension; j++) {
        sum += correctMatrix[i][j] * inputVector[j];
      }
      correctResult.push(sum);
    }
    
    const resultKeys = ['result_x', 'result_y', 'result_z'].slice(0, dimension);
    for (let i = 0; i < dimension; i++) {
      const key = resultKeys[i];
      const userVal = calcInputs[key];
      const correctVal = correctResult[i];
      
      if (!userVal || userVal.trim() === '') {
        resultStates[key] = 'empty';
        resultHasEmpty = true;
      } else {
        const numVal = parseFloat(userVal);
        if (isNaN(numVal) || Math.abs(numVal - correctVal) > 0.01) {
          resultStates[key] = 'error';
          resultHasError = true;
        } else {
          resultStates[key] = 'correct';
        }
      }
    }

    this.setData({ 
      cellStates: cellStates,
      calcStates: calcStates,
      resultStates: resultStates
    });

    const hasError = matrixHasError || calcHasError || resultHasError;
    const hasEmpty = matrixHasEmpty || calcHasEmpty || resultHasEmpty;

    // 根据检查结果确定状态
    let status = 'normal';
    if (hasError) {
      status = 'error';
      wx.showToast({ title: '答案有误，请检查红色标记', icon: 'none' });
    } else if (hasEmpty) {
      status = 'warning';
      wx.showToast({ title: '请填写黄色标记的空格', icon: 'none' });
    } else {
      status = 'success';
      wx.showToast({ title: '答案正确！', icon: 'success' });
    }
    
    // 更新状态并设置对应的随机提示
    this.setData({
      currentStatus: status,
      bubbleText: this.getRandomBubbleText(status),
      showBubble: true
    });

    // 重启定时器，从新状态开始每10秒更新提示
    this.startBubbleTimer();
  },

  showAnswer: function() {
    const { question, dimension } = this.data;
    if (!question) return;

    const matrix = question.matrix;
    const result = question.expectedVector;

    const formatNum = (num) => {
      return Number(num).toFixed(2);
    };

    const formattedMatrix = matrix.map(row => row.map(val => formatNum(val)));
    const formattedResult = result.map(val => formatNum(val));

    this.setData({
      showResult: false,
      showAnswerModal: true,
      answerMatrix: formattedMatrix,
      answerResult: formattedResult
    });
  },

  closeAnswer: function() {
    this.setData({
      showAnswerModal: false
    });
  },

  resetQuestion: function() {
    const { dimension } = this.data;
    const userAnswer = [];
    for (let i = 0; i < dimension; i++) {
      userAnswer.push([]);
      for (let j = 0; j < dimension; j++) {
        userAnswer[i].push('');
      }
    }
    this.setData({
      userAnswer: userAnswer,
      showResult: false,
      isCorrect: false,
      calcInputs: {
        a11: '', a12: '', a13: '',
        a21: '', a22: '', a23: '',
        a31: '', a32: '', a33: '',
        v1_row1: '', v2_row1: '', v3_row1: '',
        v1_row2: '', v2_row2: '', v3_row2: '',
        v1_row3: '', v2_row3: '', v3_row3: '',
        row1_result: '', row2_result: '', row3_result: '',
        result_x: '', result_y: '', result_z: ''
      }
    });
    this.initCanvas();
  },

  submitAnswer: function() {
    this.setData({ showKeyboard: false });

    const { question, userAnswer, dimension } = this.data;
    if (!question) return;

    const userMatrix = userAnswer.map(row => row.map(val => parseFloat(val) || 0));
    const correctMatrix = question.matrix;

    let isCorrect = true;
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        const userVal = userMatrix[i][j];
        const correctVal = correctMatrix[i][j];
        if (Math.abs(userVal - correctVal) > 0.01) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }

    this.setData({
      showResult: true,
      isCorrect: isCorrect
    });

    if (isCorrect) {
      this.saveRecord(true);
    } else {
      this.saveRecord(false);
    }
  },

  saveRecord: function(isCorrect) {
    const stats = wx.getStorageSync('learningStats') || {
      totalQuestions: 0,
      correctQuestions: 0,
      wrongQuestions: 0,
      dailyStats: {}
    };

    const today = new Date().toISOString().split('T')[0];
    if (!stats.dailyStats[today]) {
      stats.dailyStats[today] = { correct: 0, wrong: 0 };
    }

    stats.totalQuestions++;
    if (isCorrect) {
      stats.correctQuestions++;
      stats.dailyStats[today].correct++;
    } else {
      stats.wrongQuestions++;
      stats.dailyStats[today].wrong++;
    }

    wx.setStorageSync('learningStats', stats);

    const practiceData = wx.getStorageSync('practiceData') || {
      totalPractice: 0,
      correctRate: 0,
      wrongCount: 0,
      consecutiveDays: 0,
      wrongQuestions: []
    };

    practiceData.totalPractice = stats.totalQuestions;
    const correctRate = stats.totalQuestions > 0
      ? Math.round((stats.correctQuestions / stats.totalQuestions) * 100)
      : 0;
    practiceData.correctRate = correctRate;
    practiceData.wrongCount = stats.wrongQuestions;

    const dates = Object.keys(stats.dailyStats).sort().reverse();
    let consecutiveDays = 0;
    let checkDate = new Date(today);

    for (const dateStr of dates) {
      const date = new Date(dateStr);
      const diffDays = Math.floor((checkDate - date) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        consecutiveDays++;
        checkDate = date;
      } else {
        break;
      }
    }
    practiceData.consecutiveDays = consecutiveDays;

    const now = new Date();
    const dateStr = `今天 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    if (!isCorrect && this.data.question) {
      const wrongQ = {
        id: Date.now(),
        type: '线性变换练习',
        question: this.data.question.description || '线性变换矩阵计算',
        time: dateStr,
        status: '未复习'
      };
      const existingWrong = practiceData.wrongQuestions.find(q =>
        q.type === '线性变换练习' && q.question === wrongQ.question
      );
      if (!existingWrong) {
        practiceData.wrongQuestions.push(wrongQ);
      }
    }

    wx.setStorageSync('practiceData', practiceData);
  },

  toggleHint: function() {
    this.setData({ showHint: !this.data.showHint });
  },

  nextQuestion: function() {
    this.generateQuestion();
  },

  askAI: function() {
    const { question, dimension, userAnswer, calcInputs } = this.data;
    if (!question) return;

    const correctMatrix = question.matrix;
    const inputVector = question.inputVector || [1, 0, 0].slice(0, dimension);
    
    let analysisText = '分析你的答题情况：\n\n';
    
    // 分析用户输入
    let hasError = false;
    let hasEmpty = false;
    
    // 分析变换矩阵
    analysisText += '🔢 变换矩阵分析：\n';
    const matrixErrors = [];
    const matrixEmpties = [];
    
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        const userVal = userAnswer[i]?.[j];
        const correctVal = correctMatrix[i][j];
        
        if (!userVal || userVal.trim() === '') {
          matrixEmpties.push(`位置 (${i+1}, ${j+1})`);
          hasEmpty = true;
        } else {
          const numVal = parseFloat(userVal);
          if (isNaN(numVal) || Math.abs(numVal - correctVal) > 0.01) {
            matrixErrors.push(`位置 (${i+1}, ${j+1})：你填了 ${userVal}，正确答案是 ${correctVal}`);
            hasError = true;
          }
        }
      }
    }
    
    if (matrixErrors.length > 0) {
      analysisText += '\n';
      matrixErrors.forEach(err => {
        analysisText += `❌ ${err}\n`;
      });
    }
    if (matrixEmpties.length > 0) {
      analysisText += '\n';
      analysisText += `⚠️ 未填写：${matrixEmpties.join(', ')}\n`;
    }
    if (matrixErrors.length === 0 && matrixEmpties.length === 0) {
      analysisText += '✅ 变换矩阵填写正确\n';
    }
    analysisText += '\n';
    
    // 分析计算过程
    analysisText += '📐 计算过程分析：\n';
    const calcErrors = [];
    const calcEmpties = [];
    
    for (let i = 1; i <= dimension; i++) {
      for (let j = 1; j <= dimension; j++) {
        const key = `a${i}${j}`;
        const userVal = calcInputs[key];
        const correctVal = correctMatrix[i-1][j-1];
        
        if (!userVal || userVal.trim() === '') {
          calcEmpties.push(key);
          hasEmpty = true;
        } else {
          const numVal = parseFloat(userVal);
          if (isNaN(numVal) || Math.abs(numVal - correctVal) > 0.01) {
            calcErrors.push(`${key}：你填了 ${userVal}，正确答案是 ${correctVal}`);
            hasError = true;
          }
        }
      }
    }
    
    if (calcErrors.length > 0) {
      analysisText += '\n';
      calcErrors.forEach(err => {
        analysisText += `❌ ${err}\n`;
      });
    }
    if (calcEmpties.length > 0) {
      analysisText += '\n';
      analysisText += `⚠️ 未填写：${calcEmpties.join(', ')}\n`;
    }
    if (calcErrors.length === 0 && calcEmpties.length === 0) {
      analysisText += '✅ 计算过程填写正确\n';
    }
    analysisText += '\n';
    
    // 分析变换结果
    analysisText += '🎯 变换结果分析：\n';
    const resultErrors = [];
    const resultEmpties = [];
    
    // 计算正确的变换结果
    const correctResult = [];
    for (let i = 0; i < dimension; i++) {
      let sum = 0;
      for (let j = 0; j < dimension; j++) {
        sum += correctMatrix[i][j] * inputVector[j];
      }
      correctResult.push(sum);
    }
    
    const resultKeys = ['result_x', 'result_y', 'result_z'].slice(0, dimension);
    for (let i = 0; i < dimension; i++) {
      const key = resultKeys[i];
      const userVal = calcInputs[key];
      const correctVal = correctResult[i];
      
      if (!userVal || userVal.trim() === '') {
        resultEmpties.push(key);
        hasEmpty = true;
      } else {
        const numVal = parseFloat(userVal);
        if (isNaN(numVal) || Math.abs(numVal - correctVal) > 0.01) {
          resultErrors.push(`${key}：你填了 ${userVal}，正确答案是 ${correctVal}`);
          hasError = true;
        }
      }
    }
    
    if (resultErrors.length > 0) {
      analysisText += '\n';
      resultErrors.forEach(err => {
        analysisText += `❌ ${err}\n`;
      });
    }
    if (resultEmpties.length > 0) {
      analysisText += '\n';
      analysisText += `⚠️ 未填写：${resultEmpties.join(', ')}\n`;
    }
    if (resultErrors.length === 0 && resultEmpties.length === 0) {
      analysisText += '✅ 变换结果填写正确\n';
    }
    analysisText += '\n\n';
    
    // 易错点提醒
    if (hasError) {
      analysisText += '💡 易错点提醒：\n';
      analysisText += '\n';
      if (question.type === 'rotation') {
        analysisText += '  • 旋转矩阵：注意顺时针和逆时针的区别\n';
        analysisText += '  • cos(θ) 和 sin(θ) 的符号容易混淆\n';
        analysisText += '  • 逆时针旋转使用公式：[cos, -sin; sin, cos]\n';
      } else if (question.type === 'reflection') {
        analysisText += '  • 反射矩阵：注意对称轴的方向\n';
        analysisText += '  • 关于x轴反射：y坐标取反，矩阵为 [[1,0], [0,-1]]\n';
        analysisText += '  • 关于y轴反射：x坐标取反，矩阵为 [[-1,0], [0,1]]\n';
        analysisText += '  • 记住口诀：谁不变谁对应对角线为1\n';
      } else if (question.type === 'scaling') {
        analysisText += '  • 缩放矩阵：注意x和y方向的缩放因子\n';
        analysisText += '  • 缩放矩阵是对角矩阵\n';
      } else if (question.type === 'shear') {
        analysisText += '  • 切变矩阵：注意是水平还是垂直切变\n';
        analysisText += '  • 水平切变：x\' = x + ky\n';
        analysisText += '  • 垂直切变：y\' = y + kx\n';
      }
      analysisText += '\n';
    }
    
    if (hasEmpty) {
      analysisText += '📝 请先填写所有空白处再进行检查。\n\n';
    }
    
    if (!hasError && !hasEmpty) {
      analysisText += '🎉 太棒了！所有答案都正确！\n';
      analysisText += '✅ 你已经掌握了这个知识点！\n\n';
    }
    
    // 添加题目信息
    analysisText += '\n';
    analysisText += '📚 题目信息：\n';
    analysisText += '\n';
    analysisText += question.description || '';
    analysisText += '\n';
    if (question.matrix) {
      // 构建矩阵的LaTeX代码
      const matrixLatex = '\\begin{bmatrix}' + question.matrix.map(row => row.join(' & ')).join(' \\\\\\\\ ') + '\\end{bmatrix}';
      analysisText += '\n变换矩阵为：\n';
      analysisText += '$$' + matrixLatex + '$$';
      analysisText += '\n';
    }
    if (question.originalVector) {
      const vectorLatex = '\\begin{pmatrix}' + question.originalVector.join(' \\\\\\\\ ') + '\\end{pmatrix}^T';
      analysisText += '\n原始向量为：$' + vectorLatex + '$';
      analysisText += '\n';
    }
    if (question.expectedVector) {
      const vectorLatex = '\\begin{pmatrix}' + question.expectedVector.join(' \\\\\\\\ ') + '\\end{pmatrix}^T';
      analysisText += '\n期望结果为：$' + vectorLatex + '$';
      analysisText += '\n';
    }
    analysisText += '\n';
    analysisText += '下面为你详细讲解这道题的解题思路和方法：';
    analysisText += '\n';

    const questionData = encodeURIComponent(JSON.stringify({
      question: analysisText,
      autoSend: true,
      sourcePage: 'linear-transform'
    }));

    wx.setStorageSync('aiQuestion', questionData);
    wx.reLaunch({
      url: '/pages/ai-assistant/index'
    });
  },

  onFloatBtnTouchStart: function(e) {
    this.isLongPress = false;
    this.setData({ floatBtnClass: 'active' });
    this.longPressTimer = setTimeout(() => {
      this.isLongPress = true;
      this.setData({
        floatIcon: '✨',
        showBubble: !this.data.showBubble
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
    // 只有不是长按才跳转
    if (!this.isLongPress) {
      this.setData({ showBubble: false });
      this.askAI();
    }
  },

  goBack: function() {
    wx.navigateBack();
  },

  switchDimension: function() {
    const newDimension = this.data.dimension === 2 ? 3 : 2;
    this.setData({ dimension: newDimension });
    
    // 立即更新this.data中的维度值，确保initCanvas使用正确的维度
    this.data.dimension = newDimension;
    
    // 重新初始化画布，确保使用正确的绘图工具
    this.initCanvas();
    
    // 生成新的问题
    this.generateQuestion();
  },

  onTouchStart: function(e) {
    const touches = e.touches;
    if (touches && touches.length > 0) {
      if (this.data.dimension === 2 && this.data.canvas2D) {
        this.data.canvas2D.handleTouchStart(touches);
      } else if (this.data.dimension === 3 && this.data.canvas3D) {
        this.data.canvas3D.handleTouchStart(touches);
      }
    }
  },

  onTouchMove: function(e) {
    const touches = e.touches;
    if (touches && touches.length > 0) {
      if (this.data.dimension === 2 && this.data.canvas2D) {
        this.data.canvas2D.handleTouchMove(touches);
        this.updateCanvas();
      } else if (this.data.dimension === 3 && this.data.canvas3D) {
        this.data.canvas3D.handleTouchMove(touches);
        this.updateCanvas();
      }
    }
  },

  onTouchEnd: function(e) {
    if (this.data.dimension === 2 && this.data.canvas2D) {
      this.data.canvas2D.handleTouchEnd && this.data.canvas2D.handleTouchEnd();
    } else if (this.data.dimension === 3 && this.data.canvas3D) {
      this.data.canvas3D.handleTouchEnd();
    }
  },

  zoomIn: function() {
    if (this.data.dimension === 2 && this.data.canvas2D) {
      this.data.canvas2D.zoomIn();
      this.updateCanvas();
    } else if (this.data.dimension === 3 && this.data.canvas3D) {
      this.data.canvas3D.zoomIn();
      this.updateCanvas();
    }
  },

  zoomOut: function() {
    if (this.data.dimension === 2 && this.data.canvas2D) {
      this.data.canvas2D.zoomOut();
      this.updateCanvas();
    } else if (this.data.dimension === 3 && this.data.canvas3D) {
      this.data.canvas3D.zoomOut();
      this.updateCanvas();
    }
  },

  resetView: function() {
    if (this.data.dimension === 2 && this.data.canvas2D) {
      this.data.canvas2D.resetView();
      this.updateCanvas();
    } else if (this.data.dimension === 3 && this.data.canvas3D) {
      this.data.canvas3D.resetView();
      this.updateCanvas();
    }
  }
});
