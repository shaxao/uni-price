"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const BaseCard = () => "../../components/BaseCard.js";
const BaseButton = () => "../../components/BaseButton.js";
const BaseInput = () => "../../components/BaseInput.js";
const LoadingAnimation = () => "../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "QuoteEdit",
  components: {
    BaseCard,
    BaseButton,
    BaseInput,
    LoadingAnimation
  },
  data() {
    return {
      quoteId: "",
      isLoading: true,
      submitLoading: false,
      form: {
        forwarderName: "",
        shippingRoute: "",
        deliveryTime: "",
        pricePerKg: "",
        customsFee: "",
        totalGrossWeight: "",
        totalFreight: "",
        totalCost: "",
        remark: ""
      },
      errors: {}
    };
  },
  watch: {
    "form.pricePerKg": {
      handler: "calculateTotal",
      immediate: true
    },
    "form.customsFee": {
      handler: "calculateTotal",
      immediate: true
    }
  },
  onLoad(options) {
    this.quoteId = options.quoteId;
    this.fetchQuoteDetail();
  },
  methods: {
    async fetchQuoteDetail() {
      this.isLoading = true;
      try {
        const res = await utils_request.get(`/quotes/${this.quoteId}`);
        const quote = res.data;
        this.form = {
          forwarderName: quote.forwarder_name,
          shippingRoute: quote.shipping_route,
          deliveryTime: quote.delivery_time,
          pricePerKg: quote.price_per_kg,
          customsFee: quote.customs_fee,
          totalGrossWeight: quote.total_gross_weight,
          totalFreight: quote.total_freight,
          totalCost: quote.total_cost,
          remark: quote.remark || ""
        };
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "获取报价详情失败",
          icon: "none"
        });
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    },
    calculateTotal() {
      const { pricePerKg, customsFee, totalGrossWeight } = this.form;
      if (pricePerKg && totalGrossWeight) {
        this.form.totalFreight = (Number(pricePerKg) * Number(totalGrossWeight)).toFixed(2);
      }
      if (this.form.totalFreight && customsFee) {
        this.form.totalCost = (Number(this.form.totalFreight) + Number(customsFee)).toFixed(2);
      }
    },
    validateForm() {
      const errors = {};
      if (!this.form.forwarderName) {
        errors.forwarderName = "请输入货代公司名称";
      }
      if (!this.form.shippingRoute) {
        errors.shippingRoute = "请输入出运线路";
      }
      if (!this.form.deliveryTime) {
        errors.deliveryTime = "请输入时效";
      }
      if (!this.form.pricePerKg) {
        errors.pricePerKg = "请输入每公斤报价";
      } else if (isNaN(this.form.pricePerKg) || Number(this.form.pricePerKg) <= 0) {
        errors.pricePerKg = "请输入有效的报价金额";
      }
      if (!this.form.customsFee) {
        errors.customsFee = "请输入报关费用";
      } else if (isNaN(this.form.customsFee) || Number(this.form.customsFee) < 0) {
        errors.customsFee = "请输入有效的报关费用";
      }
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      this.submitLoading = true;
      try {
        await utils_request.put(`/quotes/${this.quoteId}`, this.form);
        common_vendor.index.showToast({
          title: "修改成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "修改失败",
          icon: "none"
        });
      } finally {
        this.submitLoading = false;
      }
    },
    handleCancel() {
      common_vendor.index.navigateBack();
    }
  }
};
if (!Array) {
  const _component_loading_animation = common_vendor.resolveComponent("loading-animation");
  const _component_base_input = common_vendor.resolveComponent("base-input");
  const _component_base_card = common_vendor.resolveComponent("base-card");
  (_component_loading_animation + _component_base_input + _component_base_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      loading: $data.isLoading,
      text: "加载报价数据..."
    }),
    b: !$data.isLoading
  }, !$data.isLoading ? common_vendor.e({
    c: common_vendor.o(($event) => $data.form.forwarderName = $event),
    d: common_vendor.p({
      label: "货代公司名称",
      placeholder: "请输入货代公司名称",
      error: $data.errors.forwarderName,
      modelValue: $data.form.forwarderName
    }),
    e: common_vendor.o(($event) => $data.form.shippingRoute = $event),
    f: common_vendor.p({
      label: "出运线路",
      placeholder: "请输入出运线路",
      error: $data.errors.shippingRoute,
      modelValue: $data.form.shippingRoute
    }),
    g: common_vendor.o(($event) => $data.form.deliveryTime = $event),
    h: common_vendor.p({
      label: "时效",
      placeholder: "请输入时效（如：3-5天）",
      error: $data.errors.deliveryTime,
      modelValue: $data.form.deliveryTime
    }),
    i: common_vendor.o(($event) => $data.form.pricePerKg = $event),
    j: common_vendor.p({
      label: "报价(元/kg)",
      type: "digit",
      placeholder: "请输入每公斤报价",
      error: $data.errors.pricePerKg,
      modelValue: $data.form.pricePerKg
    }),
    k: common_vendor.o(($event) => $data.form.customsFee = $event),
    l: common_vendor.p({
      label: "报关费用(元/票)",
      type: "digit",
      placeholder: "请输入报关费用",
      error: $data.errors.customsFee,
      modelValue: $data.form.customsFee
    }),
    m: common_vendor.o(($event) => $data.form.totalGrossWeight = $event),
    n: common_vendor.p({
      label: "总毛重(kg)",
      type: "digit",
      placeholder: "",
      error: $data.errors.totalGrossWeight,
      disabled: true,
      modelValue: $data.form.totalGrossWeight
    }),
    o: common_vendor.o(($event) => $data.form.totalFreight = $event),
    p: common_vendor.p({
      label: "总运费(元)",
      type: "digit",
      placeholder: "自动计算",
      disabled: true,
      modelValue: $data.form.totalFreight
    }),
    q: common_vendor.o(($event) => $data.form.totalCost = $event),
    r: common_vendor.p({
      label: "总费用(元)",
      type: "digit",
      placeholder: "自动计算",
      disabled: true,
      modelValue: $data.form.totalCost
    }),
    s: common_vendor.o(($event) => $data.form.remark = $event),
    t: common_vendor.p({
      label: "备注",
      type: "textarea",
      placeholder: "请输入备注信息（选填）",
      error: $data.errors.remark,
      modelValue: $data.form.remark
    }),
    v: common_vendor.t($data.form.pricePerKg || 0),
    w: common_vendor.t($data.form.customsFee || 0),
    x: common_vendor.t($data.form.totalCost || 0),
    y: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args)),
    z: !$data.submitLoading
  }, !$data.submitLoading ? {} : {}, {
    A: $data.submitLoading
  }, $data.submitLoading ? {} : {}, {
    B: common_vendor.t($data.submitLoading ? "保存中..." : "保存修改"),
    C: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    D: $data.submitLoading
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-57414b5d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quote/edit.js.map
