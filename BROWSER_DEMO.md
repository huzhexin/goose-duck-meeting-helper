# 浏览器演示指南

## 快速预览

在浏览器中预览UI效果和测试基本功能。

### 启动方法

**方法1：使用Python（推荐）**
```bash
cd src
python3 -m http.server 8000
```
然后访问：http://localhost:8000

**方法2：使用Node.js**
```bash
npx serve src
```

**方法3：使用任何静态服务器**
直接用浏览器打开 `src/index.html` 文件

## 演示功能

### 1. 基础UI测试

打开应用后，你可以：
- ✅ 查看悬浮窗界面
- ✅ 拖动悬浮窗（鼠标拖拽）
- ✅ 点击玩家查看详情
- ✅ 切换玩家标签（信任/可疑/鸭子/已死）
- ✅ 添加玩家备注
- ✅ 查看复盘页面

### 2. 模拟会议流程

在浏览器控制台（F12）中输入：

```javascript
// 1. 开始会议
testStartMeeting()

// 2. 模拟玩家发言
Voice.demoAddSpeech("我在电力室看到红色很可疑", "player_1")
Voice.demoAddSpeech("我一直在做任务，有人能证明吗", "player_2")
Voice.demoAddSpeech("蓝色跟着我，感觉不对劲", "player_3")

// 3. 查看当前游戏数据
console.log(Store.game)

// 4. 查看所有玩家
console.log(Store.getPlayers())

// 5. 标记玩家
Store.setPlayerTag("player_1", "suspicious")  // 标记为可疑
Store.setPlayerTag("player_2", "trust")       // 标记为信任
Store.setPlayerTag("player_3", "duck")        // 标记为鸭子

// 6. 刷新UI
UI.renderPlayerList()
```

### 3. 完整演示脚本

复制以下代码到控制台，体验完整流程：

```javascript
// 完整演示脚本
(async function demo() {
  console.log('%c🦆 开始演示...', 'color: #64B5F6; font-size: 16px; font-weight: bold;');

  // 第1轮会议
  console.log('第1轮会议开始');
  testStartMeeting();

  await sleep(1000);
  Voice.demoAddSpeech("我在电力室，看到红色很可疑", "player_1");
  await sleep(500);
  Voice.demoAddSpeech("我一直在做任务，有人能证明吗？", "player_2");
  await sleep(500);
  Voice.demoAddSpeech("蓝色一直跟着我", "player_3");
  await sleep(500);
  Voice.demoAddSpeech("我觉得红色没问题，他一直在做任务", "player_4");

  // 标记
  Store.setPlayerTag("player_1", "suspicious");
  Store.setPlayerTag("player_2", "trust");
  UI.renderPlayerList();

  await sleep(2000);
  console.log('第1轮会议结束');
  Store.endMeeting();
  UI.hideMeetingModal();

  // 第2轮会议
  await sleep(1000);
  console.log('第2轮会议开始');
  testStartMeeting();

  await sleep(1000);
  Voice.demoAddSpeech("红色被投出去了，但又死了一个人", "player_2");
  await sleep(500);
  Voice.demoAddSpeech("我怀疑是蓝色", "player_4");
  await sleep(500);
  Voice.demoAddSpeech("不是我！我有不在场证明", "player_3");

  Store.setPlayerTag("player_1", "dead");
  Store.setPlayerTag("player_3", "duck");
  UI.renderPlayerList();

  await sleep(2000);
  console.log('%c✅ 演示完成！点击"复盘"按钮查看完整记录', 'color: #4CAF50; font-size: 14px;');

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();
```

## 功能限制说明

浏览器演示模式下，以下功能不可用（需要在Android设备上运行）：

- ❌ 自动语音识别（需要Vosk插件）
- ❌ 自动会议检测（需要截图权限和opencv.js）
- ❌ 悬浮窗权限管理

但你可以：
- ✅ 测试所有UI交互
- ✅ 测试数据存储和读取
- ✅ 使用演示函数模拟完整流程
- ✅ 验证样式和布局

## 开发建议

1. **先在浏览器中完成UI调试**
   - 快速迭代样式
   - 测试交互逻辑
   - 验证数据流

2. **再到Android设备上测试原生功能**
   - 语音识别
   - 会议检测
   - 悬浮窗

3. **使用Chrome DevTools**
   - 响应式设计模式（Ctrl+Shift+M）
   - 模拟手机屏幕
   - 查看localStorage

## 调试技巧

### 查看存储数据
```javascript
// 查看所有存储
console.log(JSON.parse(localStorage.getItem('ggd_game')))

// 清除数据重新开始
localStorage.clear()
location.reload()
```

### 快速添加多个玩家
```javascript
for (let i = 1; i <= 12; i++) {
  Store.game.players.push({
    id: `player_${i}`,
    name: `玩家${i}`,
    color: ['#E53935', '#E91E63', '#9C27B0', '#3F51B5', '#2196F3', '#00BCD4', '#4CAF50', '#FFEB3B', '#FF9800', '#795548', '#607D8B', '#FFFFFF'][i-1],
    tag: 'unknown',
    status: 'alive',
    notes: [],
    speeches: []
  });
}
Store.save();
UI.renderPlayerList();
```

### 模拟完整游戏数据
```javascript
// 创建一个有丰富数据的游戏状态
Store.game.round = 3;
Store.getPlayers().forEach((p, i) => {
  if (i < 2) {
    p.tag = 'dead';
    p.status = 'dead';
  } else if (i === 2) {
    p.tag = 'duck';
  } else if (i < 5) {
    p.tag = 'suspicious';
  } else {
    p.tag = 'trust';
  }

  // 添加一些发言记录
  for (let r = 1; r <= 2; r++) {
    p.speeches.push({
      id: Date.now() + i + r,
      playerId: p.id,
      playerName: p.name,
      text: `这是第${r}轮的发言内容`,
      round: r,
      time: Date.now() - (3-r) * 60000,
      isAuto: true
    });
  }
});
Store.save();
UI.renderPlayerList();
UI.updateRound(Store.game.round);
```

## 常见问题

**Q: 为什么拖动不流畅？**
A: 浏览器环境下使用鼠标拖拽，在Android设备上会更流畅。

**Q: 数据会保存吗？**
A: 会保存在浏览器的localStorage中，清除浏览器数据会丢失。

**Q: 可以导出数据吗？**
A: 可以在控制台运行：
```javascript
console.log(JSON.stringify(Store.game, null, 2))
```
然后复制保存。

---

享受开发过程！ 🦆
