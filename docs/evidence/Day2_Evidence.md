今天新增了页面：
在项目 src/views/ 目录下新建了 6 个页面骨架文件：
ListView.vue（列表页）
DetailView.vue（详情页）
PublishView.vue（发布页）
MessageView.vue（消息页）
ProfileView.vue（个人中心）
BoardView.vue（看板页）
每个页面都搭建了基础 Vue 模板结构。

路由如何设计：
在 src/router/index.ts 配置路由规则，为每一个页面绑定访问路径。
采用懒加载写法 ()=>import() 引入组件，提升项目首屏加载速度。
配置的访问路径：/home 首页
/list 列表页
/detail 详情页
/publish 发布页
/message 消息页
/profile 个人中心
/board 看板页
页面内使用 <router-link> 制作顶部导航菜单，<router-view> 作为页面内容渲染容器，实现无刷新页面切换。


遇到的问题:
端口占用问题：执行 npm run dev 时 5173 端口被占用，项目自动切换到 5174 端口运行，访问地址需要同步修改。


AI 协作记录:
指导导航组件 <router-link> 和内容容器 <router-view> 的使用
排查端口占用、重复路由出口、路径大小写、样式失效等 BUG，并给出修改方案。