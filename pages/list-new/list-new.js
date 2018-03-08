// pages/list-new/list-new.js
const { $wuxLoading } = require('../../vendor/wux/wux');
const api = require('../../libs/api');
const utils = require('../../libs/utils');
const ListModel = require('../../models/ListModel').ListModel;

const app = getApp();

Page({
  data: {
    list: {},
    has_today_list: false,
    ui: {
      submitting: false
    }    
  },

  onLoad: function (options) {
    app.login({});
  },

  onShow: function() {
    this.set_has_today_list();

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

    // 判断是否今天创建过
    if(this.data.has_today_list){
      that.resetData(), 
      wx.showModal({
        title: '提示',
        content: '今天已经创建了清单',
        icon: 'success',
        duration: 2000
      })
      return
    };

    if (that.isFormSubmitting()) { return; };
    that.updateUiBeforeFormSubmit();

    var should_dos = [];
    should_dos.push(e.detail.value.should_do_first);
    should_dos.push(e.detail.value.should_do_second);
    should_dos.push(e.detail.value.should_do_third);

    for (var i = 0; i < should_dos.length; i++) {
      this.data.list.setShouldDo({
        content: should_dos[i],
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
        that.resetData();
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
        that.updateUiAfterFormSubmit();
      }
    });
  },

  resetData() {
    this.setData({
      list: {}
    });
    wx.stopPullDownRefresh();
  },

  set_has_today_list(){
    var that = this;
    api.get({
      path: '/today_list',
      success: (res) => {
        if(res.data.today_list){
          that.setData({
            'has_today_list': true
          })
        }
      }
    })
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
