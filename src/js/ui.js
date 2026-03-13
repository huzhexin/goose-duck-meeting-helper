// ===== UI渲染模块 =====

const UI = {

  // 渲染玩家列表
  renderPlayerList() {
    const container = document.getElementById('player-list');
    const players = Store.getPlayers();

    container.innerHTML = players.map(player => {
      const tag = TAGS[player.tag];
      const lastSpeech = player.speeches.slice(-1)[0];
      const isDead = player.status === 'dead';

      return `
        <div class="player-item ${isDead ? 'status-dead' : ''}"
             onclick="UI.openPlayerModal('${player.id}')">
          <div class="player-color-dot"
               style="background:${player.color}"></div>
          <span class="player-tag-icon">${tag.icon}</span>
          <span class="player-name">${player.name}</span>
          <span class="player-last-speech">
            ${lastSpeech ? lastSpeech.text : '暂无发言'}
          </span>
        </div>
      `;
    }).join('');
  },

  // 渲染会议快速标记按钮
  renderQuickTagPlayers() {
    const container = document.getElementById('quick-tag-players');
    const players = Store.getPlayers().filter(p => p.status === 'alive');

    container.innerHTML = players.map(player => {
      const tag = TAGS[player.tag];
      return `
        <div class="quick-tag-btn"
             onclick="UI.cyclePlayerTag('${player.id}', this)">
          <span class="tag-icon">${tag.icon}</span>
          <span class="tag-name">${player.name}</span>
        </div>
      `;
    }).join('');
  },

  // 循环切换标签（点击快速切换）
  cyclePlayerTag(playerId, btnEl) {
    const order = ['unknown', 'trust', 'suspicious', 'duck', 'dead'];
    const player = Store.findPlayer(playerId);
    const currentIndex = order.indexOf(player.tag);
    const nextTag = order[(currentIndex + 1) % order.length];

    Store.setPlayerTag(playerId, nextTag);

    // 更新按钮图标
    const tag = TAGS[nextTag];
    btnEl.querySelector('.tag-icon').textContent = tag.icon;

    // 刷新主列表
    this.renderPlayerList();
  },

  // 打开玩家详情弹窗
  openPlayerModal(playerId) {
    const player = Store.findPlayer(playerId);
    if (!player) return;

    // 填充玩家名
    document.getElementById('modal-player-name').textContent = player.name;

    // 渲染标签选项
    const tagContainer = document.getElementById('tag-options');
    tagContainer.innerHTML = Object.entries(TAGS).map(([key, tag]) => `
      <button class="tag-option-btn ${player.tag === key ? 'selected' : ''}"
              style="color:${tag.color}"
              onclick="UI.selectTag('${playerId}', '${key}', this)">
        ${tag.icon} ${tag.label}
      </button>
    `).join('');

    // 渲染历史发言
    const historyEl = document.getElementById('player-speech-history');
    historyEl.innerHTML = player.speeches.length
      ? player.speeches.map(s => `
          <div class="speech-item">
            <span class="speech-text">${s.text}</span>
            <span class="speech-time">
              第${s.round}轮 ${UI.formatTime(s.time)}
            </span>
          </div>
        `).join('')
      : '<div style="color:#666;font-size:12px">暂无发言记录</div>';

    // 填充已有备注
    const notes = player.notes.map(n => n.text).join('\n');
    document.getElementById('note-input').value = notes;

    // 绑定保存备注
    document.getElementById('btn-save-note').onclick = () => {
      const text = document.getElementById('note-input').value;
      Store.addPlayerNote(playerId, text);
      UI.showToast('备注已保存');
    };

    document.getElementById('player-modal').classList.remove('hidden');
  },

  // 选择标签
  selectTag(playerId, tagKey, btnEl) {
    Store.setPlayerTag(playerId, tagKey);
    // 更新选中状态
    btnEl.closest('.tag-options')
         .querySelectorAll('.tag-option-btn')
         .forEach(b => b.classList.remove('selected'));
    btnEl.classList.add('selected');
    // 刷新主列表
    this.renderPlayerList();
  },

  // 添加发言到会议弹窗
  addSpeechToMeeting(speech) {
    const container = document.getElementById('speech-list');
    const player = Store.findPlayer(speech.playerId);
    const tag = TAGS[player?.tag || 'unknown'];

    // 清除空状态
    const empty = container.querySelector('.speech-empty');
    if (empty) empty.remove();

    const item = document.createElement('div');
    item.className = 'speech-item';
    item.innerHTML = `
      <span class="speech-player-name" style="color:${tag.color}">
        ${speech.playerName}
      </span>
      <span class="speech-text">${speech.text}</span>
      <span class="speech-time">${UI.formatTime(speech.time)}</span>
    `;
    container.appendChild(item);

    // 自动滚动到底部
    container.scrollTop = container.scrollHeight;
  },

  // 显示会议弹窗
  showMeetingModal(round) {
    document.getElementById('meeting-title').textContent =
      `🔔 会议开始！第${round}轮`;
    document.getElementById('speech-list').innerHTML =
      '<div class="speech-empty">等待发言...</div>';
    this.renderQuickTagPlayers();
    document.getElementById('meeting-modal').classList.remove('hidden');
  },

  // 隐藏会议弹窗
  hideMeetingModal() {
    document.getElementById('meeting-modal').classList.add('hidden');
  },

  // 更新语音状态
  setVoiceStatus(status) {
    const dot = document.getElementById('voice-dot');
    const text = document.getElementById('voice-status');
    const liveText = document.getElementById('live-text');

    const config = {
      idle:       { dot: '',          text: '等待会议开始...' },
      listening:  { dot: 'listening', text: '🎙️ 正在识别发言...' },
      processing: { dot: 'active',    text: '⏳ 处理中...' },
      error:      { dot: '',          text: '❌ 识别出错，请检查麦克风' }
    };

    const cfg = config[status] || config.idle;
    dot.className = `voice-dot ${cfg.dot}`;
    text.textContent = cfg.text;

    if (status === 'listening') {
      liveText.style.display = 'block';
    } else {
      liveText.style.display = 'none';
    }
  },

  // 更新实时识别文字
  updateLiveText(text) {
    document.getElementById('live-text-content').textContent = text;
  },

  // 更新轮次显示
  updateRound(round) {
    document.getElementById('round-badge').textContent = `第${round}轮`;
  },

  // Toast提示
  showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed; bottom:80px; left:50%;
      transform:translateX(-50%);
      background:rgba(0,0,0,0.8); color:#fff;
      padding:8px 18px; border-radius:20px;
      font-size:13px; z-index:99999;
      animation: fadeIn 0.2s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  },

  // 格式化时间
  formatTime(ts) {
    const d = new Date(ts);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
};

window.UI = UI;
