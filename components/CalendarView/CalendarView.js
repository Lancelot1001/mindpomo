// components/CalendarView/CalendarView.js
const timeUtil = require('../../utils/time.js');

Component({
  properties: {
    dates: {
      type: Array,
      value: []
    },
    focusData: {
      type: Object,
      value: {}
    }
  },

  data: {
    weekDays: ['一', '二', '三', '四', '五', '六', '日'],
    today: timeUtil.getToday()
  },

  methods: {
    // 获取日期中的天数
    getDay(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      return parseInt(parts[2], 10);
    },

    // 判断是否为今天
    isToday(dateStr) {
      return dateStr === this.data.today;
    }
  }
});