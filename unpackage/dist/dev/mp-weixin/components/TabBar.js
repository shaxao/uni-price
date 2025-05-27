"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "TabBar",
  props: {
    tabs: {
      type: Array,
      required: true,
      validator: (tabs) => {
        return tabs.every((tab) => {
          return typeof tab.title === "string" && typeof tab.icon === "string" && typeof tab.activeIcon === "string" && typeof tab.url === "string";
        });
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleTabClick(index, tab) {
      if (this.activeIndex !== index) {
        this.$emit("change", index);
        if (tab.url) {
          common_vendor.index.switchTab({
            url: tab.url,
            fail: () => {
              common_vendor.index.navigateTo({
                url: tab.url
              });
            }
          });
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.tabs, (tab, index, i0) => {
      return {
        a: $props.activeIndex === index ? tab.activeIcon : tab.icon,
        b: common_vendor.t(tab.title),
        c: index,
        d: $props.activeIndex === index ? 1 : "",
        e: common_vendor.o(($event) => $options.handleTabClick(index, tab), index)
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-89ca1f91"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/TabBar.js.map
