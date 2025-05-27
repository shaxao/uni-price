"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true
    },
    showFullTitle: {
      type: Boolean,
      default: false
    },
    showSpecs: {
      type: Boolean,
      default: true
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultImage: "/static/images/default-product.png"
    };
  },
  methods: {
    handleClick() {
      this.$emit("click", this.product);
    },
    handleQuote() {
      this.$emit("quote", this.product);
    },
    handleAddToCart() {
      this.$emit("add-to-cart", this.product);
    },
    formatDeadline(date) {
      if (!date)
        return "";
      const deadlineDate = common_vendor.dayjs(date);
      const now = common_vendor.dayjs();
      const diffDays = deadlineDate.diff(now, "day");
      if (diffDays < 0) {
        return "已截止";
      } else if (diffDays === 0) {
        return "今日截止";
      } else if (diffDays === 1) {
        return "明日截止";
      } else if (diffDays <= 3) {
        return `${diffDays}天后截止`;
      } else {
        return deadlineDate.format("MM-DD截止");
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.product.product_image || $data.defaultImage,
    b: $props.product.deadline
  }, $props.product.deadline ? {
    c: common_vendor.t($options.formatDeadline($props.product.deadline))
  } : {}, {
    d: common_vendor.t($props.product.product_name),
    e: !$props.showFullTitle ? 1 : "",
    f: common_vendor.t($props.product.total_quantity ? `总件数 ${$props.product.total_quantity}` : $props.product.description),
    g: $props.showSpecs
  }, $props.showSpecs ? {
    h: common_vendor.t($props.product.length),
    i: common_vendor.t($props.product.width),
    j: common_vendor.t($props.product.height),
    k: common_vendor.t($props.product.gross_weight)
  } : {}, {
    l: $props.showActions
  }, $props.showActions ? {
    m: common_vendor.o((...args) => $options.handleQuote && $options.handleQuote(...args)),
    n: common_vendor.o((...args) => $options.handleAddToCart && $options.handleAddToCart(...args))
  } : {}, {
    o: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fe52aa40"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/ProductCard.js.map
