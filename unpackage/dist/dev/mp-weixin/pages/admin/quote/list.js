"use strict";
const common_vendor = require("../../../common/vendor.js");
const LoadingAnimation = () => "../../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "AdminQuoteList",
  components: {
    LoadingAnimation
  },
  data() {
    return {
      search: "",
      page: 1,
      pageSize: 10,
      statusOptions: ["全部状态", "待审核", "已通过", "已拒绝", "已过期", "已取消"],
      statusIndex: 0,
      quotes: [],
      isLoading: true,
      hasError: false,
      errorMessage: "",
      shouldFail: false
      // 用于开发时模拟请求失败的开关
    };
  },
  computed: {
    filteredQuotes() {
      let list = this.quotes;
      if (this.search) {
        const s = this.search.trim().toLowerCase();
        list = list.filter(
          (item) => item.quote_id && item.quote_id.toLowerCase().includes(s) || item.user_name && item.user_name.toLowerCase().includes(s) || item.product_name && item.product_name.toLowerCase().includes(s) || item.forwarder_name && item.forwarder_name.toLowerCase().includes(s)
        );
      }
      if (this.statusIndex > 0) {
        const statusMap = {
          1: "pending",
          2: "approved",
          3: "rejected",
          4: "expired",
          5: "cancelled"
        };
        list = list.filter((item) => item.status === statusMap[this.statusIndex]);
      }
      const start = (this.page - 1) * this.pageSize;
      return list.slice(start, start + this.pageSize);
    },
    hasNextPage() {
      let list = this.quotes;
      if (this.search) {
        const s = this.search.trim().toLowerCase();
        list = list.filter(
          (item) => item.quote_id && item.quote_id.toLowerCase().includes(s) || item.user_name && item.user_name.toLowerCase().includes(s) || item.product_name && item.product_name.toLowerCase().includes(s) || item.forwarder_name && item.forwarder_name.toLowerCase().includes(s)
        );
      }
      if (this.statusIndex > 0) {
        const statusMap = {
          1: "pending",
          2: "approved",
          3: "rejected",
          4: "expired",
          5: "cancelled"
        };
        list = list.filter((item) => item.status === statusMap[this.statusIndex]);
      }
      return list.length > this.page * this.pageSize;
    }
  },
  created() {
    {
      this.shouldFail = Math.random() < 0.1;
    }
    this.loadQuotes();
  },
  methods: {
    loadQuotes() {
      this.isLoading = true;
      this.hasError = false;
      try {
        setTimeout(() => {
          if (this.shouldFail) {
            this.handleError(new Error("模拟请求失败，这是一个随机测试错误"));
            return;
          }
          const mockUsers = [
            { id: "U1001", name: "张三" },
            { id: "U1002", name: "李四" },
            { id: "U1003", name: "王五" }
          ];
          const mockProducts = [
            { id: "P1001", name: "智能手表 Pro Max" },
            { id: "P1002", name: "蓝牙耳机" },
            { id: "P1003", name: "智能音箱" }
          ];
          const mockForwarders = [
            "环球快递",
            "海运物流",
            "航空货运",
            "京东物流",
            "顺丰速运"
          ];
          const mockRoutes = [
            "上海 - 洛杉矶",
            "深圳 - 纽约",
            "广州 - 伦敦",
            "杭州 - 温哥华",
            "南京 - 悉尼"
          ];
          const mockQuotes = [];
          for (let i = 0; i < 20; i++) {
            const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
            const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
            const price = Math.floor(40 + Math.random() * 20);
            const weight = Math.floor(100 + Math.random() * 400);
            const freight = price * weight;
            const customsFee = Math.floor(300 + Math.random() * 500);
            const totalCost = freight + customsFee;
            let status;
            if (i < 6) {
              status = "pending";
            } else if (i < 12) {
              status = "approved";
            } else if (i < 16) {
              status = "rejected";
            } else if (i < 18) {
              status = "expired";
            } else {
              status = "cancelled";
            }
            const createdDaysAgo = Math.floor(Math.random() * 30);
            const createdAt = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1e3);
            let updatedAt = null;
            if (status === "approved" || status === "rejected") {
              const updateDelay = Math.floor(Math.random() * 3) + 1;
              updatedAt = new Date(createdAt.getTime() + updateDelay * 24 * 60 * 60 * 1e3);
            }
            mockQuotes.push({
              quote_id: `Q${10001 + i}`,
              user_id: user.id,
              user_name: user.name,
              product_id: product.id,
              product_name: product.name,
              status,
              forwarder_name: mockForwarders[Math.floor(Math.random() * mockForwarders.length)],
              shipping_route: mockRoutes[Math.floor(Math.random() * mockRoutes.length)],
              delivery_time: `${Math.floor(5 + Math.random() * 10)}-${Math.floor(15 + Math.random() * 10)}天`,
              price_per_kg: price,
              total_gross_weight: weight,
              total_freight: freight,
              customs_fee: customsFee,
              total_cost: totalCost,
              remark: i % 3 === 0 ? "这是报价的备注信息。" : "",
              created_at: createdAt,
              updated_at: updatedAt,
              reviewer: updatedAt ? "管理员" : null
            });
          }
          this.quotes = mockQuotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          this.isLoading = false;
        }, 300);
      } catch (error) {
        this.handleError(error);
      }
    },
    handleError(error) {
      common_vendor.index.__f__("error", "at pages/admin/quote/list.vue:279", "获取报价列表失败:", error);
      this.hasError = true;
      this.errorMessage = error.message || "获取报价列表失败，请重试";
      this.isLoading = false;
    },
    formatDate(date) {
      return common_vendor.dayjs(date).format("YYYY-MM-DD HH:mm");
    },
    getStatusText(status) {
      const statusMap = {
        pending: "待审核",
        approved: "已通过",
        rejected: "已拒绝",
        expired: "已过期",
        cancelled: "已取消"
      };
      return statusMap[status] || status;
    },
    handleSearch() {
      this.page = 1;
    },
    onStatusChange(e) {
      this.statusIndex = e.detail.value;
      this.page = 1;
    },
    viewDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/admin/quote/detail?quoteId=${item.quote_id}&productId=${item.product_id}`
      });
    },
    handleApprove(item) {
      common_vendor.index.showModal({
        title: "确认通过",
        content: `确定通过用户"${item.user_name}"的报价吗？`,
        success: (res) => {
          if (res.confirm) {
            item.status = "approved";
            item.updated_at = /* @__PURE__ */ new Date();
            item.reviewer = "管理员";
            common_vendor.index.showToast({
              title: "已通过该报价",
              icon: "success"
            });
          }
        }
      });
    },
    handleReject(item) {
      common_vendor.index.showModal({
        title: "拒绝报价",
        content: `确定拒绝用户"${item.user_name}"的报价吗？`,
        success: (res) => {
          if (res.confirm) {
            item.status = "rejected";
            item.updated_at = /* @__PURE__ */ new Date();
            item.reviewer = "管理员";
            common_vendor.index.showToast({
              title: "已拒绝该报价",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_loading_animation = common_vendor.resolveComponent("loading-animation");
  _component_loading_animation();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      loading: $data.isLoading,
      text: "加载报价列表..."
    }),
    b: $data.hasError && !$data.isLoading
  }, $data.hasError && !$data.isLoading ? {
    c: common_vendor.t($data.errorMessage),
    d: common_vendor.o((...args) => $options.loadQuotes && $options.loadQuotes(...args))
  } : {}, {
    e: !$data.isLoading
  }, !$data.isLoading ? common_vendor.e({
    f: common_vendor.o([($event) => $data.search = $event.detail.value, (...args) => $options.handleSearch && $options.handleSearch(...args)]),
    g: $data.search,
    h: common_vendor.t($data.statusOptions[$data.statusIndex]),
    i: $data.statusOptions,
    j: $data.statusIndex,
    k: common_vendor.o((...args) => $options.onStatusChange && $options.onStatusChange(...args)),
    l: common_vendor.f($options.filteredQuotes, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.quote_id),
        b: common_vendor.t($options.getStatusText(item.status)),
        c: common_vendor.n(item.status),
        d: common_vendor.t($options.formatDate(item.created_at)),
        e: common_vendor.t(item.forwarder_name),
        f: common_vendor.t(item.shipping_route),
        g: common_vendor.t(item.price_per_kg),
        h: common_vendor.t(item.total_cost),
        i: common_vendor.t(item.user_name),
        j: common_vendor.t(item.product_name),
        k: item.status === "pending"
      }, item.status === "pending" ? {
        l: common_vendor.o(($event) => $options.handleApprove(item), index)
      } : {}, {
        m: item.status === "pending"
      }, item.status === "pending" ? {
        n: common_vendor.o(($event) => $options.handleReject(item), index)
      } : {}, {
        o: common_vendor.o(($event) => $options.viewDetail(item), index),
        p: index,
        q: common_vendor.n(item.status)
      });
    }),
    m: $options.filteredQuotes.length === 0
  }, $options.filteredQuotes.length === 0 ? {} : {}, {
    n: $data.page === 1,
    o: common_vendor.o(($event) => $data.page--),
    p: common_vendor.t($data.page),
    q: !$options.hasNextPage,
    r: common_vendor.o(($event) => $data.page++)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f9afb7ee"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/quote/list.js.map
