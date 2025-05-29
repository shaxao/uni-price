"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const TopBar = () => "../../../components/TopBar.js";
const AdminNavBar = () => "../../../components/AdminNavBar.js";
const LoadingAnimation = () => "../../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "AdminDashboard",
  components: { TopBar, AdminNavBar, LoadingAnimation },
  data() {
    return {
      loading: false,
      stats: {
        productCount: 0,
        quoteCount: 0,
        userCount: 0,
        unreadMessages: 0
      },
      navItems: [
        { name: "产品管理", path: "/pages/admin/product/list", icon: "/static/images/product-icon.png" },
        { name: "报价管理", path: "/pages/admin/quote/list", icon: "/static/images/price.png" },
        { name: "用户管理", path: "/pages/admin/user/list", icon: "/static/images/user-icon.png" },
        { name: "消息中心", path: "/pages/admin/message/list", icon: "/static/images/message-icon.png" },
        { name: "系统设置", path: "/pages/admin/profile/settings", icon: "/static/images/settings-icon.png" }
      ],
      recentQuotes: []
    };
  },
  created() {
    this.fetchDashboardData();
  },
  methods: {
    fetchDashboardData() {
      this.loading = true;
      setTimeout(() => {
        this.stats = {
          productCount: 127,
          quoteCount: 358,
          userCount: 86,
          unreadMessages: 12
        };
        this.recentQuotes = [
          {
            quote_id: "Q10001",
            product_id: "P1001",
            product_name: "智能手表",
            username: "李四",
            price: 1280,
            status: "pending",
            created_at: "2023-08-25T09:30:00Z"
          },
          {
            quote_id: "Q10002",
            product_id: "P1002",
            product_name: "蓝牙耳机",
            username: "王五",
            price: 299,
            status: "approved",
            created_at: "2023-08-24T16:45:00Z"
          },
          {
            quote_id: "Q10003",
            product_id: "P1003",
            product_name: "智能音箱",
            username: "赵六",
            price: 799,
            status: "rejected",
            created_at: "2023-08-24T10:20:00Z"
          },
          {
            quote_id: "Q10004",
            product_id: "P1004",
            product_name: "无线充电器",
            username: "钱七",
            price: 159,
            status: "pending",
            created_at: "2023-08-23T14:10:00Z"
          }
        ];
        this.loading = false;
      }, 300);
    },
    navigateTo(path) {
      common_vendor.index.navigateTo({
        url: path,
        fail: () => {
          common_vendor.index.switchTab({
            url: path,
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/admin/index/index.vue:176", "导航失败:", err);
              common_vendor.index.showToast({
                title: "页面跳转失败",
                icon: "none"
              });
            }
          });
        }
      });
    },
    viewQuoteDetail(quoteId, productId) {
      common_vendor.index.navigateTo({
        url: `/pages/admin/quote/detail?id=${quoteId}&productId=${productId}`
      });
    },
    getStatusText(status) {
      const statusMap = {
        "pending": "待审核",
        "approved": "已通过",
        "rejected": "已拒绝"
      };
      return statusMap[status] || status;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
  return {
    a: common_vendor.p({
      title: "管理后台",
      showBack: false,
      withBorder: true
    }),
    b: common_vendor.p({
      currentPath: "/pages/admin/index/index"
    }),
    c: common_assets._imports_0,
    d: common_vendor.t($data.stats.productCount),
    e: common_vendor.o(($event) => $options.navigateTo("/pages/admin/product/list")),
    f: common_assets._imports_1,
    g: common_vendor.t($data.stats.quoteCount),
    h: common_vendor.o(($event) => $options.navigateTo("/pages/admin/quote/list")),
    i: common_assets._imports_2,
    j: common_vendor.t($data.stats.userCount),
    k: common_vendor.o(($event) => $options.navigateTo("/pages/admin/user/list")),
    l: common_assets._imports_3,
    m: common_vendor.t($data.stats.unreadMessages),
    n: common_vendor.o(($event) => $options.navigateTo("/pages/admin/message/list")),
    o: common_vendor.f($data.navItems, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.navigateTo(item.path), index)
      };
    }),
    p: common_vendor.f($data.recentQuotes, (quote, index, i0) => {
      return {
        a: common_vendor.t(quote.product_name),
        b: common_vendor.t($options.getStatusText(quote.status)),
        c: common_vendor.n(quote.status),
        d: common_vendor.t(quote.username),
        e: common_vendor.t(quote.price.toFixed(2)),
        f: common_vendor.t($options.formatDate(quote.created_at)),
        g: index,
        h: common_vendor.o(($event) => $options.viewQuoteDetail(quote.quote_id, quote.product_id), index)
      };
    }),
    q: common_vendor.p({
      loading: $data.loading
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b6e7fbe1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/index/index.js.map
