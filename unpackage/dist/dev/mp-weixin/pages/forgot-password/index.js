"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "ForgotPassword",
  data() {
    return {
      username: "",
      authCode: "",
      newPassword: "",
      showPassword: false,
      loading: false
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    handleSubmit() {
      if (this.loading)
        return;
      if (!this.username.trim()) {
        return common_vendor.index.showToast({
          title: "请输入账号",
          icon: "none"
        });
      }
      if (!this.authCode || this.authCode.length !== 6) {
        return common_vendor.index.showToast({
          title: "请输入6位口令码",
          icon: "none"
        });
      }
      if (!this.newPassword || this.newPassword.length < 6) {
        return common_vendor.index.showToast({
          title: "密码长度至少6位",
          icon: "none"
        });
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        common_vendor.index.showToast({
          title: "密码重置成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.username,
    c: common_vendor.o(($event) => $data.username = $event.detail.value),
    d: $data.authCode,
    e: common_vendor.o(($event) => $data.authCode = $event.detail.value),
    f: $data.showPassword ? "text" : "password",
    g: $data.newPassword,
    h: common_vendor.o(($event) => $data.newPassword = $event.detail.value),
    i: common_vendor.t($data.showPassword ? "👁️" : "👁️‍🗨️"),
    j: common_vendor.o((...args) => $options.togglePassword && $options.togglePassword(...args)),
    k: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c1f29b51"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/forgot-password/index.js.map
