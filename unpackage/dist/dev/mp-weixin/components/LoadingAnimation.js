"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "LoadingAnimation",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: "加载中..."
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.loading
  }, $props.loading ? common_vendor.e({
    b: $props.text
  }, $props.text ? {
    c: common_vendor.t($props.text)
  } : {}) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-74bad3a5"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/LoadingAnimation.js.map
