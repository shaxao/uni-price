"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "AdminNavBar",
  props: {
    currentPath: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      navItems: [
        { name: "首页", path: "/pages/admin/index/index", icon: "/static/images/home.png" },
        { name: "产品管理", path: "/pages/admin/product/list", icon: "/static/images/product-icon.png" },
        { name: "报价管理", path: "/pages/admin/quote/list", icon: "/static/images/price.png" },
        { name: "用户管理", path: "/pages/admin/user/list", icon: "/static/images/user-icon.png" },
        { name: "订单管理", path: "/pages/admin/tasks/list", icon: "/static/images/order-icon.png" },
        { name: "消息中心", path: "/pages/admin/message/list", icon: "/static/images/message-icon.png" },
        { name: "系统设置", path: "/pages/admin/profile/settings", icon: "/static/images/settings-icon.png" }
      ]
    };
  },
  methods: {
    navigate(item) {
      if (item.path === this.currentPath)
        return;
      common_vendor.index.navigateTo({
        url: item.path,
        fail: () => {
          common_vendor.index.switchTab({
            url: item.path,
            fail: (err) => {
              common_vendor.index.__f__("error", "at components/AdminNavBar.vue:51", "导航失败:", err);
              common_vendor.index.showToast({
                title: "页面跳转失败",
                icon: "none"
              });
            }
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.navItems, (item, index, i0) => {
      return common_vendor.e({
        a: item.icon
      }, item.icon ? {
        b: item.icon
      } : {}, {
        c: common_vendor.t(item.name),
        d: index,
        e: $props.currentPath === item.path ? 1 : "",
        f: common_vendor.o(($event) => $options.navigate(item), index)
      });
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c25495e8"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/AdminNavBar.js.map
