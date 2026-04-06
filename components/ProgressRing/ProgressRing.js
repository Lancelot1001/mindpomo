// components/ProgressRing/ProgressRing.js
Component({
  properties: {
    progress: {
      type: Number,
      value: 100
    },
    time: {
      type: String,
      value: '25:00'
    },
    status: {
      type: String,
      value: 'idle' // idle, running, paused, break, completed
    },
    size: {
      type: Number,
      value: 480
    }
  },

  data: {
    progressDeg: 360
  },

  observers: {
    'progress': function(progress) {
      this.setData({
        progressDeg: Math.round(progress * 3.6)
      });
    }
  }
});