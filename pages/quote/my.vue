<template>
  <view class="quote-container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="title">我的报价</text>
      <text class="item-count" v-if="myQuotes.length > 0">{{ myQuotes.length }}项报价</text>
    </view>
    
    <!-- 报价列表 -->
    <scroll-view class="quotes-list" scroll-y v-if="myQuotes.length > 0">
      <view 
        v-for="(quote, index) in myQuotes" 
        :key="quote.quote_id" 
        class="quote-card"
        :class="{ 'slide-in': true }"
        :style="{ animationDelay: index * 0.05 + 's' }"
      >
        <view class="card-main">
          <view class="card-left">
            <view class="product-name">{{ quote.product_name }}</view>
            <view class="product-term">期限：{{ quote.delivery_time }}</view>
            <view class="product-cost">总费用：<text class="cost-value">￥{{ quote.total_cost }}</text></view>
            <view class="quote-date">报价时间：{{ quote.quote_date }}</view>
          </view>
          <view class="card-right">
            <view :class="['status-tag', quote.status]">{{ getStatusText(quote.status) }}</view>
          </view>
        </view>
        <view class="divider"></view>
        <button class="detail-btn" @click="goDetail(quote)">详情</button>
      </view>
    </scroll-view>
    
    <!-- 空状态提示 -->
    <view class="empty-state" v-if="myQuotes.length === 0">
      <text class="empty-icon">📝</text>
      <text class="empty-text">暂无报价</text>
      <text class="empty-desc">您还没有提交过报价</text>
      <button class="add-quote-btn" @click="goToHome">去浏览产品</button>
    </view>
    
    <!-- 底部导航栏 -->
    <tab-bar :current-tab="1" />
  </view>
</template>

<script>
import { get } from '../../utils/request'
import TabBar from '../../components/TabBar.vue'

export default {
  components: {
    TabBar
  },
  data() {
    return {
      myQuotes: []
    }
  },
  onLoad() {
    this.fetchMyQuotes()
  },
  methods: {
    async fetchMyQuotes() {
      // 假设接口 /quotes?self=1 返回当前用户所有报价
      const res = await get('/quotes?self=1')
      this.myQuotes = res.data || []
    },
    getStatusText(status) {
      const map = {
        pending: '审核中',
        approved: '已通过',
        rejected: '未通过',
        expired: '已过期',
        cancelled: '已取消'
      }
      return map[status] || status
    },
    goDetail(quote) {
      uni.navigateTo({
        url: `/pages/quote/detail?quoteId=${quote.quote_id}&productId=${quote.product_id}&status=${quote.status}`
      })
    },
    goToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.quote-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding-bottom: 120rpx; // 为底部导航栏留出空间
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

.quotes-list {
  padding: 24rpx;
}

.quote-card {
  width: 100%;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
  margin-bottom: 24rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.99);
  }
}

.card-main {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24rpx;
}

.card-left {
  flex: 1;
  .product-name {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 12rpx;
  }
  
  .product-term, .product-cost, .quote-date {
    font-size: 26rpx;
    color: $text-secondary;
    margin-bottom: 8rpx;
    
    .cost-value {
      color: #f44336;
      font-weight: bold;
    }
  }
}

.card-right {
  display: flex;
  align-items: center;
  
  .status-tag {
    min-width: 100rpx;
    padding: 8rpx 16rpx;
    border-radius: 24rpx;
    font-size: 24rpx;
    text-align: center;
    font-weight: bold;
    
    &.pending { background: rgba(158, 158, 158, 0.2); color: #757575; }
    &.approved { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
    &.rejected { background: rgba(244, 67, 54, 0.2); color: #f44336; }
    &.expired { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
    &.cancelled { background: rgba(111, 66, 193, 0.2); color: #673ab7; }
  }
}

.divider {
  height: 1px;
  background: $border-color;
}

.detail-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: $primary-color;
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  border-radius: 0;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0;
  
  .empty-icon {
    font-size: 120rpx;
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
  
  .add-quote-btn {
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
</style> 