const LinearTransform = require('./linear-transform.js');

const QuestionBank = {
  linear2D: {
    easy: [
      {
        id: 'lt2d_e_001',
        type: 'rotation',
        dimension: 2,
        angle: 90,
        counterClockwise: true,
        matrix: [[0, -1], [1, 0]],
        description: '逆时针旋转90°，请填写旋转矩阵',
        hint: 'cos(90°)=0, sin(90°)=1，矩阵为[0, -1; 1, 0]',
        difficulty: 'easy',
        originalVector: [1, 0],
        expectedVector: [0, 1]
      },
      {
        id: 'lt2d_e_002',
        type: 'rotation',
        dimension: 2,
        angle: 180,
        counterClockwise: true,
        matrix: [[-1, 0], [0, -1]],
        description: '逆时针旋转180°，请填写旋转矩阵',
        hint: 'cos(180°)=-1, sin(180°)=0，矩阵为[-1, 0; 0, -1]',
        difficulty: 'easy',
        originalVector: [1, 0],
        expectedVector: [-1, 0]
      },
      {
        id: 'lt2d_e_003',
        type: 'rotation',
        dimension: 2,
        angle: 270,
        counterClockwise: true,
        matrix: [[0, 1], [-1, 0]],
        description: '逆时针旋转270°，请填写旋转矩阵',
        hint: 'cos(270°)=0, sin(270°)=-1，矩阵为[0, 1; -1, 0]',
        difficulty: 'easy',
        originalVector: [1, 0],
        expectedVector: [0, -1]
      },
      {
        id: 'lt2d_e_004',
        type: 'rotation',
        dimension: 2,
        angle: 90,
        counterClockwise: false,
        matrix: [[0, 1], [-1, 0]],
        description: '顺时针旋转90°，请填写旋转矩阵',
        hint: '顺时针旋转90°等于逆时针旋转270°',
        difficulty: 'easy',
        originalVector: [1, 0],
        expectedVector: [0, -1]
      },
      {
        id: 'lt2d_e_005',
        type: 'reflection',
        dimension: 2,
        axis: 'x',
        matrix: [[1, 0], [0, -1]],
        description: '关于x轴反射，请填写反射矩阵',
        hint: '关于x轴对称：x坐标不变，y坐标取反，矩阵为[1, 0; 0, -1]',
        difficulty: 'easy',
        originalVector: [1, 1],
        expectedVector: [1, -1]
      },
      {
        id: 'lt2d_e_006',
        type: 'reflection',
        dimension: 2,
        axis: 'y',
        matrix: [[-1, 0], [0, 1]],
        description: '关于y轴反射，请填写反射矩阵',
        hint: '关于y轴对称：y坐标不变，x坐标取反，矩阵为[-1, 0; 0, 1]',
        difficulty: 'easy',
        originalVector: [1, 1],
        expectedVector: [-1, 1]
      },
      {
        id: 'lt2d_e_007',
        type: 'reflection',
        dimension: 2,
        axis: 'y=x',
        matrix: [[0, 1], [1, 0]],
        description: '关于直线y=x对称，请填写反射矩阵',
        hint: '关于y=x对称：x和y交换，矩阵为[0, 1; 1, 0]',
        difficulty: 'easy',
        originalVector: [1, 2],
        expectedVector: [2, 1]
      },
      {
        id: 'lt2d_e_008',
        type: 'reflection',
        dimension: 2,
        axis: 'y=-x',
        matrix: [[0, -1], [-1, 0]],
        description: '关于直线y=-x对称，请填写反射矩阵',
        hint: '关于y=-x对称：x和y交换且都取反，矩阵为[0, -1; -1, 0]',
        difficulty: 'easy',
        originalVector: [1, 2],
        expectedVector: [-2, -1]
      },
      {
        id: 'lt2d_e_009',
        type: 'scaling',
        dimension: 2,
        sx: 2,
        sy: 1,
        matrix: [[2, 0], [0, 1]],
        description: 'x轴放大2倍，请填写缩放矩阵',
        hint: 'x方向缩放2倍，y方向不变，矩阵为[2, 0; 0, 1]',
        difficulty: 'easy',
        originalVector: [1, 1],
        expectedVector: [2, 1]
      },
      {
        id: 'lt2d_e_010',
        type: 'scaling',
        dimension: 2,
        sx: 1,
        sy: 2,
        matrix: [[1, 0], [0, 2]],
        description: 'y轴放大2倍，请填写缩放矩阵',
        hint: 'y方向缩放2倍，x方向不变，矩阵为[1, 0; 0, 2]',
        difficulty: 'easy',
        originalVector: [1, 1],
        expectedVector: [1, 2]
      },
      {
        id: 'lt2d_e_011',
        type: 'scaling',
        dimension: 2,
        sx: 0.5,
        sy: 0.5,
        matrix: [[0.5, 0], [0, 0.5]],
        description: '整体缩小0.5倍，请填写缩放矩阵',
        hint: 'x和y方向都缩放0.5倍，矩阵为[0.5, 0; 0, 0.5]',
        difficulty: 'easy',
        originalVector: [2, 2],
        expectedVector: [1, 1]
      },
      {
        id: 'lt2d_e_012',
        type: 'shear',
        dimension: 2,
        axis: 'x',
        factor: 1,
        matrix: [[1, 1], [0, 1]],
        description: '沿x轴方向切变（切变因子为1），请填写切变矩阵',
        hint: '沿x轴切变矩阵为[1, k; 0, 1]，k为切变因子',
        difficulty: 'easy',
        originalVector: [1, 1],
        expectedVector: [2, 1]
      }
    ],
    medium: [
      {
        id: 'lt2d_m_001',
        type: 'scaling',
        dimension: 2,
        sx: 2,
        sy: 0.5,
        matrix: [[2, 0], [0, 0.5]],
        description: 'x轴放大2倍，y轴缩小0.5倍，请填写缩放矩阵',
        hint: '缩放矩阵为对角矩阵[sx, 0; 0, sy]',
        difficulty: 'medium',
        originalVector: [1, 2],
        expectedVector: [2, 1]
      },
      {
        id: 'lt2d_m_002',
        type: 'scaling',
        dimension: 2,
        sx: 3,
        sy: 2,
        matrix: [[3, 0], [0, 2]],
        description: 'x轴放大3倍，y轴放大2倍，请填写缩放矩阵',
        hint: '矩阵为[3, 0; 0, 2]',
        difficulty: 'medium',
        originalVector: [1, 1],
        expectedVector: [3, 2]
      },
      {
        id: 'lt2d_m_003',
        type: 'scaling',
        dimension: 2,
        sx: 0.5,
        sy: 3,
        matrix: [[0.5, 0], [0, 3]],
        description: 'x轴缩小0.5倍，y轴放大3倍，请填写缩放矩阵',
        hint: '矩阵为[0.5, 0; 0, 3]',
        difficulty: 'medium',
        originalVector: [2, 1],
        expectedVector: [1, 3]
      },
      {
        id: 'lt2d_m_004',
        type: 'shear',
        dimension: 2,
        direction: 'x',
        k: 1,
        matrix: [[1, 1], [0, 1]],
        description: '水平向右剪切1倍，请填写剪切矩阵',
        hint: 'X方向剪切矩阵：[1, k; 0, 1]，k=1时为[1, 1; 0, 1]',
        difficulty: 'medium',
        originalVector: [1, 1],
        expectedVector: [2, 1]
      },
      {
        id: 'lt2d_m_005',
        type: 'shear',
        dimension: 2,
        direction: 'y',
        k: 2,
        matrix: [[1, 0], [2, 1]],
        description: '竖直向上剪切2倍，请填写剪切矩阵',
        hint: 'Y方向剪切矩阵：[1, 0; k, 1]，k=2时为[1, 0; 2, 1]',
        difficulty: 'medium',
        originalVector: [1, 1],
        expectedVector: [1, 3]
      },
      {
        id: 'lt2d_m_006',
        type: 'shear',
        dimension: 2,
        direction: 'x',
        k: 0.5,
        matrix: [[1, 0.5], [0, 1]],
        description: '水平向右剪切0.5倍，请填写剪切矩阵',
        hint: '矩阵为[1, 0.5; 0, 1]',
        difficulty: 'medium',
        originalVector: [2, 2],
        expectedVector: [3, 2]
      },
      {
        id: 'lt2d_m_007',
        type: 'projection',
        dimension: 2,
        axis: 'x',
        matrix: [[1, 0], [0, 0]],
        description: '向x轴正交投影，请填写投影矩阵',
        hint: '向x轴投影：y坐标变为0，矩阵为[1, 0; 0, 0]',
        difficulty: 'medium',
        originalVector: [2, 3],
        expectedVector: [2, 0]
      },
      {
        id: 'lt2d_m_008',
        type: 'projection',
        dimension: 2,
        axis: 'y',
        matrix: [[0, 0], [0, 1]],
        description: '向y轴正交投影，请填写投影矩阵',
        hint: '向y轴投影：x坐标变为0，矩阵为[0, 0; 0, 1]',
        difficulty: 'medium',
        originalVector: [2, 3],
        expectedVector: [0, 3]
      },
      {
        id: 'lt2d_m_009',
        type: 'rotation',
        dimension: 2,
        angle: 180,
        counterClockwise: true,
        matrix: [[-1, 0], [0, -1]],
        description: '逆时针旋转180°，请填写旋转矩阵',
        hint: 'cos(180°)=-1, sin(180°)=0，矩阵为[-1, 0; 0, -1]',
        difficulty: 'medium',
        originalVector: [1, 2],
        expectedVector: [-1, -2]
      },
      {
        id: 'lt2d_m_010',
        type: 'rotation',
        dimension: 2,
        angle: 270,
        counterClockwise: true,
        matrix: [[0, 1], [-1, 0]],
        description: '逆时针旋转270°，请填写旋转矩阵',
        hint: 'cos(270°)=0, sin(270°)=-1，矩阵为[0, 1; -1, 0]',
        difficulty: 'medium',
        originalVector: [1, 2],
        expectedVector: [2, -1]
      }
    ],
    hard: [
      {
        id: 'lt2d_h_001',
        type: 'composite',
        dimension: 2,
        description: '先关于y=x对称，再y轴放大3倍，请填写复合变换矩阵',
        hint: '先反射再缩放，矩阵为[0, 3; 1, 0]',
        matrix: [[0, 3], [1, 0]],
        difficulty: 'hard',
        originalVector: [1, 2],
        expectedVector: [6, 1]
      },
      {
        id: 'lt2d_h_002',
        type: 'composite',
        dimension: 2,
        description: '先逆时针旋转90°，再关于x轴反射，请填写复合变换矩阵',
        hint: '旋转矩阵[0,-1;1,0]，反射矩阵[1,0;0,-1]，复合为[0,1;1,0]',
        matrix: [[0, 1], [1, 0]],
        difficulty: 'hard',
        originalVector: [1, 0],
        expectedVector: [0, 1]
      },
      {
        id: 'lt2d_h_003',
        type: 'shear',
        dimension: 2,
        direction: 'y',
        k: -1,
        matrix: [[1, 0], [-1, 1]],
        description: '竖直向下剪切1倍，请填写剪切矩阵',
        hint: 'k为负值，矩阵为[1, 0; -1, 1]',
        difficulty: 'hard',
        originalVector: [1, 1],
        expectedVector: [1, 0]
      },
      {
        id: 'lt2d_h_004',
        type: 'composite',
        dimension: 2,
        description: '先水平剪切1倍，再关于y轴反射，请填写复合变换矩阵',
        hint: '剪切矩阵[1,1;0,1]，反射矩阵[-1,0;0,1]，复合为[-1,-1;0,1]',
        matrix: [[-1, -1], [0, 1]],
        difficulty: 'hard',
        originalVector: [1, 1],
        expectedVector: [-2, 1]
      }
    ]
  },
  linear3D: {
    easy: [
      {
        id: 'lt3d_e_001',
        type: 'rotation',
        dimension: 3,
        axis: 'x',
        angle: 90,
        matrix: [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
        description: '绕X轴旋转90°，请填写3D旋转矩阵',
        hint: '绕X轴旋转矩阵第一行第一列为1，右下角2x2为2D旋转矩阵',
        difficulty: 'easy',
        originalVector: [0, 1, 0],
        expectedVector: [0, 0, 1]
      },
      {
        id: 'lt3d_e_002',
        type: 'rotation',
        dimension: 3,
        axis: 'x',
        angle: 180,
        matrix: [[1, 0, 0], [0, -1, 0], [0, 0, -1]],
        description: '绕X轴旋转180°，请填写3D旋转矩阵',
        hint: 'cos(180°)=-1, sin(180°)=0',
        difficulty: 'easy',
        originalVector: [0, 1, 0],
        expectedVector: [0, -1, 0]
      },
      {
        id: 'lt3d_e_003',
        type: 'rotation',
        dimension: 3,
        axis: 'y',
        angle: 90,
        matrix: [[0, 0, 1], [0, 1, 0], [-1, 0, 0]],
        description: '绕Y轴旋转90°，请填写3D旋转矩阵',
        hint: '绕Y轴旋转矩阵中间行中间列为1',
        difficulty: 'easy',
        originalVector: [1, 0, 0],
        expectedVector: [0, 0, -1]
      },
      {
        id: 'lt3d_e_004',
        type: 'rotation',
        dimension: 3,
        axis: 'y',
        angle: 180,
        matrix: [[-1, 0, 0], [0, 1, 0], [0, 0, -1]],
        description: '绕Y轴旋转180°，请填写3D旋转矩阵',
        hint: '矩阵为[-1, 0, 0; 0, 1, 0; 0, 0, -1]',
        difficulty: 'easy',
        originalVector: [1, 0, 0],
        expectedVector: [-1, 0, 0]
      },
      {
        id: 'lt3d_e_005',
        type: 'rotation',
        dimension: 3,
        axis: 'z',
        angle: 90,
        matrix: [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
        description: '绕Z轴旋转90°，请填写3D旋转矩阵',
        hint: '绕Z轴旋转矩阵第三行第三列为1，左上角2x2为2D旋转矩阵',
        difficulty: 'easy',
        originalVector: [1, 0, 0],
        expectedVector: [0, 1, 0]
      },
      {
        id: 'lt3d_e_006',
        type: 'rotation',
        dimension: 3,
        axis: 'z',
        angle: 180,
        matrix: [[-1, 0, 0], [0, -1, 0], [0, 0, 1]],
        description: '绕Z轴旋转180°，请填写3D旋转矩阵',
        hint: '矩阵为[-1, 0, 0; 0, -1, 0; 0, 0, 1]',
        difficulty: 'easy',
        originalVector: [1, 0, 0],
        expectedVector: [-1, 0, 0]
      },
      {
        id: 'lt3d_e_007',
        type: 'reflection',
        dimension: 3,
        plane: 'xOy',
        matrix: [[1, 0, 0], [0, 1, 0], [0, 0, -1]],
        description: '关于xOy平面对称，请填写反射矩阵',
        hint: '关于xOy平面对称：x,y不变，z取反，矩阵为[1,0,0;0,1,0;0,0,-1]',
        difficulty: 'easy',
        originalVector: [1, 1, 1],
        expectedVector: [1, 1, -1]
      },
      {
        id: 'lt3d_e_008',
        type: 'reflection',
        dimension: 3,
        plane: 'yOz',
        matrix: [[-1, 0, 0], [0, 1, 0], [0, 0, 1]],
        description: '关于yOz平面对称，请填写反射矩阵',
        hint: '关于yOz平面对称：y,z不变，x取反，矩阵为[-1,0,0;0,1,0;0,0,1]',
        difficulty: 'easy',
        originalVector: [1, 1, 1],
        expectedVector: [-1, 1, 1]
      },
      {
        id: 'lt3d_e_009',
        type: 'reflection',
        dimension: 3,
        plane: 'xOz',
        matrix: [[1, 0, 0], [0, -1, 0], [0, 0, 1]],
        description: '关于xOz平面对称，请填写反射矩阵',
        hint: '关于xOz平面对称：x,z不变，y取反，矩阵为[1,0,0;0,-1,0;0,0,1]',
        difficulty: 'easy',
        originalVector: [1, 1, 1],
        expectedVector: [1, -1, 1]
      },
      {
        id: 'lt3d_e_010',
        type: 'scaling',
        dimension: 3,
        sx: 2,
        sy: 2,
        sz: 2,
        matrix: [[2, 0, 0], [0, 2, 0], [0, 0, 2]],
        description: '整体等比例放大2倍，请填写缩放矩阵',
        hint: '3D缩放矩阵为对角矩阵：[2, 0, 0; 0, 2, 0; 0, 0, 2]',
        difficulty: 'easy',
        originalVector: [1, 1, 1],
        expectedVector: [2, 2, 2]
      },
      {
        id: 'lt3d_e_011',
        type: 'scaling',
        dimension: 3,
        sx: 0.5,
        sy: 0.5,
        sz: 0.5,
        matrix: [[0.5, 0, 0], [0, 0.5, 0], [0, 0, 0.5]],
        description: '整体等比例缩小0.5倍，请填写缩放矩阵',
        hint: '矩阵为[0.5, 0, 0; 0, 0.5, 0; 0, 0, 0.5]',
        difficulty: 'easy',
        originalVector: [2, 2, 2],
        expectedVector: [1, 1, 1]
      },
      {
        id: 'lt3d_e_012',
        type: 'projection',
        dimension: 3,
        plane: 'xOy',
        matrix: LinearTransform.projection3D('xOy'),
        description: '向xOy平面正交投影，请填写投影矩阵',
        hint: '向xOy平面投影：z坐标变为0，矩阵为[1,0,0;0,1,0;0,0,0]',
        difficulty: 'easy',
        originalVector: [1, 2, 3],
        expectedVector: [1, 2, 0]
      }
    ],
    medium: [
      {
        id: 'lt3d_m_001',
        type: 'scaling',
        dimension: 3,
        sx: 2,
        sy: 1,
        sz: 1,
        matrix: LinearTransform.scaling3D(2, 1, 1),
        description: 'X轴放大2倍，请填写缩放矩阵',
        hint: '矩阵为[2, 0, 0; 0, 1, 0; 0, 0, 1]',
        difficulty: 'medium',
        originalVector: [1, 1, 1],
        expectedVector: [2, 1, 1]
      },
      {
        id: 'lt3d_m_002',
        type: 'scaling',
        dimension: 3,
        sx: 1,
        sy: 2,
        sz: 1,
        matrix: LinearTransform.scaling3D(1, 2, 1),
        description: 'Y轴放大2倍，请填写缩放矩阵',
        hint: '矩阵为[1, 0, 0; 0, 2, 0; 0, 0, 1]',
        difficulty: 'medium',
        originalVector: [1, 1, 1],
        expectedVector: [1, 2, 1]
      },
      {
        id: 'lt3d_m_003',
        type: 'scaling',
        dimension: 3,
        sx: 1,
        sy: 1,
        sz: 2,
        matrix: LinearTransform.scaling3D(1, 1, 2),
        description: 'Z轴放大2倍，请填写缩放矩阵',
        hint: '矩阵为[1, 0, 0; 0, 1, 0; 0, 0, 2]',
        difficulty: 'medium',
        originalVector: [1, 1, 1],
        expectedVector: [1, 1, 2]
      },
      {
        id: 'lt3d_m_004',
        type: 'projection',
        dimension: 3,
        plane: 'yOz',
        matrix: LinearTransform.projection3D('yOz'),
        description: '向yOz平面正交投影，请填写投影矩阵',
        hint: '向yOz平面投影：x坐标变为0，矩阵为[0,0,0;0,1,0;0,0,1]',
        difficulty: 'medium',
        originalVector: [3, 1, 2],
        expectedVector: [0, 1, 2]
      },
      {
        id: 'lt3d_m_005',
        type: 'projection',
        dimension: 3,
        plane: 'xOz',
        matrix: LinearTransform.projection3D('xOz'),
        description: '向xOz平面正交投影，请填写投影矩阵',
        hint: '向xOz平面投影：y坐标变为0，矩阵为[1,0,0;0,0,0;0,0,1]',
        difficulty: 'medium',
        originalVector: [2, 3, 1],
        expectedVector: [2, 0, 1]
      },
      {
        id: 'lt3d_m_006',
        type: 'rotation',
        dimension: 3,
        axis: 'z',
        angle: 180,
        matrix: [[-1, 0, 0], [0, -1, 0], [0, 0, 1]],
        description: '绕Z轴旋转180°，请填写旋转矩阵',
        hint: 'cos(180°)=-1, sin(180°)=0',
        difficulty: 'medium',
        originalVector: [1, 0, 0],
        expectedVector: [-1, 0, 0]
      },
      {
        id: 'lt3d_m_007',
        type: 'rotation',
        dimension: 3,
        axis: 'x',
        angle: 270,
        matrix: [[1, 0, 0], [0, 0, 1], [0, -1, 0]],
        description: '绕X轴旋转270°，请填写旋转矩阵',
        hint: 'cos(270°)=0, sin(270°)=-1',
        difficulty: 'medium',
        originalVector: [0, 1, 0],
        expectedVector: [0, 0, -1]
      }
    ],
    hard: [
      {
        id: 'lt3d_h_001',
        type: 'composite',
        dimension: 3,
        description: '先绕Z轴旋转90°，再X轴放大2倍，请填写复合变换矩阵',
        hint: '先旋转再缩放，缩放矩阵左乘旋转矩阵',
        matrix: [[0, -2, 0], [1, 0, 0], [0, 0, 2]],
        difficulty: 'hard',
        originalVector: [1, 0, 1],
        expectedVector: [0, 1, 2]
      },
      {
        id: 'lt3d_h_002',
        type: 'composite',
        dimension: 3,
        description: '先关于xOy平面对称，再整体放大2倍，请填写复合变换矩阵',
        hint: '反射矩阵[1,0,0;0,1,0;0,0,-1]，缩放矩阵[2,0,0;0,2,0;0,0,2]',
        matrix: [[2, 0, 0], [0, 2, 0], [0, 0, -2]],
        difficulty: 'hard',
        originalVector: [1, 1, 1],
        expectedVector: [2, 2, -2]
      },
      {
        id: 'lt3d_h_003',
        type: 'composite',
        dimension: 3,
        description: '先绕Y轴旋转180°，再向xOz平面投影，请填写复合变换矩阵',
        hint: '旋转后y变号，投影后y变为0',
        matrix: [[-1, 0, 0], [0, 0, 0], [0, 0, -1]],
        difficulty: 'hard',
        originalVector: [1, 2, 3],
        expectedVector: [-1, 0, -3]
      }
    ]
  },

  elementary: {
    size2: [
      {
        id: 'et2_001',
        type: 'elementary',
        size: 2,
        originalMatrix: [[1, 2], [0, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      },
      {
        id: 'et2_002',
        type: 'elementary',
        size: 2,
        originalMatrix: [[2, 2], [0, 3]],
        target: 'echelon',
        difficulty: 'easy',
        description: '将矩阵化简为行阶梯形'
      },
      {
        id: 'et2_003',
        type: 'elementary',
        size: 2,
        originalMatrix: [[1, 1], [2, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      },
      {
        id: 'et2_004',
        type: 'elementary',
        size: 2,
        originalMatrix: [[3, 3], [0, 2]],
        target: 'echelon',
        difficulty: 'easy',
        description: '将矩阵化简为行阶梯形'
      },
      {
        id: 'et2_005',
        type: 'elementary',
        size: 2,
        originalMatrix: [[2, 4], [1, 2]],
        target: 'echelon',
        difficulty: 'easy',
        description: '将矩阵化简为行阶梯形'
      },
      {
        id: 'et2_006',
        type: 'elementary',
        size: 2,
        originalMatrix: [[0, 1], [1, 0]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形（需要先交换行）'
      },
      {
        id: 'et2_007',
        type: 'elementary',
        size: 2,
        originalMatrix: [[4, 2], [2, 1]],
        target: 'echelon',
        difficulty: 'easy',
        description: '将矩阵化简为行阶梯形'
      },
      {
        id: 'et2_008',
        type: 'elementary',
        size: 2,
        originalMatrix: [[1, 3], [0, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      }
    ],
    size3: [
      {
        id: 'et3_001',
        type: 'elementary',
        size: 3,
        originalMatrix: [[1, 0, 0], [2, 1, 0], [3, 2, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      },
      {
        id: 'et3_002',
        type: 'elementary',
        size: 3,
        originalMatrix: [[2, 2, 2], [0, 3, 3], [0, 0, 1]],
        target: 'echelon',
        difficulty: 'easy',
        description: '将矩阵化简为行阶梯形'
      },
      {
        id: 'et3_003',
        type: 'elementary',
        size: 3,
        originalMatrix: [[1, 1, 0], [2, 2, 1], [0, 0, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      },
      {
        id: 'et3_004',
        type: 'elementary',
        size: 3,
        originalMatrix: [[3, 0, 0], [6, 2, 0], [9, 4, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      },
      {
        id: 'et3_005',
        type: 'elementary',
        size: 3,
        originalMatrix: [[1, 2, 1], [0, 1, 1], [0, 0, 2]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      },
      {
        id: 'et3_006',
        type: 'elementary',
        size: 3,
        originalMatrix: [[0, 1, 0], [0, 0, 1], [1, 0, 0]],
        target: 'reduced',
        difficulty: 'medium',
        description: '将矩阵化简为行最简形（需要交换行）'
      },
      {
        id: 'et3_007',
        type: 'elementary',
        size: 3,
        originalMatrix: [[2, 4, 0], [1, 2, 1], [0, 0, 1]],
        target: 'echelon',
        difficulty: 'easy',
        description: '将矩阵化简为行阶梯形'
      },
      {
        id: 'et3_008',
        type: 'elementary',
        size: 3,
        originalMatrix: [[1, 2, 3], [0, 1, 2], [0, 0, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      }
    ],
    size4: [
      {
        id: 'et4_001',
        type: 'elementary',
        size: 4,
        originalMatrix: [[1, 0, 0, 0], [2, 1, 0, 0], [3, 2, 1, 0], [4, 3, 2, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      },
      {
        id: 'et4_002',
        type: 'elementary',
        size: 4,
        originalMatrix: [[2, 0, 0, 0], [4, 2, 0, 0], [6, 4, 2, 0], [8, 6, 4, 2]],
        target: 'echelon',
        difficulty: 'easy',
        description: '将矩阵化简为行阶梯形'
      },
      {
        id: 'et4_003',
        type: 'elementary',
        size: 4,
        originalMatrix: [[1, 1, 0, 0], [2, 2, 1, 0], [3, 3, 2, 1], [0, 0, 0, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      },
      {
        id: 'et4_004',
        type: 'elementary',
        size: 4,
        originalMatrix: [[3, 0, 0, 0], [6, 3, 0, 0], [9, 6, 3, 0], [12, 9, 6, 3]],
        target: 'echelon',
        difficulty: 'easy',
        description: '将矩阵化简为行阶梯形'
      },
      {
        id: 'et4_005',
        type: 'elementary',
        size: 4,
        originalMatrix: [[1, 2, 3, 4], [0, 1, 2, 3], [0, 0, 1, 2], [0, 0, 0, 1]],
        target: 'reduced',
        difficulty: 'easy',
        description: '将矩阵化简为行最简形'
      },
      {
        id: 'et4_006',
        type: 'elementary',
        size: 4,
        originalMatrix: [[2, 4, 6, 8], [0, 2, 4, 6], [0, 0, 3, 6], [0, 0, 0, 4]],
        target: 'echelon',
        difficulty: 'easy',
        description: '将矩阵化简为行阶梯形'
      }
    ]
  },

  getRandomQuestion: function(type, dimension, difficulty, target) {
    if (type === 'linear') {
      if (dimension === 2) {
        const questions = this.linear2D[difficulty] || this.linear2D.easy;
        return questions[Math.floor(Math.random() * questions.length)];
      } else {
        const questions = this.linear3D[difficulty] || this.linear3D.easy;
        return questions[Math.floor(Math.random() * questions.length)];
      }
    } else if (type === 'elementary') {
      const size = dimension;
      let questions = this.elementary['size' + size] || this.elementary.size3;
      if (target) {
        questions = questions.filter(q => q.target === target);
        if (questions.length === 0) {
          questions = this.elementary['size' + size] || this.elementary.size3;
        }
      }
      return questions[Math.floor(Math.random() * questions.length)];
    }
    return null;
  },

  getAllQuestions: function() {
    return {
      linear2D: this.linear2D,
      linear3D: this.linear3D,
      elementary: this.elementary
    };
  }
};

module.exports = QuestionBank;
