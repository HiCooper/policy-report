# Policy Report - 政策解读投资分析平台

一个用于展示中国产业政策解读和投资机会分析的 React + TypeScript 应用。

## 报告发布网站

**在线访问**: [http://www.makemerich.top/policy-report/](http://www.makemerich.top/policy-report/)

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