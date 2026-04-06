// components/TagPicker/TagPicker.js
const app = getApp();

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    tags: {
      type: Array,
      value: []
    }
  },

  data: {
    selectedTag: '其他',
    customTags: []
  },

  observers: {
    'show': function(show) {
      if (show) {
        this.setData({
          customTags: wx.getStorageSync('customTags') || []
        });
      }
    }
  },

  methods: {
    // 选择标签
    onSelectTag(e) {
      const tag = e.currentTarget.dataset.tag;
      this.setData({
        selectedTag: tag
      });
    },

    // 关闭弹窗
    onClose() {
      this.triggerEvent('close');
    },

    // 点击内容区域（阻止冒泡）
    onContentTap() {},

    // 添加自定义标签
    onAddTag() {
      wx.showModal({
        title: '添加自定义标签',
        placeholderText: '请输入标签名称',
        editable: true,
        success: (res) => {
          if (res.confirm && res.content && res.content.trim()) {
            const newTag = res.content.trim();
            const customTags = wx.getStorageSync('customTags') || [];
            
            if (!customTags.includes(newTag)) {
              customTags.push(newTag);
              wx.setStorageSync('customTags', customTags);
              
              this.setData({
                customTags: customTags,
                tags: app.getAllTags()
              });
            }
            
            this.setData({
              selectedTag: newTag
            });
          }
        }
      });
    },

    // 开始专注
    onStartFocus() {
      this.triggerEvent('select', {
        tag: this.data.selectedTag
      });
    }
  }
});