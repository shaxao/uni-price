<template>
  <view class="edit-container">
    <loading-animation :loading="isLoading" text="加载报价数据..." />
    
    <view class="content-wrapper" v-if="!isLoading">
      <!-- 页面标题 -->
      <view class="page-header">
        <text class="page-title">修改报价</text>
        <text class="page-subtitle">更新您对该产品的运输报价</text>
      </view>
    
    <base-card class="form-card">
        <!-- 表单内容 -->
      <view class="form-content">
        <base-input
          v-model="form.forwarderName"
          label="货代公司名称"
          placeholder="请输入货代公司名称"
          :error="errors.forwarderName"
        />
        
        <base-input
          v-model="form.shippingRoute"
          label="出运线路"
          placeholder="请输入出运线路"
          :error="errors.shippingRoute"
        />
        
        <base-input
          v-model="form.deliveryTime"
          label="时效"
          placeholder="请输入时效（如：3-5天）"
          :error="errors.deliveryTime"
        />
        
        <view class="form-row">
          <base-input
            v-model="form.pricePerKg"
            label="报价(元/kg)"
            type="digit"
            placeholder="请输入每公斤报价"
            :error="errors.pricePerKg"
          />
          
          <base-input
            v-model="form.customsFee"
            label="报关费用(元/票)"
            type="digit"
            placeholder="请输入报关费用"
            :error="errors.customsFee"
          />
        </view>
        
        <view class="form-row">
          <base-input
            v-model="form.totalGrossWeight"
            label="总毛重(kg)"
            type="digit"
            placeholder=""
            :error="errors.totalGrossWeight"
            disabled
          />
          
          <base-input
            v-model="form.totalFreight"
            label="总运费(元)"
            type="digit"
            placeholder="自动计算"
            disabled
          />
          
          <base-input
            v-model="form.totalCost"
            label="总费用(元)"
            type="digit"
            placeholder="自动计算"
            disabled
          />
        </view>
        
        <base-input
          v-model="form.remark"
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
          <text class="item-value">￥{{ form.pricePerKg || 0 }}/kg</text>
        </view>
        <view class="summary-item">
          <text class="item-label">报关费用</text>
          <text class="item-value">￥{{ form.customsFee || 0 }}</text>
        </view>
        <view class="summary-divider"></view>
        <view class="summary-item total">
          <text class="item-label">总费用</text>
          <text class="item-value">￥{{ form.totalCost || 0 }}</text>
        </view>
      </view>
      
      <!-- 底部操作按钮组 -->
      <view class="action-buttons">
        <button class="action-btn secondary" @click="handleCancel">
          <text class="btn-icon">✖️</text>
          <text>取消修改</text>
        </button>
        <button class="action-btn primary" @click="handleSubmit" :disabled="submitLoading">
          <text class="btn-icon" v-if="!submitLoading">✓</text>
          <text v-if="submitLoading" class="loading-icon">⟳</text>
          <text>{{ submitLoading ? '保存中...' : '保存修改' }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { get, put } from '../../utils/request'
import BaseCard from '../../components/BaseCard.vue'
import BaseButton from '../../components/BaseButton.vue'
import BaseInput from '../../components/BaseInput.vue'
import LoadingAnimation from '../../components/LoadingAnimation.vue'

export default {
  name: 'QuoteEdit',
  components: {
    BaseCard,
    BaseButton,
    BaseInput,
    LoadingAnimation
  },
  data() {
    return {
      quoteId: '',
      isLoading: true,
      submitLoading: false,
      form: {
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
    'form.pricePerKg': {
      handler: 'calculateTotal',
      immediate: true
    },
    'form.customsFee': {
      handler: 'calculateTotal',
      immediate: true
    }
  },
  onLoad(options) {
    this.quoteId = options.quoteId
    this.fetchQuoteDetail()
  },
  methods: {
    async fetchQuoteDetail() {
      this.isLoading = true
      try {
        const res = await get(`/quotes/${this.quoteId}`)
        const quote = res.data
        this.form = {
          forwarderName: quote.forwarder_name,
          shippingRoute: quote.shipping_route,
          deliveryTime: quote.delivery_time,
          pricePerKg: quote.price_per_kg,
          customsFee: quote.customs_fee,
          totalGrossWeight: quote.total_gross_weight,
          totalFreight: quote.total_freight,
          totalCost: quote.total_cost,
          remark: quote.remark || ''
        }
      } catch (error) {
        uni.showToast({
          title: error.message || '获取报价详情失败',
          icon: 'none'
        })
      } finally {
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      }
    },
    
    calculateTotal() {
      const { pricePerKg, customsFee, totalGrossWeight } = this.form
      
      if (pricePerKg && totalGrossWeight) {
        this.form.totalFreight = (Number(pricePerKg) * Number(totalGrossWeight)).toFixed(2)
      }
      
      if (this.form.totalFreight && customsFee) {
        this.form.totalCost = (Number(this.form.totalFreight) + Number(customsFee)).toFixed(2)
      }
    },
    
    validateForm() {
      const errors = {}
      
      if (!this.form.forwarderName) {
        errors.forwarderName = '请输入货代公司名称'
      }
      
      if (!this.form.shippingRoute) {
        errors.shippingRoute = '请输入出运线路'
      }
      
      if (!this.form.deliveryTime) {
        errors.deliveryTime = '请输入时效'
      }
      
      if (!this.form.pricePerKg) {
        errors.pricePerKg = '请输入每公斤报价'
      } else if (isNaN(this.form.pricePerKg) || Number(this.form.pricePerKg) <= 0) {
        errors.pricePerKg = '请输入有效的报价金额'
      }
      
      if (!this.form.customsFee) {
        errors.customsFee = '请输入报关费用'
      } else if (isNaN(this.form.customsFee) || Number(this.form.customsFee) < 0) {
        errors.customsFee = '请输入有效的报关费用'
      }
      
      this.errors = errors
      return Object.keys(errors).length === 0
    },
    
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }
      
      this.submitLoading = true
      try {
        await put(`/quotes/${this.quoteId}`, this.form)
        
        uni.showToast({
          title: '修改成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({
          title: error.message || '修改失败',
          icon: 'none'
        })
      } finally {
        this.submitLoading = false
      }
    },
    
    handleCancel() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.edit-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding: $spacing-md;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.page-header {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 12rpx;
    display: block;
  }
  
  .page-subtitle {
    font-size: 26rpx;
    color: $text-secondary;
  }
}

.form-card {
  margin-bottom: 24rpx;
}

.form-content {
  .form-row {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
    
    .base-input {
      flex: 1;
    }
  }
}

/* 费用摘要卡片 */
.summary-card {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .summary-title {
    font-size: 30rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 24rpx;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    
    .item-label {
      font-size: 26rpx;
      color: $text-secondary;
    }
    
    .item-value {
      font-size: 26rpx;
      color: $text-primary;
    }
    
    &.total {
      .item-label {
        font-size: 30rpx;
        font-weight: 500;
      }
      
      .item-value {
        font-size: 36rpx;
        font-weight: bold;
        color: #ff5252;
      }
    }
  }
  
  .summary-divider {
    height: 1rpx;
    background-color: #eee;
    margin: 20rpx 0;
  }
}

/* 底部按钮组 */
.action-buttons {
  display: flex;
  gap: 24rpx;
  margin-top: 20rpx;
  padding: 30rpx;
  background-color: white;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  
  .action-btn {
    flex: 1;
    height: 90rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 45rpx;
    font-size: 28rpx;
    font-weight: 500;
    
    .btn-icon {
      margin-right: 12rpx;
      font-size: 32rpx;
    }
    
    .loading-icon {
      margin-right: 12rpx;
      font-size: 32rpx;
      animation: spin 1s infinite linear;
    }
    
    &.secondary {
      background-color: rgba(#f44336, 0.1);
      color: #f44336;
      border: 2rpx solid rgba(#f44336, 0.3);
    }
    
    &.primary {
      background-color: #1976D2;
      color: white;
      border: none;
      box-shadow: 0 4rpx 16rpx rgba(#1976D2, 0.2);
      
      &:disabled {
        opacity: 0.7;
        background-color: #999;
        box-shadow: none;
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 