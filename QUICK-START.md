# 快速开始：自动化部署指南

## 🚀 5分钟搞定博客自动部署

### 准备工作
确保你的代码已经推送到GitHub仓库。

### 选择部署平台

## 方案一：Vercel（推荐新手）

### 1️⃣ 访问 Vercel
👉 https://vercel.com

### 2️⃣ 用GitHub登录
- 点击 "Sign in with GitHub"
- 授权Vercel访问你的仓库

### 3️⃣ 导入项目
- 点击 "New Project"
- 选择你的 `minimal-blog` 仓库
- 点击 "Import"

### 4️⃣ 点击部署
- 保持默认设置（Vercel会自动识别Next.js）
- 点击 "Deploy" 按钮

### 5️⃣ 完成！🎉
- 几秒钟后得到你的博客网址
- 格式：`https://your-project.vercel.app`

---

## 方案二：Netlify

### 1️⃣ 访问 Netlify
👉 https://netlify.com

### 2️⃣ 用GitHub登录
- 点击 "Sign up"
- 选择 "GitHub" 登录

### 3️⃣ 创建站点
- 点击 "New site from Git"
- 选择 "GitHub"
- 选择你的 `minimal-blog` 仓库

### 4️⃣ 配置设置
```
Build command: npm run build
Publish directory: .next
```

### 5️⃣ 点击部署
- 点击 "Deploy site" 按钮

### 6️⃣ 完成！🎉
- 几分钟后得到你的博客网址
- 格式：`https://random-name-123456.netlify.app`

---

## ✅ 自动部署测试

部署完成后，测试自动部署功能：

```bash
# 1. 创建一篇新文章
npm run new-post "测试自动部署"

# 2. 编辑文章（可选）
code content/posts/2025-01-30-测试自动部署.md

# 3. 提交更改
npm run deploy

# 4. 等待几分钟... 🚀
# 访问你的博客网站，新文章应该已经出现了！
```

## 📱 日常使用流程

### 写新文章：
```bash
npm run new-post "文章标题"
# 编辑内容...
npm run deploy
```

### 修改文章：
```bash
# 编辑对应的Markdown文件
code content/posts/your-post.md
npm run deploy
```

### 检查部署状态：
- **Vercel**: 访问 Vercel 控制台查看部署历史
- **Netlify**: 访问 Netlify 控制台查看部署日志

## 🔧 自定义设置

### 更改网站标题：
编辑 `lib/site.config.ts`：
```typescript
export const siteConfig = {
  title: "你的博客名称",  // 修改这里
  description: "你的博客描述",
  author: "你的名字",
  // ...
};
```

### 绑定自定义域名：
1. 购买域名（可选）
2. 在Vercel/Netlify中添加域名
3. 配置DNS记录

## 💡 推荐设置

### Vercel用户：
- ✅ 启用预览部署（每个PR都有预览链接）
- ✅ 设置部署分支为 `main`
- ✅ 添加自定义域名

### Netlify用户：
- ✅ 启用表单处理（如需要）
- ✅ 配置密码保护（可选）
- ✅ 设置分支部署规则

## 🛠️ 故障排除

### 构建失败：
1. 检查本地是否能构建：`npm run build`
2. 查看部署平台的错误日志
3. 确认所有依赖都已正确安装

### 文章不显示：
1. 确认 `draft: false`
2. 检查文章frontmatter格式
3. 查看浏览器控制台错误

### UUID链接404：
1. 确认文章有 `uuid` 字段
2. 重新构建项目：`npm run build`
3. 重新部署：`npm run deploy`

## 📚 更多文档

- `DEPLOYMENT.md` - 详细部署指南
- `DEPLOY-VERCEL.md` - Vercel详细教程
- `DEPLOY-NETLIFY.md` - Netlify详细教程

## 🎉 完成！

现在你的博客已经：
- ✅ 部署到全球CDN
- ✅ 支持自动更新
- ✅ 有独特的UUID URL
- ✅ 支持返回顶部功能
- ✅ 支持主题切换
- ✅ 有完整的SEO优化

专注于写文章吧，部署已经全自动了！🚀