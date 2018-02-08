const auth = require('./utils/auth');

App({
  login(options) {
    auth.login(options);
  }
});