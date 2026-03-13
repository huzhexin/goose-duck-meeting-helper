# 快速开始指南 ⚡

> **🎉 项目已完成！** 所有Android原生功能已实现，可以直接构建和运行。
>
> **📖 推荐阅读**: [START_HERE.md](START_HERE.md) - 更简洁的快速开始指南
>
> **🔧 详细指南**: [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md) - 完整构建和调试文档

## 🎯 5分钟快速体验

### 1. 浏览器预览（最快）

```bash
cd goose-duck-meeting-helper/src
python3 -m http.server 8000
```

访问 http://localhost:8000，在浏览器控制台输入：
```javascript
testStartMeeting()  // 开始会议
Voice.demoAddSpeech("这是测试发言")  // 添加发言
```

详细说明见 [BROWSER_DEMO.md](BROWSER_DEMO.md)

### 2. Android设备运行（完整功能）⭐

```bash
# 1. 下载Vosk模型（必需）
./download_vosk_model.sh

# 2. 同步代码
npx cap sync android

# 3. 打开Android Studio
npx cap open android

# 4. 在Android Studio中点击Run按钮 ▶️
```

**注意**：
- Android项目已经配置完成，包含所有原生插件
- Vosk模型约40MB，首次下载需要2-5分钟
- 首次Gradle构建需要5-10分钟

## 📱 Android开发完整流程

### 前置要求
- ✅ Node.js 16+
- ✅ Android Studio
- ✅ Android SDK (API 22+)
- ✅ Java JDK 11+

### 详细步骤

#### Step 1: 克隆项目
```bash
git clone https://github.com/huzhexin/goose-duck-meeting-helper.git
cd goose-duck-meeting-helper
```

#### Step 2: 安装依赖（如果还没安装）
```bash
npm install
```

#### Step 3: 下载Vosk语音模型（必需）

**方法1：使用自动脚本（推荐）**
```bash
./download_vosk_model.sh
# 选择 1 (小型模型，40MB)
```

**方法2：手动下载**
1. 访问 https://alphacephei.com/vosk/models
2. 下载 `vosk-model-small-cn-0.22.zip`（约40MB）
3. 解压到 `android/app/src/main/assets/vosk-model-cn/`

详细说明：[android/VOSK_MODEL_SETUP.md](android/VOSK_MODEL_SETUP.md)

#### Step 4: 同步代码到Android
```bash
npx cap sync android
```

**注意**：Android原生插件已经完成，包括：
- ✅ VoskPlugin.java - 语音识别插件
- ✅ ScreenCapturePlugin.java - 截图插件
- ✅ FloatingWindowPlugin.java - 悬浮窗插件
- ✅ 所有权限和依赖已配置

#### Step 5: 打开Android Studio
```bash
npx cap open android
```

#### Step 6: 运行应用
1. 等待Gradle同步完成（首次约5-10分钟）
2. 连接Android设备或启动模拟器
3. 点击运行按钮 ▶️（绿色三角形）
4. 等待构建和安装
5. 授予权限（悬浮窗、麦克风、截图）

## 🎮 使用流程

### 首次启动
1. 授予悬浮窗权限
2. 授予麦克风权限
3. 授予截图权限（用于自动检测会议）

### 游戏中使用
1. **准备阶段**
   - 点击"添加玩家"，输入每个玩家的名字
   - 或使用默认的"玩家1-8"

2. **会议阶段**
   - 应用会自动检测会议开始（或手动点击"新一轮"）
   - 语音自动识别并记录发言
   - 点击玩家头像快速标记身份

3. **投票阶段**
   - 点击"结束会议"按钮
   - 查看记录，决定投票

4. **复盘**
   - 游戏结束后点击"复盘"
   - 查看完整的发言记录和标记

## 🐛 故障排查

### 问题1: npm install失败
```bash
# 清除缓存重试
npm cache clean --force
npm install
```

### 问题2: Android Studio构建失败
```bash
# 重新同步
npx cap sync android

# 在Android Studio中：
# File → Invalidate Caches / Restart
```

### 问题3: 应用闪退
- 检查是否授予了所有必需权限
- 查看logcat日志：`adb logcat | grep "Capacitor"`

### 问题4: 语音识别不工作
- 确认Vosk模型文件已正确放置
- 检查麦克风权限
- 查看是否有错误日志

### 问题5: 悬浮窗不显示
- 检查悬浮窗权限是否开启
- 部分手机需要在设置中手动开启

## 📚 下一步

- 📖 阅读 [README.md](README.md) 了解项目详情
- 🛠️ 查看 [DEVELOPMENT.md](DEVELOPMENT.md) 学习开发Android插件
- 🎨 在 [BROWSER_DEMO.md](BROWSER_DEMO.md) 中测试UI
- 💡 查看 [GitHub Issues](https://github.com/YOUR_USERNAME/goose-duck-meeting-helper/issues) 了解已知问题

## 💬 获取帮助

遇到问题？
1. 查看文档中的"故障排查"部分
2. 搜索 [GitHub Issues](https://github.com/YOUR_USERNAME/goose-duck-meeting-helper/issues)
3. 创建新Issue描述问题

## 🎯 开发路线图

**当前进度：100% 完成** ✅🎉

- [x] Week 1: 基础UI和数据管理 ✅
- [x] Week 2: Android原生插件开发 ✅
  - [x] VoskPlugin语音识别
  - [x] ScreenCapturePlugin截图
  - [x] FloatingWindowPlugin悬浮窗
  - [x] 权限和依赖配置
  - [x] 前后端集成
- [x] 文档和工具 ✅
  - [x] 完整开发文档
  - [x] 自动化脚本
  - [x] 构建指南

**可选优化（后续）**：
- [ ] 集成OpenCV.js自动会议检测
- [ ] 添加应用设置页面
- [ ] 性能优化和测试

---

## 📚 更多资源

- **[START_HERE.md](START_HERE.md)** - 最简洁的快速开始
- **[ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md)** - 详细构建指南
- **[ANDROID_COMPLETE_SUMMARY.md](ANDROID_COMPLETE_SUMMARY.md)** - 完成总结
- **[GitHub仓库](https://github.com/huzhexin/goose-duck-meeting-helper)** - 项目主页

---

祝你游戏愉快！ 🦆🎮
