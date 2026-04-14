# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**番茄心流** (MindPomo) - 微信小程序版番茄工作法计时器。

### 核心功能
- 标准番茄工作法：25分钟专注 + 5分钟短休息，每4个周期后长休息
- 标签分类：为每次专注会话添加标签（如学习、工作、阅读）
- 统计数据：记录每日专注次数和时长，查看历史数据
- 灵活设置：自定义专注/休息时长，通知方式
- 多渠道通知：振动、声音提醒、完成自动通知

## 开发命令

### 微信开发者工具
```bash
# 使用微信开发者工具打开项目目录即可预览
# 项目根目录: C:\Users\17641\Desktop\Work\Project\mindpomo
```

### 运行测试
小程序无单独测试命令，在微信开发者工具中预览真机效果。

## 项目架构

```
mindpomo/
├── app.js/app.json/app.wxss     # 小程序入口和全局配置
├── pages/
│   ├── index/             # 专注主页（首页）
│   ├── stats/           # 统计数据页
│   └── settings/        # 设置页
├── components/
│   ├── ProgressRing/     # 环形进度条组件
│   ├── TagPicker/      # 标签选择器组件
│   └── CalendarView/    # 日历视图组件
├── utils/
│   ├── storage.js       # 数据持久化（wx.setStorage）
│   ├── time.js       # 时间工具
│   └── notification.js # 通知（wx.notifyTablet/vibrateShort）
└── audio/               # 提示音资源
```

## 技术规范

- **框架**: 原生微信小程序（无框架依赖）
- **状态管理**: 每个页面 Page 独立状态，通过 utils/storage.js 持久化
- **样式**: WXSS，使用 rpx 单位适配不同屏幕
- **数据存储**: wx.setStorage_sync 本地存储
- **AppID**: wxd664749b69a427f4（测试号）