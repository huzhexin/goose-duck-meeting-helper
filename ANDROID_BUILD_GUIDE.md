# Android构建和调试完整指南 🚀

## 📋 目录

1. [环境准备](#环境准备)
2. [下载Vosk模型](#下载vosk模型)
3. [打开Android Studio](#打开android-studio)
4. [构建项目](#构建项目)
5. [运行和调试](#运行和调试)
6. [功能测试](#功能测试)
7. [常见问题](#常见问题)

---

## 环境准备

### 必需软件

- ✅ **Node.js 16+** - 已安装
- ✅ **Android Studio** - 需要安装
- ✅ **JDK 11+** - Android Studio自带
- ✅ **Android SDK** - Android Studio自带

### 检查环境

```bash
# 检查Node.js
node --version  # 应该 >= 16

# 检查npm
npm --version

# 检查项目依赖
cd /Users/huzhexin/Documents/ggd/goose-duck-meeting-helper
npm list
```

---

## 下载Vosk模型

### 方法1：使用自动脚本（推荐）

```bash
# 在项目根目录运行
./download_vosk_model.sh
```

选择选项 `1` (小型模型，40MB，推荐)

### 方法2：手动下载

1. 访问 https://alphacephei.com/vosk/models
2. 下载 `vosk-model-small-cn-0.22.zip`
3. 解压到 `android/app/src/main/assets/vosk-model-cn/`

### 验证安装

```bash
ls -la android/app/src/main/assets/vosk-model-cn/
```

应该看到：`am/`, `conf/`, `graph/`, `ivector/` 四个文件夹

---

## 打开Android Studio

### 步骤1：同步代码

```bash
# 确保所有更改已同步到Android项目
npx cap sync android
```

### 步骤2：打开Android Studio

```bash
# 自动打开Android Studio
npx cap open android
```

或手动打开：
1. 启动Android Studio
2. 选择 "Open an Existing Project"
3. 选择 `android` 文件夹

### 步骤3：Gradle同步

Android Studio打开后会自动进行Gradle同步，等待完成（首次可能需要5-10分钟）。

---

## 构建项目

### 检查配置

1. **检查SDK版本**
   - 打开 `File` → `Project Structure`
   - SDK Location: 确保Android SDK路径正确
   - 建议使用 Android 13 (API 33) 或更高

2. **检查Gradle配置**
   - 打开 `android/build.gradle`
   - 确认compileSdkVersion >= 33
   - 确认targetSdkVersion >= 33

### 构建APK

#### 方法1：通过Android Studio

1. 点击菜单 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. 等待构建完成
3. APK位置：`android/app/build/outputs/apk/debug/app-debug.apk`

#### 方法2：通过命令行

```bash
cd android
./gradlew assembleDebug
```

---

## 运行和调试

### 连接设备

#### 选项1：真实Android设备

1. **开启开发者选项**
   - 设置 → 关于手机 → 连续点击"版本号"7次
   - 返回设置 → 开发者选项

2. **开启USB调试**
   - 开发者选项 → USB调试 → 开启
   - 连接USB线

3. **验证连接**
   ```bash
   adb devices
   ```
   应该看到设备列表

#### 选项2：Android模拟器

1. 在Android Studio中点击 `AVD Manager`
2. 创建虚拟设备（推荐：Pixel 5, API 33）
3. 启动模拟器

### 运行应用

1. 在Android Studio中选择设备
2. 点击绿色运行按钮 ▶️ 或按 `Shift + F10`
3. 等待应用安装和启动

### 查看日志

```bash
# 查看所有日志
adb logcat

# 只看Capacitor相关
adb logcat | grep Capacitor

# 只看Vosk相关
adb logcat | grep Vosk

# 只看我们的应用
adb logcat | grep goosequack
```

在Android Studio中：
- 点击底部的 `Logcat` 标签
- 筛选器输入：`package:com.goosequack.helper`

---

## 功能测试

### 测试清单

#### 1. 基础UI测试
- [ ] 应用启动成功
- [ ] 悬浮窗显示正常
- [ ] 可以拖动悬浮窗
- [ ] 最小化/展开功能正常
- [ ] 玩家列表显示

#### 2. 权限测试
- [ ] 悬浮窗权限请求
- [ ] 麦克风权限请求
- [ ] 截图权限请求（Android 10+）

#### 3. 语音识别测试

```javascript
// 在Chrome远程调试中测试
// 1. 打开 chrome://inspect
// 2. 选择设备WebView
// 3. 在Console中运行：

// 检查Vosk是否加载
console.log(typeof Capacitor !== 'undefined')

// 测试初始化
Voice.init()

// 测试开始监听
Voice.start()

// 说话测试（对着手机说话）
// 观察是否有识别结果

// 停止监听
Voice.stop()
```

#### 4. 会议检测测试

```javascript
// 测试截图功能
Detector.checkScreen()

// 手动触发会议
testStartMeeting()
```

#### 5. 完整流程测试

1. **启动应用**
   - 授予所有权限

2. **添加玩家**
   - 点击"添加玩家"
   - 输入玩家名称

3. **开始会议**
   - 点击"新一轮"
   - 或等待自动检测

4. **语音记录**
   - 对着手机说话
   - 观察是否实时显示识别文字
   - 检查发言是否记录到玩家

5. **标记玩家**
   - 点击玩家头像
   - 切换标签（信任/可疑/鸭子）

6. **结束会议**
   - 点击"结束会议"

7. **查看复盘**
   - 点击"复盘"
   - 查看完整记录

---

## 常见问题

### 问题1：Gradle同步失败

**症状**：无法下载依赖

**解决方案**：
```bash
# 清理Gradle缓存
cd android
./gradlew clean

# 重新同步
./gradlew build --refresh-dependencies
```

### 问题2：应用闪退

**症状**：应用启动后立即崩溃

**排查步骤**：
1. 查看logcat日志
   ```bash
   adb logcat | grep AndroidRuntime
   ```

2. 常见原因：
   - Vosk模型未安装或路径错误
   - 权限未授予
   - 内存不足

### 问题3：语音识别不工作

**排查步骤**：

1. **检查模型**
   ```bash
   ls android/app/src/main/assets/vosk-model-cn/
   ```

2. **检查权限**
   - 确认已授予麦克风权限
   - 设置 → 应用 → 鹅鸭杀助手 → 权限

3. **查看日志**
   ```bash
   adb logcat | grep Vosk
   ```

4. **测试麦克风**
   - 打开系统录音应用测试麦克风是否正常

### 问题4：悬浮窗不显示

**解决方案**：
1. 手动开启悬浮窗权限
   - 设置 → 应用 → 鹅鸭杀助手 → 悬浮窗权限

2. 部分手机需要在特殊权限中开启
   - 设置 → 特殊应用权限 → 显示在其他应用上层

### 问题5：构建速度慢

**优化方案**：

1. **启用Gradle离线模式**
   - File → Settings → Build, Execution, Deployment → Gradle
   - 勾选 "Offline work"

2. **增加Gradle内存**
   编辑 `android/gradle.properties`：
   ```properties
   org.gradle.jvmargs=-Xmx4096m
   ```

3. **使用国内镜像**
   编辑 `android/build.gradle`：
   ```gradle
   allprojects {
       repositories {
           maven { url 'https://maven.aliyun.com/repository/public/' }
           maven { url 'https://maven.aliyun.com/repository/google/' }
       }
   }
   ```

### 问题6：USB调试连接不上

**解决方案**：

1. **重启adb**
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```

2. **检查驱动**
   - Windows: 安装手机厂商USB驱动
   - Mac: 通常不需要额外驱动

3. **更换USB线/接口**
   - 使用数据线（非充电线）
   - 尝试不同的USB接口

---

## 调试技巧

### Chrome远程调试

1. 手机连接电脑
2. 打开Chrome浏览器
3. 访问 `chrome://inspect`
4. 选择应用的WebView
5. 可以查看Console、Network、Elements等

### 性能分析

在Android Studio中：
1. 点击 `View` → `Tool Windows` → `Profiler`
2. 选择应用进程
3. 查看CPU、内存、网络使用情况

### 布局检查

```bash
# 启用布局边界
adb shell setprop debug.layout true

# 重启应用查看布局
```

---

## 发布准备

### 生成签名APK

1. 在Android Studio中：
   - `Build` → `Generate Signed Bundle / APK`
   - 选择 APK
   - 创建或选择密钥库
   - 输入密码
   - 选择 release 构建类型

2. 生成的APK位置：
   ```
   android/app/release/app-release.apk
   ```

### 优化APK大小

1. 启用代码混淆（已配置）
2. 移除未使用的资源
3. 使用WebP格式图片

---

## 下一步

1. ✅ **基础功能测试** - 确保所有功能正常
2. ⏳ **性能优化** - 优化语音识别和检测性能
3. ⏳ **用户体验** - 改进UI交互
4. ⏳ **错误处理** - 完善异常处理
5. ⏳ **发布准备** - 准备应用商店发布

---

## 🎯 快速命令参考

```bash
# 同步代码
npx cap sync android

# 打开Android Studio
npx cap open android

# 下载Vosk模型
./download_vosk_model.sh

# 查看设备
adb devices

# 查看日志
adb logcat | grep goosequack

# 安装APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 卸载应用
adb uninstall com.goosequack.helper

# 清理重建
cd android && ./gradlew clean && ./gradlew build
```

---

祝开发顺利！ 🦆✨

有问题请查看：
- [DEVELOPMENT.md](DEVELOPMENT.md) - 详细开发文档
- [VOSK_MODEL_SETUP.md](android/VOSK_MODEL_SETUP.md) - Vosk模型设置
- [GitHub Issues](https://github.com/huzhexin/goose-duck-meeting-helper/issues) - 问题反馈
