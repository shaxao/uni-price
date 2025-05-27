"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const TabBar = () => "../../components/TabBar.js";
const _sfc_main = {
  components: {
    TabBar
  },
  data() {
    return {
      myQuotes: []
    };
  },
  onLoad() {
    this.fetchMyQuotes();
  },
  methods: {
    async fetchMyQuotes() {
      const res = await utils_request.get("/quotes?self=1");
      this.myQuotes = res.data || [];
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
    goDetail(quote) {
      common_vendor.index.navigateTo({
        url: `/pages/quote/detail?quoteId=${quote.quote_id}&productId=${quote.product_id}&status=${quote.status}`
      });
    },
    goToHome() {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    }
  }
};
if (!Array) {
  const _component_tab_bar = common_vendor.resolveComponent("tab-bar");
  _component_tab_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.myQuotes.length > 0
  }, $data.myQuotes.length > 0 ? {
    b: common_vendor.t($data.myQuotes.length)
  } : {}, {
    c: $data.myQuotes.length > 0
  }, $data.myQuotes.length > 0 ? {
    d: common_vendor.f($data.myQuotes, (quote, index, i0) => {
      return {
        a: common_vendor.t(quote.product_name),
        b: common_vendor.t(quote.delivery_time),
        c: common_vendor.t(quote.total_cost),
        d: common_vendor.t(quote.quote_date),
        e: common_vendor.t($options.getStatusText(quote.status)),
        f: common_vendor.n(quote.status),
        g: common_vendor.o(($event) => $options.goDetail(quote), quote.quote_id),
        h: quote.quote_id,
        i: index * 0.05 + "s"
      };
    })
  } : {}, {
    e: $data.myQuotes.length === 0
  }, $data.myQuotes.length === 0 ? {
    f: common_vendor.o((...args) => $options.goToHome && $options.goToHome(...args))
  } : {}, {
    g: common_vendor.p({
      ["current-tab"]: 1
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2cff2afb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quote/my.js.map
