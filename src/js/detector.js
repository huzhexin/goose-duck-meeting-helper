// ===== 会议检测模块 =====
// 注意：此文件需要配合opencv.js和Android原生截图插件使用
// 在浏览器环境下会提供模拟功能用于测试

const Detector = {
  isRunning: false,
  intervalId: null,
  template: null,
  THRESHOLD: 0.80,    // 匹配阈值，可调整
  CHECK_INTERVAL: 800, // 检测间隔ms

  // 初始化
  async init() {
    try {
      // 检查opencv.js是否可用
      if (typeof cv !== 'undefined' && cv.Mat) {
        await this.loadTemplate();
        console.log('会议检测器已就绪');
      } else {
        console.log('浏览器环境：会议检测功能将在Android设备上可用');
        // 浏览器环境下使用手动触发
        this.initBrowserDemo();
      }
    } catch(e) {
      console.error('检测器初始化失败:', e);
    }
  },

  // 浏览器环境下的演示功能
  initBrowserDemo() {
    console.log('演示模式：可以手动触发会议开始');
    // 添加全局测试函数
    window.testStartMeeting = () => {
      this.onMeetingDetected();
    };
  },

  async loadTemplate() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          this.template = cv.imread(img);
          // 转灰度，提高匹配速度
          cv.cvtColor(this.template, this.template, cv.COLOR_RGBA2GRAY);
          resolve();
        } catch(e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error('模板图片加载失败'));
      img.src = 'assets/templates/meeting_start.png';
    });
  },

  // 开始检测
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    if (typeof cv !== 'undefined' && cv.Mat && typeof window.ScreenCapturePlugin !== 'undefined') {
      this.intervalId = setInterval(() => {
        this.checkScreen();
      }, this.CHECK_INTERVAL);
      console.log('会议检测已启动');
    } else {
      console.log('演示模式：使用 testStartMeeting() 手动触发会议');
    }
  },

  // 停止检测
  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  // 截图并检测
  async checkScreen() {
    try {
      // 调用原生截图插件
      const result = await ScreenCapturePlugin.capture({
        quality: 60  // 降低质量以提升速度
      });

      if (!result.base64) return;

      // 转为图像
      const img = new Image();
      img.onload = () => {
        const matched = this.matchTemplate(img);
        if (matched) {
          this.onMeetingDetected();
        }
      };
      img.src = 'data:image/jpeg;base64,' + result.base64;

    } catch(e) {
      // 截图权限未授予等情况，静默处理
      console.debug('截图失败:', e.message);
    }
  },

  // 模板匹配
  matchTemplate(img) {
    if (!this.template) return false;

    const src = cv.imread(img);
    const gray = new cv.Mat();
    const result = new cv.Mat();

    try {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.matchTemplate(gray, this.template, result, cv.TM_CCOEFF_NORMED);
      const { maxVal } = cv.minMaxLoc(result);
      return maxVal >= this.THRESHOLD;
    } finally {
      // 必须手动释放内存
      src.delete();
      gray.delete();
      result.delete();
    }
  },

  // 检测到会议开始
  onMeetingDetected() {
    // 防止重复触发（5秒内不重复）
    if (this._lastDetect && Date.now() - this._lastDetect < 5000) return;
    this._lastDetect = Date.now();

    console.log('✅ 检测到会议开始！');

    // 触发会议流程
    const meeting = Store.startMeeting();
    UI.showMeetingModal(meeting.round);
    Voice.start();
    UI.setVoiceStatus('listening');
  }
};

window.Detector = Detector;
