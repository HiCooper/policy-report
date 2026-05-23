# Policy Report - 政策解读投资分析平台

> 本平台展示的政策分析报告由 [china-policy-investment-analyzer](https://github.com/HiCooper/agents-silky/tree/main/skills/china-policy-investment-analyzer) Skill 自动生成。

---

## 报告生成工具

**Skill 仓库**: [agents-silky](https://github.com/HiCooper/agents-silky/tree/main/skills)

### Skill 简介

`china-policy-investment-analyzer` 是一款中国产业政策投资分析工具，专为私募基金/家族办公室设计，提供：

- **政策三步法**：从政府文件获取 → 结构化阅读分析 → 匹配投资机会
- **跟踪法**：追踪资金流向（中央预算/专项债/一级市场）和试点结果验证
- **时间线演进**：政策生命周期梳理 + A股板块趋势复盘
- **ETF筛选**：从主题相关性、规模流动性、资金流向等维度筛选最佳标的

### 使用方式

触发关键词：`政策解读`、`产业政策分析`、`ETF筛选`、`投资机会`、`A股分析`

在 Qoder 中对话时，发送政策文件 URL 或标题即可自动生成四段式分析报告（政策解读→资金追踪→时间线→ETF匹配）。

---

## 项目简介

一个用于展示中国产业政策解读和投资机会分析的 React + TypeScript 应用。

## 报告发布网站

**在线访问**: [https://hicooper.github.io/policy-report](https://hicooper.github.io/policy-report/)

## 项目简介

本项目对国务院、工信部、发改委等官方发布的产业政策文件进行解读分析，从政策三步法（信息获取→阅读分析→匹配投资机会）、跟踪法（钱流向追踪+试点结果验证）、时间线演进到A股ETF/标的筛选，提供完整的分析工具。

## 技术栈

- React 18 + TypeScript
- Vite (构建工具)
- React Router (SPA 路由)
- 政策报告支持子目录部署

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 构建部署

```bash
# 构建生产版本
npm run build

# 部署脚本（需要配置远程服务器）
./deploy.sh
```

## 报告目录

报告文件位于 `report/` 目录下，支持直接打开单个 HTML 报告文件进行查看。

## 功能特点

- SPA 单页应用架构
- 支持静态报告子路径部署
- 响应式设计
- 投资机会智能分析