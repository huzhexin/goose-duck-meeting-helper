# GitHub 仓库设置指南

## 创建GitHub仓库

由于系统未安装GitHub CLI，请按以下步骤手动创建仓库：

### 方法1：通过GitHub网站创建（推荐）

1. **访问GitHub**
   - 打开 https://github.com/new

2. **填写仓库信息**
   - Repository name: `goose-duck-meeting-helper`
   - Description: `🦆 Android版鹅鸭杀会议记录助手 - Meeting helper for Goose Goose Duck game`
   - 选择 Public（公开）或 Private（私有）
   - ⚠️ **不要**勾选 "Add a README file"（我们已经有了）
   - ⚠️ **不要**勾选 "Add .gitignore"（我们已经有了）
   - ⚠️ **不要**选择 License（我们已经有了）

3. **点击 "Create repository"**

4. **推送本地代码**

   在终端中执行（替换 YOUR_USERNAME 为你的GitHub用户名）：

   ```bash
   cd /Users/huzhexin/Documents/ggd/goose-duck-meeting-helper
   git remote add origin https://github.com/YOUR_USERNAME/goose-duck-meeting-helper.git
   git branch -M main
   git push -u origin main
   ```

### 方法2：使用GitHub CLI（如果已安装）

```bash
cd /Users/huzhexin/Documents/ggd/goose-duck-meeting-helper

# 登录GitHub
gh auth login

# 创建仓库
gh repo create goose-duck-meeting-helper \
  --public \
  --source=. \
  --description="🦆 Android版鹅鸭杀会议记录助手 - Meeting helper for Goose Goose Duck game" \
  --push
```

## 推荐的仓库设置

创建完仓库后，建议进行以下设置：

### 1. 添加Topics（标签）

在仓库页面点击 "Add topics"，添加：
- `android`
- `capacitor`
- `goose-goose-duck`
- `voice-recognition`
- `game-helper`
- `vosk`
- `javascript`

### 2. 设置仓库描述

确保Description包含关键信息：
```
🦆 Android版鹅鸭杀会议记录助手 - Meeting helper for Goose Goose Duck game with offline voice recognition
```

### 3. 启用GitHub Pages（可选）

如果想展示浏览器演示版：

1. 进入 Settings → Pages
2. Source 选择 "main" 分支
3. Folder 选择 "/src"
4. 点击 Save

这样就可以通过 `https://YOUR_USERNAME.github.io/goose-duck-meeting-helper/` 访问演示版了。

### 4. 添加项目封面图（可选）

在仓库根目录添加 `screenshot.png` 或 `demo.gif` 展示应用界面，然后在README中引用：

```markdown
![应用截图](screenshot.png)
```

### 5. 设置Issue模板（可选）

创建 `.github/ISSUE_TEMPLATE/bug_report.md` 和 `feature_request.md` 方便用户反馈问题。

## 验证推送成功

推送完成后，访问你的仓库地址：
```
https://github.com/YOUR_USERNAME/goose-duck-meeting-helper
```

你应该能看到：
- ✅ README.md 显示在首页
- ✅ 14个文件
- ✅ 2个提交记录
- ✅ MIT License 标识

## 后续维护

### 保持同步

```bash
# 添加新功能后
git add .
git commit -m "Add new feature"
git push

# 拉取更新
git pull
```

### 创建Release（发布版本）

当完成重要功能时：

1. 在GitHub仓库页面点击 "Releases"
2. 点击 "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - 初始发布`
5. 描述更新内容
6. 上传APK文件（如果已构建）
7. 点击 "Publish release"

## 协作开发

如果要邀请其他人协作：

1. 进入 Settings → Collaborators
2. 点击 "Add people"
3. 输入GitHub用户名
4. 选择权限级别（Write推荐）

## 常见问题

**Q: 推送时要求输入密码？**
A: GitHub已不支持密码认证，需要使用Personal Access Token：
1. 访问 https://github.com/settings/tokens
2. 生成新token（repo权限）
3. 使用token代替密码

**Q: 如何修改仓库名？**
A: Settings → General → Repository name → Rename

**Q: 如何删除仓库？**
A: Settings → Danger Zone → Delete this repository

---

完成后，你的项目就成功托管到GitHub了！ 🎉
