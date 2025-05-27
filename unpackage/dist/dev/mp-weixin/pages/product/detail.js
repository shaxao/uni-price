"use strict";
const common_vendor = require("../../common/vendor.js");
const BaseCard = () => "../../components/BaseCard.js";
const LoadingAnimation = () => "../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "ProductDetail",
  components: {
    BaseCard,
    LoadingAnimation
  },
  data() {
    return {
      productId: "",
      product: {},
      isLoading: true
    };
  },
  computed: {
    ...common_vendor.mapState("cart", ["cartItems"]),
    ...common_vendor.mapGetters("product", ["getProductById"]),
    isInCart() {
      return this.cartItems && this.cartItems.some((item) => item.productId === this.productId);
    },
    cachedProduct() {
      if (!this.getProductById || typeof this.getProductById !== "function") {
        return null;
      }
      try {
        const product = this.getProductById(this.productId);
        return product || null;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/product/detail.vue:125", "获取缓存产品失败:", e);
        return null;
      }
    }
  },
  onLoad(options) {
    this.productId = options.id;
    this.fetchProductDetail();
    this.loadCartItems();
  },
  methods: {
    ...common_vendor.mapActions("cart", {
      cartAddToCart: "addToCart",
      // 重命名Vuex action，避免命名冲突
      loadCartItems: "loadCartItems"
    }),
    ...common_vendor.mapActions("product", ["fetchProduct"]),
    async fetchProductDetail() {
      this.isLoading = true;
      try {
        if (this.cachedProduct) {
          this.product = this.cachedProduct;
          setTimeout(() => {
            this.isLoading = false;
          }, 300);
          return;
        }
        await this.fetchProduct(this.productId);
        if (this.cachedProduct) {
          this.product = this.cachedProduct;
        } else {
          const mockData = {
            product_id: this.productId,
            product_name: "智能手表 Pro Max",
            description: "多功能健康监测智能手表，支持心率、血压、血氧监测",
            product_image: "https://cdn.example.com/img/watch.jpg",
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
            warehouse: "上海仓",
            zipcode: "200001",
            length: 5.5,
            width: 4.2,
            height: 1.8,
            gross_weight: 0.35,
            package_weight: 0.15,
            chargeable_weight: 0.5,
            box_quantity: 50,
            // 新增装箱量
            unit_quantity: 200,
            // 新增单位数量
            total_quantity: 1e3,
            total_volume: 2.5,
            total_gross_weight: 350,
            min_quote: {
              price_per_kg: 45,
              delivery_time: "7-10工作日",
              total_cost: 15750
            }
          };
          this.product = mockData;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "获取产品详情失败",
          icon: "none"
        });
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    },
    formatDate(date) {
      return common_vendor.dayjs(date).format("YYYY-MM-DD");
    },
    navigateToQuote() {
      if (!this.product.total_gross_weight) {
        common_vendor.index.showToast({
          title: "产品总毛重数据异常",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/quote/create?productId=${this.productId}&totalGrossWeight=${this.product.total_gross_weight}`
      });
    },
    handleCartAction() {
      if (this.isInCart) {
        common_vendor.index.navigateTo({ url: "/pages/cart/index" });
      } else {
        this.addToCart();
      }
    },
    async addToCart() {
      const result = await this.cartAddToCart({
        productId: this.productId,
        productName: this.product.product_name
      });
      common_vendor.index.showToast({
        title: result.message,
        icon: result.success ? "success" : "none"
      });
    }
  }
};
if (!Array) {
  const _component_loading_animation = common_vendor.resolveComponent("loading-animation");
  const _component_base_card = common_vendor.resolveComponent("base-card");
  (_component_loading_animation + _component_base_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      loading: $data.isLoading,
      text: "加载产品详情..."
    }),
    b: !$data.isLoading
  }, !$data.isLoading ? common_vendor.e({
    c: $data.product.product_image,
    d: common_vendor.t($data.product.product_name),
    e: common_vendor.t($data.product.description),
    f: common_vendor.t($options.formatDate($data.product.expiry_date)),
    g: common_vendor.t($data.product.product_id),
    h: common_vendor.t($data.product.warehouse),
    i: common_vendor.t($data.product.zipcode),
    j: common_vendor.t($data.product.length),
    k: common_vendor.t($data.product.width),
    l: common_vendor.t($data.product.height),
    m: common_vendor.t($data.product.gross_weight),
    n: common_vendor.t($data.product.package_weight),
    o: common_vendor.t($data.product.chargeable_weight),
    p: common_vendor.t($data.product.box_quantity || "-"),
    q: common_vendor.t($data.product.unit_quantity || "-"),
    r: common_vendor.t($data.product.total_quantity),
    s: common_vendor.t($data.product.total_volume),
    t: common_vendor.t($data.product.total_gross_weight),
    v: $data.product.min_quote
  }, $data.product.min_quote ? {
    w: common_vendor.t($data.product.min_quote.price_per_kg),
    x: common_vendor.t($data.product.min_quote.delivery_time),
    y: common_vendor.t($data.product.min_quote.total_cost)
  } : {}, {
    z: common_vendor.t($options.isInCart ? "已在购物车" : "加入购物车"),
    A: common_vendor.o((...args) => $options.handleCartAction && $options.handleCartAction(...args)),
    B: $options.isInCart,
    C: common_vendor.o((...args) => $options.navigateToQuote && $options.navigateToQuote(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-acf502d9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/detail.js.map
