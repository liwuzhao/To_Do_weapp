// pages/list-index/list-index.js
const api = require('../../libs/api');
const utils = require('../../libs/utils');
const ListModel = require('../../models/ListModel').ListModel;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: {},
    test: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.FetchDataFromRemoteServer();
  },

  FetchDataFromRemoteServer: function(){
    var that = this;
    api.get({
      path: '/lists',
      success: (res) => {
        that.setData({
          'lists': res.data.lists
        })
      },
      complete: () =>{
        wx.stopPullDownRefresh();
      }
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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