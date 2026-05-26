const MATRIX = require('./matrix.js');

const LinearTransform = {
  rotation2D: function(angle) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
      [cos, -sin],
      [sin, cos]
    ];
  },

  reflection2D: function(axis) {
    switch (axis) {
      case 'x':
        return [[1, 0], [0, -1]];
      case 'y':
        return [[-1, 0], [0, 1]];
      case 'y=x':
        return [[0, 1], [1, 0]];
      case 'y=-x':
        return [[0, -1], [-1, 0]];
      default:
        return null;
    }
  },

  scaling2D: function(sx, sy) {
    return [
      [sx, 0],
      [0, sy]
    ];
  },

  shear2D: function(direction, k) {
    if (direction === 'x') {
      return [[1, k], [0, 1]];
    } else if (direction === 'y') {
      return [[1, 0], [k, 1]];
    }
    return null;
  },

  projection2D: function(axis) {
    if (axis === 'x') {
      return [[1, 0], [0, 0]];
    } else if (axis === 'y') {
      return [[0, 0], [0, 1]];
    }
    return null;
  },

  rotation3DX: function(angle) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
      [1, 0, 0],
      [0, cos, -sin],
      [0, sin, cos]
    ];
  },

  rotation3DY: function(angle) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
      [cos, 0, sin],
      [0, 1, 0],
      [-sin, 0, cos]
    ];
  },

  rotation3DZ: function(angle) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1]
    ];
  },

  reflection3D: function(plane) {
    switch (plane) {
      case 'xOy':
        return [[1, 0, 0], [0, 1, 0], [0, 0, -1]];
      case 'yOz':
        return [[-1, 0, 0], [0, 1, 0], [0, 0, 1]];
      case 'xOz':
        return [[1, 0, 0], [0, -1, 0], [0, 0, 1]];
      default:
        return null;
    }
  },

  scaling3D: function(sx, sy, sz) {
    return [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, sz]
    ];
  },

  projection3D: function(plane) {
    switch (plane) {
      case 'xOy':
        return [[1, 0, 0], [0, 1, 0], [0, 0, 0]];
      case 'yOz':
        return [[0, 0, 0], [0, 1, 0], [0, 0, 1]];
      case 'xOz':
        return [[1, 0, 0], [0, 0, 0], [0, 0, 1]];
      default:
        return null;
    }
  },

  apply2D: function(matrix, vector) {
    const result = [0, 0];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        result[i] += matrix[i][j] * vector[j];
      }
    }
    return result;
  },

  apply3D: function(matrix, vector) {
    const result = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[i] += matrix[i][j] * vector[j];
      }
    }
    return result;
  },

  compose2D: function(matrices) {
    let result = matrices[0];
    for (let i = 1; i < matrices.length; i++) {
      result = MATRIX.multiply(result, matrices[i]);
    }
    return result;
  },

  compositeSteps: function(matrices) {
    const steps = [];
    let current = [[1, 0], [0, 1]];
    steps.push({ matrix: MATRIX.copy(current), desc: '单位矩阵' });
    for (let i = 0; i < matrices.length; i++) {
      current = MATRIX.multiply(current, matrices[i]);
      steps.push({ matrix: MATRIX.copy(current), desc: `变换 ${i + 1}` });
    }
    return steps;
  },

  getTransformType: function(matrix) {
    if (!matrix || matrix.length !== 2) return 'unknown';
    const [[a, b], [c, d]] = matrix;
    const det = a * d - b * c;
    if (Math.abs(det - 1) < 1e-6) {
      if (Math.abs(a - d) < 1e-6 && Math.abs(b) < 1e-6 && Math.abs(c) < 1e-6) {
        if (Math.abs(a - 1) < 1e-6) return '恒等变换';
        if (Math.abs(a + 1) < 1e-6) return '旋转180°';
      }
      if (Math.abs(a * a + b * b - 1) < 1e-6 && Math.abs(c + b) < 1e-6 && Math.abs(d - a) < 1e-6) {
        return '旋转';
      }
    }
    if (Math.abs(det) < 1e-6) return '投影';
    if (Math.abs(det) < 1e-3) return '压缩';
    if (det < 0) return '反射';
    return '缩放旋转';
  },

  generateRotationQuestion: function(angle, isCounterClockwise = true) {
    const dir = isCounterClockwise ? 1 : -1;
    const matrix = this.rotation2D(dir * angle);
    return {
      type: 'rotation',
      dimension: 2,
      angle: angle,
      counterClockwise: isCounterClockwise,
      matrix: matrix,
      originalVectors: [[1, 0], [0, 1]],
      description: `${isCounterClockwise ? '逆' : '顺'}时针旋转${angle}°`
    };
  },

  generateReflectionQuestion: function(axis) {
    const matrix = this.reflection2D(axis);
    return {
      type: 'reflection',
      dimension: 2,
      axis: axis,
      matrix: matrix,
      originalVectors: [[1, 0], [0, 1]],
      description: `关于${axis === 'x' ? 'x轴' : axis === 'y' ? 'y轴' : axis === 'y=x' ? 'y=x' : 'y=-x'}反射`
    };
  },

  generateScalingQuestion: function(sx, sy) {
    const matrix = this.scaling2D(sx, sy);
    return {
      type: 'scaling',
      dimension: 2,
      sx: sx,
      sy: sy,
      matrix: matrix,
      originalVectors: [[1, 0], [0, 1]],
      description: `缩放变换 (${sx}, ${sy})`
    };
  },

  generateShearQuestion: function(direction, k) {
    const matrix = this.shear2D(direction, k);
    return {
      type: 'shear',
      dimension: 2,
      direction: direction,
      k: k,
      matrix: matrix,
      originalVectors: [[1, 0], [0, 1]],
      description: `${direction === 'x' ? '水平' : '竖直'}剪切 ${k} 倍`
    };
  },

  generateProjectionQuestion: function(axis) {
    const matrix = this.projection2D(axis);
    return {
      type: 'projection',
      dimension: 2,
      axis: axis,
      matrix: matrix,
      originalVectors: [[1, 0], [0, 1]],
      description: `向${axis === 'x' ? 'x轴' : 'y轴'}投影`
    };
  },

  verifyAnswer: function(correctMatrix, userMatrix, tolerance = 1e-4) {
    return MATRIX.equals(correctMatrix, userMatrix, tolerance);
  },

  findErrors: function(correctMatrix, userMatrix, tolerance = 1e-4) {
    const errors = [];
    if (!correctMatrix || !userMatrix) {
      return [{ position: 'matrix', message: '矩阵格式错误' }];
    }
    for (let i = 0; i < correctMatrix.length; i++) {
      for (let j = 0; j < correctMatrix[0].length; j++) {
        if (Math.abs(correctMatrix[i][j] - userMatrix[i][j]) > tolerance) {
          errors.push({
            row: i,
            col: j,
            expected: correctMatrix[i][j],
            received: userMatrix[i][j]
          });
        }
      }
    }
    return errors;
  }
};

module.exports = LinearTransform;