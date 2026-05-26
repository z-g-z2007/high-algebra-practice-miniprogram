const Drawing3D = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  scale: 40,
  centerX: 0,
  centerY: 0,
  originX: 0,
  originY: 0,
  offsetX: 0,
  offsetY: 0,
  rotation: { x: 0.5, y: 0.5, z: 0.2 },
  isDragging: false,
  lastTouch: { x: 0, y: 0 },
  rotationSpeed: 0.015,
  minScale: 5,
  maxScale: 500,
  lastTouchDist: 0,
  padding: 0.8,

  init: function(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.originX = this.centerX;
    this.originY = this.centerY;
    this.offsetX = 0;
    this.offsetY = 0;
    this.minScale = 5;
    this.maxScale = 500;
    this.padding = 0.8;
    this.axisLength = 4;
  },

  clear: function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);
  },

  setRotation: function(rotations) {
    this.rotation = rotations;
  },

  getEffectiveOriginX: function() {
    return this.originX + this.offsetX;
  },

  getEffectiveOriginY: function() {
    return this.originY + this.offsetY;
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

  resetView: function() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 40;
    this.axisLength = 4;
  },

  autoScale: function(matrix, vectors) {
    let maxAbsValue = 0.1;

    if (vectors && vectors.length > 0) {
      for (let i = 0; i < vectors.length; i++) {
        const vec = vectors[i];
        if (vec && vec.length >= 3) {
          const len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
          maxAbsValue = Math.max(maxAbsValue, len);
        }
      }
    }

    if (matrix && matrix.length === 3) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const val = Math.abs(matrix[i][j]);
          if (!isNaN(val) && val !== 0) {
            maxAbsValue = Math.max(maxAbsValue, val);
          }
        }
      }
    }

    const maxCanvasDimension = Math.min(this.width, this.height) * this.padding;
    const targetRange = maxAbsValue * 3;
    let newScale = maxCanvasDimension / targetRange;
    newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
    this.scale = newScale;
    this.originX = this.width / 2;
    this.originY = this.height / 2;

    if (maxAbsValue <= 1) {
      this.axisLength = Math.ceil(maxAbsValue * 2);
      this.axisLength = Math.max(1, this.axisLength);
    } else {
      this.axisLength = Math.ceil(maxAbsValue * 1.5);
      this.axisLength = Math.min(this.axisLength, 10);
    }
    this.axisLength = Math.max(this.axisLength, 1);
  },

  projectOrtho: function(x, y, z) {
    const cosX = Math.cos(this.rotation.x);
    const sinX = Math.sin(this.rotation.x);
    const cosY = Math.cos(this.rotation.y);
    const sinY = Math.sin(this.rotation.y);
    const cosZ = Math.cos(this.rotation.z);
    const sinZ = Math.sin(this.rotation.z);

    let X = x;
    let Y = z;
    let Z = y;

    const tempX1 = X * cosZ - Y * sinZ;
    const tempY1 = X * sinZ + Y * cosZ;
    X = tempX1;
    Y = tempY1;

    const tempY2 = Y * cosX - Z * sinX;
    Z = Y * sinX + Z * cosX;
    Y = tempY2;

    const tempX2 = X * cosY + Z * sinY;
    Z = -X * sinY + Z * cosY;
    X = tempX2;

    return {
      x: this.getEffectiveOriginX() + X * this.scale,
      y: this.getEffectiveOriginY() - Y * this.scale,
      z: Z
    };
  },

  project: function(x, y, z) {
    const cosX = Math.cos(this.rotation.x);
    const sinX = Math.sin(this.rotation.x);
    const cosY = Math.cos(this.rotation.y);
    const sinY = Math.sin(this.rotation.y);
    const cosZ = Math.cos(this.rotation.z);
    const sinZ = Math.sin(this.rotation.z);

    let X = x;
    let Y = z;
    let Z = y;

    const tempX1 = X * cosZ - Y * sinZ;
    const tempY1 = X * sinZ + Y * cosZ;
    X = tempX1;
    Y = tempY1;

    const tempY2 = Y * cosX - Z * sinX;
    Z = Y * sinX + Z * cosX;
    Y = tempY2;

    const tempX2 = X * cosY + Z * sinY;
    Z = -X * sinY + Z * cosY;
    X = tempX2;

    const distance = 5;
    const scale = this.scale * distance / (distance + Z);

    return {
      x: this.getEffectiveOriginX() + X * scale,
      y: this.getEffectiveOriginY() - Y * scale,
      z: Z
    };
  },

  drawGrid: function() {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const gridRange = 5;
    const gridColor = 'rgba(180, 180, 180, 0.15)';
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.3;

    const drawLine3DOrtho = (x1, y1, z1, x2, y2, z2, color, lineWidth) => {
      const p1 = this.projectOrtho(x1, y1, z1);
      const p2 = this.projectOrtho(x2, y2, z2);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    };

    for (let i = -gridRange; i <= gridRange; i++) {
      drawLine3DOrtho(i, -gridRange, 0, i, gridRange, 0, gridColor, 0.3);
      drawLine3DOrtho(-gridRange, i, 0, gridRange, i, 0, gridColor, 0.3);
    }

    for (let i = -gridRange; i <= gridRange; i++) {
      drawLine3DOrtho(i, 0, -gridRange, i, 0, gridRange, gridColor, 0.3);
      drawLine3DOrtho(-gridRange, 0, i, gridRange, 0, i, gridColor, 0.3);
    }

    for (let i = -gridRange; i <= gridRange; i++) {
      drawLine3DOrtho(0, i, -gridRange, 0, i, gridRange, gridColor, 0.3);
      drawLine3DOrtho(0, -gridRange, i, 0, gridRange, i, gridColor, 0.3);
    }
  },

  drawAxes: function() {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const axisLength = this.axisLength || 4;

    this.drawLine3D(-axisLength, 0, 0, axisLength, 0, 0, '#e74c3c', 2);
    this.drawLine3D(0, -axisLength, 0, 0, axisLength, 0, '#27ae60', 2);
    this.drawLine3D(0, 0, -axisLength, 0, 0, axisLength, '#3498db', 2);

    this.drawArrow3D(axisLength, 0, 0, '#e74c3c');
    this.drawArrow3D(0, axisLength, 0, '#27ae60');
    this.drawArrow3D(0, 0, axisLength, '#3498db');

    const xLabel = this.project(axisLength + 0.6, 0, 0);
    const yLabel = this.project(0, axisLength + 0.6, 0);
    const zLabel = this.project(0, 0, axisLength + 0.6);
    const origin = this.project(0, 0, 0);

    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('x', xLabel.x - 4, xLabel.y + 4);
    
    ctx.fillStyle = '#27ae60';
    ctx.fillText('y', yLabel.x - 4, yLabel.y + 4);
    
    ctx.fillStyle = '#3498db';
    ctx.fillText('z', zLabel.x - 4, zLabel.y + 4);

    ctx.fillStyle = '#333333';
    ctx.fillText('O', origin.x - 15, origin.y + 15);

    this.drawAxisTicks();
  },

  drawArrow3D: function(x, y, z, color) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const p = this.project(x, y, z);
    const origin = this.project(0, 0, 0);
    
    const angle = Math.atan2(p.y - origin.y, p.x - origin.x);
    const arrowSize = 10;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(
      p.x - arrowSize * Math.cos(angle - Math.PI / 6),
      p.y - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      p.x - arrowSize * Math.cos(angle + Math.PI / 6),
      p.y - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  },

  drawAxisTicks: function() {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const tickRange = this.axisLength || 4;
    const maxAbsValue = Math.max(Math.abs(tickRange), 0.1);

    let step = 1;
    if (maxAbsValue <= 0.5) {
      step = 0.05;
    } else if (maxAbsValue <= 1) {
      step = 0.1;
    } else if (maxAbsValue <= 2) {
      step = 0.2;
    } else if (maxAbsValue <= 5) {
      step = 0.5;
    }

    ctx.font = '10px Arial';
    ctx.fillStyle = '#666666';

    for (let i = -tickRange; i <= tickRange; i += step) {
      if (Math.abs(i) < 0.0001) continue;

      const xTick = this.project(i, 0, 0);
      const yTick = this.project(0, i, 0);
      const zTick = this.project(0, 0, i);

      const label = (i % 1 === 0) ? i.toString() : i.toFixed(2).replace(/\.?0+$/, '');

      ctx.fillStyle = '#e74c3c';
      ctx.fillText(label, xTick.x - 4, xTick.y + 12);
      
      ctx.fillStyle = '#27ae60';
      ctx.fillText(label, yTick.x - 4, yTick.y + 12);
      
      ctx.fillStyle = '#3498db';
      ctx.fillText(label, zTick.x - 4, zTick.y + 12);
    }
  },

  drawLine3D: function(x1, y1, z1, x2, y2, z2, color = '#333333', lineWidth = 1) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const p1 = this.project(x1, y1, z1);
    const p2 = this.project(x2, y2, z2);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  },

  drawPoint3D: function(x, y, z, color = '#667eea', radius = 4) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const p = this.project(x, y, z);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  },

  drawVector: function(x, y, z, color = '#667eea') {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const start = this.project(0, 0, 0);
    const end = this.project(x, y, z);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    this.drawArrow3D(x, y, z, color);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(end.x, end.y, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#333333';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`, end.x + 10, end.y - 10);
  },

  drawCube: function(size = 2, color = '#667eea') {
    if (!this.ctx) return;
    
    const s = size / 2;
    const vertices = [
      [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
      [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    edges.forEach(edge => {
      const v1 = vertices[edge[0]];
      const v2 = vertices[edge[1]];
      this.drawLine3D(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], color, 2);
    });

    vertices.forEach(v => {
      this.drawPoint3D(v[0], v[1], v[2], color, 4);
    });
  },

  drawMatrixTransform: function(matrix, color = 'rgba(102, 126, 234, 0.5)') {
    if (!this.ctx) return;
    
    const s = 1;
    const vertices = [
      [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
      [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    const transformVertex = (v) => {
      if (matrix.length === 2) {
        return [
          matrix[0][0] * v[0] + matrix[0][1] * v[1],
          matrix[1][0] * v[0] + matrix[1][1] * v[1],
          v[2]
        ];
      } else {
        return [
          matrix[0][0] * v[0] + matrix[0][1] * v[1] + matrix[0][2] * v[2],
          matrix[1][0] * v[0] + matrix[1][1] * v[1] + matrix[1][2] * v[2],
          matrix[2][0] * v[0] + matrix[2][1] * v[1] + matrix[2][2] * v[2]
        ];
      }
    };

    edges.forEach(edge => {
      const v1 = transformVertex(vertices[edge[0]]);
      const v2 = transformVertex(vertices[edge[1]]);
      this.drawLine3D(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], color, 2);
    });
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
      this.lastTouch = {
        x: (x0 + x1) / 2,
        y: (y0 + y1) / 2
      };
    } else if (touches.length === 1) {
      this.isDragging = true;
      this.lastTouch = {
        x: x0,
        y: y0
      };
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
      this.pan(centerX - this.lastTouch.x, centerY - this.lastTouch.y);
      this.lastTouch = {
        x: centerX,
        y: centerY
      };
    } else if (touches.length === 1 && this.isDragging) {
      const deltaX = x0 - this.lastTouch.x;
      const deltaY = y0 - this.lastTouch.y;

      this.rotation.y += deltaX * this.rotationSpeed;
      this.rotation.x -= deltaY * this.rotationSpeed;

      this.lastTouch = {
        x: x0,
        y: y0
      };
    }
  },

  handleTouchEnd: function() {
    this.isDragging = false;
    this.lastTouchDist = 0;
  },

  touchStart: function(e) {
    this.handleTouchStart(e.touches);
  },

  touchMove: function(e) {
    this.handleTouchMove(e.touches);
  },

  touchEnd: function() {
    this.handleTouchEnd();
  }
};

module.exports = Drawing3D;
