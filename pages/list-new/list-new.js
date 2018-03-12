// pages/list-new/list-new.js
const { $wuxLoading } = require('../../vendor/wux/wux');
const api = require('../../libs/api');
const utils = require('../../libs/utils');
const ListModel = require('../../models/ListModel').ListModel;

const app = getApp();

Page({
  data: {
    list: {},
    ui: {
      submitting: false
    }    
  },

  onLoad: function (options) {
    app.login({});
  },

  onShow: function() {
    let now = new Date();
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

    if (that.isFormSubmitting()) { return; };
    that.updateUiBeforeFormSubmit();

    var should_dos = [];
    should_dos.push(e.detail.value.should_do_first);
    should_dos.push(e.detail.value.should_do_second);
    should_dos.push(e.detail.value.should_do_third);

    var categories = ['必做', '应做', '可做'];
    for (var i = 0; i < should_dos.length; i++) {
      that.data.list.setShouldDo({
        content: should_dos[i],
        category: categories[i],
        status: "未完成"
      });
    }

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
        this.setData({
          has_today_list: true,
        });
        wx.switchTab({
          url: '/pages/list-index/list-index'
        });
        wx.showToast({
          title: '成功记录',
          icon: 'success',
          duration: 2000
        });
      },
      complete: () => {
        that.resetData();
        that.updateUiAfterFormSubmit();
      }
    });
  },

  resetData() {
    this.setData({
      list: {},
      ui: {
        submitting: false
      }    
    });
    wx.stopPullDownRefresh();
  },

  updateUiBeforeFormSubmit() {
    this.setData({ 'ui.submitting': true });
    $wuxLoading.show({ text: '发布中' });
  },

  updateUiAfterFormSubmit() {
    $wuxLoading.hide();
    this.setData({ 'ui.submitting': false });
  },

  isFormSubmitting() {
    return this.data.ui.submitting;
  },

})
