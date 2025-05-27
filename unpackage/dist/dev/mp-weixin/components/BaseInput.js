"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "BaseInput",
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ""
    }
  },
  methods: {
    onInput(e) {
      const value = e.detail && e.detail.value !== void 0 ? e.detail.value : e.target.value;
      this.$emit("update:modelValue", value);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.label
  }, $props.label ? {
    b: common_vendor.t($props.label)
  } : {}, {
    c: $props.type !== "textarea"
  }, $props.type !== "textarea" ? {
    d: $props.type || "text",
    e: $props.modelValue,
    f: $props.placeholder,
    g: $props.disabled,
    h: common_vendor.o((...args) => $options.onInput && $options.onInput(...args))
  } : {
    i: $props.modelValue,
    j: $props.placeholder,
    k: $props.disabled,
    l: common_vendor.o((...args) => $options.onInput && $options.onInput(...args))
  }, {
    m: $props.error
  }, $props.error ? {
    n: common_vendor.t($props.error)
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-48a2094e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/BaseInput.js.map
