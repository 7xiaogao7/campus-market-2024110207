# AI Collaboration Card

该文档将在后续版本中完善。

当前请按照教师要求记录：

- Prompt
- AI 输出
- 自己修改
- 最终验证

---

## 记录 1：项目初始化与技术栈分析（Day1）

### 一、Prompt

```
分析项目目录结构；
解释 main.ts；
解释 router 的作用；
分析当前项目采用的技术栈。
```

### 二、AI 输出

#### 1. 项目目录结构

项目核心代码位于 `campus-market-seed/` 子目录，采用标准 Vue 3 工程化骨架：

```
campus-market-seed/
├── .vscode/                # VS Code 配置（推荐插件、工作区设置）
├── docs/                   # 文档
│   ├── ai/                 # AI 协作记录
│   ├── evidence/           # 每日过程证据（Day1~Day7）
│   └── guide/              # 使用指南（环境搭建、快速开始）
├── public/                 # 静态资源（不经过构建，直接复制输出）
│   └── favicon.ico         # 网站图标
├── scripts/                # 自定义脚本目录（预留）
├── src/                    # 源代码主目录
│   ├── api/                # API 接口请求模块（预留）
│   ├── components/         # 公共组件目录（预留）
│   ├── router/index.ts     # 路由配置入口
│   ├── stores/             # Pinia 状态管理仓库（预留）
│   ├── views/HomeView.vue  # 页面级组件（首页）
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口文件
├── .editorconfig           # 统一编辑器格式
├── .gitignore              # Git 忽略规则
├── .nvmrc                  # Node.js 版本锁定
├── .oxlintrc.json          # Oxlint 代码检查配置
├── env.d.ts                # TypeScript 环境类型声明
├── eslint.config.ts        # ESLint 代码质量检查配置
├── index.html              # HTML 入口模板
├── package.json            # 项目依赖与脚本配置
├── tsconfig.json           # TypeScript 编译配置
├── vite.config.ts          # Vite 构建工具配置
└── README.md               # 项目说明文档
```

#### 2. main.ts 启动流程

```typescript
// 1. 导入核心依赖
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 2. 创建应用实例（以 App.vue 为根组件）
const app = createApp(App)

// 3. 注册插件：Pinia 状态管理 + Vue Router
app.use(createPinia())
app.use(router)

// 4. 挂载到 index.html 中 id="app" 的 DOM 元素
app.mount('#app')
```

**核心流程：创建实例 → 注册插件 → 挂载 DOM**（Vue 3 标准启动三部曲）

#### 3. Router 的作用

路由配置文件：`src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView }
  ]
})

export default router
```

**四大作用：**

| 作用 | 说明 |
|------|------|
| **SPA 页面导航** | 无需刷新浏览器即可切换页面，基于 URL 动态渲染对应组件 |
| **URL-组件映射** | `routes` 数组定义规则：如访问 `/` → 渲染 `HomeView.vue` |
| **History 模式** | `createWebHistory()` 使用 HTML5 History API，URL 干净无 `#` 号 |
| **渲染出口** | 配合 `App.vue` 中 `<RouterView />` 占位符，自动替换为匹配组件 |

#### 4. 技术栈分层

| 层级 | 技术 | 版本 | 作用 |
|------|------|------|------|
| **核心框架** | Vue 3 (Composition API) + TypeScript | 3.5.38 / 6.0.0 | 渐进式前端框架 + 静态类型系统 |
| **路由/状态** | Vue Router + Pinia | 5.1.0 / 3.0.4 | SPA 路由管理 + 全局状态管理 |
| **构建工具** | Vite + @vitejs/plugin-vue + vue-tsc | 8.0.16 | 极速构建 + Vue SFC 编译 + TS 类型检查 |
| **代码质量** | ESLint + Oxlint + 官方规则集 | 10.5.0 / 1.69.0 | JS/TS 代码检查 + Rust 极速补充检查 |
| **包管理/环境** | pnpm 11 + Node 22/24 + ES Module | - | 包管理器 + 运行环境 + 模块规范 |

### 三、自己修改

1. **目录结构修正**：外层 `__MACOSX/` 是 macOS 解压产生的冗余目录，无实际用途。真正的项目根在 `campus-market-seed/campus-market-seed/` 下。
2. **main.ts 细节补充**：`app.use()` 注册顺序虽无严格强制，但 Pinia 先于 Router 注册是常见实践，便于后续在路由守卫中访问 store。
3. **Router 备注**：`import.meta.env.BASE_URL` 来自 Vite 环境变量；若部署在子路径（如 `https://xxx.com/market/`），需在 `vite.config.ts` 的 `base` 字段配置，否则保持默认 `/`。
4. **技术栈版本感知**：TypeScript `~6.0.0` 与 Vite `^8.0.16` 属于目前 Vue 生态最前沿的版本组合，开发时注意查阅最新 API 文档。

### 四、最终验证

| 验证项 | 操作 | 结果 |
|-------|------|------|
| 目录完整性 | 核对 `src/` 下 `api/components/router/stores/views` 5 个子目录 | ✅ 全部存在 |
| 项目启动 | `pnpm install` + `pnpm dev` 访问 `localhost:5173` | ✅ 显示"校园轻集市"标题 |
| Router 生效 | 访问 `/` 路径，观察 `<RouterView />` 渲染 HomeView 内容 | ✅ 正确渲染 |
| 依赖版本 | `pnpm list vue vue-router pinia vite typescript` | ✅ 与 package.json 一致 |
| 代码检查 | `pnpm lint` 运行 oxlint + eslint | ✅ 无报错 |
| 类型检查 | `pnpm type-check` 运行 vue-tsc | ✅ 全部通过 |