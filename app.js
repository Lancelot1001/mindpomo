// app.js
App({
  globalData: {
    // 默认设置
    settings: {
      focusDuration: 25,       // 专注时长（分钟）
      shortBreak: 5,           // 短休息
      longBreak: 15,           // 长休息
      vibration: true,        // 震动
      sound: true,            // 声音
      autoStartBreak: false   // 自动开始休息
    },
    // 预设标签
    presetTags: ['学习', '工作', '阅读', '创作', '其他'],
    // 番茄钟周期数
    pomodoroCount: 0
  },

  onLaunch() {
    // 初始化设置
    this.initSettings();
    // 初始化标签
    this.initTags();
  },

  // 初始化设置
  initSettings() {
    const savedSettings = wx.getStorageSync('settings');
    if (savedSettings) {
      this.globalData.settings = { ...this.globalData.settings, ...savedSettings };
    } else {
      wx.setStorageSync('settings', this.globalData.settings);
    }
  },

  // 初始化标签
  initTags() {
    const savedTags = wx.getStorageSync('customTags');
    if (!savedTags) {
      wx.setStorageSync('customTags', []);
    }
  },

  // 获取当前设置
  getSettings() {
    return this.globalData.settings;
  },

  // 更新设置
  updateSettings(newSettings) {
    this.globalData.settings = { ...this.globalData.settings, ...newSettings };
    wx.setStorageSync('settings', this.globalData.settings);
  },

  // 获取所有标签
  getAllTags() {
    const customTags = wx.getStorageSync('customTags') || [];
    return [...this.globalData.presetTags, ...customTags];
  }
})