# GitHub博客系统

## 项目介绍

这是一个基于GitHub Pages和Cloudflare Workers的个人博客系统，支持GitHub账号登录，提供简洁美观的界面和Markdown编辑功能。本系统无需数据库，完全依托于GitHub生态系统，适合个人博客、技术文档或知识分享平台。

## 功能特点

- 🔐 GitHub OAuth认证登录
- 📝 Markdown编辑器支持
- 🌐 自动部署到GitHub Pages
- 🔄 Cloudflare Workers提供API服务
- 📱 响应式设计，支持移动端访问
- 🔍 SEO友好的静态页面

## 部署指南（小白教程）

### 前置准备

#### 1. 创建GitHub账号

如果你还没有GitHub账号，请先前往[GitHub官网](https://github.com/)注册一个账号。

#### 2. 安装必要软件

- **安装Node.js**：
  - 前往[Node.js官网](https://nodejs.org/)下载并安装最新的LTS版本
  - 安装完成后，打开命令提示符(CMD)或PowerShell，输入以下命令验证安装：
    ```
    node -v
    npm -v
    ```
  - 如果显示版本号，说明安装成功

- **安装Git**：
  - 前往[Git官网](https://git-scm.com/downloads)下载并安装
  - 安装完成后，打开命令提示符，输入以下命令验证安装：
    ```
    git --version
    ```
  - 如果显示版本号，说明安装成功

### 步骤一：克隆项目

1. 在GitHub上创建一个新的仓库，命名为`Github_Blog`（或你喜欢的任何名称）

2. 打开命令提示符(CMD)或PowerShell，执行以下命令：

   ```
   # 克隆本项目
   git clone https://github.com/your-username/Github_Blog.git
   
   # 进入项目目录
   cd Github_Blog
   ```

### 步骤二：配置GitHub OAuth应用

1. 登录GitHub，点击右上角头像，选择`Settings`
2. 在左侧菜单中找到并点击`Developer settings`
3. 点击`OAuth Apps`，然后点击`New OAuth App`按钮
4. 填写以下信息：
   - **Application name**: 你的博客名称（例如：My GitHub Blog）
   - **Homepage URL**: `https://your-username.github.io/Github_Blog`（替换为你的GitHub用户名）
   - **Authorization callback URL**: `https://your-username.github.io/Github_Blog/auth.html`
5. 点击`Register application`按钮
6. 创建成功后，你会看到`Client ID`，点击`Generate a new client secret`生成`Client Secret`
7. 保存`Client ID`和`Client Secret`，后面会用到

### 步骤三：配置Cloudflare Workers

本项目使用Cloudflare Workers作为中间层来保护GitHub OAuth密钥，不再需要在前端暴露敏感信息。

1. 注册Cloudflare账号
   - 前往[Cloudflare官网](https://www.cloudflare.com/)注册一个免费账号

2. 创建Workers项目
   - 登录Cloudflare控制台
   - 在左侧菜单中选择`Workers & Pages`
   - 点击`Create application`
   - 选择`Create Worker`
   - 为你的Worker命名（例如：github-oauth-proxy）

3. 部署Workers代码
   - 将本项目中`workers`目录下的`index.js`和`setup.js`文件内容复制到Cloudflare Workers编辑器中
   - 点击`Save and deploy`按钮

4. 配置Workers环境变量
   - 在Workers详情页面，点击`Settings`选项卡
   - 找到`Variables`部分，点击`Add variable`
   - 添加以下环境变量：
     - `BASE_URL`: 设置为`https://your-username.github.io`（替换为你的GitHub用户名）
     - `ALLOWED_USERS`: 设置为你的GitHub用户名（如有多个用户，用逗号分隔）
     - `GITHUB_CLIENT_ID`: 设置为你在步骤二中获取的Client ID（例如：Ov23liYGqP6tjWqtRrQp）
     - `GITHUB_CLIENT_SECRET`: 设置为你在步骤二中获取的Client Secret（例如：211fcd615836402f751b6ce78a800e4f44cc46a2）

5. 记录Workers URL
   - 部署成功后，你会获得一个类似`https://your-worker-name.your-username.workers.dev`的URL
   - 记录这个URL，后面会用到（例如：https://github-oauth-proxy.bxiao.workers.dev/）

### 步骤四：修改前端配置

1. 在项目的以下文件中找到并修改Cloudflare Workers URL：
   - `frontend/js/auth.js`
   - `frontend/auth.html`
   - `frontend/login.html`

   找到以下代码行：

   ```javascript
   const OAUTH_PROXY_URL = "https://github-oauth-proxy.bxiao.workers.dev/";
   ```

2. 将其修改为你自己的Workers URL：

   ```javascript
   const OAUTH_PROXY_URL = "https://your-worker-name.your-username.workers.dev/";
   ```

   **注意**：确保在所有文件中都进行了修改，这对于OAuth认证流程正常工作至关重要。

### 步骤五：安装依赖并构建项目

1. 在命令提示符中，确保你在项目根目录下，执行以下命令：

   ```
   # 安装项目依赖
   npm install
   
   # 构建项目
   npm run build
   ```

2. 构建完成后，会在项目根目录下生成一个`dist`文件夹，里面包含了构建好的静态文件

### 步骤六：部署到GitHub Pages

1. 初始化Git仓库并提交代码：

   ```
   # 初始化Git仓库（如果还没有初始化）
   git init
   
   # 添加所有文件到暂存区
   git add .
   
   # 提交更改
   git commit -m "初始化博客系统"
   
   # 添加远程仓库（替换为你的GitHub仓库地址）
   git remote add origin https://github.com/your-username/Github_Blog.git
   
   # 推送到远程仓库的main分支
   git push -u origin main
   ```

2. 配置GitHub Pages：
   - 打开你的GitHub仓库页面
   - 点击`Settings`选项卡
   - 在左侧菜单中找到`Pages`
   - 在`Source`部分，选择`GitHub Actions`
   - 系统会自动使用仓库中的`.github/workflows/deploy.yml`文件进行部署

### 步骤七：验证部署

1. 等待GitHub Actions完成部署（可以在仓库的Actions选项卡中查看进度）
2. 部署完成后，访问`https://your-username.github.io/Github_Blog`查看你的博客
3. 点击登录按钮，测试GitHub OAuth登录功能是否正常工作

## 使用指南

### 访问博客

部署完成后，你可以通过以下URL访问你的博客：

```
https://your-username.github.io/Github_Blog
```

### 登录管理后台

1. 点击博客右上角的`登录`按钮
2. 使用GitHub账号登录
3. 登录成功后，你将被重定向到管理后台

### 发布新文章

1. 在管理后台，点击`新建文章`按钮
2. 使用Markdown编辑器编写文章内容
3. 填写文章标题、摘要和标签
4. 点击`发布`按钮

### 管理文章

在管理后台，你可以：
- 查看所有文章
- 编辑现有文章
- 删除文章
- 设置文章置顶

## 常见问题

### 部署后网站无法访问

1. 检查GitHub Pages是否已启用
2. 确认GitHub Actions工作流是否成功运行
3. 检查仓库名称和分支设置是否正确

### 登录失败

1. 检查OAuth应用配置是否正确
2. 确认回调URL是否与实际部署URL一致
3. 检查Cloudflare Workers环境变量是否正确设置
4. 确认你的GitHub用户名在`ALLOWED_USERS`环境变量中
5. 确保所有前端文件中的`OAUTH_PROXY_URL`已正确设置为你的Cloudflare Workers URL
   - 检查`frontend/js/auth.js`
   - 检查`frontend/auth.html`
   - 检查`frontend/login.html`
6. 检查浏览器控制台是否有404错误，如果有`/Github_Blog/authorize`的404错误，说明前端代码中的认证URL配置有误

### Cloudflare Workers相关问题

1. 确认Workers代码已正确部署
2. 检查环境变量是否正确设置，特别是`BASE_URL`变量
3. 查看Workers日志以获取更详细的错误信息

## 自定义主题

你可以通过修改`frontend/css/style.css`文件来自定义博客主题，包括颜色、字体和布局等。

## 技术栈

- 前端：HTML, CSS, JavaScript, Vite
- 后端：Cloudflare Workers
- 认证：GitHub OAuth
- 部署：GitHub Actions, GitHub Pages

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

本项目采用MIT许可证。详情请查看[LICENSE](LICENSE)文件。
