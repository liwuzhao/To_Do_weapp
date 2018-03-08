const { observer } = require('../../vendor/observer');
const api = require('../../libs/api');
const mineStore = require('../../stores/mineStore');

const app = getApp();

Page(observer({
  props: {
    mineStore
  },

  onShow() {
    app.login({
      success: () => {
        this.refresh();
      }
    });
  },

  onPullDownRefresh() {
    this.refresh();
  },

  refresh() {
    api.get({
      path: '/mine/me',
      success: (res) => {
        mineStore.setMe(res.data.user);
      },
      complete: () => {
        wx.stopPullDownRefresh();
      }
    });
  }
  
}));
