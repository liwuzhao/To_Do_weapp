// pages/list-new/list-new.js

const api = require('../../libs/api');
const utils = require('../../libs/utils');
const ListModel = require('../../models/ListModel').ListModel;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    list_date: ""
  },


  onLoad: function (options) {
    app.login({});
    let now = new Date;
    now.setHours(12);
    now.setMinutes(0);
    now.setSeconds(0);

    let list_date = utils.formatDate(now);

    var list = new ListModel({ list_date: list_date });
    
    this.setData({
      list: list,
      list_date: list_date
    });

  },




  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})