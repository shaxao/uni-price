"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "BaseButton",
  props: {
    type: {
      type: String,
      default: "default",
      validator: (value) => ["primary", "success", "warning", "danger", "info", "default"].includes(value)
    },
    size: {
      type: String,
      default: "normal",
      validator: (value) => ["large", "normal", "small", "mini"].includes(value)
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(e) {
      if (this.disabled || this.loading)
        return;
      this.$emit("click", e);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.loading
  }, $props.loading ? {} : {}, {
    b: common_vendor.n($props.type),
    c: common_vendor.n($props.size),
    d: common_vendor.n({
      "is-plain": $props.plain,
      "is-disabled": $props.disabled,
      "is-loading": $props.loading,
      "is-round": $props.round,
      "is-block": $props.block
    }),
    e: $props.disabled,
    f: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f82883ed"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/BaseButton.js.map
