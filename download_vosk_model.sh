#!/bin/bash

# 鹅鸭杀助手 - Vosk模型自动下载脚本

echo "🦆 鹅鸭杀助手 - Vosk模型下载工具"
echo "=================================="
echo ""

# 检查是否已存在模型
if [ -d "android/app/src/main/assets/vosk-model-cn" ]; then
    echo "⚠️  检测到已存在的模型文件"
    read -p "是否要重新下载？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "✅ 使用现有模型"
        exit 0
    fi
    echo "🗑️  删除旧模型..."
    rm -rf android/app/src/main/assets/vosk-model-cn
fi

# 创建目录
echo "📁 创建assets目录..."
mkdir -p android/app/src/main/assets
cd android/app/src/main/assets

# 选择模型
echo ""
echo "请选择要下载的模型："
echo "1) 小型模型 (40MB) - 推荐，速度快"
echo "2) 大型模型 (1.3GB) - 准确率更高"
read -p "请输入选项 (1/2) [默认:1]: " choice
choice=${choice:-1}

if [ "$choice" == "2" ]; then
    MODEL_NAME="vosk-model-cn-0.22"
    MODEL_URL="https://alphacephei.com/vosk/models/vosk-model-cn-0.22.zip"
    echo "📦 下载大型模型 (1.3GB)，这可能需要较长时间..."
else
    MODEL_NAME="vosk-model-small-cn-0.22"
    MODEL_URL="https://alphacephei.com/vosk/models/vosk-model-small-cn-0.22.zip"
    echo "📦 下载小型模型 (40MB)..."
fi

# 下载模型
echo "⬇️  正在下载 $MODEL_NAME ..."
if command -v curl &> /dev/null; then
    curl -L -o model.zip "$MODEL_URL" --progress-bar
elif command -v wget &> /dev/null; then
    wget "$MODEL_URL" -O model.zip --show-progress
else
    echo "❌ 错误：未找到 curl 或 wget 命令"
    exit 1
fi

if [ $? -ne 0 ]; then
    echo "❌ 下载失败！请检查网络连接"
    exit 1
fi

# 解压
echo "📂 解压模型文件..."
unzip -q model.zip

if [ $? -ne 0 ]; then
    echo "❌ 解压失败！"
    rm model.zip
    exit 1
fi

# 重命名
echo "📝 重命名模型文件夹..."
mv "$MODEL_NAME" vosk-model-cn

# 清理
echo "🧹 清理临时文件..."
rm model.zip

# 验证
if [ -d "vosk-model-cn/am" ] && [ -d "vosk-model-cn/conf" ] && [ -d "vosk-model-cn/graph" ]; then
    echo ""
    echo "✅ Vosk模型安装完成！"
    echo ""
    echo "模型位置: android/app/src/main/assets/vosk-model-cn/"
    echo "模型大小: $(du -sh vosk-model-cn | cut -f1)"
    echo ""
    echo "下一步："
    echo "  1. 运行: npx cap sync android"
    echo "  2. 运行: npx cap open android"
    echo "  3. 在Android Studio中构建并运行应用"
    echo ""
else
    echo "❌ 模型文件结构不完整，请检查下载"
    exit 1
fi
