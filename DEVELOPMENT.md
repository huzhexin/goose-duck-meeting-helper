# 开发指南

## Android原生插件开发

### 1. VoskPlugin - 语音识别插件

在 `android/app/src/main/java/com/goosequack/helper/` 目录下创建：

**VoskPlugin.java**

```java
package com.goosequack.helper;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

import org.vosk.Model;
import org.vosk.Recognizer;
import org.vosk.android.SpeechService;
import org.vosk.android.RecognitionListener;

@CapacitorPlugin(name = "VoskPlugin")
public class VoskPlugin extends Plugin implements RecognitionListener {

    private Model model;
    private SpeechService speechService;

    @PluginMethod
    public void initModel(PluginCall call) {
        new Thread(() -> {
            try {
                // 从assets加载中文模型
                model = new Model(getContext(), "vosk-model-cn");

                JSObject result = new JSObject();
                result.put("success", true);
                call.resolve(result);
            } catch (Exception e) {
                call.reject("模型加载失败: " + e.getMessage());
            }
        }).start();
    }

    @PluginMethod
    public void startListening(PluginCall call) {
        try {
            Recognizer recognizer = new Recognizer(model, 16000.0f);
            speechService = new SpeechService(recognizer, 16000.0f);
            speechService.startListening(this);
            call.resolve();
        } catch (Exception e) {
            call.reject("启动识别失败: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stopListening(PluginCall call) {
        if (speechService != null) {
            speechService.stop();
            speechService = null;
        }
        call.resolve();
    }

    @Override
    public void onPartialResult(String hypothesis) {
        try {
            JSObject data = new JSObject();
            data.put("type", "partial");
            data.put("text", hypothesis);
            notifyListeners("onResult", data);
        } catch (Exception e) { }
    }

    @Override
    public void onResult(String hypothesis) {
        try {
            JSObject data = new JSObject();
            data.put("type", "final");
            data.put("text", hypothesis);
            notifyListeners("onResult", data);
        } catch (Exception e) { }
    }

    @Override
    public void onFinalResult(String hypothesis) { }

    @Override
    public void onError(Exception e) {
        JSObject data = new JSObject();
        data.put("error", e.getMessage());
        notifyListeners("onError", data);
    }

    @Override
    public void onTimeout() { }
}
```

### 2. ScreenCapturePlugin - 截图插件

**ScreenCapturePlugin.java**

```java
package com.goosequack.helper;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.Image;
import android.media.ImageReader;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.DisplayMetrics;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;

@CapacitorPlugin(name = "ScreenCapturePlugin")
public class ScreenCapturePlugin extends Plugin {

    private static final int REQUEST_CODE = 100;
    private MediaProjection mediaProjection;
    private ImageReader imageReader;
    private VirtualDisplay virtualDisplay;

    @PluginMethod
    public void requestPermission(PluginCall call) {
        MediaProjectionManager manager =
            (MediaProjectionManager) getContext().getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        Intent intent = manager.createScreenCaptureIntent();
        startActivityForResult(call, intent, REQUEST_CODE);
    }

    @PluginMethod
    public void capture(PluginCall call) {
        if (mediaProjection == null) {
            call.reject("需要先请求截图权限");
            return;
        }

        try {
            Activity activity = getActivity();
            DisplayMetrics metrics = new DisplayMetrics();
            activity.getWindowManager().getDefaultDisplay().getMetrics(metrics);

            int width = metrics.widthPixels;
            int height = metrics.heightPixels;
            int density = metrics.densityDpi;

            imageReader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2);

            virtualDisplay = mediaProjection.createVirtualDisplay(
                "ScreenCapture",
                width, height, density,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                imageReader.getSurface(),
                null, null
            );

            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                Image image = imageReader.acquireLatestImage();
                if (image != null) {
                    Bitmap bitmap = imageToBitmap(image);
                    image.close();

                    // 压缩为JPEG
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    int quality = call.getInt("quality", 80);
                    bitmap.compress(Bitmap.CompressFormat.JPEG, quality, baos);
                    String base64 = Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);

                    JSObject result = new JSObject();
                    result.put("base64", base64);
                    call.resolve(result);

                    virtualDisplay.release();
                    imageReader.close();
                } else {
                    call.reject("截图失败");
                }
            }, 100);

        } catch (Exception e) {
            call.reject("截图异常: " + e.getMessage());
        }
    }

    private Bitmap imageToBitmap(Image image) {
        Image.Plane[] planes = image.getPlanes();
        ByteBuffer buffer = planes[0].getBuffer();
        int pixelStride = planes[0].getPixelStride();
        int rowStride = planes[0].getRowStride();
        int rowPadding = rowStride - pixelStride * image.getWidth();

        Bitmap bitmap = Bitmap.createBitmap(
            image.getWidth() + rowPadding / pixelStride,
            image.getHeight(),
            Bitmap.Config.ARGB_8888
        );
        bitmap.copyPixelsFromBuffer(buffer);
        return bitmap;
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);

        PluginCall savedCall = getSavedCall();
        if (savedCall == null) return;

        if (requestCode == REQUEST_CODE && resultCode == Activity.RESULT_OK) {
            MediaProjectionManager manager =
                (MediaProjectionManager) getContext().getSystemService(Context.MEDIA_PROJECTION_SERVICE);
            mediaProjection = manager.getMediaProjection(resultCode, data);

            JSObject result = new JSObject();
            result.put("granted", true);
            savedCall.resolve(result);
        } else {
            savedCall.reject("用户拒绝授权");
        }
    }
}
```

### 3. FloatingWindowPlugin - 悬浮窗插件

**FloatingWindowPlugin.java**

```java
package com.goosequack.helper;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "FloatingWindowPlugin")
public class FloatingWindowPlugin extends Plugin {

    @PluginMethod
    public void checkPermission(PluginCall call) {
        boolean hasPermission = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            hasPermission = Settings.canDrawOverlays(getContext());
        }

        JSObject result = new JSObject();
        result.put("granted", hasPermission);
        call.resolve(result);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(getContext())) {
                Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getContext().getPackageName())
                );
                startActivityForResult(call, intent, 1001);
                return;
            }
        }

        JSObject result = new JSObject();
        result.put("granted", true);
        call.resolve(result);
    }
}
```

### 4. 在MainActivity中注册插件

**MainActivity.java**

```java
package com.goosequack.helper;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 注册自定义插件
        registerPlugin(VoskPlugin.class);
        registerPlugin(ScreenCapturePlugin.class);
        registerPlugin(FloatingWindowPlugin.class);
    }
}
```

### 5. AndroidManifest.xml 配置

在 `android/app/src/main/AndroidManifest.xml` 中添加权限：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.goosequack.helper">

    <!-- 悬浮窗权限 -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>

    <!-- 录音权限 -->
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>

    <!-- 截图权限 -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION"/>

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 6. build.gradle 依赖

在 `android/app/build.gradle` 中添加：

```gradle
dependencies {
    // Vosk语音识别
    implementation 'com.alphacephei:vosk-android:0.3.45'

    // 其他依赖
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
}
```

## 调试技巧

### 浏览器调试

1. 启动本地服务器：
```bash
cd src && python3 -m http.server 8000
```

2. 在浏览器控制台测试功能：
```javascript
// 测试会议开始
testStartMeeting()

// 测试添加发言
Voice.demoAddSpeech("玩家1说的话", "player_1")

// 查看存储数据
console.log(Store.game)
```

### Android调试

1. 启用USB调试
2. 连接设备后运行：
```bash
adb logcat | grep "Capacitor"
```

3. Chrome远程调试：
- 打开 `chrome://inspect`
- 选择你的设备和WebView

## 性能优化建议

1. **语音识别**
   - 使用小模型（40MB）而非大模型（1GB+）
   - 考虑降低采样率（8000Hz vs 16000Hz）

2. **图像检测**
   - 降低截图质量（quality: 60）
   - 增加检测间隔（800ms → 1500ms）
   - 缩小模板图片尺寸

3. **内存管理**
   - 及时释放OpenCV的Mat对象
   - 限制localStorage存储大小
   - 定期清理旧数据

## 常见问题

### Q: Vosk模型加载失败？
A: 确保模型文件放在正确位置：`android/app/src/main/assets/vosk-model-cn/`

### Q: 悬浮窗权限被拒绝？
A: 需要在系统设置中手动开启悬浮窗权限

### Q: 截图功能不工作？
A: Android 10+需要在前台服务中运行截图功能

### Q: 语音识别不准确？
A: 尝试更换更大的模型，或调整识别参数
