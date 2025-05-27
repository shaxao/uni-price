"use strict";
const common_vendor = require("../../../common/vendor.js");
const BaseCard = () => "../../../components/BaseCard.js";
const BaseButton = () => "../../../components/BaseButton.js";
const LoadingAnimation = () => "../../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "AdminQuoteDetail",
  components: {
    BaseCard,
    BaseButton,
    LoadingAnimation
  },
  data() {
    return {
      quoteId: "",
      productId: "",
      quote: {
        user_id: "",
        user_name: "",
        product_id: "",
        product_name: "",
        status: "pending",
        forwarder_name: "",
        shipping_route: "",
        delivery_time: "",
        price_per_kg: 0,
        total_gross_weight: 0,
        total_freight: 0,
        customs_fee: 0,
        total_cost: 0,
        remark: "",
        created_at: /* @__PURE__ */ new Date(),
        updated_at: null,
        reviewer: ""
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
          title: "待审核",
          desc: "该报价正在等待审核，您可以选择通过或拒绝。"
        },
        approved: {
          title: "已通过",
          desc: "您已经通过了该报价，用户可以查看并继续后续流程。"
        },
        rejected: {
          title: "已拒绝",
          desc: "您已拒绝了该报价，用户可以查看拒绝原因并重新提交。"
        },
        expired: {
          title: "已过期",
          desc: "该报价已过期，不需要进一步操作。"
        },
        cancelled: {
          title: "已取消",
          desc: "用户已取消了该报价，不需要进一步操作。"
        }
      }
    };
  },
  onLoad(options) {
    this.quoteId = options.quoteId || "";
    this.productId = options.productId || "";
    this.fetchQuoteDetail();
  },
  methods: {
    async fetchQuoteDetail() {
      this.isLoading = true;
      this.hasError = false;
      try {
        setTimeout(() => {
          const mockData = {
            quote_id: this.quoteId || "Q10001",
            user_id: "U1002",
            user_name: "李四",
            product_id: this.productId || "P1001",
            product_name: "智能手表 Pro Max",
            status: "pending",
            forwarder_name: "环球快递",
            shipping_route: "上海 - 洛杉矶",
            delivery_time: "15-20天",
            price_per_kg: 45,
            total_gross_weight: 350,
            total_freight: 15750,
            customs_fee: 500,
            total_cost: 16250,
            remark: "需要特殊包装，请在运输过程中注意防震。",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3),
            // 2天前
            updated_at: null,
            reviewer: ""
          };
          this.quote = mockData;
          this.isLoading = false;
        }, 800);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/admin/quote/detail.vue:263", "获取报价详情失败:", error);
        this.hasError = true;
        this.errorMessage = "获取报价详情失败，请重试";
        this.isLoading = false;
      }
    },
    formatDate(date) {
      if (!date)
        return "-";
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
    handleApprove() {
      common_vendor.index.showModal({
        title: "确认通过",
        content: "确定要通过该报价吗？通过后将通知用户。",
        success: (res) => {
          if (res.confirm) {
            this.quote.status = "approved";
            this.quote.updated_at = /* @__PURE__ */ new Date();
            this.quote.reviewer = "管理员";
            common_vendor.index.showToast({
              title: "已通过该报价",
              icon: "success"
            });
          }
        }
      });
    },
    handleReject() {
      common_vendor.index.showModal({
        title: "拒绝报价",
        content: "确定要拒绝该报价吗？拒绝后将通知用户。",
        success: (res) => {
          if (res.confirm) {
            this.quote.status = "rejected";
            this.quote.updated_at = /* @__PURE__ */ new Date();
            this.quote.reviewer = "管理员";
            common_vendor.index.showToast({
              title: "已拒绝该报价",
              icon: "success"
            });
          }
        }
      });
    },
    handleGoBack() {
      common_vendor.index.navigateBack();
    },
    handleContact() {
      common_vendor.index.showModal({
        title: "联系用户",
        content: `是否联系用户 ${this.quote.user_name}？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "已发送消息给用户",
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
    f: common_vendor.t($data.statusIcons[$data.quote.status]),
    g: common_vendor.t($options.getStatusText($data.quote.status)),
    h: common_vendor.t($data.statusMessages[$data.quote.status].desc),
    i: common_vendor.n($data.quote.status),
    j: common_vendor.t($data.quote.user_name),
    k: common_vendor.t($data.quote.user_id),
    l: common_vendor.t($options.formatDate($data.quote.created_at)),
    m: common_vendor.t($data.quote.product_name),
    n: common_vendor.t($data.quote.product_id),
    o: common_vendor.t($data.quote.forwarder_name),
    p: common_vendor.t($data.quote.shipping_route),
    q: common_vendor.t($data.quote.delivery_time),
    r: common_vendor.t($data.quote.price_per_kg),
    s: common_vendor.t($data.quote.total_gross_weight),
    t: common_vendor.t($data.quote.total_freight),
    v: common_vendor.t($data.quote.customs_fee),
    w: common_vendor.t($data.quote.total_cost),
    x: $data.quote.remark
  }, $data.quote.remark ? {
    y: common_vendor.t($data.quote.remark)
  } : {}, {
    z: common_vendor.t($data.quoteId),
    A: common_vendor.t($options.formatDate($data.quote.created_at)),
    B: $data.quote.status === "approved" || $data.quote.status === "rejected"
  }, $data.quote.status === "approved" || $data.quote.status === "rejected" ? {
    C: common_vendor.t($options.formatDate($data.quote.updated_at))
  } : {}, {
    D: $data.quote.status === "approved" || $data.quote.status === "rejected"
  }, $data.quote.status === "approved" || $data.quote.status === "rejected" ? {
    E: common_vendor.t($data.quote.reviewer || "系统管理员")
  } : {}, {
    F: $data.quote.status === "pending"
  }, $data.quote.status === "pending" ? {
    G: common_vendor.o((...args) => $options.handleReject && $options.handleReject(...args)),
    H: common_vendor.o((...args) => $options.handleApprove && $options.handleApprove(...args))
  } : {
    I: common_vendor.o((...args) => $options.handleGoBack && $options.handleGoBack(...args)),
    J: common_vendor.o((...args) => $options.handleContact && $options.handleContact(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ded00edc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/quote/detail.js.map
