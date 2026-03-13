# 🦆 鹅鸭杀会议记录助手

Android版鹅鸭杀（Goose Goose Duck）游戏会议记录助手，通过悬浮窗实时记录玩家发言、标记身份、智能复盘。

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

### 环境要求

- Node.js 16+
- Android Studio
- Android SDK (API 22+)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/goose-duck-meeting-helper.git
cd goose-duck-meeting-helper
```

2. **安装依赖**
```bash
npm install
```

3. **初始化Capacitor**
```bash
npx cap init
```

4. **添加Android平台**
```bash
npx cap add android
```

5. **同步代码**
```bash
npx cap sync android
```

6. **下载Vosk中文模型**
- 访问：https://alphacephei.com/vosk/models
- 下载：`vosk-model-small-cn-0.22` (约40MB)
- 解压后放入：`android/app/src/main/assets/vosk-model-cn/`

7. **打开Android Studio**
```bash
npx cap open android
```

8. **运行**
- 连接Android设备或启动模拟器
- 在Android Studio中点击Run按钮

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

## 🔧 开发计划

### Week 1：基础UI ✅
- [x] 搭建项目结构
- [x] 完成悬浮窗样式
- [x] 完成玩家列表和标签功能
- [x] 实现数据存储

### Week 2：语音识别
- [ ] 创建Android原生插件VoskPlugin
- [ ] 集成Vosk模型
- [ ] 测试中文识别效果
- [ ] 联调发言记录存储

### Week 3：会议检测
- [ ] 创建截图插件ScreenCapturePlugin
- [ ] 集成opencv.js
- [ ] 准备会议UI模板图
- [ ] 调试模板匹配
- [ ] 联调自动弹窗

### Week 4：完善和优化
- [ ] 完善复盘页面功能
- [ ] 添加数据导出功能
- [ ] 性能优化
- [ ] 测试各种边界情况
- [ ] 编写用户文档

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
