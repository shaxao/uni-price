"use strict";
const common_vendor = require("../../../common/vendor.js");
const BaseCard = () => "../../../components/BaseCard.js";
const LoadingAnimation = () => "../../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "AdminProductDetail",
  components: { BaseCard, LoadingAnimation },
  data() {
    return {
      productId: "",
      product: {},
      quotes: [],
      isLoading: true,
      defaultImg: "/static/images/default-product.png",
      statusOptions: ["全部", "待审核", "已通过", "已拒绝"],
      statusFilterIndex: 0,
      scrollToQuotes: false
    };
  },
  computed: {
    filteredQuotes() {
      if (this.statusFilterIndex === 0)
        return this.quotes;
      const statusMap = {
        1: "pending",
        2: "approved",
        3: "rejected"
      };
      return this.quotes.filter((quote) => quote.status === statusMap[this.statusFilterIndex]);
    }
  },
  onLoad(options) {
    this.productId = options.id;
    this.fetchProductDetail();
    this.scrollToQuotes = options.scrollToQuotes === "true";
  },
  onReady() {
    if (this.scrollToQuotes) {
      setTimeout(() => {
        const query = common_vendor.index.createSelectorQuery().in(this);
        query.select(".quotes-card").boundingClientRect((data) => {
          common_vendor.index.pageScrollTo({
            scrollTop: data.top,
            duration: 300
          });
        }).exec();
      }, 500);
    }
  },
  methods: {
    async fetchProductDetail() {
      this.isLoading = true;
      try {
        this.product = {
          product_id: this.productId || "P1001",
          product_name: "智能手表 Pro Max",
          description: "多功能健康监测智能手表，支持心率、血压、血氧监测",
          product_image: "https://cdn.example.com/img/watch.jpg",
          warehouse: "上海仓",
          zipcode: "200001",
          length: 5.5,
          width: 4.2,
          height: 1.8,
          gross_weight: 0.35,
          package_weight: 0.15,
          chargeable_weight: 0.5,
          box_quantity: 50,
          // 装箱量
          unit_quantity: 200,
          // 单位数量
          total_quantity: 1e3,
          total_volume: 2.5,
          total_gross_weight: 350
        };
        this.quotes = this.generateMockQuotes();
      } catch (error) {
        common_vendor.index.showToast({ title: error.message || "获取产品详情失败", icon: "none" });
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 400);
      }
    },
    // 生成模拟报价数据
    generateMockQuotes() {
      const mockUsers = [
        { id: "U1001", name: "张三" },
        { id: "U1002", name: "李四" },
        { id: "U1003", name: "王五" },
        { id: "U1004", name: "赵六" },
        { id: "U1005", name: "钱七" }
      ];
      const statusOptions = ["pending", "approved", "rejected"];
      const quotes = [];
      for (let i = 0; i < 8; i++) {
        const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const price = Math.floor(40 + Math.random() * 20);
        const totalCost = price * this.product.total_gross_weight;
        quotes.push({
          quote_id: `Q${1e3 + i}`,
          user_id: user.id,
          user_name: user.name,
          product_id: this.productId,
          price_per_kg: price,
          delivery_time: `${Math.floor(5 + Math.random() * 10)}-${Math.floor(15 + Math.random() * 10)}天`,
          total_cost: totalCost,
          status: i < 3 ? "pending" : statusOptions[Math.floor(Math.random() * 3)],
          created_at: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1e3),
          remarks: i % 2 === 0 ? "这是一些额外的备注说明" : ""
        });
      }
      return quotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    formatDate(date) {
      return common_vendor.dayjs(date).format("YYYY-MM-DD HH:mm");
    },
    getStatusText(status) {
      const statusMap = {
        pending: "待审核",
        approved: "已通过",
        rejected: "已拒绝",
        expired: "已过期"
      };
      return statusMap[status] || status;
    },
    onStatusFilterChange(e) {
      this.statusFilterIndex = e.detail.value;
    },
    handleEdit() {
      common_vendor.index.navigateTo({ url: `/pages/admin/product/edit?id=${this.productId}` });
    },
    handleDelete() {
      common_vendor.index.showModal({
        title: "确认删除",
        content: `确定要删除产品「${this.product.product_name}」吗？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({ title: "已删除", icon: "success" });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1e3);
          }
        }
      });
    },
    handleApprove(quote) {
      common_vendor.index.showModal({
        title: "确认通过",
        content: `确定通过用户"${quote.user_name}"的报价？`,
        success: (res) => {
          if (res.confirm) {
            quote.status = "approved";
            common_vendor.index.showToast({ title: "已通过该报价", icon: "success" });
          }
        }
      });
    },
    handleReject(quote) {
      common_vendor.index.showModal({
        title: "确认拒绝",
        content: `确定拒绝用户"${quote.user_name}"的报价？`,
        success: (res) => {
          if (res.confirm) {
            quote.status = "rejected";
            common_vendor.index.showToast({ title: "已拒绝该报价", icon: "success" });
          }
        }
      });
    },
    viewQuoteDetail(quote) {
      common_vendor.index.navigateTo({
        url: `/pages/admin/quote/detail?quoteId=${quote.quote_id}&productId=${this.productId}&status=${quote.status}`
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
    c: $data.product.product_image || $data.defaultImg,
    d: common_vendor.t($data.product.product_name || "-"),
    e: common_vendor.t($data.product.description || "-"),
    f: common_vendor.t($data.product.product_id || "-"),
    g: common_vendor.t($data.product.warehouse || "-"),
    h: common_vendor.t($data.product.zipcode || "-"),
    i: common_vendor.t($data.product.length || "-"),
    j: common_vendor.t($data.product.width || "-"),
    k: common_vendor.t($data.product.height || "-"),
    l: common_vendor.t($data.product.gross_weight || "-"),
    m: common_vendor.t($data.product.package_weight || "-"),
    n: common_vendor.t($data.product.chargeable_weight || "-"),
    o: common_vendor.t($data.product.box_quantity || "-"),
    p: common_vendor.t($data.product.unit_quantity || "-"),
    q: common_vendor.t($data.product.total_quantity || "-"),
    r: common_vendor.t($data.product.total_volume || "-"),
    s: common_vendor.t($data.product.total_gross_weight || "-"),
    t: common_vendor.t($data.quotes.length),
    v: common_vendor.t($data.statusOptions[$data.statusFilterIndex]),
    w: $data.statusOptions,
    x: $data.statusFilterIndex,
    y: common_vendor.o((...args) => $options.onStatusFilterChange && $options.onStatusFilterChange(...args)),
    z: $options.filteredQuotes.length === 0
  }, $options.filteredQuotes.length === 0 ? {} : {
    A: common_vendor.f($options.filteredQuotes, (quote, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(quote.user_name),
        b: common_vendor.t($options.formatDate(quote.created_at)),
        c: common_vendor.t(quote.price_per_kg),
        d: common_vendor.t(quote.delivery_time),
        e: common_vendor.t(quote.total_cost),
        f: common_vendor.t($options.getStatusText(quote.status)),
        g: common_vendor.n(quote.status),
        h: quote.status === "pending"
      }, quote.status === "pending" ? {
        i: common_vendor.o(($event) => $options.handleApprove(quote), index)
      } : {}, {
        j: quote.status === "pending"
      }, quote.status === "pending" ? {
        k: common_vendor.o(($event) => $options.handleReject(quote), index)
      } : {}, {
        l: common_vendor.o(($event) => $options.viewQuoteDetail(quote), index),
        m: index,
        n: common_vendor.n(quote.status)
      });
    })
  }, {
    B: common_vendor.o((...args) => $options.handleDelete && $options.handleDelete(...args)),
    C: common_vendor.o((...args) => $options.handleEdit && $options.handleEdit(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5dbbcc34"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/product/detail.js.map
