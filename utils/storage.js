// utils/storage.js - 本地存储工具

/**
 * 获取专注记录
 */
function getRecords() {
  return wx.getStorageSync('focusRecords') || [];
}

/**
 * 保存专注记录
 * @param {Object} record - 专注记录
 */
function saveRecord(record) {
  const records = getRecords();
  records.push(record);
  wx.setStorageSync('focusRecords', records);
  updateDailySummary(record.date, record.duration, record.tag);
}

/**
 * 获取指定日期的专注记录
 * @param {string} date - 日期字符串 YYYY-MM-DD
 */
function getRecordsByDate(date) {
  const records = getRecords();
  return records.filter(r => r.date === date);
}

/**
 * 获取每日汇总
 */
function getDailySummary() {
  return wx.getStorageSync('dailySummary') || {};
}

/**
 * 更新每日汇总
 * @param {string} date - 日期字符串
 * @param {number} duration - 专注时长（分钟）
 * @param {string} tag - 标签
 */
function updateDailySummary(date, duration, tag) {
  const summary = getDailySummary();
  if (!summary[date]) {
    summary[date] = { totalFocus: 0, sessionCount: 0, tags: {} };
  }
  summary[date].totalFocus += duration;
  summary[date].sessionCount += 1;
  summary[date].tags[tag] = (summary[date].tags[tag] || 0) + duration;
  wx.setStorageSync('dailySummary', summary);
}

/**
 * 获取指定日期的汇总
 * @param {string} date - 日期字符串
 */
function getSummaryByDate(date) {
  const summary = getDailySummary();
  return summary[date] || { totalFocus: 0, sessionCount: 0, tags: {} };
}

/**
 * 获取本周汇总
 */
function getWeekSummary() {
  const summary = getDailySummary();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  
  let totalMinutes = 0;
  let sessionCount = 0;
  let daysWithFocus = 0;
  const tags = {};

  for (let i = 0; i < 7; i++) {
    const date = formatDate(new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000));
    if (summary[date]) {
      totalMinutes += summary[date].totalFocus;
      sessionCount += summary[date].sessionCount;
      daysWithFocus++;
      for (const tag in summary[date].tags) {
        tags[tag] = (tags[tag] || 0) + summary[date].tags[tag];
      }
    }
  }

  return {
    totalMinutes,
    sessionCount,
    daysWithFocus,
    tags,
    goalMinutes: 10 * 60 // 默认目标10小时
  };
}

/**
 * 获取本月汇总
 */
function getMonthSummary() {
  const summary = getDailySummary();
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  let totalMinutes = 0;
  let sessionCount = 0;
  let daysWithFocus = 0;

  while (monthStart <= today) {
    const date = formatDate(monthStart);
    if (summary[date]) {
      totalMinutes += summary[date].totalFocus;
      sessionCount += summary[date].sessionCount;
      if (summary[date].totalFocus > 0) {
        daysWithFocus++;
      }
    }
    monthStart.setDate(monthStart.getDate() + 1);
  }

  return {
    totalMinutes,
    sessionCount,
    daysWithFocus,
    avgMinutes: daysWithFocus > 0 ? Math.round(totalMinutes / daysWithFocus) : 0
  };
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 清空所有记录
 */
function clearAllRecords() {
  wx.removeStorageSync('focusRecords');
  wx.removeStorageSync('dailySummary');
}

/**
 * 导出数据为JSON
 */
function exportData() {
  const data = {
    records: getRecords(),
    summary: getDailySummary(),
    exportTime: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
}

module.exports = {
  getRecords,
  saveRecord,
  getRecordsByDate,
  getDailySummary,
  getSummaryByDate,
  getWeekSummary,
  getMonthSummary,
  formatDate,
  clearAllRecords,
  exportData
};