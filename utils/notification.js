// utils/notification.js - 通知管理

let audioContext = null;

/**
 * 播放提示音
 */
function playSound() {
  const settings = wx.getStorageSync('settings');
  if (settings && settings.sound) {
    if (!audioContext) {
      audioContext = wx.createInnerAudioContext();
    }
    audioContext.src = '/audio/bell.m4a';
    audioContext.stop();
    audioContext.play();
  }
}

/**
 * 震动提醒
 */
function vibrate() {
  const settings = wx.getStorageSync('settings');
  if (settings && settings.vibration) {
    wx.vibrateShort({ type: 'heavy' });
  }
}

/**
 * 完成提醒
 */
function notifyComplete() {
  vibrate();
  playSound();
  // 去掉toast提醒
}

/**
 * 休息提醒
 */
function notifyBreak() {
  wx.showToast({
    title: '休息一下 ☕',
    icon: 'none',
    duration: 2000
  });
}

/**
 * 显示确认对话框
 * @param {string} title - 标题
 * @param {string} content - 内容
 */
function showConfirm(title, content) {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        resolve(res.confirm);
      }
    });
  });
}

/**
 * 显示加载中
 * @param {string} title - 提示文字
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

/**
 * 隐藏加载中
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示提示
 * @param {string} message - 提示内容
 * @param {string} icon - 图标类型
 */
function showToast(message, icon = 'none') {
  wx.showToast({
    title: message,
    icon,
    duration: 2000
  });
}

module.exports = {
  playSound,
  vibrate,
  notifyComplete,
  notifyBreak,
  showConfirm,
  showLoading,
  hideLoading,
  showToast
};