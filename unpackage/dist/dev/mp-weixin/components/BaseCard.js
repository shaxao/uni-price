"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "BaseCard",
  props: {
    rounded: {
      type: Boolean,
      default: true
    },
    shadow: {
      type: Boolean,
      default: true
    },
    noPadding: {
      type: Boolean,
      default: false
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.$slots.header
  }, _ctx.$slots.header ? {} : {}, {
    b: _ctx.$slots.footer
  }, _ctx.$slots.footer ? {} : {}, {
    c: common_vendor.n($props.rounded ? "rounded" : ""),
    d: common_vendor.n($props.shadow ? "shadow" : ""),
    e: common_vendor.n({
      "no-padding": $props.noPadding
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-03acb5fc"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/BaseCard.js.map
