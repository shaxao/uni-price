"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "FilterBar",
  props: {
    showActiveTags: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawerVisible: false,
      filters: {
        priceSort: "default",
        dateSort: "default",
        productTypes: [],
        weightRange: [0, 500]
      },
      priceOptions: [
        { label: "默认排序", value: "default" },
        { label: "价格从低到高", value: "asc" },
        { label: "价格从高到低", value: "desc" }
      ],
      dateOptions: [
        { label: "默认排序", value: "default" },
        { label: "截止日期最近", value: "asc" },
        { label: "截止日期最远", value: "desc" }
      ],
      productTypes: [
        { label: "电子产品", value: "electronics" },
        { label: "服装", value: "clothing" },
        { label: "家居", value: "home" },
        { label: "玩具", value: "toys" },
        { label: "运动户外", value: "sports" },
        { label: "美容个护", value: "beauty" },
        { label: "食品", value: "food" },
        { label: "书籍", value: "books" }
      ]
    };
  },
  computed: {
    hasActiveFilters() {
      return this.filters.priceSort !== "default" || this.filters.dateSort !== "default" || this.filters.productTypes.length > 0 || this.filters.weightRange[0] > 0 || this.filters.weightRange[1] < 500;
    }
  },
  methods: {
    openDrawer() {
      this.drawerVisible = true;
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
    selectPriceSort(value) {
      this.filters.priceSort = value;
    },
    selectDateSort(value) {
      this.filters.dateSort = value;
    },
    toggleProductType(value) {
      const index = this.filters.productTypes.indexOf(value);
      if (index > -1) {
        this.filters.productTypes.splice(index, 1);
      } else {
        this.filters.productTypes.push(value);
      }
    },
    onMinWeightChange(e) {
      const value = e.detail.value;
      if (value > this.filters.weightRange[1]) {
        this.filters.weightRange[0] = this.filters.weightRange[1];
      } else {
        this.filters.weightRange[0] = value;
      }
    },
    onMaxWeightChange(e) {
      const value = e.detail.value;
      if (value < this.filters.weightRange[0]) {
        this.filters.weightRange[1] = this.filters.weightRange[0];
      } else {
        this.filters.weightRange[1] = value;
      }
    },
    resetFilters() {
      this.filters = {
        priceSort: "default",
        dateSort: "default",
        productTypes: [],
        weightRange: [0, 500]
      };
    },
    applyFilters() {
      this.$emit("filter", { ...this.filters });
      this.closeDrawer();
    },
    clearPriceSort() {
      this.filters.priceSort = "default";
      this.$emit("filter", { ...this.filters });
    },
    clearDateSort() {
      this.filters.dateSort = "default";
      this.$emit("filter", { ...this.filters });
    },
    removeProductType(type) {
      const index = this.filters.productTypes.indexOf(type);
      if (index > -1) {
        this.filters.productTypes.splice(index, 1);
        this.$emit("filter", { ...this.filters });
      }
    },
    getPriceSortLabel(value) {
      const option = this.priceOptions.find((item) => item.value === value);
      return option ? option.label : "";
    },
    getDateSortLabel(value) {
      const option = this.dateOptions.find((item) => item.value === value);
      return option ? option.label : "";
    },
    getProductTypeLabel(value) {
      const option = this.productTypes.find((item) => item.value === value);
      return option ? option.label : "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.hasActiveFilters
  }, $options.hasActiveFilters ? {} : {}, {
    b: common_vendor.o((...args) => $options.openDrawer && $options.openDrawer(...args)),
    c: $data.drawerVisible
  }, $data.drawerVisible ? {
    d: common_vendor.o((...args) => $options.closeDrawer && $options.closeDrawer(...args))
  } : {}, {
    e: common_vendor.o((...args) => $options.closeDrawer && $options.closeDrawer(...args)),
    f: common_vendor.f($data.priceOptions, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.label),
        b: $data.filters.priceSort === item.value
      }, $data.filters.priceSort === item.value ? {} : {}, {
        c: `price-${index}`,
        d: $data.filters.priceSort === item.value ? 1 : "",
        e: common_vendor.o(($event) => $options.selectPriceSort(item.value), `price-${index}`)
      });
    }),
    g: common_vendor.f($data.dateOptions, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.label),
        b: $data.filters.dateSort === item.value
      }, $data.filters.dateSort === item.value ? {} : {}, {
        c: `date-${index}`,
        d: $data.filters.dateSort === item.value ? 1 : "",
        e: common_vendor.o(($event) => $options.selectDateSort(item.value), `date-${index}`)
      });
    }),
    h: common_vendor.f($data.productTypes, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag.label),
        b: `type-${index}`,
        c: $data.filters.productTypes.includes(tag.value) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleProductType(tag.value), `type-${index}`)
      };
    }),
    i: common_vendor.t($data.filters.weightRange[0]),
    j: common_vendor.t($data.filters.weightRange[1]),
    k: $data.filters.weightRange[0],
    l: common_vendor.o((...args) => $options.onMinWeightChange && $options.onMinWeightChange(...args)),
    m: $data.filters.weightRange[1],
    n: common_vendor.o((...args) => $options.onMaxWeightChange && $options.onMaxWeightChange(...args)),
    o: common_vendor.o((...args) => $options.resetFilters && $options.resetFilters(...args)),
    p: common_vendor.o((...args) => $options.applyFilters && $options.applyFilters(...args)),
    q: $data.drawerVisible ? 1 : "",
    r: $options.hasActiveFilters && $props.showActiveTags
  }, $options.hasActiveFilters && $props.showActiveTags ? common_vendor.e({
    s: $data.filters.priceSort !== "default"
  }, $data.filters.priceSort !== "default" ? {
    t: common_vendor.t($options.getPriceSortLabel($data.filters.priceSort)),
    v: common_vendor.o((...args) => $options.clearPriceSort && $options.clearPriceSort(...args))
  } : {}, {
    w: $data.filters.dateSort !== "default"
  }, $data.filters.dateSort !== "default" ? {
    x: common_vendor.t($options.getDateSortLabel($data.filters.dateSort)),
    y: common_vendor.o((...args) => $options.clearDateSort && $options.clearDateSort(...args))
  } : {}, {
    z: common_vendor.f($data.filters.productTypes, (type, index, i0) => {
      return {
        a: common_vendor.t($options.getProductTypeLabel(type)),
        b: common_vendor.o(($event) => $options.removeProductType(type), `active-${index}`),
        c: `active-${index}`
      };
    })
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9c3aa681"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/FilterBar.js.map
