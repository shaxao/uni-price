"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "SearchBar",
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "搜索"
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isFocus: false
    };
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
    },
    handleConfirm(e) {
      this.$emit("confirm", e.target.value);
    },
    handleClear() {
      this.$emit("input", "");
      this.$emit("clear");
    },
    handleCancel() {
      this.handleClear();
      this.$emit("cancel");
    },
    handleFocus() {
      this.isFocus = true;
      this.$emit("focus");
    },
    handleBlur() {
      this.isFocus = false;
      this.$emit("blur");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.placeholder,
    b: $props.value,
    c: $props.autoFocus,
    d: common_vendor.o((...args) => $options.handleInput && $options.handleInput(...args)),
    e: common_vendor.o((...args) => $options.handleConfirm && $options.handleConfirm(...args)),
    f: common_vendor.o((...args) => $options.handleFocus && $options.handleFocus(...args)),
    g: common_vendor.o((...args) => $options.handleBlur && $options.handleBlur(...args)),
    h: $props.value
  }, $props.value ? {
    i: common_vendor.o((...args) => $options.handleClear && $options.handleClear(...args))
  } : {}, {
    j: $data.isFocus ? 1 : "",
    k: $props.showCancel
  }, $props.showCancel ? {
    l: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2334f7bd"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/SearchBar.js.map
