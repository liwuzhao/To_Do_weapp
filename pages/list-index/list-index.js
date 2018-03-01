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
    lists: [],
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
    this.FetchDataFromRemoteServer();
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
  
  },

  
  changeStatus(e) {
    var that = this;

    let lists = that.data.lists;
    let shouldDoId = e.currentTarget.dataset.shouldDoId;

    // Find_list_index
    var temp = 0;
    let listIndex = lists.findIndex(function (e){
      e.should_dos.findIndex(function (e){
        if(e.id == shouldDoId)
        {
            temp = 1;
            return ;
        }    
      })
      if(temp == 1)
       return e;
    })

    // Find_list_id
    let listId = lists[listIndex];


    api.put({
      path: '/lists/' + listId + '/should_dos/' + shouldDoId,
      success: (res) => {
        this.FetchDataFromRemoteServer();
      }
    })



  }
})