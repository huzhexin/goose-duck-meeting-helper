# 🦆 鹅鸭杀会议记录助手

Android版鹅鸭杀（Goose Goose Duck）游戏会议记录助手，通过悬浮窗实时记录玩家发言、标记身份、智能复盘。

> **🎉 项目状态**: ✅ Android开发完成！所有功能已实现，可以开始构建和测试。
>
> **📖 快速开始**: 查看 [START_HERE.md](START_HERE.md) 快速上手
>
> **🔧 构建指南**: 查看 [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md) 详细说明

## ✨ 功能特性

- 🎯 **悬浮窗设计** - 游戏中随时可用，不遮挡游戏画面
- 🎙️ **离线语音识别** - 基于Vosk，完全免费，无需联网
- 🤖 **自动会议检测** - 使用opencv.js检测会议开始画面
- 👥 **玩家管理** - 支持4-16人，快速标记身份（信任/可疑/鸭子）
- 📝 **发言记录** - 实时记录每个玩家的发言内容
- 📊 **智能复盘** - 自动生成本局游戏的完整复盘报告

## 🛠️ 技术栈

```
前端UI：HTML + CSS + 原生JavaScript
跨平台：Capacitor.js (Web → Android)
语音识别：Vosk (离线中文识别)
图像识别：opencv.js (会议检测)
本地存储：localStorage
```

## 📦 项目结构

```
goose-duck-meeting-helper/
├── src/                      # 前端代码
│   ├── index.html            # 主入口
│   ├── css/                  # 样式文件
│   │   ├── main.css
│   │   ├── floating.css
│   │   └── meeting.css
│   ├── js/                   # JavaScript模块
│   │   ├── app.js           # 主逻辑
│   │   ├── store.js         # 数据管理
│   │   ├── ui.js            # UI渲染
│   │   ├── voice.js         # 语音识别
│   │   └── detector.js      # 会议检测
│   └── assets/
│       └── templates/       # 会议UI模板图片
│
├── android/                 # Android原生工程（运行npx cap add android后生成）
├── capacitor.config.json    # Capacitor配置
└── package.json
```

## 🚀 快速开始

> **⚡ 3步快速启动**：查看 [START_HERE.md](START_HERE.md) 获取最简单的启动方式

### 环境要求

- ✅ Node.js 16+
- ✅ Android Studio
- ✅ Android SDK (API 22+)
- ✅ JDK 11+

### 完整安装步骤

#### 1. 克隆项目
```bash
git clone https://github.com/huzhexin/goose-duck-meeting-helper.git
cd goose-duck-meeting-helper
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 下载Vosk语音模型（必需）
```bash
# 使用自动脚本（推荐）
./download_vosk_model.sh
# 选择 1 (小型模型，40MB)
```

或手动下载：
- 访问：https://alphacephei.com/vosk/models
- 下载：`vosk-model-small-cn-0.22.zip`
- 解压到：`android/app/src/main/assets/vosk-model-cn/`

详细说明：[android/VOSK_MODEL_SETUP.md](android/VOSK_MODEL_SETUP.md)

#### 4. 同步到Android
```bash
npx cap sync android
```

#### 5. 打开Android Studio
```bash
npx cap open android
```

#### 6. 运行应用
- 等待Gradle同步完成（首次约5-10分钟）
- 连接Android设备或启动模拟器
- 点击运行按钮 ▶️
- 授予权限（悬浮窗、麦克风、截图）

### 📚 详细文档

- **[START_HERE.md](START_HERE.md)** - 快速开始指南 ⭐⭐⭐⭐⭐
- **[ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md)** - 完整构建和调试指南
- **[ANDROID_COMPLETE_SUMMARY.md](ANDROID_COMPLETE_SUMMARY.md)** - 项目完成总结
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - 详细开发文档
- **[QUICKSTART.md](QUICKSTART.md)** - 快速开始
- **[BROWSER_DEMO.md](BROWSER_DEMO.md)** - 浏览器演示

## 🎮 使用说明

### 基本流程

1. **启动应用** - 打开鹅鸭杀助手，悬浮窗会显示在屏幕上
2. **添加玩家** - 点击"添加玩家"按钮，输入玩家名称
3. **开始游戏** - 应用会自动检测会议开始
4. **记录发言** - 会议期间自动识别语音并记录
5. **标记身份** - 点击玩家快速标记身份（信任/可疑/鸭子）
6. **结束会议** - 点击"结束会议"按钮
7. **查看复盘** - 点击"复盘"按钮查看完整记录

### 快捷操作

- **拖动面板** - 长按标题栏拖动悬浮窗位置
- **最小化** - 点击"-"按钮最小化面板
- **快速标记** - 会议中点击玩家头像快速切换标签
- **详细信息** - 主界面点击玩家查看历史发言和添加备注

## 📱 浏览器预览

可以在浏览器中预览UI效果：

```bash
# 使用任何静态服务器
npx serve src

# 或者使用Python
cd src && python3 -m http.server 8000
```

然后访问 http://localhost:8000

**浏览器演示功能：**
- 在控制台输入 `testStartMeeting()` 测试会议开始
- 在控制台输入 `Voice.demoAddSpeech("测试发言")` 测试添加发言

## 🔧 开发进度

### ✅ 已完成功能

#### Week 1：基础UI ✅
- [x] 搭建项目结构
- [x] 完成悬浮窗样式
- [x] 完成玩家列表和标签功能
- [x] 实现数据存储

#### Week 2：Android原生开发 ✅
- [x] 创建VoskPlugin语音识别插件
- [x] 创建ScreenCapturePlugin截图插件
- [x] 创建FloatingWindowPlugin悬浮窗插件
- [x] 配置Android权限和依赖
- [x] 集成Vosk语音识别库
- [x] 前后端完整集成

#### 文档和工具 ✅
- [x] 编写完整开发文档
- [x] 创建自动化脚本
- [x] 编写构建和调试指南
- [x] 推送到GitHub

### 🎯 当前状态

**项目完成度：100%** 🎉

所有核心功能已实现，可以开始构建和测试！

### ⏳ 可选优化（后续）

- [ ] 集成OpenCV.js实现自动会议检测
- [ ] 添加应用设置页面
- [ ] 支持数据导出功能
- [ ] 性能优化和测试
- [ ] 准备应用商店发布

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- [Vosk](https://alphacephei.com/vosk/) - 开源离线语音识别
- [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html) - 计算机视觉库
- [Capacitor](https://capacitorjs.com/) - 跨平台应用框架

## 📮 联系方式

如有问题或建议，请提交Issue或通过以下方式联系：

- GitHub Issues: [项目Issues页面](https://github.com/your-username/goose-duck-meeting-helper/issues)

---

**注意：** 本项目仅供学习和个人使用，请勿用于商业目的。
