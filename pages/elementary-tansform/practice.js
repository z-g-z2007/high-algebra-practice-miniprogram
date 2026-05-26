Page({
  data: {
    questionTypes: ['线性变换-2D', '线性变换-3D', '初等变换'],
    questionTypeIndex: 0,
    difficultyLevels: ['简单', '中等', '困难'],
    difficultyIndex: 0,
    matrixSizes: [2, 3, 4],
    matrixSizeIndex: 1,
    targetTypes: ['行阶梯形', '行最简形'],
    targetTypeIndex: 0,
    currentSize: 3,
    authorName: '',
    authorEmail: '',
    questionContent: '',
    v1: '',
    v2: '',
    v3: '',
    resultX: '',
    resultY: '',
    resultZ: '',
    a11: '',
    a12: '',
    a13: '',
    a21: '',
    a22: '',
    a23: '',
    a31: '',
    a32: '',
    a33: '',
    row1Result: '',
    row2Result: '',
    initialMatrixRows: [['', '', ''], ['', '', ''], ['', '', '']],
    targetMatrixRows: [['', '', ''], ['', '', ''], ['', '', '']],
    showKeyboard: false,
    keyboardField: '',
    keyboardRow: -1,
    keyboardCol: -1,
    keyboardMatrix: '',
    keyboardValue: ''
  },

  onQuestionTypeChange: function(e) {
    const size = this.data.matrixSizes[this.data.matrixSizeIndex];
    this.setData({
      questionTypeIndex: parseInt(e.detail.value),
      v1: '', v2: '', v3: '',
      resultX: '', resultY: '', resultZ: '',
      a11: '', a12: '', a13: '',
      a21: '', a22: '', a23: '',
      a31: '', a32: '', a33: '',
      row1Result: '', row2Result: '',
      showKeyboard: false
    });
  },

  onDifficultyChange: function(e) {
    this.setData({ difficultyIndex: e.detail.value });
  },

  onMatrixSizeChange: function(e) {
    const size = this.data.matrixSizes[e.detail.value];
    const emptyRow = new Array(size).fill('');
    const emptyRows = [];
    for (let i = 0; i < size; i++) {
      emptyRows.push([...emptyRow]);
    }
    this.setData({
      matrixSizeIndex: e.detail.value,
      currentSize: size,
      initialMatrixRows: emptyRows,
      targetMatrixRows: emptyRows,
      showKeyboard: false
    });
  },

  onTargetTypeChange: function(e) {
    this.setData({ targetTypeIndex: e.detail.value });
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

  onVectorCellTap: function(e) {
    const vector = e.currentTarget.dataset.vector;
    let currentValue = '';
    switch(vector) {
      case 'v1': currentValue = this.data.v1; break;
      case 'v2': currentValue = this.data.v2; break;
      case 'v3': currentValue = this.data.v3; break;
      case 'resultX': currentValue = this.data.resultX; break;
      case 'resultY': currentValue = this.data.resultY; break;
      case 'resultZ': currentValue = this.data.resultZ; break;
    }
    this.setData({
      showKeyboard: true,
      keyboardField: vector,
      keyboardRow: -1,
      keyboardCol: -1,
      keyboardMatrix: '',
      keyboardValue: currentValue
    });
  },

  onMatrixCellTap: function(e) {
    const field = e.currentTarget.dataset.field;
    let currentValue = '';
    switch(field) {
      case 'a11': currentValue = this.data.a11; break;
      case 'a12': currentValue = this.data.a12; break;
      case 'a13': currentValue = this.data.a13; break;
      case 'a21': currentValue = this.data.a21; break;
      case 'a22': currentValue = this.data.a22; break;
      case 'a23': currentValue = this.data.a23; break;
      case 'a31': currentValue = this.data.a31; break;
      case 'a32': currentValue = this.data.a32; break;
      case 'a33': currentValue = this.data.a33; break;
      case 'row1Result': currentValue = this.data.row1Result; break;
      case 'row2Result': currentValue = this.data.row2Result; break;
    }
    this.setData({
      showKeyboard: true,
      keyboardField: field,
      keyboardRow: -1,
      keyboardCol: -1,
      keyboardMatrix: '',
      keyboardValue: currentValue
    });
  },

  onElemCellTap: function(e) {
    const { row, col, matrix } = e.currentTarget.dataset;
    const key = matrix === 'initial' ? 'initialMatrixRows' : 'targetMatrixRows';
    const currentValue = this.data[key][row][col];
    this.setData({
      showKeyboard: true,
      keyboardField: '',
      keyboardRow: row,
      keyboardCol: col,
      keyboardMatrix: matrix,
      keyboardValue: currentValue
    });
  },

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
  },

  onKeyClear: function() {
    this.setData({ keyboardValue: '' });
  },

  onKeyBackspace: function() {
    let current = this.data.keyboardValue || '';
    if (current.length > 0) {
      current = current.slice(0, -1);
    }
    this.setData({ keyboardValue: current });
  },

  onKeyConfirm: function() {
    const { keyboardField, keyboardRow, keyboardCol, keyboardMatrix, keyboardValue } = this.data;
    if (keyboardField) {
      const update = {};
      update[keyboardField] = keyboardValue;
      this.setData(update);
    } else if (keyboardRow >= 0 && keyboardCol >= 0 && keyboardMatrix) {
      const key = keyboardMatrix === 'initial' ? 'initialMatrixRows' : 'targetMatrixRows';
      const rows = this.data[key].map(r => [...r]);
      rows[keyboardRow][keyboardCol] = keyboardValue;
      const update = {};
      update[key] = rows;
      this.setData(update);
    }
    this.setData({ showKeyboard: false });
  },

  handleSubmitQuestion: function() {
    const {
      authorName, questionContent, questionTypeIndex,
      v1, v2, v3, resultX, resultY, resultZ,
      a11, a12, a13, a21, a22, a23, a31, a32, a33,
      matrixSizes, matrixSizeIndex, targetTypes, targetTypeIndex,
      initialMatrixRows, targetMatrixRows
    } = this.data;

    if (!authorName) {
      wx.showToast({ title: '请输入作者姓名', icon: 'none' });
      return;
    }

    if (!questionContent) {
      wx.showToast({ title: '请输入题目描述', icon: 'none' });
      return;
    }

    let submission = {
      id: 'sub_' + Date.now(),
      type: this.data.questionTypes[questionTypeIndex],
      difficulty: this.data.difficultyLevels[this.data.difficultyIndex],
      authorName: authorName,
      authorEmail: this.data.authorEmail,
      content: questionContent,
      description: questionContent,
      createTime: new Date().toLocaleString()
    };

    if (questionTypeIndex === 0) {
      if (!v1 || !v2 || !resultX || !resultY || !a11 || !a12 || !a21 || !a22) {
        wx.showToast({ title: '请填写完整的2D变换数据', icon: 'none' });
        return;
      }
      const matrix = [Number(a11), Number(a12), Number(a21), Number(a22)];
      submission.originalVector = [Number(v1), Number(v2)];
      submission.expectedVector = [Number(resultX), Number(resultY)];
      submission.matrix = matrix;
      submission.answer = JSON.stringify(matrix);
    } else if (questionTypeIndex === 1) {
      if (!v1 || !v2 || !v3 || !resultX || !resultY || !resultZ ||
          !a11 || !a12 || !a13 || !a21 || !a22 || !a23 || !a31 || !a32 || !a33) {
        wx.showToast({ title: '请填写完整的3D变换数据', icon: 'none' });
        return;
      }
      const matrix = [Number(a11), Number(a12), Number(a13), Number(a21), Number(a22), Number(a23), Number(a31), Number(a32), Number(a33)];
      submission.originalVector = [Number(v1), Number(v2), Number(v3)];
      submission.expectedVector = [Number(resultX), Number(resultY), Number(resultZ)];
      submission.matrix = matrix;
      submission.answer = JSON.stringify(matrix);
    } else if (questionTypeIndex === 2) {
      const size = matrixSizes[matrixSizeIndex];
      const flatInitial = [];
      const flatTarget = [];

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const v1 = initialMatrixRows[i][j];
          const v2 = targetMatrixRows[i][j];
          if (!v1 || isNaN(Number(v1))) {
            wx.showToast({ title: '请填写完整的初始矩阵', icon: 'none' });
            return;
          }
          if (!v2 || isNaN(Number(v2))) {
            wx.showToast({ title: '请填写完整的目标矩阵', icon: 'none' });
            return;
          }
          flatInitial.push(Number(v1));
          flatTarget.push(Number(v2));
        }
      }

      submission.matrix = flatInitial;
      submission.initialMatrix = flatInitial;
      submission.target = flatTarget.join(',');
      submission.targetMatrix = flatTarget;
      submission.targetType = targetTypes[targetTypeIndex];
      submission.answer = flatTarget.join(',');
      submission.size = size;
    }

    const submissions = wx.getStorageSync('questionSubmissions') || [];
    submissions.push(submission);
    wx.setStorageSync('questionSubmissions', submissions);

    wx.showToast({ title: '提交成功', icon: 'success' });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});
