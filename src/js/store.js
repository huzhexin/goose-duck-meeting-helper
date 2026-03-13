// ===== 数据管理模块 =====

const TAGS = {
  unknown:    { label: '未知', icon: '❓', color: '#888888' },
  trust:      { label: '信任', icon: '✅', color: '#4CAF50' },
  suspicious: { label: '可疑', icon: '🟡', color: '#FF9800' },
  duck:       { label: '鸭子', icon: '🔴', color: '#F44336' },
  dead:       { label: '已死', icon: '💀', color: '#555555' }
};

// 玩家颜色（对应游戏内颜色）
const PLAYER_COLORS = [
  '#E53935', '#E91E63', '#9C27B0', '#3F51B5',
  '#2196F3', '#00BCD4', '#4CAF50', '#FFEB3B',
  '#FF9800', '#795548', '#607D8B', '#FFFFFF'
];

const Store = {
  // 当前游戏数据
  game: {
    round: 1,
    players: [],
    meetings: [],
    currentMeeting: null
  },

  // 初始化默认玩家（鹅鸭杀通常4-16人）
  initPlayers(count = 8) {
    this.game.players = Array.from({ length: count }, (_, i) => ({
      id: `player_${i + 1}`,
      name: `玩家${i + 1}`,
      color: PLAYER_COLORS[i] || '#888',
      tag: 'unknown',
      status: 'alive',   // alive | dead
      notes: [],
      speeches: []
    }));
    this.save();
    return this.game.players;
  },

  // 获取所有玩家
  getPlayers() {
    return this.game.players;
  },

  // 更新玩家标签
  setPlayerTag(playerId, tag) {
    const player = this.findPlayer(playerId);
    if (player) {
      player.tag = tag;
      // 标记为死亡时同步status
      if (tag === 'dead') player.status = 'dead';
      this.save();
    }
  },

  // 添加玩家笔记
  addPlayerNote(playerId, text) {
    const player = this.findPlayer(playerId);
    if (player && text.trim()) {
      player.notes.push({
        text: text.trim(),
        time: Date.now()
      });
      this.save();
    }
  },

  // 添加发言记录
  addSpeech(playerId, text, isAuto = true) {
    const player = this.findPlayer(playerId);
    if (!player) return;

    const speech = {
      id: Date.now(),
      playerId,
      playerName: player.name,
      text,
      round: this.game.round,
      time: Date.now(),
      isAuto
    };

    // 存入玩家发言历史
    player.speeches.push(speech);

    // 存入当前会议
    if (this.game.currentMeeting) {
      this.game.currentMeeting.speeches.push(speech);
    }

    this.save();
    return speech;
  },

  // 开始新一轮会议
  startMeeting() {
    const meeting = {
      id: Date.now(),
      round: this.game.round,
      startTime: Date.now(),
      endTime: null,
      speeches: []
    };
    this.game.currentMeeting = meeting;
    this.game.meetings.push(meeting);
    this.save();
    return meeting;
  },

  // 结束会议
  endMeeting() {
    if (this.game.currentMeeting) {
      this.game.currentMeeting.endTime = Date.now();
      this.game.currentMeeting = null;
    }
    this.game.round++;
    this.save();
  },

  // 重置游戏
  resetGame() {
    this.game = {
      round: 1,
      players: [],
      meetings: [],
      currentMeeting: null
    };
    this.initPlayers(8);
  },

  // 查找玩家
  findPlayer(playerId) {
    return this.game.players.find(p => p.id === playerId);
  },

  // 持久化存储
  save() {
    localStorage.setItem('ggd_game', JSON.stringify(this.game));
  },

  // 读取存储
  load() {
    const saved = localStorage.getItem('ggd_game');
    if (saved) {
      try {
        this.game = JSON.parse(saved);
      } catch(e) {
        console.error('数据读取失败', e);
      }
    }
  }
};

// 暴露全局
window.Store = Store;
window.TAGS = TAGS;
