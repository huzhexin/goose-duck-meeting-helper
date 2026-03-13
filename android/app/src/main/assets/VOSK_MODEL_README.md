# Vosk语音识别模型说明

## ⚠️ 重要提示

**Vosk中文语音识别模型（65MB）不包含在Git仓库中！**

## 📥 如何获取模型

### 方法1：使用自动脚本（推荐）

```bash
cd /Users/huzhexin/Documents/ggd/goose-duck-meeting-helper
./download_vosk_model.sh
```

选择 `1` (小型模型，40MB压缩，65MB解压后)

### 方法2：手动下载

1. 访问：https://alphacephei.com/vosk/models
2. 下载：`vosk-model-small-cn-0.22.zip` (约40MB)
3. 解压到此目录，重命名为 `vosk-model-cn`

## 📁 正确的目录结构

```
android/app/src/main/assets/
└── vosk-model-cn/          # 模型目录（65MB）
    ├── am/                 # 声学模型
    ├── conf/               # 配置文件
    ├── graph/              # 语言模型
    ├── ivector/            # 特征提取
    └── README
```

## ✅ 验证安装

运行以下命令检查模型是否正确安装：

```bash
ls -lh android/app/src/main/assets/vosk-model-cn/
```

应该看到 `am/`, `conf/`, `graph/`, `ivector/` 等目录。

## ❓ 为什么不包含在Git中？

1. **文件太大** - 65MB会让Git仓库膨胀
2. **克隆缓慢** - 影响其他用户下载速度
3. **最佳实践** - 大型二进制文件应该单独下载

## 📚 更多信息

查看项目根目录的以下文档：
- `READY_TO_BUILD.md` - 完整构建指南
- `START_HERE.md` - 快速开始
- `android/VOSK_MODEL_SETUP.md` - 详细的模型安装说明

---

**如有问题，请查看项目文档或提交Issue**
