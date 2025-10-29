# Vercel 自动部署教程

## 前置准备
1. ✅ 项目代码已在GitHub仓库中
2. ✅ 项目包含完整的 `package.json`
3. ✅ 项目可以成功构建 (`npm run build`)

## 部署步骤

### 1. 注册 Vercel 账户
- 访问 https://vercel.com
- 使用GitHub账户登录（推荐）
- 或使用邮箱注册

### 2. 导入项目
#### 方法一：通过GitHub导入（推荐）
1. 登录后点击 "New Project"
2. 选择你的GitHub仓库
3. 选择 `minimal-blog` 项目
4. 点击 "Import"

#### 方法二：通过Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录运行
vercel

# 按提示操作：
# - 登录Vercel账户
# - 选择项目设置
# - 确认部署
```

### 3. 配置构建设置
Vercel会自动检测Next.js项目，配置通常如下：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### 4. 环境变量（如果需要）
如果项目需要环境变量，在Vercel控制台添加：
1. 进入项目设置 → Environment Variables
2. 添加需要的环境变量

### 5. 部署
点击 "Deploy" 按钮，Vercel会：
1. 安装依赖
2. 运行构建命令
3. 生成静态页面
4. 部署到全球CDN

### 6. 获取域名
部署完成后，你会得到：
- 临时域名：`https://your-project.vercel.app`
- 可以绑定自定义域名

## 自动部署设置

### 启用GitHub集成
1. 在Vercel项目设置中
2. 找到 "Git Integration"
3. 确保已连接GitHub仓库
4. 设置部署分支（通常是 `main` 或 `master`）

### 自动部署触发条件
每次以下操作都会触发自动部署：
- ✅ Push代码到主分支
- ✅ 创建Pull Request
- ✅ 合并Pull Request

## 部署后操作

### 1. 验证部署
访问你的Vercel域名，确认：
- ✅ 首页正常显示
- ✅ 文章链接正常
- ✅ UUID路由工作正常
- ✅ 样式和功能完整

### 2. 绑定自定义域名（可选）
1. 在Vercel控制台 → Domains
2. 添加你的域名
3. 配置DNS记录

### 3. 配置SSL证书
Vercel会自动为所有域名提供免费SSL证书

## 本地开发流程变更

### 原来的流程：
1. 本地写文章
2. 手动构建
3. 手动上传到服务器

### 现在的流程：
1. 本地写文章：`npm run new-post "文章标题"`
2. 编辑文章内容
3. 推送到GitHub：`npm run deploy` 或 `git push`
4. 🚀 Vercel自动部署完成！

## 高级配置

### 1. 自定义构建设置
在项目根目录创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "pages/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 2. 预览部署
- 每个Pull Request都会生成预览链接
- 可以在部署前预览更改
- 非常适合团队协作

### 3. 分支部署
可以为不同分支设置不同的部署环境：
- `main` 分支 → 生产环境
- `develop` 分支 → 预览环境

## 常见问题解决

### Q: 构建失败怎么办？
A:
1. 检查本地是否可以成功构建：`npm run build`
2. 查看Vercel构建日志
3. 检查环境变量配置
4. 确认所有依赖都已安装

### Q: 自定义域名无法访问？
A:
1. 检查DNS配置
2. 确认域名已正确添加到Vercel
3. 等待DNS传播（通常需要几分钟到几小时）

### Q: 如何回滚部署？
A:
1. 在Vercel控制台找到部署历史
2. 点击特定部署旁边的"..."
3. 选择"Promote to Production"或"Redeploy"

## 优势总结

### Vercel的优势：
- ✅ **零配置**：自动检测Next.js项目
- ✅ **全球CDN**：快速的访问速度
- ✅ **自动HTTPS**：免费SSL证书
- ✅ **预览部署**：每个PR都有预览链接
- ✅ **无限带宽**：不用担心流量
- ✅ **自动扩展**：无需担心服务器负载
- ✅ **Git集成**：完整的版本控制支持

现在你只需要专注于写文章，部署完全自动化！🎉