<template>
  <view class="product-card" @click="handleClick">
    <view class="product-image-container">
      <image class="product-image" :src="product.product_image || defaultImage" mode="aspectFill" />
      <view class="deadline-tag" v-if="product.deadline">
        <text class="deadline-text">{{ formatDeadline(product.deadline) }}</text>
      </view>
    </view>
    <view class="product-content">
      <text class="product-title" :class="{ 'single-line': !showFullTitle }">{{ product.product_name }}</text>
      <view class="product-desc">
        <text class="desc-text">
          {{ product.total_quantity ? `总件数 ${product.total_quantity}` : product.description }}
        </text>
      </view>
      <view class="product-footer">
        <view class="product-specs" v-if="showSpecs">
          <text class="spec-item">{{ product.length }}×{{ product.width }}×{{ product.height }}cm</text>
          <text class="spec-item">{{ product.gross_weight }}kg</text>
        </view>
        <view class="product-actions" v-if="showActions">
          <button class="action-btn quote-btn" @click.stop="handleQuote">申请报价</button>
          <button class="action-btn cart-btn" @click.stop="handleAddToCart">加入购物车</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    showFullTitle: {
      type: Boolean,
      default: false
    },
    showSpecs: {
      type: Boolean,
      default: true
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultImage: '/static/images/default-product.png'
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.product)
    },
    handleQuote() {
      this.$emit('quote', this.product)
    },
    handleAddToCart() {
      this.$emit('add-to-cart', this.product)
    },
    formatDeadline(date) {
      if (!date) return ''
      const deadlineDate = dayjs(date)
      const now = dayjs()
      const diffDays = deadlineDate.diff(now, 'day')
      
      if (diffDays < 0) {
        return '已截止'
      } else if (diffDays === 0) {
        return '今日截止'
      } else if (diffDays === 1) {
        return '明日截止'
      } else if (diffDays <= 3) {
        return `${diffDays}天后截止`
      } else {
        return deadlineDate.format('MM-DD截止')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.product-card {
  width: 100%;
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: $box-shadow-base;
  margin-bottom: 24rpx;
}

.product-image-container {
  width: 100%;
  height: 320rpx;
  position: relative;
  overflow: hidden;
  
  .product-image {
    width: 100%;
    height: 100%;
  }
  
  .deadline-tag {
    position: absolute;
    top: 16rpx;
    right: 0;
    background-color: rgba(#ff4d4f, 0.8);
    padding: 6rpx 16rpx 6rpx 24rpx;
    border-radius: 30rpx 0 0 30rpx;
    
    .deadline-text {
      font-size: 22rpx;
      color: #ffffff;
      font-weight: 500;
    }
  }
}

.product-content {
  padding: 20rpx 24rpx 24rpx;
}

.product-title {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: 12rpx;
  
  &.single-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.product-desc {
  margin-bottom: 16rpx;
  
  .desc-text {
    font-size: 24rpx;
    color: $text-secondary;
    line-height: 1.4;
  }
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-specs {
  display: flex;
  flex-wrap: wrap;
  
  .spec-item {
    font-size: 22rpx;
    color: $text-light;
    padding: 4rpx 12rpx;
    background-color: #f5f5f5;
    border-radius: 4rpx;
    margin-right: 12rpx;
    margin-bottom: 8rpx;
  }
}

.product-actions {
  display: flex;
  gap: 12rpx;
  
  .action-btn {
    padding: 0 18rpx;
    height: 50rpx;
    line-height: 50rpx;
    font-size: 24rpx;
    border-radius: 25rpx;
    border: none;
  }
  
  .quote-btn {
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  
  .cart-btn {
    background-color: $primary-color;
    color: #ffffff;
  }
}
</style> 