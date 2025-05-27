<template>
  <view class="edit-container">
    <loading-animation :loading="isLoading" text="加载产品详情..." />
    <view class="content-wrapper" v-if="!isLoading">
      <!-- 页面标题 -->
      <view class="page-header">
        <text class="page-title">产品详情</text>
        <text class="page-subtitle">查看产品详细信息及操作</text>
        </view>
      <base-card class="form-card">
        <view class="form-content">
          <view class="form-row">
            <image :src="product.product_image" class="product-image" mode="aspectFill" />
            <view class="product-info-main">
              <text class="product-title">{{ product.product_name }}</text>
              <text class="product-desc">{{ product.description }}</text>
              <text class="product-expiry">截止日期：{{ formatDate(product.expiry_date) }}</text>
          </view>
          </view>
          <view class="info-section">
            <text class="section-title">基本信息</text>
            <view class="info-item"><text class="label">产品品号：</text><text class="value">{{ product.product_id }}</text></view>
            <view class="info-item"><text class="label">仓库地址：</text><text class="value">{{ product.warehouse }}</text></view>
            <view class="info-item"><text class="label">邮编：</text><text class="value">{{ product.zipcode }}</text></view>
          </view>
        <view class="info-section">
          <text class="section-title">尺寸信息</text>
          <view class="info-grid">
              <view class="info-item"><text class="label">长度：</text><text class="value">{{ product.length }}cm</text></view>
              <view class="info-item"><text class="label">宽度：</text><text class="value">{{ product.width }}cm</text></view>
              <view class="info-item"><text class="label">高度：</text><text class="value">{{ product.height }}cm</text></view>
            </view>
          </view>
        <view class="info-section">
          <text class="section-title">重量信息</text>
          <view class="info-grid">
              <view class="info-item"><text class="label">毛重：</text><text class="value">{{ product.gross_weight }}kg</text></view>
              <view class="info-item"><text class="label">箱体重：</text><text class="value">{{ product.package_weight }}kg</text></view>
              <view class="info-item"><text class="label">计费重：</text><text class="value">{{ product.chargeable_weight }}kg</text></view>
            </view>
          </view>
        <view class="info-section">
          <text class="section-title">数量信息</text>
          <view class="info-grid">
              <view class="info-item"><text class="label">装箱量：</text><text class="value">{{ product.box_quantity || '-' }}</text></view>
              <view class="info-item"><text class="label">单位数量：</text><text class="value">{{ product.unit_quantity || '-' }}</text></view>
              <view class="info-item"><text class="label">总件数：</text><text class="value">{{ product.total_quantity }}</text></view>
            </view>
          </view>
        <view class="info-section">
          <text class="section-title">总量信息</text>
          <view class="info-grid">
              <view class="info-item"><text class="label">总体积：</text><text class="value">{{ product.total_volume }}m³</text></view>
              <view class="info-item"><text class="label">总毛重：</text><text class="value">{{ product.total_gross_weight }}kg</text></view>
            </view>
          </view>
        </view>
      </base-card>
      <!-- 费用摘要卡片（如有报价信息可展示） -->
      <view class="summary-card" v-if="product.min_quote">
        <view class="summary-title">最低报价摘要</view>
        <view class="summary-item">
          <text class="item-label">最低报价</text>
          <text class="item-value">￥{{ product.min_quote.price_per_kg }}/kg</text>
        </view>
        <view class="summary-item">
          <text class="item-label">最快时效</text>
          <text class="item-value">{{ product.min_quote.delivery_time }}</text>
      </view>
        <view class="summary-divider"></view>
        <view class="summary-item total">
          <text class="item-label">总费用</text>
          <text class="item-value">￥{{ product.min_quote.total_cost }}</text>
        </view>
      </view>
      <!-- 底部操作按钮组 -->
      <view class="action-buttons">
        <button class="action-btn secondary" @click="handleCartAction" :disabled="isInCart">
          <text class="btn-icon">🛒</text>
          <text>{{ isInCart ? '已在购物车' : '加入购物车' }}</text>
        </button>
        <button class="action-btn primary" @click="navigateToQuote">
          <text class="btn-icon">💰</text>
          <text>提交报价</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import BaseCard from '../../components/BaseCard.vue'
import LoadingAnimation from '../../components/LoadingAnimation.vue'
import dayjs from 'dayjs'
import { get } from '../../utils/request'

export default {
  name: 'ProductDetail',
  components: {
    BaseCard,
    LoadingAnimation
  },
  data() {
    return {
      productId: '',
      product: {},
      isLoading: true
    }
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    ...mapGetters('product', ['getProductById']),
    isInCart() {
      return this.cartItems && this.cartItems.some(item => item.productId === this.productId)
    },
    cachedProduct() {
      if (!this.getProductById || typeof this.getProductById !== 'function') {
        return null;
      }
      try {
        const product = this.getProductById(this.productId);
        return product || null;
      } catch (e) {
        console.error('获取缓存产品失败:', e);
        return null;
      }
    }
  },
  onLoad(options) {
    this.productId = options.id
    this.fetchProductDetail()
    this.loadCartItems() // 确保加载最新的购物车数据
  },
  methods: {
    ...mapActions('cart', {
      cartAddToCart: 'addToCart',  // 重命名Vuex action，避免命名冲突
      loadCartItems: 'loadCartItems'
    }),
    ...mapActions('product', ['fetchProduct']),
    async fetchProductDetail() {
      this.isLoading = true
      try {
        // 先尝试从Vuex缓存获取
        if (this.cachedProduct) {
          this.product = this.cachedProduct
          setTimeout(() => {
            this.isLoading = false
          }, 300)
          return
        }
        
        // 如果缓存没有，则从API获取
        await this.fetchProduct(this.productId)
        if (this.cachedProduct) {
          this.product = this.cachedProduct
        } else {
          // 模拟数据
          const mockData = {
            product_id: this.productId,
            product_name: "智能手表 Pro Max",
            description: "多功能健康监测智能手表，支持心率、血压、血氧监测",
            product_image: "https://cdn.example.com/img/watch.jpg",
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            warehouse: "上海仓",
            zipcode: "200001",
            length: 5.5,
            width: 4.2,
            height: 1.8,
            gross_weight: 0.35,
            package_weight: 0.15,
            chargeable_weight: 0.5,
            box_quantity: 50, // 新增装箱量
            unit_quantity: 200, // 新增单位数量
            total_quantity: 1000,
            total_volume: 2.5,
            total_gross_weight: 350,
            min_quote: {
              price_per_kg: 45,
              delivery_time: "7-10工作日",
              total_cost: 15750
            }
          };
          this.product = mockData;
        }
      } catch (error) {
        uni.showToast({
          title: error.message || '获取产品详情失败',
          icon: 'none'
        })
      } finally {
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      }
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    navigateToQuote() {
      if (!this.product.total_gross_weight) {
        uni.showToast({
          title: '产品总毛重数据异常',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: `/pages/quote/create?productId=${this.productId}&totalGrossWeight=${this.product.total_gross_weight}` 
      })
    },
    handleCartAction() {
      if (this.isInCart) {
        // 如果已在购物车中，可以导航到购物车页面
        uni.navigateTo({ url: '/pages/cart/index' })
      } else {
        // 否则添加到购物车
        this.addToCart()
      }
    },
    async addToCart() {
      const result = await this.cartAddToCart({
        productId: this.productId,
        productName: this.product.product_name
      })
      
      uni.showToast({
        title: result.message,
        icon: result.success ? 'success' : 'none'
      })
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
    .product-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 16rpx;
      margin-right: $spacing-md;
      background: #f5f5f5;
      object-fit: cover;
    }
    .product-info-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      .product-title {
        font-size: 32rpx;
        font-weight: bold;
        color: $text-primary;
      }
      .product-desc {
        font-size: 26rpx;
        color: $text-secondary;
      }
      .product-expiry {
        font-size: 24rpx;
        color: $text-secondary;
    }
  }
}
  .info-section {
    margin-bottom: $spacing-lg;
    .section-title {
      font-size: $font-size-md;
      font-weight: bold;
      color: $text-primary;
      margin-bottom: $spacing-sm;
      display: block;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-md;
    }
    .info-item {
      margin-bottom: $spacing-sm;
      .label {
        font-size: $font-size-sm;
        color: $text-secondary;
        margin-right: $spacing-xs;
      }
      .value {
        font-size: $font-size-sm;
        color: $text-primary;
      }
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
</style> 