本项目基于 nestjs@6

## 项目结构

```
|____config 配置文件
| |____dev.config.json 开发环境配置
| |____prod.config.json 生产配置
|____src 后台逻辑代码
| |____middleware 中间件
| |____main.ts 启动文件
| |____dao dao层
| |____constant 常量
| |____api api控制器
| |____service 服务层
| |____pages mvc渲染页面
| |____interceptor 拦截器
```

### 命令

```json
{
  "scripts": {
    "build": "nest build", // 构建
    "start": "NODE_ENV=dev nest start", // 启动
    "start:dev": "NODE_ENV=dev nest start --watch", // 启动开发模式并热重载
    "start:debug": "NODE_ENV=dev nest start --debug --watch", // 启动debug模式并热重载
    "start:prod": "NODE_ENV=prod nodemon dist/main", // 启动生产模式并热重载
  }, 
}
```
