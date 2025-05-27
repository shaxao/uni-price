<template>
  <view class="edit-container">
    <loading-animation :loading="isLoading" text="加载中..." />
    <view class="content-wrapper" v-if="!isLoading">
    <base-card class="form-card">
      <template #header>
          <view class="page-header">
            <text class="page-title">提交报价</text>
            <text class="page-subtitle">请填写您的运输报价信息</text>
          </view>
      </template>
      <view class="form-content">
        <base-input
            v-model="quote.forwarderName"
          label="货代公司名称"
          placeholder="请输入货代公司名称"
          :error="errors.forwarderName"
        />
        <base-input
            v-model="quote.shippingRoute"
          label="出运线路"
          placeholder="请输入出运线路"
          :error="errors.shippingRoute"
        />
        <base-input
            v-model="quote.deliveryTime"
          label="时效"
          placeholder="请输入时效（如：3-5天）"
          :error="errors.deliveryTime"
        />
        <view class="form-row">
          <base-input
              v-model="quote.pricePerKg"
            label="报价(元/kg)"
            type="digit"
            placeholder="请输入每公斤报价"
            :error="errors.pricePerKg"
          />
          <base-input
              v-model="quote.customsFee"
            label="报关费用(元/票)"
            type="digit"
            placeholder="请输入报关费用"
            :error="errors.customsFee"
          />
        </view>
        <view class="form-row">
          <base-input
              v-model="quote.totalGrossWeight"
            label="总毛重(kg)"
            type="digit"
              placeholder="由产品详情自动带入"
            :error="errors.totalGrossWeight"
            disabled
          />
          <base-input
              v-model="quote.totalFreight"
            label="总运费(元)"
            type="digit"
            placeholder="自动计算"
            disabled
          />
          <base-input
              v-model="quote.totalCost"
            label="总费用(元)"
            type="digit"
            placeholder="自动计算"
            disabled
          />
        </view>
        <base-input
            v-model="quote.remark"
          label="备注"
          type="textarea"
          placeholder="请输入备注信息（选填）"
          :error="errors.remark"
        />
      </view>
      </base-card>

      <!-- 费用摘要卡片 -->
      <view class="summary-card">
        <view class="summary-title">费用摘要</view>
        <view class="summary-item">
          <text class="item-label">运费单价</text>
          <text class="item-value">￥{{ quote.pricePerKg || 0 }}/kg</text>
        </view>
        <view class="summary-item">
          <text class="item-label">报关费用</text>
          <text class="item-value">￥{{ quote.customsFee || 0 }}</text>
        </view>
        <view class="summary-divider"></view>
        <view class="summary-item total">
          <text class="item-label">总费用</text>
          <text class="item-value">￥{{ quote.totalCost || 0 }}</text>
        </view>
      </view>

      <!-- 底部操作按钮组 -->
      <view class="action-buttons">
        <button class="action-btn secondary" @click="handleCancel">
          <text class="btn-icon">✖️</text>
          <text>取消</text>
        </button>
        <button class="action-btn primary" @click="handleSubmit" :loading="submitLoading">
          <text class="btn-icon" v-if="!submitLoading">✓</text>
          <text>{{ submitLoading ? '提交中...' : '提交报价' }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import BaseCard from '../../components/BaseCard.vue'
import BaseInput from '../../components/BaseInput.vue'
import LoadingAnimation from '../../components/LoadingAnimation.vue'
import { post } from '../../utils/request'

export default {
  name: 'QuoteCreate',
  components: {
    BaseCard,
    BaseInput,
    LoadingAnimation
  },
  data() {
    return {
      isLoading: false,
      submitLoading: false,
      productId: '',
      quote: {
        forwarderName: '',
        shippingRoute: '',
        deliveryTime: '',
        pricePerKg: '',
        customsFee: '',
        totalGrossWeight: '',
        totalFreight: '',
        totalCost: '',
        remark: ''
      },
      errors: {}
    }
  },
  watch: {
    'quote.pricePerKg': {
      handler: 'calculateTotalFreight',
      immediate: true
    },
    'quote.totalGrossWeight': {
      handler: 'calculateTotalFreight',
      immediate: true
    },
    'quote.customsFee': {
      handler: 'calculateTotalCost',
      immediate: true
    },
    'quote.totalFreight': {
      handler: 'calculateTotalCost',
      immediate: true
    }
  },
  onLoad(options) {
    console.log('接收到的参数：', options)
    this.productId = options.productId
    if (options.totalGrossWeight) {
      this.quote.totalGrossWeight = options.totalGrossWeight
      this.calculateTotalFreight()
    } else {
      uni.showToast({
        title: '请从产品详情页进入',
        icon: 'none'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  },
  methods: {
    calculateTotalFreight() {
      if (this.quote.pricePerKg && this.quote.totalGrossWeight) {
        const totalFreight = Number(this.quote.pricePerKg) * Number(this.quote.totalGrossWeight)
        this.quote.totalFreight = totalFreight.toFixed(2)
        this.calculateTotalCost()
      }
    },
    calculateTotalCost() {
      if (this.quote.customsFee && this.quote.totalFreight) {
        const totalCost = Number(this.quote.customsFee) + Number(this.quote.totalFreight)
        this.quote.totalCost = totalCost.toFixed(2)
      }
    },
    validateForm() {
      const errors = {}
      if (!this.quote.forwarderName) {
        errors.forwarderName = '请输入货代公司名称'
      }
      if (!this.quote.shippingRoute) {
        errors.shippingRoute = '请输入出运线路'
      }
      if (!this.quote.deliveryTime) {
        errors.deliveryTime = '请输入时效'
      }
      if (!this.quote.pricePerKg) {
        errors.pricePerKg = '请输入每公斤报价'
      } else if (isNaN(this.quote.pricePerKg) || Number(this.quote.pricePerKg) <= 0) {
        errors.pricePerKg = '请输入有效的报价金额'
      }
      if (!this.quote.customsFee) {
        errors.customsFee = '请输入报关费用'
      } else if (isNaN(this.quote.customsFee) || Number(this.quote.customsFee) < 0) {
        errors.customsFee = '请输入有效的报关费用'
      }
      this.errors = errors
      return Object.keys(errors).length === 0
    },
    handleCancel() {
      uni.navigateBack()
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }
      this.submitLoading = true
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
        }
        await post('/quotes', submitData)
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({
          title: error.message || '提交失败',
          icon: 'none'
        })
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.edit-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding: $spacing-lg;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.page-header {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.04);
  margin-bottom: 32rpx;
  padding: 36rpx 24rpx;
  .page-title {
    font-size: 38rpx;
    font-weight: bold;
    color: #222;
    margin-bottom: 10rpx;
  }
  .page-subtitle {
    font-size: 28rpx;
    color: #888;
  }
}

.form-card {
  margin-bottom: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.04);
}

.form-content {
  .form-row {
    display: flex;
    gap: 32rpx;
    margin-bottom: 32rpx;
    .base-input-wrapper {
      flex: 1;
      margin-bottom: 0;
    }
  }
}

/* 费用摘要卡片 */
.summary-card {
  background-color: #fff;
  padding: 36rpx 24rpx;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.04);
  .summary-title {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 24rpx;
  }
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18rpx;
    .item-label {
      font-size: 28rpx;
      color: $text-secondary;
    }
    .item-value {
      font-size: 28rpx;
      color: $text-primary;
    }
    &.total {
      .item-label {
        font-size: 32rpx;
        font-weight: 500;
      }
      .item-value {
        font-size: 38rpx;
        font-weight: bold;
        color: #ff5252;
      }
    }
  }
  .summary-divider {
    height: 1rpx;
    background-color: #eee;
    margin: 22rpx 0;
  }
}

/* 底部按钮组 */
.action-buttons {
  display: flex;
  gap: 32rpx;
  margin-top: 28rpx;
  padding: 36rpx 24rpx;
  background-color: white;
  border-radius: 18rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  .action-btn {
    flex: 1;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50rpx;
    font-size: 30rpx;
    font-weight: 500;
    .btn-icon {
      margin-right: 14rpx;
      font-size: 34rpx;
    }
    &.secondary {
      background-color: rgba(#f44336, 0.08);
      color: #f44336;
      border: 2rpx solid rgba(#f44336, 0.2);
    }
    &.primary {
      background-color: #1976D2;
      color: white;
      border: none;
      box-shadow: 0 4rpx 16rpx rgba(#1976D2, 0.13);
      &:disabled {
        opacity: 0.7;
        background-color: #999;
        box-shadow: none;
      }
    }
  }
}
</style> 