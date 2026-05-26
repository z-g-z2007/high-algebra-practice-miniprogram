const MATRIX = require('./matrix.js');
const LinearTransform = require('./linear-transform.js');
const ElementaryTransform = require('./elementary-transform.js');
const QuestionBank = require('./question-bank.js');

const Validator = {
  tolerance: 1e-6,

  validateLinearAnswer: function(correctMatrix, userMatrix) {
    const result = {
      isCorrect: true,
      errors: [],
      message: ''
    };
    if (!correctMatrix || !userMatrix) {
      result.isCorrect = false;
      result.errors.push({ type: 'format', message: '矩阵格式错误' });
      result.message = '请检查矩阵格式';
      return result;
    }
    if (correctMatrix.length !== userMatrix.length || 
        correctMatrix[0].length !== userMatrix[0].length) {
      result.isCorrect = false;
      result.errors.push({ type: 'dimension', message: '矩阵维度不匹配' });
      result.message = '矩阵维度不正确';
      return result;
    }
    const errorPositions = [];
    for (let i = 0; i < correctMatrix.length; i++) {
      for (let j = 0; j < correctMatrix[0].length; j++) {
        const correct = correctMatrix[i][j];
        const user = parseFloat(userMatrix[i][j]) || 0;
        if (Math.abs(correct - user) > this.tolerance) {
          result.isCorrect = false;
          errorPositions.push({ row: i, col: j });
          if (Math.abs(correct) < this.tolerance && Math.abs(user) < this.tolerance) {
          } else if (Math.abs(correct) < this.tolerance) {
            result.errors.push({
              type: 'value',
              position: { row: i, col: j },
              message: `第${i + 1}行第${j + 1}列应为0`
            });
          } else {
            result.errors.push({
              type: 'value',
              position: { row: i, col: j },
              message: `第${i + 1}行第${j + 1}列错误`
            });
          }
        }
      }
    }
    if (result.isCorrect) {
      result.message = '回答正确！';
    } else {
      result.message = `有 ${errorPositions.length} 个元素错误`;
    }
    return result;
  },

  validateElementaryStep: function(prevMatrix, currentMatrix, operation, matrixSize) {
    const result = {
      isValid: true,
      errors: [],
      message: ''
    };
    if (!operation || operation.type === 'unknown') {
      result.isValid = false;
      result.errors.push({ message: '未知的操作类型' });
      result.message = '操作无效';
      return result;
    }
    if (operation.type === 'swap') {
      const { row1, row2 } = operation;
      if (row1 < 0 || row1 >= matrixSize || row2 < 0 || row2 >= matrixSize) {
        result.isValid = false;
        result.errors.push({ message: `行号 ${row1 + 1} 或 ${row2 + 1} 超出范围` });
      } else if (row1 === row2) {
        result.isValid = false;
        result.errors.push({ message: '不能交换同一行' });
      }
    } else if (operation.type === 'multiply') {
      const { row, k } = operation;
      if (row < 0 || row >= matrixSize) {
        result.isValid = false;
        result.errors.push({ message: `行号 ${row + 1} 超出范围` });
      }
      if (Math.abs(k) < this.tolerance) {
        result.isValid = false;
        result.errors.push({ message: '倍数不能为零' });
      }
    } else if (operation.type === 'addMultiple') {
      const { sourceRow, targetRow, k } = operation;
      if (sourceRow < 0 || sourceRow >= matrixSize || targetRow < 0 || targetRow >= matrixSize) {
        result.isValid = false;
        result.errors.push({ message: '行号超出范围' });
      }
      if (sourceRow === targetRow) {
        result.isValid = false;
        result.errors.push({ message: '源行和目标行不能相同' });
      }
    }
    if (result.isValid) {
      result.message = '操作有效';
    } else {
      result.message = result.errors[0]?.message || '操作无效';
    }
    return result;
  },

  validateElementaryFinal: function(matrix, target) {
    const result = {
      isComplete: false,
      isCorrect: false,
      message: ''
    };
    if (target === 'echelon') {
      result.isCorrect = ElementaryTransform.isRowEchelonForm(matrix);
      result.isComplete = result.isCorrect;
    } else if (target === 'reduced') {
      result.isCorrect = ElementaryTransform.isRowReducedEchelonForm(matrix);
      result.isComplete = result.isCorrect;
    }
    if (result.isComplete) {
      result.message = '化简完成！答案正确';
    } else if (result.isCorrect === false) {
      result.message = '尚未达到目标形式';
    }
    return result;
  },

  getHint: function(question) {
    if (question.type === 'rotation') {
      if (question.dimension === 2) {
        return `旋转角度：${question.angle}°${question.counterClockwise ? '逆时针' : '顺时针'}\n旋转矩阵格式：[cosθ, -sinθ; sinθ, cosθ]`;
      } else {
        return `绕${question.axis.toUpperCase()}轴旋转${question.angle}°`;
      }
    } else if (question.type === 'reflection') {
      if (question.dimension === 2) {
        const axisNames = { x: 'x轴', y: 'y轴', 'y=x': 'y=x', 'y=-x': 'y=-x' };
        return `关于${axisNames[question.axis]}反射`;
      } else {
        return `关于${question.plane}平面对称`;
      }
    } else if (question.type === 'scaling') {
      if (question.dimension === 2) {
        return `缩放变换：sx=${question.sx}, sy=${question.sy}`;
      } else {
        return `三维缩放：sx=${question.sx}, sy=${question.sy}, sz=${question.sz}`;
      }
    } else if (question.type === 'shear') {
      const dir = question.direction === 'x' ? '水平' : '竖直';
      return `${dir}剪切变换，剪切系数k=${question.k}`;
    } else if (question.type === 'projection') {
      const axis = question.dimension === 2 ? 
        (question.axis === 'x' ? 'x轴' : 'y轴') : 
        `${question.plane}平面`;
      return `向${axis}正交投影`;
    }
    return '请仔细分析变换类型';
  },

  getSolution: function(question) {
    if (question.type === 'rotation') {
      if (question.dimension === 2) {
        const rad = question.angle * Math.PI / 180;
        const cos = Math.cos(rad).toFixed(4);
        const sin = Math.sin(rad).toFixed(4);
        return `旋转矩阵为：
[ ${cos}  -${sin} ]
[ ${sin}   ${cos} ]`;
      }
    } else if (question.type === 'reflection') {
      const m = question.matrix;
      return `反射矩阵为：
[ ${m[0][0].toFixed(4)}  ${m[0][1].toFixed(4)} ]
[ ${m[1][0].toFixed(4)}  ${m[1][1].toFixed(4)} ]`;
    } else if (question.type === 'scaling') {
      return `缩放矩阵为：
[ ${question.sx}   0   ]
[  0   ${question.sy} ]`;
    }
    return '请参考标准答案';
  }
};

module.exports = Validator;