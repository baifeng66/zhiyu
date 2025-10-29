# Netlify 自动部署教程

## 前置准备
1. ✅ 项目代码已在GitHub仓库中
2. ✅ 项目包含完整的 `package.json`
3. ✅ 项目可以成功构建 (`npm run build`)

## 部署步骤

### 1. 注册 Netlify 账户
- 访问 https://netlify.com
- 点击 "Sign up"
- 使用GitHub账户登录（推荐）
- 或使用邮箱注册

### 2. 创建新站点
#### 方法一：通过GitHub导入（推荐）
1. 登录后点击 "New site from Git"
2. 选择 "GitHub"
3. 授权Netlify访问你的GitHub账户
4. 选择 `minimal-blog` 仓库
5. 点击 "Deploy site"

#### 方法二：拖拽部署
1. 运行 `npm run build`
2. 将 `.next` 文件夹拖拽到Netlify首页
3. （不推荐，无法自动更新）

### 3. 配置构建设置
在 "Build settings" 中设置：

```
Build command: npm run build
Publish directory: .next
```

### 4. 环境变量（如果需要）
在 Site settings → Build & deploy → Environment 中添加：
- 点击 "Edit variables"
- 添加需要的环境变量

### 5. 部署配置
Netlify会自动开始部署，完成后：
- 得到一个随机域名：`https://amazing-pasteur-123456.netlify.app`
- 可以在Site settings中更改域名

## 自动部署设置

### 1. 启用自动部署
在部署完成后：
1. 进入 Site settings → Build & deploy → Continuous Deployment
2. 确认 "Build hooks" 已启用
3. 选择需要自动部署的分支（通常是 `main` 或 `master`）

### 2. 配置部署触发条件
在 "Deploy contexts" 中可以设置：
- **Production deploy**: 主分支推送时
- **Branch deploys**: 其他分支推送时
- **Deploy previews**: Pull Request时
- **Background deploys**: 定时检查

### 3. 立即测试自动部署
```bash
# 做一个小改动
echo "test" >> README.md

# 提交并推送
git add .
git commit -m "test auto deploy"
git push origin main
```

## 高级配置

### 1. 创建 netlify.toml 配置文件
在项目根目录创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"

# 处理SPA路由
[[redirects]]
  from = "/post/*"
  to = "/post/:splat"
  status = 200

[[redirects]]
  from = "/posts/*"
  to = "/posts/:splat"
  status = 200
```

### 2. 配置自定义域名
1. 在Site settings → Domain management
2. 点击 "Add custom domain"
3. 输入你的域名
4. 配置DNS记录：
   ```
   类型: CNAME
   名称: @ (或 www)
   值: your-site.netlify.app
   ```

### 3. 表单处理（如果需要）
Netlify支持表单处理：
```html
<form name="contact" method="POST" data-netlify="true">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

## 本地开发流程

### 完整的工作流程：
1. **创建新文章**：
   ```bash
   npm run new-post "我的新文章"
   ```

2. **编辑文章内容**：
   ```bash
   # 编辑生成的Markdown文件
   code content/posts/2025-01-30-my-new-post.md
   ```

3. **本地预览**：
   ```bash
   npm run dev
   # 访问 http://localhost:3000 预览
   ```

4. **部署到生产环境**：
   ```bash
   npm run deploy
   # 或者
   git add .
   git commit -m "Add new post"
   git push origin main
   ```

5. **自动部署**：
   - Netlify检测到push
   - 自动拉取代码
   - 运行 `npm run build`
   - 部署到全球CDN
   - ✅ 完成！

## 优化配置

### 1. 性能优化
在 `netlify.toml` 中添加：
```toml
[build]
  command = "npm run build && npm run export"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"
```

### 2. 启用Functions（如果需要）
```toml
[functions]
  directory = "netlify/functions"
```

### 3. 分支部署配置
```toml
[context.production]
  command = "npm run build"

[context.deploy-preview]
  command = "npm run build"
  [context.deploy-preview.environment]
    NODE_ENV = "development"
```

## 监控和日志

### 1. 部署状态
- 在Netlify控制台查看部署历史
- 每次部署都有详细日志
- 可以查看构建时间和性能

### 2. 表单和分析
- Site settings → Forms：查看表单提交
- Site settings → Analytics：查看访问统计
- 可以集成Google Analytics

### 3. 错误监控
```toml
# 添加错误页面
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

## 常见问题解决

### Q: 构建失败，提示 "Command not found"
A:
1. 检查build命令是否正确
2. 确认Node.js版本兼容
3. 在netlify.toml中指定Node版本

### Q: 静态资源404
A:
1. 确认publish目录设置正确
2. 检查文件路径大小写
3. 验证_next目录是否正确生成

### Q: 表单无法提交
A:
1. 确认添加了 `data-netlify="true"`
2. 检查表单字段名称
3. 查看Netlify表单日志

### Q: 自定义域名不生效
A:
1. 检查DNS配置
2. 确认DNS已传播
3. 清除浏览器缓存

## Netlify vs Vercel 对比

| 特性 | Netlify | Vercel |
|------|---------|--------|
| 免费额度 | 100GB带宽/月 | 100GB带宽/月 |
| 构建时间 | 300分钟/月 | 无限制 |
| 预览部署 | ✅ | ✅ |
| 表单处理 | ✅ | ❌ |
| Functions | ✅ | ✅ |
| 边缘函数 | ✅ | ✅ |
| 分析功能 | ✅ | 基础版 |

## 优势总结

### Netlify的优势：
- ✅ **表单处理**：内置表单功能
- ✅ **简单易用**：拖拽部署入门简单
- ✅ **详细分析**：内置访问统计
- ✅ **A/B测试**：支持Split Testing
- ✅ **密码保护**：可以保护整个站点
- ✅ **Webhook集成**：丰富的集成选项

现在你的博客可以实现完全自动化的部署流程！🚀