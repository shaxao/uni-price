"use strict";
const common_vendor = require("../../../common/vendor.js");
const BaseCard = () => "../../../components/BaseCard.js";
const BaseInput = () => "../../../components/BaseInput.js";
const _sfc_main = {
  name: "AdminProductEdit",
  components: { BaseCard, BaseInput },
  data() {
    return {
      isEdit: false,
      form: {
        product_id: "",
        product_name: "",
        description: "",
        product_image: "",
        length: "",
        width: "",
        height: "",
        gross_weight: "",
        package_weight: "",
        chargeable_weight: "",
        quantity: "",
        packing_quantity: "",
        total_quantity: "",
        total_volume: "",
        total_gross_weight: "",
        warehouse: "",
        zipcode: "",
        status: "on",
        statusIndex: 0
      },
      statusOptions: ["上架", "下架"],
      errors: {}
    };
  },
  onLoad(options) {
    if (options && options.id) {
      this.isEdit = true;
      this.form = {
        product_id: options.id,
        product_name: "智能手表",
        description: "多功能健康监测智能手表",
        product_image: "https://cdn.example.com/img/watch.jpg",
        length: 10,
        width: 5,
        height: 2,
        gross_weight: 0.2,
        package_weight: "",
        chargeable_weight: "",
        quantity: 10,
        packing_quantity: 12,
        total_quantity: "",
        total_volume: "",
        total_gross_weight: "",
        warehouse: "上海仓",
        zipcode: "200000",
        status: "on",
        statusIndex: 0
      };
      this.autoCalc();
    }
  },
  methods: {
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.form.product_image = res.tempFilePaths[0];
        }
      });
    },
    onStatusChange(e) {
      this.form.statusIndex = e.detail.value;
      this.form.status = this.form.statusIndex === 0 ? "on" : "off";
    },
    autoCalc() {
      const l = Number(this.form.length) || 0;
      const w = Number(this.form.width) || 0;
      const h = Number(this.form.height) || 0;
      const gross = Number(this.form.gross_weight) || 0;
      const quantity = Number(this.form.quantity) || 0;
      const packing = Number(this.form.packing_quantity) || 0;
      const packageWeight = l && w && h ? (l * w * h / 6e3).toFixed(3) : "";
      this.form.package_weight = packageWeight;
      const chargeableWeight = packageWeight && gross ? Math.max(Number(packageWeight), gross).toFixed(3) : "";
      this.form.chargeable_weight = chargeableWeight;
      const totalQuantity = quantity && packing ? quantity * packing : "";
      this.form.total_quantity = totalQuantity;
      const totalVolume = l && w && h && totalQuantity ? (l * w * h * totalQuantity / 1e6).toFixed(3) : "";
      this.form.total_volume = totalVolume;
      const totalGrossWeight = chargeableWeight && totalQuantity ? (Number(chargeableWeight) * totalQuantity).toFixed(3) : "";
      this.form.total_gross_weight = totalGrossWeight;
    },
    validateForm() {
      const errors = {};
      if (!this.form.product_name)
        errors.product_name = "请输入产品名称";
      if (!this.form.product_id)
        errors.product_id = "请输入产品编号";
      if (!this.form.description)
        errors.description = "请输入产品描述";
      if (!this.form.length)
        errors.length = "请输入长度";
      if (!this.form.width)
        errors.width = "请输入宽度";
      if (!this.form.height)
        errors.height = "请输入高度";
      if (!this.form.gross_weight)
        errors.gross_weight = "请输入毛重";
      if (!this.form.quantity)
        errors.quantity = "请输入数量";
      if (!this.form.packing_quantity)
        errors.packing_quantity = "请输入装箱量";
      if (!this.form.warehouse)
        errors.warehouse = "请输入仓库地址";
      if (!this.form.zipcode)
        errors.zipcode = "请输入邮编";
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    handleSubmit() {
      if (!this.validateForm())
        return;
      common_vendor.index.showToast({ title: this.isEdit ? "修改成功" : "添加成功", icon: "success" });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1200);
    },
    handleCancel() {
      common_vendor.index.navigateBack();
    }
  },
  watch: {
    "form.length": "autoCalc",
    "form.width": "autoCalc",
    "form.height": "autoCalc",
    "form.gross_weight": "autoCalc",
    "form.quantity": "autoCalc",
    "form.packing_quantity": "autoCalc"
  }
};
if (!Array) {
  const _component_base_input = common_vendor.resolveComponent("base-input");
  const _component_base_card = common_vendor.resolveComponent("base-card");
  (_component_base_input + _component_base_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.isEdit ? "编辑产品" : "新增产品"),
    b: common_vendor.o(($event) => $data.form.product_name = $event),
    c: common_vendor.p({
      label: "产品名称",
      placeholder: "请输入产品名称",
      error: $data.errors.product_name,
      modelValue: $data.form.product_name
    }),
    d: common_vendor.o(($event) => $data.form.product_id = $event),
    e: common_vendor.p({
      label: "产品编号",
      placeholder: "请输入产品编号",
      error: $data.errors.product_id,
      disabled: $data.isEdit,
      modelValue: $data.form.product_id
    }),
    f: common_vendor.o(($event) => $data.form.description = $event),
    g: common_vendor.p({
      label: "产品描述",
      placeholder: "请输入产品描述",
      error: $data.errors.description,
      modelValue: $data.form.description
    }),
    h: common_vendor.o($options.autoCalc),
    i: common_vendor.o(($event) => $data.form.length = $event),
    j: common_vendor.p({
      label: "长度(cm)",
      type: "number",
      placeholder: "",
      error: $data.errors.length,
      modelValue: $data.form.length
    }),
    k: common_vendor.o($options.autoCalc),
    l: common_vendor.o(($event) => $data.form.width = $event),
    m: common_vendor.p({
      label: "宽度(cm)",
      type: "number",
      placeholder: "",
      error: $data.errors.width,
      modelValue: $data.form.width
    }),
    n: common_vendor.o($options.autoCalc),
    o: common_vendor.o(($event) => $data.form.height = $event),
    p: common_vendor.p({
      label: "高度(cm)",
      type: "number",
      placeholder: "",
      error: $data.errors.height,
      modelValue: $data.form.height
    }),
    q: common_vendor.o($options.autoCalc),
    r: common_vendor.o(($event) => $data.form.gross_weight = $event),
    s: common_vendor.p({
      label: "毛重(kg)",
      type: "number",
      placeholder: "",
      error: $data.errors.gross_weight,
      modelValue: $data.form.gross_weight
    }),
    t: common_vendor.o(($event) => $data.form.package_weight = $event),
    v: common_vendor.p({
      label: "箱体重(kg)",
      type: "number",
      placeholder: "自动计算",
      error: $data.errors.package_weight,
      disabled: true,
      modelValue: $data.form.package_weight
    }),
    w: common_vendor.o(($event) => $data.form.chargeable_weight = $event),
    x: common_vendor.p({
      label: "计费重(kg)",
      type: "number",
      placeholder: "自动计算",
      error: $data.errors.chargeable_weight,
      disabled: true,
      modelValue: $data.form.chargeable_weight
    }),
    y: common_vendor.o($options.autoCalc),
    z: common_vendor.o(($event) => $data.form.quantity = $event),
    A: common_vendor.p({
      label: "数量",
      type: "number",
      placeholder: "请输入数量",
      error: $data.errors.quantity,
      modelValue: $data.form.quantity
    }),
    B: common_vendor.o($options.autoCalc),
    C: common_vendor.o(($event) => $data.form.packing_quantity = $event),
    D: common_vendor.p({
      label: "装箱量",
      type: "number",
      placeholder: "请输入装箱量",
      error: $data.errors.packing_quantity,
      modelValue: $data.form.packing_quantity
    }),
    E: common_vendor.o(($event) => $data.form.total_quantity = $event),
    F: common_vendor.p({
      label: "总件数",
      type: "number",
      placeholder: "请输入总件数",
      error: $data.errors.total_quantity,
      disabled: true,
      modelValue: $data.form.total_quantity
    }),
    G: common_vendor.o(($event) => $data.form.total_volume = $event),
    H: common_vendor.p({
      label: "总体积(m³)",
      type: "number",
      placeholder: "自动计算",
      error: $data.errors.total_volume,
      disabled: true,
      modelValue: $data.form.total_volume
    }),
    I: common_vendor.o(($event) => $data.form.total_gross_weight = $event),
    J: common_vendor.p({
      label: "总毛重(kg)",
      type: "number",
      placeholder: "自动计算",
      error: $data.errors.total_gross_weight,
      disabled: true,
      modelValue: $data.form.total_gross_weight
    }),
    K: common_vendor.o(($event) => $data.form.warehouse = $event),
    L: common_vendor.p({
      label: "仓库地址",
      placeholder: "请输入仓库地址",
      error: $data.errors.warehouse,
      modelValue: $data.form.warehouse
    }),
    M: common_vendor.o(($event) => $data.form.zipcode = $event),
    N: common_vendor.p({
      label: "邮编",
      placeholder: "请输入邮编",
      error: $data.errors.zipcode,
      modelValue: $data.form.zipcode
    }),
    O: $data.form.product_image
  }, $data.form.product_image ? {
    P: $data.form.product_image
  } : {}, {
    Q: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    R: common_vendor.t($data.statusOptions[$data.form.statusIndex]),
    S: $data.statusOptions,
    T: $data.form.statusIndex,
    U: common_vendor.o((...args) => $options.onStatusChange && $options.onStatusChange(...args)),
    V: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args)),
    W: common_vendor.t($data.isEdit ? "保存修改" : "添加产品"),
    X: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4b7c562a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/product/edit.js.map
