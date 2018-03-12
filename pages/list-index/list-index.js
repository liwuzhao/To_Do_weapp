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
    page: 1,
    today_list: {},
    activeTabIndex: 0,
    tabs: ['今日', '历史'],
    ui: {
      refreshing: false,
      loadingMore: false,
      nodata: false,
      nomore: false
    }
  },

  onLoad: function (options) {
    var that = this;
    that.FetchDataFromRemoteServer();
  },

  onShow: function () {
    var that = this;
    that.FetchDataFromRemoteServer();
  },

  FetchDataFromRemoteServer(){
    if (this.data.activeTabIndex == 0) {
      this.loadTodayList();
    } else if (this.data.activeTabIndex == 1) {
      this.loadHistoryList();
    }
  },

  FetchMoreDataFromRemoteServer(){
    var that = this;
    var page = that.data.page;
    page += 1;
    api.get({
      path: '/lists?page=' + page,
      success: (res) => {
        let new_lists = res.data.lists;
        let lists = that.data.lists;
        lists = lists.concat(new_lists);
        that.setData({
          'lists': lists,
          'page': page,
          'ui.nodata': lists.length === 0,
          'ui.nomore': lists.length !== 0 && new_lists.length === 0
        })
      },
      complete: () => {
        that.setData({
          'ui.refreshing': false,
          'ui.loadingMore': false
        }),
        wx.stopPullDownRefresh();
      }
    });
  },

  loadHistoryList() {
    var that = this;
    api.get({
      path: '/lists',
      success: (res) => {
        that.setData({
          'lists': res.data.lists,
          'ui.nodata': res.data.lists.length === 0
        })
      },
      complete: () => {
        that.setData({
          'ui.refreshing': false,
          'ui.loadingMore': false
        }),
        wx.stopPullDownRefresh();
      }
    });
  },

  loadTodayList(){
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

  onPullDownRefresh() {
    this.refresh();
  },

  onReachBottom() {
    if (this.data.ui.nomore) { return; }
    this.FetchMoreDataFromRemoteServer();
  },

  isFetching() {
    return this.data.ui.refreshing || this.data.ui.loadingMore;
  },

  refresh() {
    if (this.isFetching()) { return; }
    this.setData({
      'page': 1,
      'ui.refreshing': true,
      'ui.nodata': false,
      'ui.nomore': false
    })
    this.FetchDataFromRemoteServer()
  },


  tabClick(e) {
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

  changeStatus(e){
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
  },



})