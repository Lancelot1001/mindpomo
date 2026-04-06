// pages/settings/settings.js
const app = getApp();
const storage = require('../../utils/storage.js');
const notification = require('../../utils/notification.js');

Page({
  data: {
    // 专注时长
    focusDuration: 25,
    // 休息时长
    shortBreak: 5,
    longBreak: 15,
    // 提醒设置
    vibration: true,
    sound: true,
    autoStartBreak: false
  },

  onLoad() {
    this.loadSettings();
  },

  // 加载设置
  loadSettings() {
    const settings = app.getSettings();
    this.setData({
      focusDuration: settings.focusDuration,
      shortBreak: settings.shortBreak,
      longBreak: settings.longBreak,
      vibration: settings.vibration,
      sound: settings.sound,
      autoStartBreak: settings.autoStartBreak
    });
  },

  // 专注时长变化
  onFocusDurationChange(e) {
    const value = e.detail.value;
    this.setData({ focusDuration: value });
    this.saveSettings({ focusDuration: value });
  },

  // 短休息变化
  onShortBreakTap(e) {
    let value = parseInt(e.currentTarget.dataset.value, 10);
    if (value < 3) value = 3;
    if (value > 10) value = 10;
    this.setData({ shortBreak: value });
    this.saveSettings({ shortBreak: value });
  },

  // 长休息变化
  onLongBreakTap(e) {
    let value = parseInt(e.currentTarget.dataset.value, 10);
    if (value < 10) value = 10;
    if (value > 30) value = 30;
    this.setData({ longBreak: value });
    this.saveSettings({ longBreak: value });
  },

  // 震动提醒变化
  onVibrationChange(e) {
    const value = e.detail.value;
    this.setData({ vibration: value });
    this.saveSettings({ vibration: value });
  },

  // 声音提醒变化
  onSoundChange(e) {
    const value = e.detail.value;
    this.setData({ sound: value });
    this.saveSettings({ sound: value });
  },

  // 自动开始休息变化
  onAutoStartBreakChange(e) {
    const value = e.detail.value;
    this.setData({ autoStartBreak: value });
    this.saveSettings({ autoStartBreak: value });
  },

  // 保存设置
  saveSettings(newSettings) {
    app.updateSettings(newSettings);
  },

  // 导出数据
  onExportData() {
    const data = storage.exportData();
    
    wx.setStorageSync('exportData', data);
    
    wx.showModal({
      title: '导出成功',
      content: '数据已导出，是否查看？',
      confirmText: '查看',
      success: (res) => {
        if (res.confirm) {
          // 可以复制到剪贴板或展示
          wx.setClipboardData({
            data: data,
            success: () => {
              wx.showToast({
                title: '已复制到剪贴板',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  // 清空记录
  onClearRecords() {
    wx.showModal({
      title: '清空记录',
      content: '确定要清空所有专注记录吗？此操作不可恢复。',
      confirmText: '清空',
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          storage.clearAllRecords();
          notification.showToast('记录已清空');
        }
      }
    });
  }
});