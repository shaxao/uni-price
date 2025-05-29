"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const BaseCard = () => "../../../components/BaseCard.js";
const TopBar = () => "../../../components/TopBar.js";
const AdminNavBar = () => "../../../components/AdminNavBar.js";
const LoadingAnimation = () => "../../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "AdminProductList",
  components: { BaseCard, TopBar, AdminNavBar, LoadingAnimation },
  data() {
    return {
      loading: false,
      search: "",
      page: 1,
      pageSize: 10,
      priceOptions: ["默认排序", "价格从高到低", "价格从低到高"],
      priceIndex: 0,
      statusOptions: ["全部状态", "上架", "下架"],
      statusIndex: 0,
      warehouseOptions: ["全部仓库", "上海仓", "深圳仓"],
      warehouseIndex: 0,
      products: [],
      defaultImg: "/static/images/default-product.png"
    };
  },
  computed: {
    filteredProducts() {
      let list = this.products;
      if (this.search) {
        const s = this.search.trim().toLowerCase();
        list = list.filter(
          (item) => item.product_name.toLowerCase().includes(s) || item.product_id.toLowerCase().includes(s)
        );
      }
      if (this.statusIndex === 1)
        list = list.filter((i) => i.status === "on");
      if (this.statusIndex === 2)
        list = list.filter((i) => i.status === "off");
      if (this.warehouseIndex > 0)
        list = list.filter((i) => i.warehouse === this.warehouseOptions[this.warehouseIndex]);
      if (this.priceIndex === 1)
        list = list.slice().sort((a, b) => (b.price || 0) - (a.price || 0));
      if (this.priceIndex === 2)
        list = list.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
      const start = (this.page - 1) * this.pageSize;
      return list.slice(start, start + this.pageSize);
    },
    hasNextPage() {
      let list = this.products;
      if (this.search) {
        const s = this.search.trim().toLowerCase();
        list = list.filter(
          (item) => item.product_name.toLowerCase().includes(s) || item.product_id.toLowerCase().includes(s)
        );
      }
      if (this.statusIndex === 1)
        list = list.filter((i) => i.status === "on");
      if (this.statusIndex === 2)
        list = list.filter((i) => i.status === "off");
      if (this.warehouseIndex > 0)
        list = list.filter((i) => i.warehouse === this.warehouseOptions[this.warehouseIndex]);
      return list.length > this.page * this.pageSize;
    }
  },
  onLoad() {
    this.loadProducts();
  },
  methods: {
    loadProducts() {
      this.loading = true;
      setTimeout(() => {
        const mockProducts = [
          {
            product_id: "P1001",
            product_name: "智能手表",
            description: "多功能健康监测智能手表",
            product_image: "https://cdn.example.com/img/watch.jpg",
            quantity: 120,
            warehouse: "上海仓",
            status: "on",
            price: 1280,
            pendingQuotes: 3,
            // 待审核报价数量
            totalQuotes: 5,
            // 总报价数量
            hasNewQuotes: true
            // 是否有新报价
          },
          {
            product_id: "P1002",
            product_name: "蓝牙耳机",
            description: "降噪无线蓝牙耳机",
            product_image: "https://cdn.example.com/img/earphone.jpg",
            quantity: 80,
            warehouse: "深圳仓",
            status: "off",
            price: 299,
            pendingQuotes: 0,
            totalQuotes: 2,
            hasNewQuotes: false
          },
          {
            product_id: "P1003",
            product_name: "智能音箱",
            description: "高音质智能语音音箱",
            product_image: "https://cdn.example.com/img/speaker.jpg",
            quantity: 50,
            warehouse: "上海仓",
            status: "on",
            price: 799,
            pendingQuotes: 2,
            totalQuotes: 3,
            hasNewQuotes: true
          },
          {
            product_id: "P1004",
            product_name: "无线充电器",
            description: "快充无线充电板",
            product_image: "https://cdn.example.com/img/charger.jpg",
            quantity: 200,
            warehouse: "深圳仓",
            status: "on",
            price: 159,
            pendingQuotes: 1,
            totalQuotes: 1,
            hasNewQuotes: true
          },
          {
            product_id: "P1005",
            product_name: "智能手环",
            description: "运动监测智能手环",
            product_image: "https://cdn.example.com/img/band.jpg",
            quantity: 150,
            warehouse: "上海仓",
            status: "on",
            price: 199,
            pendingQuotes: 0,
            totalQuotes: 0,
            hasNewQuotes: false
          }
        ];
        this.products = mockProducts;
        this.loading = false;
      }, 800);
    },
    handleSearch() {
      this.page = 1;
    },
    onPriceChange(e) {
      this.priceIndex = e.detail.value;
      this.page = 1;
    },
    onStatusChange(e) {
      this.statusIndex = e.detail.value;
      this.page = 1;
    },
    onWarehouseChange(e) {
      this.warehouseIndex = e.detail.value;
      this.page = 1;
    },
    handleAdd() {
      common_vendor.index.navigateTo({ url: "/pages/admin/product/edit" });
    },
    onView(item) {
      common_vendor.index.navigateTo({ url: `/pages/admin/product/detail?id=${item.product_id}` });
    },
    onEdit(item) {
      common_vendor.index.navigateTo({ url: `/pages/admin/product/edit?id=${item.product_id}` });
    },
    onDelete(item) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: `确定要删除产品「${item.product_name}」吗？`,
        success: (res) => {
          if (res.confirm) {
            this.products = this.products.filter((p) => p.product_id !== item.product_id);
            common_vendor.index.showToast({ title: "已删除", icon: "success" });
          }
        }
      });
    },
    onChangeStatus(item, status) {
      item.status = status;
      common_vendor.index.showToast({ title: `已${status === "on" ? "上架" : "下架"}`, icon: "success" });
    },
    onViewQuotes(item) {
      common_vendor.index.navigateTo({
        url: `/pages/admin/product/detail?id=${item.product_id}&scrollToQuotes=true`
      });
    }
  }
};
if (!Array) {
  const _component_TopBar = common_vendor.resolveComponent("TopBar");
  const _component_AdminNavBar = common_vendor.resolveComponent("AdminNavBar");
  const _component_LoadingAnimation = common_vendor.resolveComponent("LoadingAnimation");
  (_component_TopBar + _component_AdminNavBar + _component_LoadingAnimation)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: "产品管理",
      showBack: false,
      withBorder: true
    }),
    b: common_vendor.p({
      currentPath: "/pages/admin/product/list"
    }),
    c: common_vendor.o([($event) => $data.search = $event.detail.value, (...args) => $options.handleSearch && $options.handleSearch(...args)]),
    d: $data.search,
    e: common_vendor.o((...args) => $options.handleAdd && $options.handleAdd(...args)),
    f: common_vendor.t($data.priceOptions[$data.priceIndex]),
    g: $data.priceOptions,
    h: $data.priceIndex,
    i: common_vendor.o((...args) => $options.onPriceChange && $options.onPriceChange(...args)),
    j: common_vendor.t($data.statusOptions[$data.statusIndex]),
    k: $data.statusOptions,
    l: $data.statusIndex,
    m: common_vendor.o((...args) => $options.onStatusChange && $options.onStatusChange(...args)),
    n: common_vendor.t($data.warehouseOptions[$data.warehouseIndex]),
    o: $data.warehouseOptions,
    p: $data.warehouseIndex,
    q: common_vendor.o((...args) => $options.onWarehouseChange && $options.onWarehouseChange(...args)),
    r: common_vendor.f($options.filteredProducts, (item, k0, i0) => {
      return common_vendor.e({
        a: $data.defaultImg || item.product_image,
        b: common_vendor.t(item.product_name),
        c: common_vendor.t(item.status === "on" ? "上架" : "下架"),
        d: common_vendor.n(item.status === "on" ? "on" : "off"),
        e: common_vendor.t(item.product_id),
        f: common_vendor.t(item.description),
        g: common_vendor.t(item.quantity),
        h: common_vendor.t(item.warehouse),
        i: item.price
      }, item.price ? {
        j: common_vendor.t(item.price.toFixed(2))
      } : {}, {
        k: common_vendor.o(($event) => $options.onView(item), item.product_id),
        l: common_vendor.o(($event) => $options.onEdit(item), item.product_id),
        m: common_vendor.o(($event) => $options.onDelete(item), item.product_id),
        n: item.status === "on"
      }, item.status === "on" ? {
        o: common_vendor.o(($event) => $options.onChangeStatus(item, "off"), item.product_id)
      } : {
        p: common_vendor.o(($event) => $options.onChangeStatus(item, "on"), item.product_id)
      }, {
        q: item.pendingQuotes > 0
      }, item.pendingQuotes > 0 ? {
        r: common_vendor.t(item.pendingQuotes),
        s: common_vendor.o(($event) => $options.onViewQuotes(item), item.product_id)
      } : {}, {
        t: item.product_id
      });
    }),
    s: $data.page === 1,
    t: common_vendor.o(($event) => $data.page--),
    v: common_vendor.t($data.page),
    w: !$options.hasNextPage,
    x: common_vendor.o(($event) => $data.page++),
    y: $data.loading
  }, $data.loading ? {} : {}, {
    z: $options.filteredProducts.length === 0
  }, $options.filteredProducts.length === 0 ? {
    A: common_assets._imports_0$1,
    B: common_vendor.t($data.search ? "未找到匹配的产品" : "暂无产品数据")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a64add69"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/product/list.js.map
