// ===== 语音识别模块 =====
// 注意：此文件需要配合Android原生插件VoskPlugin使用
// 在浏览器环境下会提供模拟功能用于测试

const Voice = {
  isListening: false,
  currentBuffer: '',      // 当前句子缓冲
  currentPlayerId: null,  // 当前发言玩家（需手动指定或自动检测）

  // 初始化
  async init() {
    try {
      // 检查是否在Capacitor环境
      if (typeof window.VoskPlugin !== 'undefined') {
        // 初始化Vosk模型（首次加载较慢，约3-5秒）
        await VoskPlugin.initModel();
        console.log('语音模型加载成功');

        // 监听识别结果
        VoskPlugin.addListener('onResult', (data) => {
          this.handleResult(data);
        });

        VoskPlugin.addListener('onError', (data) => {
          console.error('识别错误:', data.error);
          UI.setVoiceStatus('error');
        });
      } else {
        console.log('浏览器环境：语音识别功能将在Android设备上可用');
        // 浏览器环境下的模拟功能
        this.initBrowserDemo();
      }

    } catch(e) {
      console.error('语音识别初始化失败:', e);
    }
  },

  // 浏览器环境下的演示功能
  initBrowserDemo() {
    console.log('演示模式：可以手动触发模拟语音识别');
  },

  // 开始监听
  async start() {
    if (this.isListening) return;
    try {
      if (typeof window.VoskPlugin !== 'undefined') {
        await VoskPlugin.startListening();
      } else {
        console.log('演示模式：开始监听');
      }
      this.isListening = true;
      UI.setVoiceStatus('listening');
    } catch(e) {
      UI.setVoiceStatus('error');
    }
  },

  // 停止监听
  async stop() {
    if (!this.isListening) return;
    if (typeof window.VoskPlugin !== 'undefined') {
      await VoskPlugin.stopListening();
    } else {
      console.log('演示模式：停止监听');
    }
    this.isListening = false;
    UI.setVoiceStatus('idle');
  },

  // 处理识别结果
  handleResult(data) {
    let text = '';

    // 解析Vosk返回的JSON
    try {
      const parsed = JSON.parse(data.text);
      text = parsed.partial || parsed.text || '';
    } catch(e) {
      text = data.text || '';
    }

    if (!text.trim()) return;

    if (data.type === 'partial') {
      // 实时显示识别中的文字
      UI.updateLiveText(text);

    } else if (data.type === 'final' && text.trim()) {
      // 最终结果：存入记录
      UI.updateLiveText('');

      // 自动归属到当前选中玩家，或默认第一个玩家
      const playerId = this.currentPlayerId || Store.getPlayers()[0]?.id;
      if (playerId) {
        const speech = Store.addSpeech(playerId, text.trim(), true);

        if (speech) {
          UI.addSpeechToMeeting(speech);
          UI.renderPlayerList();
        }
      }
    }
  },

  // 设置当前发言玩家
  setCurrentPlayer(playerId) {
    this.currentPlayerId = playerId;
  },

  // 演示功能：模拟添加发言（用于浏览器测试）
  demoAddSpeech(text, playerId = null) {
    if (!playerId) {
      playerId = Store.getPlayers()[0]?.id;
    }
    if (playerId) {
      const speech = Store.addSpeech(playerId, text, true);
      if (speech) {
        UI.addSpeechToMeeting(speech);
        UI.renderPlayerList();
      }
    }
  }
};

window.Voice = Voice;
