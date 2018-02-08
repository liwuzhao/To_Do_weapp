const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },

  onLoad(options) {
    var that = this;
    app.login({
      success: function (res) {
        that.setData({
          'userInfo.nickName': res.profile.nick_name,
          'userInfo.avatarUrl': res.profile.avatar_url
        })
      }
    });
  }
})
