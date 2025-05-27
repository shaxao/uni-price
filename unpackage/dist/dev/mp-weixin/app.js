"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/admin/product/list.js";
  "./pages/admin/product/edit.js";
  "./pages/admin/product/detail.js";
  "./pages/admin/quote/list.js";
  "./pages/admin/quote/detail.js";
  "./pages/login/index.js";
  "./pages/index/index.js";
  "./pages/forgot-password/index.js";
  "./pages/register/index.js";
  "./pages/privacy/index.js";
  "./pages/product/create.js";
  "./pages/product/detail.js";
  "./pages/quote/create.js";
  "./pages/quote/detail.js";
  "./pages/quote/edit.js";
  "./pages/quote/my.js";
  "./pages/cart/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.store);
  return {
    app,
    store: store_index.store
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
