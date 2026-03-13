# 快速开始指南 ⚡

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

### 2. Android设备运行（完整功能）

```bash
# 安装依赖
npm install

# 添加Android平台
npx cap add android

# 打开Android Studio
npx cap open android

# 在Android Studio中点击Run按钮
```

## 📱 Android开发完整流程

### 前置要求
- ✅ Node.js 16+
- ✅ Android Studio
- ✅ Android SDK (API 22+)
- ✅ Java JDK 11+

### 详细步骤

#### Step 1: 克隆项目
```bash
git clone https://github.com/YOUR_USERNAME/goose-duck-meeting-helper.git
cd goose-duck-meeting-helper
```

#### Step 2: 安装依赖
```bash
npm install
```

#### Step 3: 添加Android平台
```bash
npx cap add android
```

#### Step 4: 下载Vosk中文模型
1. 访问 https://alphacephei.com/vosk/models
2. 下载 `vosk-model-small-cn-0.22.zip`（约40MB）
3. 解压到 `android/app/src/main/assets/vosk-model-cn/`

目录结构应该是：
```
android/app/src/main/assets/vosk-model-cn/
├── am/
├── conf/
├── graph/
└── ivector/
```

#### Step 5: 创建Android原生插件

参考 [DEVELOPMENT.md](DEVELOPMENT.md) 创建以下文件：
- `VoskPlugin.java` - 语音识别
- `ScreenCapturePlugin.java` - 截图功能
- `FloatingWindowPlugin.java` - 悬浮窗权限

或者先跳过这一步，使用浏览器演示模式。

#### Step 6: 配置权限

编辑 `android/app/src/main/AndroidManifest.xml`，添加：
```xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION"/>
```

#### Step 7: 同步代码
```bash
npx cap sync android
```

#### Step 8: 打开Android Studio
```bash
npx cap open android
```

#### Step 9: 运行
1. 连接Android设备或启动模拟器
2. 点击 Run 按钮（绿色三角形）
3. 等待构建和安装

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

当前进度：**Week 1 完成** ✅

- [x] Week 1: 基础UI和数据管理
- [ ] Week 2: 语音识别集成
- [ ] Week 3: 会议自动检测
- [ ] Week 4: 优化和测试

---

祝你游戏愉快！ 🦆
