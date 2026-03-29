# Lottery Project

这是一个彩票类项目的仓库，包含三个独立但协同工作的子项目：

- `backend`：NestJS 服务端，负责业务逻辑、数据库、身份认证和接口。
- `admin-frontend`：管理后台前端，基于 React + Vite + MUI。
- `user-frontend`：用户前端，基于 React + Vite。

## 重要版本信息（开发者须知）

- `backend`：`0.0.1`
- `admin-frontend`：`0.0.0`
- `user-frontend`：`0.0.1`

## 项目结构概览

- `backend/`：NestJS 服务器应用
  - 依赖版本示例：`@nestjs/core@^11.0.1`, `typeorm@^0.3.28`
- `admin-frontend/`：管理员 React 前端
  - 依赖版本示例：`react@^19.2.4`, `vite@^8.0.1`
- `user-frontend/`：用户 React 前端
  - 依赖版本示例：`react@^18.3.1`, `vite@^5.4.11`

## 本地开发准备

建议使用 Node.js 20 及以上版本，npm 10 及以上版本。

> 注意：`backend` 通常需要一个 `.env` 文件来配置数据库、JWT 等环境变量。请确认 `backend/.env` 已正确创建并填写。

## 一步一步运行方法

```bash
# 1. 克隆仓库
git clone <repo-url> lottery-project
cd lottery-project

# 2. 安装后端依赖
cd backend
npm install

# 3. 安装管理后台依赖
cd ../admin-frontend
npm install

# 4. 安装用户前端依赖
cd ../user-frontend
npm install
```

## 运行项目

```bash
# 启动后端服务（在 backend 目录）
cd backend
npm run start:dev

# 启动管理后台（在 admin-frontend 目录）
cd ../admin-frontend
npm run dev

# 启动用户前端（在 user-frontend 目录）
cd ../user-frontend
npm run dev
```

如果你希望同时启动多个服务，可以在不同终端窗口中分别执行上述命令。

## 其它常用命令

### 后端
```bash
cd backend
npm run build
npm run lint
npm run test
npm run test:e2e
```

### 管理后台
```bash
cd admin-frontend
npm run build
npm run lint
npm run preview
```

### 用户前端
```bash
cd user-frontend
npm run build
npm run preview
```

## 备注

- `backend` 使用 NestJS 作为主要框架。
- 两个前端都使用 Vite 作为开发服务器。
- 根目录目前没有统一的 monorepo 构建脚本，因此各子项目分别安装和运行。
