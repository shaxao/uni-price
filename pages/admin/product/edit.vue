<template>
  <view class="admin-product-edit-container">
    <base-card class="form-card">
      <template #header>
        <view class="page-header">
          <text class="page-title">{{ isEdit ? '编辑产品' : '新增产品' }}</text>
        </view>
      </template>
      <view class="form-content">
        <base-input v-model="form.product_name" label="产品名称" placeholder="请输入产品名称" :error="errors.product_name" />
        <base-input v-model="form.product_id" label="产品编号" placeholder="请输入产品编号" :error="errors.product_id" :disabled="isEdit" />
        <base-input v-model="form.description" label="产品描述" placeholder="请输入产品描述" :error="errors.description" />
        <view class="form-row">
          <base-input v-model="form.length" label="长度(cm)" type="number" placeholder="" :error="errors.length" @input="autoCalc" />
          <base-input v-model="form.width" label="宽度(cm)" type="number" placeholder="" :error="errors.width" @input="autoCalc" />
          <base-input v-model="form.height" label="高度(cm)" type="number" placeholder="" :error="errors.height" @input="autoCalc" />
        </view>
        <view class="form-row">
          <base-input v-model="form.gross_weight" label="毛重(kg)" type="number" placeholder="" :error="errors.gross_weight" @input="autoCalc" />
          <base-input v-model="form.package_weight" label="箱体重(kg)" type="number" placeholder="自动计算" :error="errors.package_weight" disabled />
          <base-input v-model="form.chargeable_weight" label="计费重(kg)" type="number" placeholder="自动计算" :error="errors.chargeable_weight" disabled />
        </view>
        <view class="form-row">
          <base-input v-model="form.quantity" label="数量" type="number" placeholder="请输入数量" :error="errors.quantity" @input="autoCalc" />
          <base-input v-model="form.packing_quantity" label="装箱量" type="number" placeholder="请输入装箱量" :error="errors.packing_quantity" @input="autoCalc" />
          <base-input v-model="form.total_quantity" label="总件数" type="number" placeholder="请输入总件数" :error="errors.total_quantity" disabled />
        </view>
        <view class="form-row">
          <base-input v-model="form.total_volume" label="总体积(m³)" type="number" placeholder="自动计算" :error="errors.total_volume" disabled />
          <base-input v-model="form.total_gross_weight" label="总毛重(kg)" type="number" placeholder="自动计算" :error="errors.total_gross_weight" disabled />
        </view>
        <base-input v-model="form.warehouse" label="仓库地址" placeholder="请输入仓库地址" :error="errors.warehouse" />
        <base-input v-model="form.zipcode" label="邮编" placeholder="请输入邮编" :error="errors.zipcode" />
        <view class="form-row">
          <view class="form-label">产品图片</view>
          <view class="image-upload">
            <image v-if="form.product_image" :src="form.product_image" class="product-image-preview" />
            <button class="upload-btn" @click="chooseImage">上传图片</button>
          </view>
        </view>
        <view class="form-row">
          <view class="form-label">状态</view>
          <picker :range="statusOptions" :value="form.statusIndex" @change="onStatusChange">
            <view class="picker-value">{{ statusOptions[form.statusIndex] }}</view>
          </picker>
        </view>
      </view>
      <template #footer>
        <view class="form-footer">
          <button class="action-btn secondary" @click="handleCancel">取消</button>
          <button class="action-btn primary" @click="handleSubmit">{{ isEdit ? '保存修改' : '添加产品' }}</button>
        </view>
      </template>
    </base-card>
  </view>
</template>

<script>
import BaseCard from '../../../components/BaseCard.vue'
import BaseInput from '../../../components/BaseInput.vue'

export default {
  name: 'AdminProductEdit',
  components: { BaseCard, BaseInput },
  data() {
    return {
      isEdit: false,
      form: {
        product_id: '',
        product_name: '',
        description: '',
        product_image: '',
        length: '',
        width: '',
        height: '',
        gross_weight: '',
        package_weight: '',
        chargeable_weight: '',
        quantity: '',
        packing_quantity: '',
        total_quantity: '',
        total_volume: '',
        total_gross_weight: '',
        warehouse: '',
        zipcode: '',
        status: 'on',
        statusIndex: 0
      },
      statusOptions: ['上架', '下架'],
      errors: {}
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.isEdit = true
      // TODO: 这里应从后端或store获取产品详情，现用mock
      this.form = {
        product_id: options.id,
        product_name: '智能手表',
        description: '多功能健康监测智能手表',
        product_image: 'https://cdn.example.com/img/watch.jpg',
        length: 10,
        width: 5,
        height: 2,
        gross_weight: 0.2,
        package_weight: '',
        chargeable_weight: '',
        quantity: 10,
        packing_quantity: 12,
        total_quantity: '',
        total_volume: '',
        total_gross_weight: '',
        warehouse: '上海仓',
        zipcode: '200000',
        status: 'on',
        statusIndex: 0
      }
      this.autoCalc()
    }
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.form.product_image = res.tempFilePaths[0]
        }
      })
    },
    onStatusChange(e) {
      this.form.statusIndex = e.detail.value
      this.form.status = this.form.statusIndex === 0 ? 'on' : 'off'
    },
    autoCalc() {
      // 1. 箱体重 = 长*宽*高/6000
      const l = Number(this.form.length) || 0
      const w = Number(this.form.width) || 0
      const h = Number(this.form.height) || 0
      const gross = Number(this.form.gross_weight) || 0
      const quantity = Number(this.form.quantity) || 0
      const packing = Number(this.form.packing_quantity) || 0
      // 箱体重
      const packageWeight = l && w && h ? (l * w * h / 6000).toFixed(3) : ''
      this.form.package_weight = packageWeight
      // 计费重
      const chargeableWeight = packageWeight && gross ? Math.max(Number(packageWeight), gross).toFixed(3) : ''
      this.form.chargeable_weight = chargeableWeight
      // 总件数 = 数量*装箱量
      const totalQuantity = quantity && packing ? (quantity * packing) : ''
      this.form.total_quantity = totalQuantity
      // 总体积 = 长*宽*高*总件数/1000000
      const totalVolume = l && w && h && totalQuantity ? (l * w * h * totalQuantity / 1000000).toFixed(3) : ''
      this.form.total_volume = totalVolume
      // 总毛重 = 计费重*总件数
      const totalGrossWeight = chargeableWeight && totalQuantity ? (Number(chargeableWeight) * totalQuantity).toFixed(3) : ''
      this.form.total_gross_weight = totalGrossWeight
    },
    validateForm() {
      const errors = {}
      if (!this.form.product_name) errors.product_name = '请输入产品名称'
      if (!this.form.product_id) errors.product_id = '请输入产品编号'
      if (!this.form.description) errors.description = '请输入产品描述'
      if (!this.form.length) errors.length = '请输入长度'
      if (!this.form.width) errors.width = '请输入宽度'
      if (!this.form.height) errors.height = '请输入高度'
      if (!this.form.gross_weight) errors.gross_weight = '请输入毛重'
      if (!this.form.quantity) errors.quantity = '请输入数量'
      if (!this.form.packing_quantity) errors.packing_quantity = '请输入装箱量'
      if (!this.form.warehouse) errors.warehouse = '请输入仓库地址'
      if (!this.form.zipcode) errors.zipcode = '请输入邮编'
      this.errors = errors
      return Object.keys(errors).length === 0
    },
    handleSubmit() {
      if (!this.validateForm()) return
      // TODO: 保存到后端或store
      uni.showToast({ title: this.isEdit ? '修改成功' : '添加成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1200)
    },
    handleCancel() {
      uni.navigateBack()
    }
  },
  watch: {
    'form.length': 'autoCalc',
    'form.width': 'autoCalc',
    'form.height': 'autoCalc',
    'form.gross_weight': 'autoCalc',
    'form.quantity': 'autoCalc',
    'form.packing_quantity': 'autoCalc'
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/theme.scss';
.admin-product-edit-container {
  min-height: 100vh;
  background: $bg-secondary;
  padding: 40rpx 24rpx;
}
.form-card {
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.04);
  margin-bottom: 32rpx;
}
.page-header {
  padding: 36rpx 24rpx;
  .page-title {
    font-size: 38rpx;
    font-weight: bold;
    color: #222;
  }
}
.form-content {
  .form-row {
    display: flex;
    gap: 32rpx;
    margin-bottom: 32rpx;
    align-items: center;
    .form-label {
      font-size: 28rpx;
      color: #666;
      min-width: 120rpx;
    }
    .image-upload {
      display: flex;
      align-items: center;
      gap: 18rpx;
      .product-image-preview {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        object-fit: cover;
        background: #f5f5f5;
      }
      .upload-btn {
        height: 60rpx;
        padding: 0 24rpx;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        background: #1976d2;
        color: #fff;
        border: none;
      }
    }
    .picker-value {
      font-size: 28rpx;
      color: #1976d2;
      padding: 12rpx 24rpx;
      background: #f5f5f5;
      border-radius: 8rpx;
      min-width: 120rpx;
    }
  }
}
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 32rpx;
  margin-top: 32rpx;
  .action-btn {
    height: 80rpx;
    min-width: 160rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    &.secondary {
      background: #fbe9e7;
      color: #f44336;
      border: none;
    }
    &.primary {
      background: #1976d2;
      color: #fff;
      border: none;
    }
  }
}
</style> 