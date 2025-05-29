"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "Login",
  data() {
    return {
      loginType: "admin",
      // 默认管理员登录
      showPassword: false,
      loading: false,
      admin: {
        username: "",
        password: ""
      }
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  methods: {
    ...common_vendor.mapActions("user", ["login"]),
    async checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      }
    },
    setLoginType(type) {
      this.loginType = type;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleAdminLogin() {
      if (this.loading)
        return;
      if (!this.admin.username || !this.admin.username.trim()) {
        return common_vendor.index.showToast({
          title: "请输入账号",
          icon: "none"
        });
      }
      if (!this.admin.password) {
        return common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
      }
      this.loading = true;
      try {
        await this.login({
          type: "admin",
          username: this.admin.username,
          password: this.admin.password
        });
        common_vendor.index.reLaunch({
          url: "/pages/admin/product/list"
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "登录失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    async handleSupplierLogin() {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const { code } = await common_vendor.index.login();
        await this.login({
          type: "supplier",
          code
        });
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "登录失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    handleForgotPassword() {
      common_vendor.index.navigateTo({
        url: "/pages/forgot-password/index"
      });
    },
    handleRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: common_assets._imports_1$1,
    c: $data.loginType === "admin" ? 1 : "",
    d: common_vendor.o(($event) => $options.setLoginType("admin")),
    e: common_assets._imports_2$1,
    f: $data.loginType === "supplier" ? 1 : "",
    g: common_vendor.o(($event) => $options.setLoginType("supplier")),
    h: $data.loginType === "admin"
  }, $data.loginType === "admin" ? {
    i: $data.admin.username,
    j: common_vendor.o(($event) => $data.admin.username = $event.detail.value),
    k: $data.showPassword ? "text" : "password",
    l: $data.admin.password,
    m: common_vendor.o(($event) => $data.admin.password = $event.detail.value),
    n: common_vendor.t($data.showPassword ? "👁️" : "👁️‍🗨️"),
    o: common_vendor.o((...args) => $options.togglePassword && $options.togglePassword(...args)),
    p: common_vendor.o((...args) => $options.handleAdminLogin && $options.handleAdminLogin(...args))
  } : {}, {
    q: $data.loginType === "supplier"
  }, $data.loginType === "supplier" ? {
    r: common_vendor.o((...args) => $options.handleSupplierLogin && $options.handleSupplierLogin(...args))
  } : {}, {
    s: common_vendor.o((...args) => $options.handleForgotPassword && $options.handleForgotPassword(...args)),
    t: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
