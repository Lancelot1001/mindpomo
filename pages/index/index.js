// pages/index/index.js
const app = getApp();
const storage = require('../../utils/storage.js');
const timeUtil = require('../../utils/time.js');
const notification = require('../../utils/notification.js');

Page({
  data: {
    // 计时器状态
    timerStatus: 'idle', // idle, running, paused
    displayTime: '25:00',
    progress: 100,
    
    // 标签相关
    showTagPicker: false,
    selectedTag: '其他',
    allTags: [],
    
    // 今日统计
    todayStats: {
      count: 0,
      duration: '0分钟'
    },
    
    // 内部状态
    totalSeconds: 0,
    remainingSeconds: 0,
    timerInterval: null,
    startTime: null,
    elapsedSeconds: 0  // 已过去的秒数（用于暂停恢复）
  },

  onLoad() {
    this.initTags();
    this.loadTodayStats();
  },

  onShow() {
    this.loadTodayStats();
    this.refreshSettings();
    // 如果正在计时，重新启动interval
    if (this.data.timerStatus === 'running') {
      this.startInterval();
    }
  },

  onHide() {
    // 页面隐藏时清除计时器，避免后台运行导致timeout
    this.clearTimer();
  },

  onUnload() {
    this.clearTimer();
  },

  // 初始化标签
  initTags() {
    this.setData({
      allTags: app.getAllTags()
    });
  },

  // 加载今日统计
  loadTodayStats() {
    const today = timeUtil.getToday();
    const summary = storage.getSummaryByDate(today);
    const count = summary.sessionCount || 0;
    const duration = timeUtil.formatDuration(summary.totalFocus || 0);
    
    this.setData({
      todayStats: {
        count,
        duration
      }
    });
  },

  // 刷新设置
  refreshSettings() {
    const settings = app.getSettings();
    if (this.data.timerStatus === 'idle') {
      const totalSeconds = settings.focusDuration * 60;
      this.setData({
        totalSeconds,
        remainingSeconds: totalSeconds,
        displayTime: timeUtil.formatTime(totalSeconds),
        progress: 100
      });
    }
  },

  // 开始计时
  startTimer() {
    if (this.data.timerStatus === 'idle') {
      // 显示标签选择
      this.setData({ showTagPicker: true });
      return;
    }
    
    if (this.data.timerStatus === 'paused') {
      // 继续计时
      this.resumeTimer();
    }
  },

  // 选择标签后开始
  onTagSelect(e) {
    const tag = e.detail.tag;
    this.setData({
      selectedTag: tag,
      showTagPicker: false
    });
    this.beginTimer();
  },

  // 关闭标签选择
  onTagPickerClose() {
    this.setData({ showTagPicker: false });
  },

  // 开始计时
  beginTimer() {
    const settings = app.getSettings();
    const totalSeconds = settings.focusDuration * 60;
    
    this.setData({
      timerStatus: 'running',
      totalSeconds,
      remainingSeconds: totalSeconds,
      displayTime: timeUtil.formatTime(totalSeconds),
      startTime: Date.now(),
      elapsedSeconds: 0,
      progress: 100
    });
    
    // 播放开始提示音
    notification.playSound();
    
    this.startInterval();
  },

  // 启动定时器
  startInterval() {
    this.clearTimer();
    
    this.data.timerInterval = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - this.data.startTime) / 1000);
      const newElapsed = this.data.elapsedSeconds + currentElapsed;
      const remaining = this.data.totalSeconds - newElapsed;
      
      if (remaining <= 0) {
        this.onTimerComplete();
      } else {
        const progress = Math.round((remaining / this.data.totalSeconds) * 100);
        this.setData({
          remainingSeconds: remaining,
          displayTime: timeUtil.formatTime(remaining),
          progress: progress
        });
      }
    }, 1000);
  },

  // 清除定时器
  clearTimer() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.data.timerInterval = null;
    }
  },

  // 暂停计时
  pauseTimer() {
    // 计算当前这一段已经过去的时间
    const currentElapsed = Math.floor((Date.now() - this.data.startTime) / 1000);
    this.data.elapsedSeconds += currentElapsed;
    
    this.clearTimer();
    this.setData({
      timerStatus: 'paused'
    });
  },

  // 继续计时
  resumeTimer() {
    this.setData({
      timerStatus: 'running',
      startTime: Date.now()
    });
    
    // 播放提示音
    notification.playSound();
    
    this.startInterval();
  },

  // 重置计时
  quitTimer() {
    this.clearTimer();
    
    const elapsedMinutes = Math.floor((this.data.totalSeconds - this.data.remainingSeconds) / 60);
    
    if (elapsedMinutes > 0) {
      // 询问是否保存
      notification.showConfirm('重置本次专注？', `已专注${elapsedMinutes}分钟`).then(confirm => {
        if (confirm) {
          this.saveRecord(elapsedMinutes);
        }
        this.resetTimer();
      });
    } else {
      this.resetTimer();
    }
  },

  // 重置计时器
  resetTimer() {
    this.setData({
      timerStatus: 'idle',
      progress: 100
    });
    this.refreshSettings();
    this.loadTodayStats();
  },

  // 计时完成
  onTimerComplete() {
    this.clearTimer();
    
    // 播放提醒
    notification.notifyComplete();
    
    // 保存记录
    const settings = app.getSettings();
    this.saveRecord(settings.focusDuration);
    
    // 更新周期计数
    app.globalData.pomodoroCount++;
    
    // 检查是否需要长休息
    if (app.globalData.pomodoroCount >= 4) {
      app.globalData.pomodoroCount = 0;
      this.showLongBreak(settings);
    } else {
      // 自动开始短休息（如果设置开启）
      if (settings.autoStartBreak) {
        this.startBreak(settings.shortBreak);
      } else {
        this.showShortBreak(settings);
      }
    }
  },

  // 显示短休息
  showShortBreak(settings) {
    notification.notifyBreak();
    this.setData({ timerStatus: 'idle', progress: 100 });
    this.refreshSettings();
    this.loadTodayStats();
  },

  // 显示长休息
  showLongBreak(settings) {
    wx.showModal({
      title: '🎉 完成4个周期！',
      content: `是时候休息一下了，需要开始${settings.longBreak}分钟的长休息吗？`,
      confirmText: '开始休息',
      cancelText: '稍后',
      success: (res) => {
        if (res.confirm) {
          this.startBreak(settings.longBreak);
        } else {
          this.resetTimer();
        }
      }
    });
  },

  // 开始休息
  startBreak(duration) {
    const totalSeconds = duration * 60;
    this.setData({
      timerStatus: 'break',
      totalSeconds,
      remainingSeconds: totalSeconds,
      displayTime: timeUtil.formatTime(totalSeconds),
      startTime: Date.now(),
      elapsedSeconds: 0,
      progress: 100,
      selectedTag: '休息'
    });
    
    // 播放提示音
    notification.playSound();
    
    this.startBreakInterval();
  },

  // 休息定时器
  startBreakInterval() {
    this.clearTimer();
    
    this.data.timerInterval = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - this.data.startTime) / 1000);
      const newElapsed = this.data.elapsedSeconds + currentElapsed;
      const remaining = this.data.totalSeconds - newElapsed;
      
      if (remaining <= 0) {
        this.onBreakComplete();
      } else {
        const progress = Math.round((remaining / this.data.totalSeconds) * 100);
        this.setData({
          remainingSeconds: remaining,
          displayTime: timeUtil.formatTime(remaining),
          progress: progress
        });
      }
    }, 1000);
  },

  // 休息完成
  onBreakComplete() {
    this.clearTimer();
    this.setData({ timerStatus: 'idle', progress: 100 });
    this.refreshSettings();
  },

  // 提前结束休息
  endBreak() {
    this.clearTimer();
    this.setData({ timerStatus: 'idle', progress: 100 });
    this.refreshSettings();
    this.loadTodayStats();
  },

  // 保存专注记录
  saveRecord(duration) {
    const now = new Date();
    const record = {
      id: this.generateId(),
      date: timeUtil.getToday(),
      startTime: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      endTime: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      duration: duration,
      tag: this.data.selectedTag,
      completed: true
    };
    
    storage.saveRecord(record);
  },

  // 生成唯一ID
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // 跳转设置页
  goToSettings() {
    wx.switchTab({
      url: '/pages/settings/settings'
    });
  },

  // 跳转统计页
  goToStats() {
    wx.switchTab({
      url: '/pages/stats/stats'
    });
  }
});