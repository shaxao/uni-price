"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const SearchBar = () => "../../components/SearchBar.js";
const FilterBar = () => "../../components/FilterBar.js";
const ProductCard = () => "../../components/ProductCard.js";
const TabBar = () => "../../components/TabBar.js";
const LoadingAnimation = () => "../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "Index",
  components: {
    SearchBar,
    FilterBar,
    ProductCard,
    TabBar,
    LoadingAnimation
  },
  data() {
    return {
      products: [],
      quotes: [],
      searchText: "",
      productId: null,
      isLoading: true,
      currentFilter: "default"
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchText)
        return this.products;
      return this.products.filter(
        (p) => {
          var _a;
          return p.product_name.toLowerCase().includes(this.searchText.toLowerCase()) || ((_a = p.description) == null ? void 0 : _a.toLowerCase().includes(this.searchText.toLowerCase()));
        }
      );
    },
    sortedProducts() {
      const products = [...this.filteredProducts];
      if (typeof this.currentFilter === "string" && this.currentFilter.startsWith("{")) {
        try {
          const filters = JSON.parse(this.currentFilter);
          return this.applyComplexFilters(products, filters);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.vue:91", "解析筛选条件出错:", error);
          return products;
        }
      }
      switch (this.currentFilter) {
        case "priceHigh":
          return products.sort((a, b) => {
            const priceA = this.getProductTotalCostNumber(a.product_id);
            const priceB = this.getProductTotalCostNumber(b.product_id);
            return priceB - priceA;
          });
        case "priceLow":
          return products.sort((a, b) => {
            const priceA = this.getProductTotalCostNumber(a.product_id);
            const priceB = this.getProductTotalCostNumber(b.product_id);
            return priceA - priceB;
          });
        case "dateFar":
          return products.sort((a, b) => {
            const dateA = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
            const dateB = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
            return dateB - dateA;
          });
        case "dateNear":
          return products.sort((a, b) => {
            const dateA = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
            const dateB = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
            return dateA - dateB;
          });
        default:
          return products;
      }
    }
  },
  onLoad(options) {
    this.productId = options.id;
    this.fetchProducts();
    this.fetchQuotes();
  },
  methods: {
    ...common_vendor.mapActions("product", ["fetchProducts"]),
    async fetchProducts() {
      this.isLoading = true;
      try {
        const res = await utils_request.get("/products");
        this.products = res.data;
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "获取产品列表失败",
          icon: "none"
        });
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    },
    async fetchQuotes() {
      try {
        const res = await utils_request.get("/quotes");
        this.quotes = res.data;
      } catch (error) {
      }
    },
    handleViewProduct(id) {
      common_vendor.index.navigateTo({ url: `/pages/product/detail?id=${id}` });
    },
    handleTabChange(index) {
    },
    // 筛选相关方法
    handleFilterChange(filter) {
      this.currentFilter = filter;
    },
    // 获取产品最低报价
    getProductTotalCost(productId) {
      const quote = this.quotes.filter((q) => q.product_id === productId);
      if (!quote.length)
        return "-";
      return Math.min(...quote.map((q) => q.total_cost));
    },
    // 获取产品最低报价(数字)，用于排序
    getProductTotalCostNumber(productId) {
      const quote = this.quotes.filter((q) => q.product_id === productId);
      if (!quote.length)
        return 0;
      return Math.min(...quote.map((q) => q.total_cost));
    },
    formatExpiryDate(expiryDate) {
      if (!expiryDate)
        return "-";
      return common_vendor.dayjs(expiryDate).format("YYYY-MM-DD");
    },
    // 应用复合筛选条件
    applyComplexFilters(products, filters) {
      let result = [...products];
      if (filters.price === "high") {
        result.sort((a, b) => {
          const priceA = this.getProductTotalCostNumber(a.product_id);
          const priceB = this.getProductTotalCostNumber(b.product_id);
          return priceB - priceA;
        });
      } else if (filters.price === "low") {
        result.sort((a, b) => {
          const priceA = this.getProductTotalCostNumber(a.product_id);
          const priceB = this.getProductTotalCostNumber(b.product_id);
          return priceA - priceB;
        });
      }
      if (filters.date !== null) {
        result = this.stableSortByDate(result, filters.date);
      }
      return result;
    },
    // 稳定排序按日期（保持价格排序的结果）
    stableSortByDate(products, dateFilter) {
      const indexed = products.map((item, index) => ({ item, index }));
      indexed.sort((a, b) => {
        const dateA = a.item.expiry_date ? new Date(a.item.expiry_date).getTime() : 0;
        const dateB = b.item.expiry_date ? new Date(b.item.expiry_date).getTime() : 0;
        const dateDiff = dateFilter === "far" ? dateB - dateA : dateA - dateB;
        return dateDiff !== 0 ? dateDiff : a.index - b.index;
      });
      return indexed.map((x) => x.item);
    },
    // 添加搜索处理方法
    onSearch(value) {
      this.searchText = value;
    },
    // 添加搜索确认方法
    onSearchConfirm(value) {
      this.searchText = value;
      common_vendor.index.showToast({
        title: "搜索: " + value,
        icon: "none",
        duration: 2e3
      });
    }
  }
};
if (!Array) {
  const _component_search_bar = common_vendor.resolveComponent("search-bar");
  const _component_filter_bar = common_vendor.resolveComponent("filter-bar");
  const _component_loading_animation = common_vendor.resolveComponent("loading-animation");
  const _component_product_card = common_vendor.resolveComponent("product-card");
  const _component_tab_bar = common_vendor.resolveComponent("tab-bar");
  (_component_search_bar + _component_filter_bar + _component_loading_animation + _component_product_card + _component_tab_bar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.searchText = ""),
    b: common_vendor.o($options.onSearch),
    c: common_vendor.o($options.onSearchConfirm),
    d: common_vendor.o(($event) => $data.searchText = $event),
    e: common_vendor.p({
      placeholder: "搜索产品",
      modelValue: $data.searchText
    }),
    f: common_vendor.o($options.handleFilterChange),
    g: common_vendor.p({
      selectedFilter: $data.currentFilter
    }),
    h: common_vendor.p({
      loading: $data.isLoading,
      text: "加载产品中..."
    }),
    i: !$data.isLoading
  }, !$data.isLoading ? {
    j: common_vendor.f($options.sortedProducts, (product, k0, i0) => {
      return {
        a: product.product_id,
        b: common_vendor.o($options.handleViewProduct, product.product_id),
        c: "1cf27b2a-3-" + i0,
        d: common_vendor.p({
          product,
          price: $options.getProductTotalCost(product.product_id),
          ["expiry-date"]: $options.formatExpiryDate(product.expiry_date)
        })
      };
    })
  } : {}, {
    k: $options.sortedProducts.length === 0 && !$data.isLoading
  }, $options.sortedProducts.length === 0 && !$data.isLoading ? {} : {}, {
    l: common_vendor.o($options.handleTabChange),
    m: common_vendor.p({
      ["current-tab"]: 0
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
