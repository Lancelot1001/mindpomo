// utils/time.js - 时间工具函数

/**
 * 格式化时间为 mm:ss
 * @param {number} seconds - 秒数
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * 格式化时长为可读字符串
 * @param {number} minutes - 分钟数
 */
function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}小时`;
  }
  return `${hours}h${mins}m`;
}

/**
 * 格式化时长为简短格式
 * @param {number} minutes - 分钟数
 */
function formatDurationShort(minutes) {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h${mins}m`;
}

/**
 * 获取今天的日期字符串
 */
function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取本周开始日期
 */
function getWeekStart() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(today.setDate(diff));
}

/**
 * 获取本周日期数组
 */
function getWeekDates() {
  const weekStart = getWeekStart();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

/**
 * 获取星期几
 * @param {number} dayIndex - 0-6
 */
function getWeekDayName(dayIndex) {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return days[dayIndex];
}

/**
 * 获取月份名称
 * @param {number} monthIndex - 0-11
 */
function getMonthName(monthIndex) {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return months[monthIndex];
}

module.exports = {
  formatTime,
  formatDuration,
  formatDurationShort,
  getToday,
  getWeekStart,
  getWeekDates,
  getWeekDayName,
  getMonthName
};