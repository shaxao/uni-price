"use strict";
const common_vendor = require("../../common/vendor.js");
const BaseCard = () => "../../components/BaseCard.js";
const BaseButton = () => "../../components/BaseButton.js";
const BaseInput = () => "../../components/BaseInput.js";
const _sfc_main = {
  name: "ProductCreate",
  components: {
    BaseCard,
    BaseButton,
    BaseInput
  },
  data() {
    return {
      loading: false,
      form: {
        name: "",
        description: "",
        length: "",
        width: "",
        height: "",
        grossWeight: "",
        packageWeight: "",
        chargeableWeight: "",
        totalQuantity: "",
        totalVolume: "",
        totalGrossWeight: "",
        warehouse: "",
        zipcode: "",
        expiryDate: ""
      },
      errors: {}
    };
  },
  computed: {
    minDate() {
      return common_vendor.dayjs().format("YYYY-MM-DD");
    },
    maxDate() {
      return common_vendor.dayjs().add(1, "year").format("YYYY-MM-DD");
    }
  },
  methods: {
    ...common_vendor.mapActions("product", ["createProduct"]),
    handleDateChange(e) {
      this.form.expiryDate = e.detail.value;
    },
    validateForm() {
      const errors = {};
      if (!this.form.name) {
        errors.name = "请输入产品名称";
      }
      if (!this.form.description) {
        errors.description = "请输入产品描述";
      }
      if (!this.form.length) {
        errors.length = "请输入长度";
      }
      if (!this.form.width) {
        errors.width = "请输入宽度";
      }
      if (!this.form.height) {
        errors.height = "请输入高度";
      }
      if (!this.form.grossWeight) {
        errors.grossWeight = "请输入毛重";
      }
      if (!this.form.packageWeight) {
        errors.packageWeight = "请输入箱体重";
      }
      if (!this.form.chargeableWeight) {
        errors.chargeableWeight = "请输入计费重";
      }
      if (!this.form.totalQuantity) {
        errors.totalQuantity = "请输入总件数";
      }
      if (!this.form.totalVolume) {
        errors.totalVolume = "请输入总体积";
      }
      if (!this.form.totalGrossWeight) {
        errors.totalGrossWeight = "请输入总毛重";
      }
      if (!this.form.warehouse) {
        errors.warehouse = "请输入仓库地址";
      }
      if (!this.form.zipcode) {
        errors.zipcode = "请输入邮编";
      }
      if (!this.form.expiryDate) {
        errors.expiryDate = "请选择截止日期";
      }
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      this.loading = true;
      try {
        await this.createProduct(this.form);
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "发布失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    handleCancel() {
      common_vendor.index.navigateBack();
    }
  }
};
if (!Array) {
  const _component_base_input = common_vendor.resolveComponent("base-input");
  const _component_base_button = common_vendor.resolveComponent("base-button");
  const _component_base_card = common_vendor.resolveComponent("base-card");
  (_component_base_input + _component_base_button + _component_base_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.form.name = $event),
    b: common_vendor.p({
      label: "产品名称",
      placeholder: "请输入产品名称",
      error: $data.errors.name,
      modelValue: $data.form.name
    }),
    c: common_vendor.o(($event) => $data.form.description = $event),
    d: common_vendor.p({
      label: "产品描述",
      placeholder: "请输入产品描述",
      error: $data.errors.description,
      modelValue: $data.form.description
    }),
    e: common_vendor.o(($event) => $data.form.length = $event),
    f: common_vendor.p({
      label: "长度(cm)",
      type: "number",
      placeholder: "请输入长度",
      error: $data.errors.length,
      modelValue: $data.form.length
    }),
    g: common_vendor.o(($event) => $data.form.width = $event),
    h: common_vendor.p({
      label: "宽度(cm)",
      type: "number",
      placeholder: "请输入宽度",
      error: $data.errors.width,
      modelValue: $data.form.width
    }),
    i: common_vendor.o(($event) => $data.form.height = $event),
    j: common_vendor.p({
      label: "高度(cm)",
      type: "number",
      placeholder: "请输入高度",
      error: $data.errors.height,
      modelValue: $data.form.height
    }),
    k: common_vendor.o(($event) => $data.form.grossWeight = $event),
    l: common_vendor.p({
      label: "毛重(kg)",
      type: "number",
      placeholder: "请输入毛重",
      error: $data.errors.grossWeight,
      modelValue: $data.form.grossWeight
    }),
    m: common_vendor.o(($event) => $data.form.packageWeight = $event),
    n: common_vendor.p({
      label: "箱体重(kg)",
      type: "number",
      placeholder: "请输入箱体重",
      error: $data.errors.packageWeight,
      modelValue: $data.form.packageWeight
    }),
    o: common_vendor.o(($event) => $data.form.chargeableWeight = $event),
    p: common_vendor.p({
      label: "计费重(kg)",
      type: "number",
      placeholder: "请输入计费重",
      error: $data.errors.chargeableWeight,
      modelValue: $data.form.chargeableWeight
    }),
    q: common_vendor.o(($event) => $data.form.totalQuantity = $event),
    r: common_vendor.p({
      label: "总件数",
      type: "number",
      placeholder: "请输入总件数",
      error: $data.errors.totalQuantity,
      modelValue: $data.form.totalQuantity
    }),
    s: common_vendor.o(($event) => $data.form.totalVolume = $event),
    t: common_vendor.p({
      label: "总体积(m³)",
      type: "number",
      placeholder: "请输入总体积",
      error: $data.errors.totalVolume,
      modelValue: $data.form.totalVolume
    }),
    v: common_vendor.o(($event) => $data.form.totalGrossWeight = $event),
    w: common_vendor.p({
      label: "总毛重(kg)",
      type: "number",
      placeholder: "",
      error: $data.errors.totalGrossWeight,
      modelValue: $data.form.totalGrossWeight
    }),
    x: common_vendor.o(($event) => $data.form.warehouse = $event),
    y: common_vendor.p({
      label: "仓库地址",
      placeholder: "请输入仓库地址",
      error: $data.errors.warehouse,
      modelValue: $data.form.warehouse
    }),
    z: common_vendor.o(($event) => $data.form.zipcode = $event),
    A: common_vendor.p({
      label: "邮编",
      placeholder: "请输入邮编",
      error: $data.errors.zipcode,
      modelValue: $data.form.zipcode
    }),
    B: common_vendor.t($data.form.expiryDate || "请选择截止日期"),
    C: $data.form.expiryDate,
    D: $options.minDate,
    E: $options.maxDate,
    F: common_vendor.o((...args) => $options.handleDateChange && $options.handleDateChange(...args)),
    G: $data.errors.expiryDate
  }, $data.errors.expiryDate ? {
    H: common_vendor.t($data.errors.expiryDate)
  } : {}, {
    I: common_vendor.o($options.handleCancel),
    J: common_vendor.p({
      type: "secondary"
    }),
    K: common_vendor.o($options.handleSubmit),
    L: common_vendor.p({
      type: "primary",
      loading: $data.loading
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5f2e7316"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/create.js.map
