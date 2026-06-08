# 像素英语世界 - Pixel English World

> Minecraft 风格的儿童英语学习 PWA 应用

![版本](https://img.shields.io/badge/version-1.0.0-green)
![平台](https://img.shields.io/badge/platform-iPad%20%7C%20iPhone%20%7C%20Android-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

## ✨ 功能特色

- 🎮 **Minecraft 像素风格** - 孩子喜欢的游戏化界面
- 📚 **背单词模块** - 关卡式学习，循序渐进
- 🧩 **拼句子模块** - 拖拽拼接，趣味学句型
- ⚗️ **单词合成台** - 像合成道具一样组合单词，记忆更深刻
- 📱 **PWA 应用** - 可添加到主屏幕，离线也能玩
- 🎯 **适配 iPad** - 横屏优先，触控友好

## 🚀 快速开始

### 本地运行

```bash
# 进入项目目录
cd pixel-english-world

# 启动本地服务器
python3 -m http.server 8000

# 浏览器访问
open http://localhost:8000
```

### 部署到 GitHub Pages

#### 方法一：手动部署（最简单）

1. 在 GitHub 创建新仓库，比如 `pixel-english-world`
2. 将本项目所有文件推送到仓库的 `main` 分支
3. 进入仓库 Settings → Pages
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main` / `root`
6. 点击 Save，等待几分钟即可访问

访问地址：`https://你的用户名.github.io/pixel-english-world/`

#### 方法二：GitHub Actions 自动部署

项目已包含 `.github/workflows/pages.yml` 配置文件，推送到 main 分支会自动部署。

1. 确保仓库 Settings → Pages → Source 选择 `GitHub Actions`
2. 推送代码到 main 分支
3. 自动触发部署，在 Actions 页面查看进度

### 子路径部署注意事项

如果部署在 `https://username.github.io/repo-name/` 这样的子路径下：

1. 打开 `index.html`，取消注释并修改 base 标签：
   ```html
   <base href="/repo-name/">
   ```

2. 修改 `manifest.json` 中的 `start_url` 和 `scope`：
   ```json
   "start_url": "/repo-name/",
   "scope": "/repo-name/"
   ```

3. 修改 `service-worker.js` 中的缓存路径（可选）

## 📱 添加到主屏幕

### iPad / iPhone

1. 用 Safari 打开应用网址
2. 点击底部分享按钮（方框+箭头）
3. 向下滑动找到「添加到主屏幕」
4. 点击「添加」，应用就出现在桌面上了！

### Android

1. 用 Chrome 打开应用网址
2. 点击菜单按钮（三个点）
3. 选择「安装应用」或「添加到主屏幕」

## 📁 项目结构

```
pixel-english-world/
├── index.html              # 主页面
├── manifest.json           # PWA 应用清单
├── service-worker.js       # Service Worker（离线缓存）
├── README.md               # 项目说明
├── .gitignore              # Git 忽略配置
├── css/
│   └── styles.css          # 样式文件
├── js/
│   └── app.js              # 交互逻辑
├── icons/                  # 应用图标（8种尺寸）
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── .github/
    └── workflows/
        └── pages.yml       # GitHub Actions 自动部署
```

## 🎯 功能模块

### 1. 首页主菜单
- 背单词入口（幼儿启蒙 / MC游戏 / 教材同步）
- 拼句子入口（常用300句 / 小学1000词 / 教材同步）
- 单词合成台快速入口
- 设置按钮

### 2. 背单词关卡地图
- 7大主题关卡
- 进度条显示学习进度
- 解锁式学习

### 3. MC游戏单词分类
- 6大单词分类（方块/生物/动物/颜色/食物/材料）
- 支持中文/英文显示模式切换
- 自动播放模式

### 4. 单词合成台
- 拖拽组合两个单词
- 合成新单词解锁成就
- 每日挑战模式
- 自由合成模式

### 5. 拼句子玩法
- 场景化句子练习
- 拖拽单词块拼成完整句子
- 提示功能
- 逐题闯关

## 🎨 设计规范

- **主色调**：草地绿 `#5D9E3A`
- **辅助色**：泥土棕 `#8B5A2B`、天空蓝 `#87CEEB`、金色 `#FFD700`
- **字体**：像素风格 / 无衬线字体
- **按钮样式**：像素边框 + 立体阴影 + 按压反馈
- **最小触控区域**：44x44pt

## 🔧 技术栈

- 纯 HTML5 + CSS3 + JavaScript（无框架依赖）
- Service Worker API（离线缓存）
- Web App Manifest（PWA）
- Canvas（可选扩展）

## 📝 更新日志

### v1.0.0 (2026-06-08)
- ✨ 初始版本发布
- 🎮 完整的5个核心页面
- 📱 PWA 支持，可添加到主屏幕
- 🎨 Minecraft 像素风格UI
- 📐 iPad 横屏适配

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

🌟 如果这个应用对你有帮助，别忘了给个 Star 哦～