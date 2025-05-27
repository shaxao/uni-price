"use strict";
const common_vendor = require("../../common/vendor.js");
const BaseCard = () => "../../components/BaseCard.js";
const BaseButton = () => "../../components/BaseButton.js";
const LoadingAnimation = () => "../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "QuoteDetail",
  components: {
    BaseCard,
    BaseButton,
    LoadingAnimation
  },
  data() {
    return {
      productId: "",
      quoteId: "",
      quoteStatus: "pending",
      quote: {
        status: "pending",
        product_name: "加载中...",
        delivery_time: "-",
        total_cost: 0,
        price_per_kg: 0,
        customs_fee: 0,
        total_gross_weight: 0,
        total_freight: 0,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: null
      },
      isLoading: true,
      hasError: false,
      errorMessage: "",
      statusIcons: {
        pending: "⏳",
        approved: "✅",
        rejected: "❌",
        expired: "⏱️",
        cancelled: "🚫"
      },
      statusMessages: {
        pending: {
          title: "您的报价正在审核中",
          desc: "正常情况下，我们会在1-2个工作日内完成审核。您可以在这期间修改或取消报价。"
        },
        approved: {
          title: "恭喜！您的报价已通过",
          desc: "您的报价已被接受，请联系客服安排后续事宜。"
        },
        rejected: {
          title: "很遗憾，报价未通过审核",
          desc: "您可以根据市场行情调整价格后再次提交报价。"
        },
        expired: {
          title: "此报价已过期",
          desc: "该产品的报价期限已过，您可以浏览其他产品或联系客服了解更多信息。"
        },
        cancelled: {
          title: "此报价已取消",
          desc: "您已取消了该报价，可以随时重新报价。"
        }
      }
    };
  },
  computed: {
    ...common_vendor.mapGetters("user", ["isAdmin"]),
    statusIndex() {
      const statusOrder = {
        pending: 1,
        approved: 2,
        rejected: 2,
        expired: 2,
        cancelled: 2
      };
      return statusOrder[this.quote.status] || 0;
    },
    statusTimeline() {
      return [
        { label: "提交报价", date: this.formatDate(this.quote.created_at, "MM-DD") },
        { label: "审核中", date: "" },
        {
          label: this.getStatusText(this.quote.status),
          date: this.quote.status !== "pending" ? this.formatDate(this.quote.updated_at || /* @__PURE__ */ new Date(), "MM-DD") : ""
        }
      ];
    }
  },
  onLoad(options) {
    this.productId = options.productId || "1";
    this.quoteId = options.quoteId || "1";
    this.quoteStatus = options.status || "pending";
    this.fetchQuoteDetail();
  },
  methods: {
    ...common_vendor.mapActions("quote", ["fetchQuote", "deleteQuote", "selectBestQuote"]),
    async fetchQuoteDetail() {
      this.isLoading = true;
      try {
        const mockData = {
          quote_id: this.quoteId,
          product_id: this.productId,
          product_name: "模拟商品" + this.productId,
          delivery_time: "30天",
          total_cost: 5e3,
          price_per_kg: 50,
          customs_fee: 500,
          total_gross_weight: 100,
          total_freight: 4500,
          status: this.quoteStatus || "pending",
          // 使用URL参数中的状态
          remark: "这是关于报价的一些额外说明和备注信息，包括一些关于产品和配送方面的特殊要求。",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3),
          // 3天前
          updated_at: this.quoteStatus !== "pending" ? /* @__PURE__ */ new Date() : null
        };
        this.quote = mockData;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/quote/detail.vue:301", "模拟数据处理失败:", error);
        this.hasError = true;
        this.errorMessage = "获取报价详情失败，请重试";
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    },
    handleEdit() {
      common_vendor.index.navigateTo({
        url: `/pages/quote/edit?productId=${this.productId}&quoteId=${this.quoteId}`
      });
    },
    handleReQuote() {
      common_vendor.index.navigateTo({
        url: `/pages/quote/create?productId=${this.productId}`
      });
    },
    goToHome() {
      common_vendor.index.switchTab({
        url: "/pages/index/index",
        fail: () => {
          common_vendor.index.reLaunch({ url: "/pages/index/index" });
        }
      });
    },
    goToMyQuotes() {
      common_vendor.index.navigateTo({
        url: "/pages/quote/my"
      });
    },
    handleContact() {
      common_vendor.index.showModal({
        title: "联系客服",
        content: "客服电话：400-123-4567\n工作时间：周一至周五 9:00-18:00",
        confirmText: "拨打",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.makePhoneCall({
              phoneNumber: "4001234567",
              fail: () => {
                common_vendor.index.showToast({
                  title: "拨打失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    },
    handleShare() {
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
        success: () => {
          common_vendor.index.showToast({
            title: "请点击右上角分享",
            icon: "none"
          });
        }
      });
    },
    formatDate(date, format = "YYYY-MM-DD HH:mm") {
      if (!date)
        return "-";
      return common_vendor.dayjs(date).format(format);
    },
    getStatusText(status) {
      const map = {
        pending: "审核中",
        approved: "已通过",
        rejected: "未通过",
        expired: "已过期",
        cancelled: "已取消"
      };
      return map[status] || status;
    },
    handleCancel() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消该报价吗？",
        success: (res) => {
          if (res.confirm) {
            this.quote.status = "cancelled";
            common_vendor.index.showLoading({
              title: "取消中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "报价已取消",
                icon: "success"
              });
            }, 800);
          }
        }
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
      text: "加载报价详情..."
    }),
    b: $data.hasError && !$data.isLoading
  }, $data.hasError && !$data.isLoading ? {
    c: common_vendor.t($data.errorMessage),
    d: common_vendor.o((...args) => $options.fetchQuoteDetail && $options.fetchQuoteDetail(...args))
  } : {}, {
    e: !$data.isLoading
  }, !$data.isLoading ? common_vendor.e({
    f: common_vendor.f($options.statusTimeline, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.label),
        b: item.date
      }, item.date ? {
        c: common_vendor.t(item.date)
      } : {}, {
        d: index,
        e: $options.statusIndex >= index ? 1 : "",
        f: $options.statusIndex === index ? 1 : ""
      });
    }),
    g: common_vendor.t($data.statusIcons[$data.quote.status]),
    h: common_vendor.t($options.getStatusText($data.quote.status)),
    i: common_vendor.n($data.quote.status),
    j: common_vendor.t($data.quote.product_name),
    k: common_vendor.t($data.quote.delivery_time),
    l: common_vendor.t($data.quote.total_gross_weight),
    m: common_vendor.t($data.quote.total_cost),
    n: common_vendor.t($data.quote.price_per_kg),
    o: common_vendor.t($data.quote.customs_fee),
    p: common_vendor.t($data.quote.total_freight),
    q: $data.quote.remark
  }, $data.quote.remark ? {
    r: common_vendor.t($data.quote.remark)
  } : {}, {
    s: common_vendor.t($data.statusIcons[$data.quote.status]),
    t: common_vendor.t($data.statusMessages[$data.quote.status].title),
    v: common_vendor.t($data.statusMessages[$data.quote.status].desc),
    w: common_vendor.n($data.quote.status),
    x: common_vendor.t($data.quoteId),
    y: common_vendor.t($options.formatDate($data.quote.created_at || /* @__PURE__ */ new Date())),
    z: $data.quote.status === "approved" || $data.quote.status === "rejected"
  }, $data.quote.status === "approved" || $data.quote.status === "rejected" ? {
    A: common_vendor.t($options.formatDate($data.quote.updated_at || /* @__PURE__ */ new Date()))
  } : {}, {
    B: $data.quote.status === "pending"
  }, $data.quote.status === "pending" ? {
    C: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args)),
    D: common_vendor.o((...args) => $options.handleEdit && $options.handleEdit(...args))
  } : $data.quote.status === "rejected" ? {
    F: common_vendor.o((...args) => $options.goToMyQuotes && $options.goToMyQuotes(...args)),
    G: common_vendor.o((...args) => $options.handleReQuote && $options.handleReQuote(...args))
  } : $data.quote.status === "approved" ? {
    I: common_vendor.o((...args) => $options.handleShare && $options.handleShare(...args)),
    J: common_vendor.o((...args) => $options.handleContact && $options.handleContact(...args))
  } : $data.quote.status === "expired" ? {
    L: common_vendor.o((...args) => $options.goToHome && $options.goToHome(...args)),
    M: common_vendor.o((...args) => $options.goToMyQuotes && $options.goToMyQuotes(...args))
  } : $data.quote.status === "cancelled" ? {
    O: common_vendor.o((...args) => $options.goToMyQuotes && $options.goToMyQuotes(...args)),
    P: common_vendor.o((...args) => $options.handleReQuote && $options.handleReQuote(...args))
  } : {}, {
    E: $data.quote.status === "rejected",
    H: $data.quote.status === "approved",
    K: $data.quote.status === "expired",
    N: $data.quote.status === "cancelled",
    Q: common_vendor.n($data.quote.status)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9ac2b0fc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quote/detail.js.map
