"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "Register",
  data() {
    return {
      username: "",
      authCode: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      agreed: false,
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
    toggleAgreement() {
      this.agreed = !this.agreed;
    },
    handlePrivacy() {
      common_vendor.index.navigateTo({
        url: "/pages/privacy/index"
      });
    },
    handleSubmit() {
      if (this.loading || !this.agreed)
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
      if (!this.password || this.password.length < 6) {
        return common_vendor.index.showToast({
          title: "密码长度至少6位",
          icon: "none"
        });
      }
      if (this.password !== this.confirmPassword) {
        return common_vendor.index.showToast({
          title: "两次密码输入不一致",
          icon: "none"
        });
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        common_vendor.index.showToast({
          title: "注册成功",
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
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.username,
    c: common_vendor.o(($event) => $data.username = $event.detail.value),
    d: $data.authCode,
    e: common_vendor.o(($event) => $data.authCode = $event.detail.value),
    f: $data.showPassword ? "text" : "password",
    g: $data.password,
    h: common_vendor.o(($event) => $data.password = $event.detail.value),
    i: $data.showPassword
  }, $data.showPassword ? {} : {}, {
    j: common_vendor.o((...args) => $options.togglePassword && $options.togglePassword(...args)),
    k: $data.showPassword ? "text" : "password",
    l: $data.confirmPassword,
    m: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    n: $data.showPassword
  }, $data.showPassword ? {} : {}, {
    o: common_vendor.o((...args) => $options.togglePassword && $options.togglePassword(...args)),
    p: $data.agreed ? 1 : "",
    q: common_vendor.o((...args) => $options.toggleAgreement && $options.toggleAgreement(...args)),
    r: common_vendor.o((...args) => $options.handlePrivacy && $options.handlePrivacy(...args)),
    s: !$data.agreed,
    t: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-46a64346"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/index.js.map
