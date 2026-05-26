const Drawing2D = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  scale: 40,
  centerX: 0,
  centerY: 0,
  originX: 0,
  originY: 0,
  padding: 0.8,
  offsetX: 0,
  offsetY: 0,
  minScale: 5,
  maxScale: 500,
  lastTouchDist: 0,
  lastTouchX: 0,
  lastTouchY: 0,

  init: function(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.originX = this.centerX;
    this.originY = this.centerY;
    this.scale = 40;
    this.offsetX = 0;
    this.offsetY = 0;
    this.minScale = 5;
    this.maxScale = 500;
    this.padding = 0.85;
  },

  resetView: function() {
    this.offsetX = 0;
    this.offsetY = 0;
  },

  setScale: function(newScale) {
    this.scale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
  },

  zoomIn: function() {
    this.setScale(this.scale * 1.3);
  },

  zoomOut: function() {
    this.setScale(this.scale / 1.3);
  },

  pan: function(dx, dy) {
    this.offsetX += dx;
    this.offsetY += dy;
  },

  clear: function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);
  },

  autoScale: function(matrix, vectors) {
    let maxAbsValue = 0.1;

    if (vectors && vectors.length > 0) {
      for (let i = 0; i < vectors.length; i++) {
        const vec = vectors[i];
        if (vec && vec.length >= 2) {
          const len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
          maxAbsValue = Math.max(maxAbsValue, len);
        }
      }
    }

    if (matrix && matrix.length === 2) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const val = Math.abs(matrix[i][j]);
          if (!isNaN(val) && val !== 0) {
            maxAbsValue = Math.max(maxAbsValue, val);
          }
        }
      }
    }

    const maxCanvasDimension = Math.min(this.width, this.height) * this.padding;
    const targetRange = maxAbsValue * 2.5;
    let newScale = maxCanvasDimension / targetRange;
    newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
    this.scale = newScale;
    this.originX = this.width / 2;
    this.originY = this.height / 2;
  },

  getEffectiveOriginX: function() {
    return this.originX + this.offsetX;
  },

  getEffectiveOriginY: function() {
    return this.originY + this.offsetY;
  },

  toCanvasX: function(x) {
    return this.getEffectiveOriginX() + x * this.scale;
  },

  toCanvasY: function(y) {
    return this.getEffectiveOriginY() - y * this.scale;
  },

  toMathX: function(canvasX) {
    return (canvasX - this.getEffectiveOriginX()) / this.scale;
  },

  toMathY: function(canvasY) {
    return (this.getEffectiveOriginY() - canvasY) / this.scale;
  },

  handleTouchStart: function(touches) {
    if (!touches || touches.length === 0) return;

    const touch0 = touches[0];
    const x0 = touch0.clientX !== undefined ? touch0.clientX : (touch0.pageX || 0);
    const y0 = touch0.clientY !== undefined ? touch0.clientY : (touch0.pageY || 0);

    if (touches.length === 2) {
      const touch1 = touches[1];
      const x1 = touch1.clientX !== undefined ? touch1.clientX : (touch1.pageX || 0);
      const y1 = touch1.clientY !== undefined ? touch1.clientY : (touch1.pageY || 0);

      const dx = x0 - x1;
      const dy = y0 - y1;
      this.lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      this.lastTouchX = (x0 + x1) / 2;
      this.lastTouchY = (y0 + y1) / 2;
    } else if (touches.length === 1) {
      this.lastTouchX = x0;
      this.lastTouchY = y0;
    }
  },

  handleTouchMove: function(touches) {
    if (!touches || touches.length === 0) return;

    const touch0 = touches[0];
    const x0 = touch0.clientX !== undefined ? touch0.clientX : (touch0.pageX || 0);
    const y0 = touch0.clientY !== undefined ? touch0.clientY : (touch0.pageY || 0);

    if (touches.length === 2) {
      const touch1 = touches[1];
      const x1 = touch1.clientX !== undefined ? touch1.clientX : (touch1.pageX || 0);
      const y1 = touch1.clientY !== undefined ? touch1.clientY : (touch1.pageY || 0);

      const dx = x0 - x1;
      const dy = y0 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (this.lastTouchDist > 0) {
        const scaleFactor = dist / this.lastTouchDist;
        this.setScale(this.scale * scaleFactor);
      }
      this.lastTouchDist = dist;

      const centerX = (x0 + x1) / 2;
      const centerY = (y0 + y1) / 2;
      this.pan(centerX - this.lastTouchX, centerY - this.lastTouchY);
      this.lastTouchX = centerX;
      this.lastTouchY = centerY;
    } else if (touches.length === 1) {
      const dx = x0 - this.lastTouchX;
      const dy = y0 - this.lastTouchY;
      this.pan(dx, dy);
      this.lastTouchX = x0;
      this.lastTouchY = y0;
    }
  },

  drawGrid: function() {
    const ctx = this.ctx;
    const gridSize = this.scale;
    const effectiveOriginX = this.getEffectiveOriginX();
    const effectiveOriginY = this.getEffectiveOriginY();

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let x = effectiveOriginX % gridSize; x <= this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }

    for (let y = effectiveOriginY % gridSize; y <= this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
  },

  drawAxes: function() {
    const ctx = this.ctx;
    const effectiveOriginX = this.getEffectiveOriginX();
    const effectiveOriginY = this.getEffectiveOriginY();

    if (!ctx) {
      return;
    }

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, effectiveOriginY);
    ctx.lineTo(this.width, effectiveOriginY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(effectiveOriginX, 0);
    ctx.lineTo(effectiveOriginX, this.height);
    ctx.stroke();

    this.drawArrow(this.width - 10, effectiveOriginY - 5, this.width, effectiveOriginY, this.width - 10, effectiveOriginY + 5);
    this.drawArrow(effectiveOriginX - 5, 10, effectiveOriginX, 0, effectiveOriginX + 5, 10);

    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('x', this.width - 20, effectiveOriginY - 10);
    ctx.fillText('y', effectiveOriginX + 10, 20);
    ctx.fillText('O', effectiveOriginX - 15, effectiveOriginY + 15);

    this.drawAxisLabels();
  },

  drawArrow: function(x1, y1, x2, y2, x3, y3) {
    const ctx = this.ctx;
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  },

  drawAxisLabels: function() {
    const ctx = this.ctx;
    ctx.fillStyle = '#444444';
    ctx.font = '11px Arial';

    const effectiveOriginX = this.getEffectiveOriginX();
    const effectiveOriginY = this.getEffectiveOriginY();

    const maxX = (this.width - effectiveOriginX) / this.scale;
    const minX = -effectiveOriginX / this.scale;
    const maxY = effectiveOriginY / this.scale;
    const minY = -(this.height - effectiveOriginY) / this.scale;

    const absMax = Math.max(Math.abs(minX), Math.abs(maxX), Math.abs(minY), Math.abs(maxY), 0.5);
    let step = 1;
    let decimalPlaces = 0;

    if (absMax <= 0.1) {
      step = 0.01;
      decimalPlaces = 2;
    } else if (absMax <= 0.2) {
      step = 0.02;
      decimalPlaces = 2;
    } else if (absMax <= 0.5) {
      step = 0.05;
      decimalPlaces = 2;
    } else if (absMax <= 1) {
      step = 0.1;
      decimalPlaces = 1;
    } else if (absMax <= 2) {
      step = 0.2;
      decimalPlaces = 1;
    } else if (absMax <= 5) {
      step = 0.5;
      decimalPlaces = 1;
    } else if (absMax <= 10) {
      step = 1;
      decimalPlaces = 0;
    } else if (absMax <= 20) {
      step = 2;
      decimalPlaces = 0;
    } else if (absMax <= 50) {
      step = 5;
      decimalPlaces = 0;
    } else {
      step = Math.pow(10, Math.floor(Math.log10(absMax))) * (Math.ceil(absMax / Math.pow(10, Math.floor(Math.log10(absMax)))) || 1);
      if (step < 1) step = 1;
      else step = Math.round(step);
      decimalPlaces = 0;
    }

    const startX = Math.floor(minX / step) * step;
    const endX = Math.ceil(maxX / step) * step;
    for (let i = startX; i <= endX; i += step) {
      if (Math.abs(i) < 0.0001) continue;
      const x = this.toCanvasX(i);
      if (x < 0 || x > this.width) continue;
      const label = decimalPlaces === 0 ? Math.round(i).toString() : i.toFixed(decimalPlaces);
      ctx.fillText(label, x - label.length * 3, effectiveOriginY + 16);
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, effectiveOriginY - 4);
      ctx.lineTo(x, effectiveOriginY + 4);
      ctx.stroke();
    }

    const startY = Math.floor(minY / step) * step;
    const endY = Math.ceil(maxY / step) * step;
    for (let i = startY; i <= endY; i += step) {
      if (Math.abs(i) < 0.0001) continue;
      const y = this.toCanvasY(i);
      if (y < 0 || y > this.height) continue;
      const label = decimalPlaces === 0 ? Math.round(i).toString() : i.toFixed(decimalPlaces);
      ctx.fillText(label, effectiveOriginX - label.length * 4 - 4, y + 4);
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(effectiveOriginX - 4, y);
      ctx.lineTo(effectiveOriginX + 4, y);
      ctx.stroke();
    }
  },

  drawVector: function(x, y, color = '#667eea', lineWidth = 2) {
    const ctx = this.ctx;
    const effectiveOriginX = this.getEffectiveOriginX();
    const effectiveOriginY = this.getEffectiveOriginY();

    const startX = effectiveOriginX;
    const startY = effectiveOriginY;
    const endX = this.toCanvasX(x);
    const endY = this.toCanvasY(y);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(endX, endY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`(${x.toFixed(2)}, ${y.toFixed(2)})`, endX + 8, endY - 8);

    const angle = Math.atan2(startY - endY, endX - startX);
    const arrowSize = 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY + arrowSize * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY + arrowSize * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  },

  getDataRange: function(matrix, vectors) {
    let minVal = Infinity;
    let maxVal = -Infinity;

    if (vectors && vectors.length > 0) {
      for (let i = 0; i < vectors.length; i++) {
        const vec = vectors[i];
        if (vec && vec.length >= 2) {
          minVal = Math.min(minVal, vec[0], vec[1]);
          maxVal = Math.max(maxVal, vec[0], vec[1]);
        }
      }
    }

    if (matrix && matrix.length === 2) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const val = matrix[i][j];
          if (!isNaN(val)) {
            minVal = Math.min(minVal, val);
            maxVal = Math.max(maxVal, val);
          }
        }
      }
    }

    if (minVal === Infinity) {
      minVal = -1;
      maxVal = 1;
    }

    return { min: minVal, max: maxVal };
  }
};

module.exports = Drawing2D;
