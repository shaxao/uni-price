"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const TabBar = () => "../../components/TabBar.js";
const _sfc_main = {
  name: "CartPage",
  components: {
    TabBar
  },
  computed: {
    ...common_vendor.mapState("cart", ["cartItems"])
  },
  onShow() {
    this.loadCartItems();
  },
  methods: {
    ...common_vendor.mapActions("cart", [
      "loadCartItems",
      "removeCartItem",
      "clearCart"
    ]),
    formatTime(timestamp) {
      return common_vendor.dayjs(timestamp).format("YYYY年MM月DD日 HH:mm");
    },
    navigateToHome() {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    },
    viewProduct(productId) {
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${productId}`
      });
    },
    showDeleteConfirm(index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要从购物车中删除该商品吗？",
        success: (res) => {
          if (res.confirm) {
            this.handleRemoveItem(index);
          }
        }
      });
    },
    async handleRemoveItem(index) {
      const result = await this.removeCartItem(index);
      common_vendor.index.showToast({
        title: result.message,
        icon: result.success ? "success" : "none"
      });
    },
    showClearConfirm() {
      common_vendor.index.showModal({
        title: "确认清空",
        content: "确定要清空购物车吗？此操作不可恢复。",
        success: (res) => {
          if (res.confirm) {
            this.handleClearCart();
          }
        }
      });
    },
    async handleClearCart() {
      const result = await this.clearCart();
      common_vendor.index.showToast({
        title: result.message,
        icon: result.success ? "success" : "none"
      });
    }
  }
};
if (!Array) {
  const _component_tab_bar = common_vendor.resolveComponent("tab-bar");
  _component_tab_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.cartItems.length > 0
  }, _ctx.cartItems.length > 0 ? {
    b: common_vendor.t(_ctx.cartItems.length)
  } : {}, {
    c: _ctx.cartItems.length === 0
  }, _ctx.cartItems.length === 0 ? {
    d: common_assets._imports_0$3,
    e: common_vendor.o((...args) => $options.navigateToHome && $options.navigateToHome(...args))
  } : {
    f: common_vendor.f(_ctx.cartItems, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t($options.formatTime(item.addTime)),
        c: common_vendor.o(($event) => $options.viewProduct(item.productId), index),
        d: common_vendor.o(($event) => $options.showDeleteConfirm(index), index),
        e: index,
        f: index * 0.05 + "s"
      };
    }),
    g: common_assets._imports_1$2
  }, {
    h: _ctx.cartItems.length > 0
  }, _ctx.cartItems.length > 0 ? {
    i: common_vendor.o((...args) => $options.showClearConfirm && $options.showClearConfirm(...args))
  } : {}, {
    j: common_vendor.p({
      ["current-tab"]: 2
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8039fbf1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/cart/index.js.map
