const MATRIX = require('./matrix.js');

const formatRational = (val) => {
  if (typeof val !== 'number') return val;
  const rounded = Math.round(val * 100) / 100;
  if (Number.isInteger(rounded)) return rounded.toString();
  const fractionMap = {
    '0.25': '1/4', '0.5': '1/2', '0.75': '3/4',
    '0.33': '1/3', '0.67': '2/3', '0.2': '1/5', '0.4': '2/5',
    '0.6': '3/5', '0.8': '4/5', '0.125': '1/8', '0.375': '3/8',
    '0.625': '5/8', '0.875': '7/8', '0.1': '1/10', '0.3': '3/10',
    '0.7': '7/10', '0.9': '9/10'
  };
  const roundedStr = rounded.toString();
  if (fractionMap[roundedStr]) return fractionMap[roundedStr];
  for (let den = 2; den <= 9; den++) {
    const num = Math.round(rounded * den);
    if (Math.abs(num / den - rounded) < 0.005 && num > 0) {
      return num + '/' + den;
    }
  }
  return roundedStr;
};

const ElementaryTransform = {
  swapRows: function(A, row1, row2) {
    const result = MATRIX.copy(A);
    const temp = result[row1];
    result[row1] = result[row2];
    result[row2] = temp;
    return {
      matrix: result,
      operation: { type: 'swap', row1: row1, row2: row2 }
    };
  },

  multiplyRow: function(A, row, k) {
    if (Math.abs(k) < 1e-10) {
      return { error: '倍数不能为零' };
    }
    const result = MATRIX.copy(A);
    for (let j = 0; j < result[0].length; j++) {
      result[row][j] *= k;
    }
    return {
      matrix: result,
      operation: { type: 'multiply', row: row, k: k }
    };
  },

  addMultiple: function(A, sourceRow, targetRow, k) {
    const result = MATRIX.copy(A);
    for (let j = 0; j < result[0].length; j++) {
      result[targetRow][j] += k * result[sourceRow][j];
    }
    return {
      matrix: result,
      operation: { type: 'addMultiple', sourceRow: sourceRow, targetRow: targetRow, k: k }
    };
  },

  isRowEchelonForm: function(A) {
    let prevLeadingCol = -1;
    for (let i = 0; i < A.length; i++) {
      let leadingCol = -1;
      for (let j = 0; j < A[0].length; j++) {
        if (Math.abs(A[i][j]) > 1e-10) {
          leadingCol = j;
          break;
        }
      }
      if (leadingCol !== -1) {
        if (leadingCol <= prevLeadingCol) {
          return false;
        }
        prevLeadingCol = leadingCol;
      }
    }
    return true;
  },

  isRowReducedEchelonForm: function(A) {
    if (!this.isRowEchelonForm(A)) return false;
    for (let i = 0; i < A.length; i++) {
      let leadingCol = -1;
      let leadingRow = -1;
      for (let j = 0; j < A[0].length; j++) {
        if (Math.abs(A[i][j]) > 1e-10) {
          if (leadingCol === -1) {
            leadingCol = j;
            leadingRow = i;
          }
          if (j !== leadingCol && i !== leadingRow && Math.abs(A[i][j]) > 1e-10) {
            return false;
          }
        }
      }
    }
    return true;
  },

  getPivotPositions: function(A) {
    const pivots = [];
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < A[0].length; j++) {
        if (Math.abs(A[i][j]) > 1e-10) {
          pivots.push({ row: i, col: j });
          break;
        }
      }
    }
    return pivots;
  },

  toRowEchelonForm: function(A) {
    const steps = [];
    let matrix = MATRIX.copy(A);
    steps.push({ matrix: MATRIX.copy(matrix), desc: '原始矩阵' });
    const m = matrix.length;
    const n = matrix[0].length;
    let lead = 0;
    for (let r = 0; r < m; r++) {
      if (lead >= n) break;
      let i = r;
      while (Math.abs(matrix[i][lead]) < 1e-10) {
        i++;
        if (i === m) {
          i = r;
          lead++;
          if (lead === n) break;
        }
      }
      if (lead >= n) break;
      if (i !== r) {
        matrix = this.swapRows(matrix, i, r).matrix;
        steps.push({ matrix: MATRIX.copy(matrix), desc: `交换第${i + 1}行和第${r + 1}行` });
      }
      const div = matrix[r][lead];
      if (Math.abs(div) > 1e-10) {
        for (let j = 0; j < n; j++) {
          matrix[r][j] /= div;
        }
        if (Math.abs(matrix[r][lead] - 1) > 1e-10) {
          steps.push({ matrix: MATRIX.copy(matrix), desc: `第${r + 1}行除以${formatRational(div)}` });
        }
      }
      for (let i = 0; i < m; i++) {
        if (i !== r && Math.abs(matrix[i][lead]) > 1e-10) {
          const mult = matrix[i][lead];
          for (let j = 0; j < n; j++) {
            matrix[i][j] -= mult * matrix[r][j];
          }
          steps.push({ matrix: MATRIX.copy(matrix), desc: `第${i + 1}行减去第${r + 1}行的${formatRational(mult)}倍` });
        }
      }
      lead++;
    }
    return steps;
  },

  toRowReducedEchelonForm: function(A) {
    return this.toRowEchelonForm(A);
  },

  verifyStep: function(prevMatrix, currentMatrix, operation, matrixSize) {
    const errors = [];
    if (!prevMatrix || !currentMatrix) {
      return { valid: false, errors: [{ message: '矩阵格式错误' }] };
    }
    if (operation.type === 'swap') {
      const { row1, row2 } = operation;
      if (row1 < 0 || row1 >= matrixSize || row2 < 0 || row2 >= matrixSize) {
        errors.push({ message: `行号 ${row1 + 1} 或 ${row2 + 1} 超出范围` });
      } else {
        for (let j = 0; j < prevMatrix[0].length; j++) {
          if (j === row1) {
            if (!MATRIX.equals([prevMatrix[row1]], [currentMatrix[row2]]) &&
                !MATRIX.equals([prevMatrix[row2]], [currentMatrix[row1]])) {
              errors.push({ message: '行交换结果不正确' });
            }
          }
        }
      }
    } else if (operation.type === 'multiply') {
      const { row, k } = operation;
      if (Math.abs(k) < 1e-10) {
        errors.push({ message: '倍数不能为零' });
      }
      if (row < 0 || row >= matrixSize) {
        errors.push({ message: `行号 ${row + 1} 超出范围` });
      }
    } else if (operation.type === 'addMultiple') {
      const { sourceRow, targetRow, k } = operation;
      if (sourceRow < 0 || sourceRow >= matrixSize || targetRow < 0 || targetRow >= matrixSize) {
        errors.push({ message: '行号超出范围' });
      }
    }
    return { valid: errors.length === 0, errors: errors };
  },

  generateQuestion: function(size, target = 'echelon') {
    const A = MATRIX.create2D(size, size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        A[i][j] = Math.floor(Math.random() * 10) - 5;
      }
    }
    return {
      originalMatrix: MATRIX.copy(A),
      size: size,
      target: target
    };
  },

  generateRandomStep: function(currentMatrix, operationType) {
    const size = currentMatrix.length;
    if (operationType === 'swap') {
      const row1 = Math.floor(Math.random() * size);
      let row2 = Math.floor(Math.random() * size);
      while (row2 === row1) row2 = Math.floor(Math.random() * size);
      return { type: 'swap', row1: row1, row2: row2 };
    } else if (operationType === 'multiply') {
      const row = Math.floor(Math.random() * size);
      const k = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 0.5);
      return { type: 'multiply', row: row, k: k };
    } else if (operationType === 'addMultiple') {
      const sourceRow = Math.floor(Math.random() * size);
      let targetRow = Math.floor(Math.random() * size);
      while (targetRow === sourceRow) targetRow = Math.floor(Math.random() * size);
      const k = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      return { type: 'addMultiple', sourceRow: sourceRow, targetRow: targetRow, k: k };
    }
    return null;
  },

  applyOperation: function(A, operation) {
    if (operation.type === 'swap') {
      return this.swapRows(A, operation.row1, operation.row2).matrix;
    } else if (operation.type === 'multiply') {
      return this.multiplyRow(A, operation.row, operation.k).matrix;
    } else if (operation.type === 'addMultiple') {
      return this.addMultiple(A, operation.sourceRow, operation.targetRow, operation.k).matrix;
    }
    return A;
  },

  getOperationDescription: function(operation) {
    if (operation.type === 'swap') {
      return `交换第${operation.row1 + 1}行和第${operation.row2 + 1}行`;
    } else if (operation.type === 'multiply') {
      return `第${operation.row + 1}行乘以${operation.k.toFixed(2)}`;
    } else if (operation.type === 'addMultiple') {
      return `第${operation.targetRow + 1}行加上第${operation.sourceRow + 1}行的${operation.k}倍`;
    }
    return '';
  },

  validateMatrix: function(A) {
    if (!A || !Array.isArray(A) || A.length === 0) {
      return { valid: false, error: '矩阵格式错误' };
    }
    const cols = A[0].length;
    for (let i = 0; i < A.length; i++) {
      if (!Array.isArray(A[i]) || A[i].length !== cols) {
        return { valid: false, error: `第${i + 1}行列数不一致` };
      }
      for (let j = 0; j < cols; j++) {
        if (typeof A[i][j] !== 'number' || isNaN(A[i][j])) {
          return { valid: false, error: `元素A[${i + 1}][${j + 1}]不是有效数字` };
        }
      }
    }
    return { valid: true };
  }
};

module.exports = ElementaryTransform;