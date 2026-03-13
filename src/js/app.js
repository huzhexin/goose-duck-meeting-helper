// ===== 主逻辑入口 =====

document.addEventListener('DOMContentLoaded', async () => {

  // 1. 加载本地数据
  Store.load();
  if (Store.getPlayers().length === 0) {
    Store.initPlayers(8);
  }

  // 2. 渲染界面
  UI.renderPlayerList();
  UI.updateRound(Store.game.round);

  // 3. 初始化语音识别
  await Voice.init();

  // 4. 初始化会议检测
  await Detector.init();
  Detector.start();  // 开始后台检测

  // ===== 绑定按钮事件 =====

  // 最小化/展开
  document.getElementById('btn-minimize').onclick = () => {
    const panel = document.getElementById('floating-panel');
    panel.classList.toggle('minimized');
    document.getElementById('btn-minimize').textContent =
      panel.classList.contains('minimized') ? '□' : '─';
  };

  // 手动添加玩家
  document.getElementById('btn-add-player').onclick = () => {
    const name = prompt('输入玩家名称：');
    if (name) {
      Store.game.players.push({
        id: `player_${Date.now()}`,
        name,
        color: '#888',
        tag: 'unknown',
        status: 'alive',
        notes: [],
        speeches: []
      });
      Store.save();
      UI.renderPlayerList();
    }
  };

  // 新一轮
  document.getElementById('btn-new-round').onclick = () => {
    if (confirm('开始新一轮？')) {
      Store.game.round++;
      Store.save();
      UI.updateRound(Store.game.round);
      UI.showToast(`第${Store.game.round}轮开始`);
    }
  };

  // 复盘
  document.getElementById('btn-review').onclick = () => {
    showReview();
  };

  // 关闭玩家弹窗
  document.getElementById('btn-close-player-modal').onclick = () => {
    document.getElementById('player-modal').classList.add('hidden');
  };

  // 结束会议
  document.getElementById('btn-end-meeting').onclick = () => {
    Store.endMeeting();
    UI.hideMeetingModal();
    Voice.stop();
    UI.updateRound(Store.game.round);
    UI.renderPlayerList();
    UI.showToast('会议结束，进入投票');
  };

  // 关闭会议弹窗
  document.getElementById('btn-close-meeting').onclick = () => {
    UI.hideMeetingModal();
  };

  // 悬浮窗拖拽
  initDrag();

  // 浏览器演示模式提示
  if (typeof window.Capacitor === 'undefined') {
    console.log('%c🦆 鹅鸭杀助手 - 演示模式', 'color: #64B5F6; font-size: 16px; font-weight: bold;');
    console.log('%c在浏览器中预览UI效果。完整功能需要在Android设备上运行。', 'color: #888;');
    console.log('%c测试会议功能：testStartMeeting()', 'color: #4CAF50;');
    console.log('%c测试语音功能：Voice.demoAddSpeech("这是测试发言")', 'color: #4CAF50;');
  }
});

// ===== 悬浮窗拖拽 =====
function initDrag() {
  const panel = document.getElementById('floating-panel');
  const handle = document.getElementById('drag-handle');
  let startX, startY, startLeft, startBottom;

  handle.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    const rect = panel.getBoundingClientRect();
    startLeft = rect.left;
    startBottom = window.innerHeight - rect.bottom;
  });

  handle.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    const newLeft = Math.max(0, Math.min(
      window.innerWidth - panel.offsetWidth,
      startLeft + dx
    ));
    const newBottom = Math.max(0, Math.min(
      window.innerHeight - panel.offsetHeight,
      startBottom - dy
    ));

    panel.style.left = newLeft + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = newBottom + 'px';
  }, { passive: false });

  // 鼠标拖拽支持（用于桌面浏览器测试）
  handle.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    const rect = panel.getBoundingClientRect();
    startLeft = rect.left;
    startBottom = window.innerHeight - rect.bottom;

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newLeft = Math.max(0, Math.min(
        window.innerWidth - panel.offsetWidth,
        startLeft + dx
      ));
      const newBottom = Math.max(0, Math.min(
        window.innerHeight - panel.offsetHeight,
        startBottom - dy
      ));

      panel.style.left = newLeft + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = newBottom + 'px';
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

// ===== 复盘页面 =====
function showReview() {
  const panel = document.getElementById('review-panel');
  const content = document.getElementById('review-content');
  const players = Store.getPlayers();

  content.innerHTML = `
    <div style="padding:16px">
      <h3 style="color:#64B5F6;margin-bottom:12px">
        玩家总结（共${Store.game.round - 1}轮）
      </h3>
      ${players.map(p => {
        const tag = TAGS[p.tag];
        return `
          <div style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.06)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <div style="width:10px;height:10px;border-radius:50%;
                          background:${p.color}"></div>
              <span style="font-weight:600">${p.name}</span>
              <span style="color:${tag.color}">${tag.icon} ${tag.label}</span>
            </div>
            <div style="font-size:12px;color:#888">
              发言${p.speeches.length}次
              ${p.notes.length ? `· ${p.notes.length}条备注` : ''}
            </div>
            ${p.speeches.map(s => `
              <div style="font-size:12px;color:#aaa;
                          padding:4px 0;border-left:2px solid #333;
                          padding-left:8px;margin-top:4px">
                第${s.round}轮：${s.text}
              </div>
            `).join('')}
          </div>
        `;
      }).join('')}
    </div>
  `;

  panel.classList.remove('hidden');

  document.getElementById('btn-back').onclick = () => {
    panel.classList.add('hidden');
  };
}
