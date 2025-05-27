"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const BaseCard = () => "../../components/BaseCard.js";
const BaseInput = () => "../../components/BaseInput.js";
const LoadingAnimation = () => "../../components/LoadingAnimation.js";
const _sfc_main = {
  name: "QuoteCreate",
  components: {
    BaseCard,
    BaseInput,
    LoadingAnimation
  },
  data() {
    return {
      isLoading: false,
      submitLoading: false,
      productId: "",
      quote: {
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
    "quote.pricePerKg": {
      handler: "calculateTotalFreight",
      immediate: true
    },
    "quote.totalGrossWeight": {
      handler: "calculateTotalFreight",
      immediate: true
    },
    "quote.customsFee": {
      handler: "calculateTotalCost",
      immediate: true
    },
    "quote.totalFreight": {
      handler: "calculateTotalCost",
      immediate: true
    }
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/quote/create.vue:165", "接收到的参数：", options);
    this.productId = options.productId;
    if (options.totalGrossWeight) {
      this.quote.totalGrossWeight = options.totalGrossWeight;
      this.calculateTotalFreight();
    } else {
      common_vendor.index.showToast({
        title: "请从产品详情页进入",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    }
  },
  methods: {
    calculateTotalFreight() {
      if (this.quote.pricePerKg && this.quote.totalGrossWeight) {
        const totalFreight = Number(this.quote.pricePerKg) * Number(this.quote.totalGrossWeight);
        this.quote.totalFreight = totalFreight.toFixed(2);
        this.calculateTotalCost();
      }
    },
    calculateTotalCost() {
      if (this.quote.customsFee && this.quote.totalFreight) {
        const totalCost = Number(this.quote.customsFee) + Number(this.quote.totalFreight);
        this.quote.totalCost = totalCost.toFixed(2);
      }
    },
    validateForm() {
      const errors = {};
      if (!this.quote.forwarderName) {
        errors.forwarderName = "请输入货代公司名称";
      }
      if (!this.quote.shippingRoute) {
        errors.shippingRoute = "请输入出运线路";
      }
      if (!this.quote.deliveryTime) {
        errors.deliveryTime = "请输入时效";
      }
      if (!this.quote.pricePerKg) {
        errors.pricePerKg = "请输入每公斤报价";
      } else if (isNaN(this.quote.pricePerKg) || Number(this.quote.pricePerKg) <= 0) {
        errors.pricePerKg = "请输入有效的报价金额";
      }
      if (!this.quote.customsFee) {
        errors.customsFee = "请输入报关费用";
      } else if (isNaN(this.quote.customsFee) || Number(this.quote.customsFee) < 0) {
        errors.customsFee = "请输入有效的报关费用";
      }
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    handleCancel() {
      common_vendor.index.navigateBack();
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      this.submitLoading = true;
      try {
        const submitData = {
          productId: this.productId,
          forwarderName: this.quote.forwarderName,
          shippingRoute: this.quote.shippingRoute,
          deliveryTime: this.quote.deliveryTime,
          pricePerKg: Number(this.quote.pricePerKg),
          customsFee: Number(this.quote.customsFee),
          totalGrossWeight: Number(this.quote.totalGrossWeight),
          totalFreight: Number(this.quote.totalFreight),
          totalCost: Number(this.quote.totalCost),
          remark: this.quote.remark
        };
        await utils_request.post("/quotes", submitData);
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "提交失败",
          icon: "none"
        });
      } finally {
        this.submitLoading = false;
      }
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
      text: "加载中..."
    }),
    b: !$data.isLoading
  }, !$data.isLoading ? common_vendor.e({
    c: common_vendor.o(($event) => $data.quote.forwarderName = $event),
    d: common_vendor.p({
      label: "货代公司名称",
      placeholder: "请输入货代公司名称",
      error: $data.errors.forwarderName,
      modelValue: $data.quote.forwarderName
    }),
    e: common_vendor.o(($event) => $data.quote.shippingRoute = $event),
    f: common_vendor.p({
      label: "出运线路",
      placeholder: "请输入出运线路",
      error: $data.errors.shippingRoute,
      modelValue: $data.quote.shippingRoute
    }),
    g: common_vendor.o(($event) => $data.quote.deliveryTime = $event),
    h: common_vendor.p({
      label: "时效",
      placeholder: "请输入时效（如：3-5天）",
      error: $data.errors.deliveryTime,
      modelValue: $data.quote.deliveryTime
    }),
    i: common_vendor.o(($event) => $data.quote.pricePerKg = $event),
    j: common_vendor.p({
      label: "报价(元/kg)",
      type: "digit",
      placeholder: "请输入每公斤报价",
      error: $data.errors.pricePerKg,
      modelValue: $data.quote.pricePerKg
    }),
    k: common_vendor.o(($event) => $data.quote.customsFee = $event),
    l: common_vendor.p({
      label: "报关费用(元/票)",
      type: "digit",
      placeholder: "请输入报关费用",
      error: $data.errors.customsFee,
      modelValue: $data.quote.customsFee
    }),
    m: common_vendor.o(($event) => $data.quote.totalGrossWeight = $event),
    n: common_vendor.p({
      label: "总毛重(kg)",
      type: "digit",
      placeholder: "由产品详情自动带入",
      error: $data.errors.totalGrossWeight,
      disabled: true,
      modelValue: $data.quote.totalGrossWeight
    }),
    o: common_vendor.o(($event) => $data.quote.totalFreight = $event),
    p: common_vendor.p({
      label: "总运费(元)",
      type: "digit",
      placeholder: "自动计算",
      disabled: true,
      modelValue: $data.quote.totalFreight
    }),
    q: common_vendor.o(($event) => $data.quote.totalCost = $event),
    r: common_vendor.p({
      label: "总费用(元)",
      type: "digit",
      placeholder: "自动计算",
      disabled: true,
      modelValue: $data.quote.totalCost
    }),
    s: common_vendor.o(($event) => $data.quote.remark = $event),
    t: common_vendor.p({
      label: "备注",
      type: "textarea",
      placeholder: "请输入备注信息（选填）",
      error: $data.errors.remark,
      modelValue: $data.quote.remark
    }),
    v: common_vendor.t($data.quote.pricePerKg || 0),
    w: common_vendor.t($data.quote.customsFee || 0),
    x: common_vendor.t($data.quote.totalCost || 0),
    y: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args)),
    z: !$data.submitLoading
  }, !$data.submitLoading ? {} : {}, {
    A: common_vendor.t($data.submitLoading ? "提交中..." : "提交报价"),
    B: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    C: $data.submitLoading
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-00b539cc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quote/create.js.map
