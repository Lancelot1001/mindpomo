// pages/stats/stats.js
const storage = require('../../utils/storage.js');
const timeUtil = require('../../utils/time.js');

Page({
  data: {
    // 本周数据
    weekData: {
      totalMinutes: 0,
      formattedDuration: '0h',
      formattedGoal: '10h',
      sessionCount: 0
    },
    weekProgress: 0,
    
    // 今日数据
    todayData: {
      count: 0,
      totalMinutes: 0,
      formattedDuration: '0分钟'
    },
    todayProgress: 0,
    
    // 日历数据
    weekDates: [],
    weekFocusData: {},
    
    // 标签分布
    tagDistribution: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  // 加载数据
  loadData() {
    this.loadWeekData();
    this.loadTodayData();
    this.loadCalendarData();
    this.loadTagDistribution();
  },

  // 加载本周数据
  loadWeekData() {
    const weekData = storage.getWeekSummary();
    const totalMinutes = weekData.totalMinutes;
    const goalMinutes = weekData.goalMinutes;
    
    let formattedDuration;
    if (totalMinutes >= 60) {
      formattedDuration = `${Math.floor(totalMinutes / 60)}h`;
    } else {
      formattedDuration = `${totalMinutes}m`;
    }
    
    const progress = Math.min(100, Math.round((totalMinutes / goalMinutes) * 100));
    
    this.setData({
      weekData: {
        totalMinutes,
        formattedDuration,
        formattedGoal: `${goalMinutes / 60}h`,
        sessionCount: weekData.sessionCount
      },
      weekProgress: progress
    });
  },

  // 加载今日数据
  loadTodayData() {
    const today = timeUtil.getToday();
    const summary = storage.getSummaryByDate(today);
    const count = summary.sessionCount || 0;
    const totalMinutes = summary.totalFocus || 0;
    const formattedDuration = timeUtil.formatDuration(totalMinutes);
    
    // 目标1小时30分钟
    const goalMinutes = 90;
    const progress = Math.min(100, Math.round((totalMinutes / goalMinutes) * 100));
    
    this.setData({
      todayData: {
        count,
        totalMinutes,
        formattedDuration
      },
      todayProgress: progress
    });
  },

  // 加载日历数据
  loadCalendarData() {
    const weekDates = timeUtil.getWeekDates();
    const summary = storage.getDailySummary();
    
    const weekFocusData = {};
    weekDates.forEach(date => {
      weekFocusData[date] = summary[date] && summary[date].totalFocus > 0;
    });
    
    this.setData({
      weekDates,
      weekFocusData
    });
  },

  // 加载标签分布
  loadTagDistribution() {
    const weekData = storage.getWeekSummary();
    const tags = weekData.tags;
    
    if (Object.keys(tags).length === 0) {
      this.setData({
        tagDistribution: []
      });
      return;
    }
    
    // 计算总时长
    let total = 0;
    for (const tag in tags) {
      total += tags[tag];
    }
    
    // 转换为百分比
    const distribution = [];
    for (const tag in tags) {
      distribution.push({
        tag,
        minutes: tags[tag],
        percentage: Math.round((tags[tag] / total) * 100)
      });
    }
    
    // 按百分比排序
    distribution.sort((a, b) => b.percentage - a.percentage);
    
    this.setData({
      tagDistribution: distribution
    });
  }
});