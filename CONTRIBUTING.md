# 贡献指南

感谢你对本项目的关注！以下是参与贡献的简要说明。

## 如何贡献

### 报告 Bug

请使用 [Bug 报告模板](.github/ISSUE_TEMPLATE/bug_report.yml) 提交 Issue，并尽量包含：

- 复现步骤
- 预期行为与实际行为
- 微信开发者工具版本、基础库版本
- 相关截图或日志（如有）

### 提出功能建议

请使用 [功能建议模板](.github/ISSUE_TEMPLATE/feature_request.yml) 描述你的想法与使用场景。

### 提交代码

1. Fork 本仓库并创建分支：

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. 在本地用微信开发者工具验证改动可正常编译、运行。

3. 保持提交信息清晰，例如：

   - `fix: 修复初等变换判题逻辑`
   - `feat: 题库增加难度筛选`

4. 推送分支并发起 Pull Request，填写 PR 模板中的说明。

## 代码规范

- 遵循项目现有目录与命名风格
- 页面逻辑放在对应 `pages/` 目录，可复用逻辑放在 `utils/`
- 避免提交 `project.private.config.json` 等本地配置文件
- 新增页面需在 `app.json` 的 `pages` 中注册

## 题目贡献

用户也可通过小程序内「贡献」页提交题目；维护者审核后合并到 `utils/question-bank.js` 或相关数据源。

## 行为准则

请保持友善、尊重的沟通方式。恶意、歧视性言论将不被接受。

如有疑问，欢迎在 Issue 中讨论。
