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
    today_list: {},
    activeTabIndex: 0,
    tabs: ['今日', '历史'],    
  },

  onLoad: function (options) {
    var that = this;
    this.FetchDataFromRemoteServer();
  },

  onShow: function () {
    this.FetchDataFromRemoteServer();
  },

  FetchDataFromRemoteServer: function(){
    if (this.data.activeTabIndex == 0) {
      this.loadTodayList();
    } else if (this.data.activeTabIndex == 1) {
      this.loadHistoryList();
    }
  },

  loadHistoryList: function(){
    var that = this;
    api.get({
      path: '/lists',
      success: (res) => {
        that.setData({
          'lists': res.data.lists
        })
      },
      complete: () => {
        wx.stopPullDownRefresh();
      }
    });
  },

  loadTodayList: function(){
    var that = this;
    api.get({
      path: '/today_list',
      success: (res) => {
        that.setData({
          'today_list': res.data
        })
      },
      complete: () => {
        wx.stopPullDownRefresh();
      }
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
  
  },

  tabClick: function(e) {
    if (this.data.activeTabIndex == e.currentTarget.id) { return; }

    this.setData({
      'activeTabIndex': e.currentTarget.id
    });

    if (e.currentTarget.id == 0 ) {
      this.loadTodayList();
    } else if (e.currentTarget.id == 1) {
      this.loadHistoryList();
    }    
  },

  changeStatus: function(e) {
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