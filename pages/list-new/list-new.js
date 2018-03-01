// pages/list-new/list-new.js

const api = require('../../libs/api');
const utils = require('../../libs/utils');
const ListModel = require('../../models/ListModel').ListModel;

const app = getApp();

Page({
  data: {
    list: {}
  },

  onLoad: function (options) {
    app.login({});
  },

  onShow: function() {
    let now = new Date;
    now.setHours(12);
    now.setMinutes(0);
    now.setSeconds(0);

    let list_date = utils.formatDate(now);

    var list = new ListModel({ list_date: list_date });

    this.setData({
      list: list,
    });
  },

  onFormSubmit(e) {
    var that = this;

    var should_do_first = e.detail.value.should_do_first;
    var should_do_second = e.detail.value.should_do_second;
    var should_do_third = e.detail.value.should_do_third;


    this.data.list.setShouldDo({
      content: should_do_first,
      status: "未完成"
    });

    this.data.list.setShouldDo({
      content: should_do_second,
      status: "未完成"
    });

    this.data.list.setShouldDo({
      content: should_do_third,
      status: "未完成"
    });   
    let list = that.data.list.toJS();

    this.setData({
      list: list,
    });

    api.post({
      path: '/lists',
      data: {
        list: list
      },
      success: () => {
        that.resetData();
        wx.switchTab({
          url: '/pages/list-index/list-index'
        });
        wx.showToast({
          title: '成功记录',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  resetData() {
    this.setData({
      list: {}
    });
    wx.stopPullDownRefresh();
  }

})
