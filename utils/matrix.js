const MATRIX = {
  add: function(A, B) {
    if (A.length !== B.length || A[0].length !== B[0].length) {
      return null;
    }
    const result = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < A[0].length; j++) {
        result[i][j] = A[i][j] + B[i][j];
      }
    }
    return result;
  },

  subtract: function(A, B) {
    if (A.length !== B.length || A[0].length !== B[0].length) {
      return null;
    }
    const result = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < A[0].length; j++) {
        result[i][j] = A[i][j] - B[i][j];
      }
    }
    return result;
  },

  multiply: function(A, B) {
    if (A[0].length !== B.length) {
      return null;
    }
    const result = [];
    const m = A.length;
    const n = B[0].length;
    const p = B.length;
    for (let i = 0; i < m; i++) {
      result[i] = [];
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < p; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  },

  scalarMultiply: function(A, k) {
    const result = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < A[0].length; j++) {
        result[i][j] = A[i][j] * k;
      }
    }
    return result;
  },

  transpose: function(A) {
    const result = [];
    for (let i = 0; i < A[0].length; i++) {
      result[i] = [];
      for (let j = 0; j < A.length; j++) {
        result[i][j] = A[j][i];
      }
    }
    return result;
  },

  identity: function(n) {
    const result = [];
    for (let i = 0; i < n; i++) {
      result[i] = [];
      for (let j = 0; j < n; j++) {
        result[i][j] = i === j ? 1 : 0;
      }
    }
    return result;
  },

  zeros: function(m, n) {
    const result = [];
    for (let i = 0; i < m; i++) {
      result[i] = [];
      for (let j = 0; j < n; j++) {
        result[i][j] = 0;
      }
    }
    return result;
  },

  determinant: function(A) {
    const n = A.length;
    if (n !== A[0].length) return null;
    if (n === 1) return A[0][0];
    if (n === 2) {
      return A[0][0] * A[1][1] - A[0][1] * A[1][0];
    }
    let det = 0;
    for (let j = 0; j < n; j++) {
      det += Math.pow(-1, j) * A[0][j] * this.determinant(this.getMinor(A, 0, j));
    }
    return det;
  },

  getMinor: function(A, row, col) {
    const result = [];
    for (let i = 0; i < A.length; i++) {
      if (i === row) continue;
      const newRow = [];
      for (let j = 0; j < A[0].length; j++) {
        if (j === col) continue;
        newRow.push(A[i][j]);
      }
      result.push(newRow);
    }
    return result;
  },

  inverse: function(A) {
    const n = A.length;
    if (n !== A[0].length) return null;
    const det = this.determinant(A);
    if (Math.abs(det) < 1e-10) return null;
    if (n === 2) {
      return [
        [A[1][1] / det, -A[0][1] / det],
        [-A[1][0] / det, A[0][0] / det]
      ];
    }
    const cofactors = [];
    for (let i = 0; i < n; i++) {
      cofactors[i] = [];
      for (let j = 0; j < n; j++) {
        cofactors[i][j] = Math.pow(-1, i + j) * this.determinant(this.getMinor(A, i, j));
      }
    }
    const adjugate = this.transpose(cofactors);
    return this.scalarMultiply(adjugate, 1 / det);
  },

  equals: function(A, B, tolerance = 1e-6) {
    if (!A || !B || A.length !== B.length || A[0].length !== B[0].length) {
      return false;
    }
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < A[0].length; j++) {
        if (Math.abs(A[i][j] - B[i][j]) > tolerance) {
          return false;
        }
      }
    }
    return true;
  },

  copy: function(A) {
    return A.map(row => [...row]);
  },

  toVector: function(A) {
    return A.map(row => row[0]);
  },

  fromVector: function(v) {
    return v.map(x => [x]);
  },

  norm: function(v) {
    let sum = 0;
    for (let i = 0; i < v.length; i++) {
      sum += v[i] * v[i];
    }
    return Math.sqrt(sum);
  },

  dot: function(v1, v2) {
    let sum = 0;
    for (let i = 0; i < v1.length; i++) {
      sum += v1[i] * v2[i];
    }
    return sum;
  },

  cross: function(v1, v2) {
    if (v1.length !== 3 || v2.length !== 3) return null;
    return [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0]
    ];
  },

  normalize: function(v) {
    const len = this.norm(v);
    if (len < 1e-10) return v;
    return v.map(x => x / len);
  },

  scale: function(v, s) {
    return v.map(x => x * s);
  },

  addVectors: function(v1, v2) {
    return v1.map((x, i) => x + v2[i]);
  },

  subtractVectors: function(v1, v2) {
    return v1.map((x, i) => x - v2[i]);
  },

  create2D: function(m, n, val = 0) {
    const result = [];
    for (let i = 0; i < m; i++) {
      result[i] = [];
      for (let j = 0; j < n; j++) {
        result[i][j] = val;
      }
    }
    return result;
  },

  formatMatrix: function(A, decimals = 4) {
    return A.map(row => 
      row.map(x => {
        if (Math.abs(x) < 1e-10) return '0';
        return x.toFixed(decimals).replace(/\.?0+$/, '');
      }).join('  ')
    ).join('\n');
  },

  parseInput: function(str) {
    const rows = str.trim().split('\n');
    const matrix = rows.map(row => 
      row.split(/[\s,]+/).filter(x => x).map(x => parseFloat(x))
    );
    if (matrix.length > 0 && matrix[0].length > 0) {
      const cols = matrix[0].length;
      return matrix.every(row => row.length === cols) ? matrix : null;
    }
    return null;
  }
};

module.exports = MATRIX;