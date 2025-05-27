<template>
  <view class="cart-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <text class="title">我的购物车</text>
      <text class="item-count" v-if="cartItems.length > 0">{{ cartItems.length }}件商品</text>
    </view>
    
    <!-- 空购物车状态 -->
    <view class="empty-state" v-if="cartItems.length === 0">
      <image src="/static/images/empty.png" class="empty-icon" />
      <text class="empty-text">购物车还是空的</text>
      <text class="empty-desc">快去添加喜欢的商品吧</text>
      <button class="go-shopping-btn" @click="navigateToHome">去选购</button>
    </view>
    
    <!-- 购物车商品列表 -->
    <scroll-view class="cart-list" scroll-y v-else>
      <view 
        class="cart-item"
        v-for="(item, index) in cartItems" 
        :key="index"
        :class="{ 'slide-in': true }"
        :style="{ animationDelay: index * 0.05 + 's' }"
      >
        <view class="item-content">
          <!-- 商品图片 -->
          <image 
            class="item-image" 
            src="/static/images/default-product.png" 
            mode="aspectFill" 
          />
          
          <!-- 商品信息 -->
          <view class="item-info">
            <text class="item-name">{{ item.productName }}</text>
            <text class="item-time">{{ formatTime(item.addTime) }}</text>
          </view>
          
          <!-- 商品操作 -->
          <view class="item-actions">
            <view class="action-btn view-btn" @click="viewProduct(item.productId)">
              <text class="btn-text">查看</text>
            </view>
            <view class="action-btn delete-btn" @click="showDeleteConfirm(index)">
              <text class="btn-text">删除</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部操作区 -->
    <view class="cart-footer safe-area-bottom" v-if="cartItems.length > 0">
      <view class="footer-action">
        <button class="action-btn clear-btn" @click="showClearConfirm">
          <text class="btn-icon">🗑️</text>
          <text class="btn-text">清空购物车</text>
        </button>
      </view>
    </view>
    
    <!-- 底部菜单栏 -->
    <tab-bar :current-tab="2" />
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TabBar from '../../components/TabBar.vue'
import dayjs from 'dayjs'

export default {
  name: 'CartPage',
  components: {
    TabBar
  },
  computed: {
    ...mapState('cart', ['cartItems'])
  },
  onShow() {
    // 每次显示页面时重新获取购物车数据
    this.loadCartItems()
  },
  methods: {
    ...mapActions('cart', [
      'loadCartItems',
      'removeCartItem',
      'clearCart'
    ]),
    formatTime(timestamp) {
      return dayjs(timestamp).format('YYYY年MM月DD日 HH:mm')
    },
    navigateToHome() {
      // 使用reLaunch替代switchTab，因为index页面可能不是tabBar页面
      uni.reLaunch({
        url: '/pages/index/index'
      })
    },
    viewProduct(productId) {
      uni.navigateTo({
        url: `/pages/product/detail?id=${productId}`
      })
    },
    showDeleteConfirm(index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要从购物车中删除该商品吗？',
        success: (res) => {
          if (res.confirm) {
            this.handleRemoveItem(index)
          }
        }
      })
    },
    async handleRemoveItem(index) {
      const result = await this.removeCartItem(index)
      
      uni.showToast({
        title: result.message,
        icon: result.success ? 'success' : 'none'
      })
    },
    showClearConfirm() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空购物车吗？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            this.handleClearCart()
          }
        }
      })
    },
    async handleClearCart() {
      const result = await this.clearCart()
      
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

.cart-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding-bottom: 170rpx; // 为底部留出空间
  position: relative;
}

.header {
  background: linear-gradient(135deg, $primary-color, darken($primary-color, 10%));
  padding: 40rpx 30rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
  }
  
  .item-count {
    font-size: 24rpx;
    color: rgba(255,255,255,0.9);
    padding: 6rpx 16rpx;
    background-color: rgba(255,255,255,0.2);
    border-radius: 20rpx;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0;
  
  .empty-icon {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 40rpx;
    opacity: 0.7;
  }
  
  .empty-text {
    font-size: 36rpx;
    color: $text-primary;
    font-weight: 500;
    margin-bottom: 16rpx;
  }
  
  .empty-desc {
    font-size: 28rpx;
    color: $text-secondary;
    margin-bottom: 40rpx;
  }
  
  .go-shopping-btn {
    width: 280rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(135deg, $primary-color, darken($primary-color, 10%));
    color: #fff;
    font-size: 28rpx;
    border-radius: 40rpx;
    font-weight: 500;
    box-shadow: 0 4rpx 12rpx rgba($primary-color, 0.3);
    transition: all 0.2s ease;
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2rpx 8rpx rgba($primary-color, 0.2);
    }
  }
}

.cart-list {
  padding: 20rpx;
}

// 动画效果
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

.cart-item {
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.99);
  }
  
  .item-content {
    padding: 24rpx;
    display: flex;
    align-items: center;
  }
  
  .item-image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 16rpx;
    object-fit: cover;
    background-color: #f5f5f5;
    flex-shrink: 0;
  }
  
  .item-info {
    flex: 1;
    padding: 0 20rpx;
    
    .item-name {
      font-size: 30rpx;
      color: $text-primary;
      font-weight: 500;
      margin-bottom: 12rpx;
      display: block;
      // 文本溢出省略
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .item-time {
      font-size: 24rpx;
      color: $text-secondary;
      // 文本溢出省略
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .item-actions {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    flex-shrink: 0;
    
    .action-btn {
      width: 110rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 30rpx;
      font-size: 24rpx;
      
      &.view-btn {
        background-color: #f0f0f0;
        color: $text-primary;
      }
      
      &.delete-btn {
        background-color: rgba(#f44336, 0.1);
        color: #f44336;
      }
    }
  }
}

.cart-footer {
  position: fixed;
  bottom: 100rpx; // 避免与TabBar重叠
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 10;
  
  .footer-action {
    display: flex;
    justify-content: flex-end;
    
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 40rpx;
      height: 80rpx;
      font-size: 28rpx;
      
      &.clear-btn {
        background-color: rgba(#f44336, 0.06);
        color: #f44336;
        padding: 0 40rpx;
        font-weight: 500;
        
        .btn-icon {
          margin-right: 8rpx;
          font-size: 32rpx;
        }
      }
    }
  }
}

.safe-area-bottom {
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom, 0));
}
</style> 