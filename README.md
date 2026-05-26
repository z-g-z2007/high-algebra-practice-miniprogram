# 线性代数练习

一款面向线性代数学习的微信小程序，提供线性变换、初等变换互动练习、题库、AI 答疑与学习报告等功能。

## 功能特性

- **线性变换**：2D / 3D 互动练习，理解旋转、缩放、剪切等变换
- **初等变换**：矩阵初等行变换实操
- **题库**：按难度与类型浏览、练习题目
- **AI 答疑**：学习过程中的智能问答辅助
- **练习报告**：查看练习数据与学习进度
- **错题本**：自动记录错题，便于复习

## 技术栈

- 微信小程序原生框架（WXML / WXSS / JavaScript）
- Glass Easel 组件框架
- 自定义 Tab Bar

## 项目结构

```
ggg/
├── app.js                 # 小程序入口
├── app.json               # 全局配置
├── app.wxss               # 全局样式
├── custom-tab-bar/        # 自定义底部导航
├── pages/                 # 页面
│   ├── index/             # 首页
│   ├── linear-transform/  # 线性变换
│   ├── elementary-transform/  # 初等变换
│   ├── ai-assistant/      # AI 答疑
│   ├── question-bank/     # 题库
│   ├── contribute/        # 题目贡献
│   ├── profile/           # 个人中心
│   └── report/            # 练习报告
└── utils/                 # 工具与题库逻辑
    ├── matrix.js
    ├── linear-transform.js
    ├── elementary-transform.js
    ├── question-bank.js
    └── ...
```

## 快速开始

### 环境要求

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 已注册的微信小程序 AppID（或使用测试号）

### 本地运行

1. 克隆仓库：

   ```bash
   git clone https://github.com/<your-username>/ggg.git
   cd ggg
   ```

2. 使用微信开发者工具打开项目根目录。

3. 配置私有信息（仓库中已脱敏为 `*`，需本地填写）：
   - 复制 `config/private.example.js` 为 `config/private.js`，填入 AI 接口地址、API Key、联系邮箱等
   - 在 `project.config.json` 或 `project.private.config.json` 中填写小程序 AppID，或在开发者工具中选择「测试号」

4. 点击「编译」即可在模拟器或真机预览。

> **注意**：`project.private.config.json` 与 `config/private.js` 为本地私有配置，已加入 `.gitignore`，请勿提交到仓库。

## 贡献

欢迎提交 Issue 与 Pull Request。请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

本项目采用 [MIT License](LICENSE) 开源。
