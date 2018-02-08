const auth = require('./libs/auth');

App({
  login(options) {
    auth.login(options);
  }
});
