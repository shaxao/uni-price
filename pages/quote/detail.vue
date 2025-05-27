<template>
  <view class="detail-container">
    <loading-animation :loading="isLoading" text="加载报价详情..." />
    
    <!-- 错误提示条 -->
    <view class="error-bar" v-if="hasError && !isLoading">
      <text class="error-message">{{ errorMessage }}</text>
      <view class="error-action" @click="fetchQuoteDetail">重试</view>
    </view>
    
    <view class="content-wrapper" v-if="!isLoading">
      <!-- 状态时间线 -->
      <view class="status-timeline">
        <view class="timeline-item" 
          v-for="(item, index) in statusTimeline" 
          :key="index"
          :class="{ 
            'active': statusIndex >= index,
            'current': statusIndex === index 
          }"
        >
          <view class="timeline-dot"></view>
          <view class="timeline-label">{{ item.label }}</view>
          <view class="timeline-date" v-if="item.date">{{ item.date }}</view>
        </view>
      </view>
    
      <!-- 主卡片内容 -->
      <base-card class="quote-card">
        <template #header>
          <view class="card-header">
            <text class="quote-title">报价详情</text>
            <view :class="['quote-status', quote.status]">
              <view class="status-icon">{{ statusIcons[quote.status] }}</view>
              <text>{{ getStatusText(quote.status) }}</text>
            </view>
          </view>
        </template>
        
        <view class="quote-content">
          <!-- 产品信息区域 -->
          <view class="product-section">
            <view class="product-name">{{ quote.product_name }}</view>
            <view class="product-meta">
              <view class="meta-item">
                <text class="meta-icon">📅</text>
                <text>期限：{{ quote.delivery_time }}</text>
              </view>
              <view class="meta-item">
                <text class="meta-icon">⚖️</text>
                <text>总重：{{ quote.total_gross_weight }}kg</text>
              </view>
            </view>
          </view>
          
          <!-- 价格信息区 -->
          <view class="price-section">
            <view class="total-price">
              <text class="price-label">总费用</text>
              <text class="price-value">￥{{ quote.total_cost }}</text>
            </view>
            
            <view class="price-details">
              <view class="price-item">
                <text class="item-label">运费单价</text>
                <text class="item-value">￥{{ quote.price_per_kg }}/kg</text>
              </view>
              <view class="price-item">
                <text class="item-label">报关费用</text>
                <text class="item-value">￥{{ quote.customs_fee }}</text>
              </view>
              <view class="price-item">
                <text class="item-label">总运费</text>
                <text class="item-value">￥{{ quote.total_freight }}</text>
              </view>
            </view>
          </view>
          
          <!-- 备注信息 -->
          <view class="remark-section" v-if="quote.remark">
            <text class="section-title">备注信息</text>
            <view class="remark-content">
              <text>{{ quote.remark }}</text>
            </view>
          </view>
          
          <!-- 状态信息卡片 -->
          <view class="status-card" :class="quote.status">
            <view class="status-icon large">{{ statusIcons[quote.status] }}</view>
            <view class="status-content">
              <text class="status-title">{{ statusMessages[quote.status].title }}</text>
              <text class="status-desc">{{ statusMessages[quote.status].desc }}</text>
            </view>
          </view>
          
          <!-- 附加信息 -->
          <view class="extra-info">
            <view class="info-item">
              <text class="info-label">报价编号</text>
              <text class="info-value">{{ quoteId }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">提交时间</text>
              <text class="info-value">{{ formatDate(quote.created_at || new Date()) }}</text>
            </view>
            <view class="info-item" v-if="quote.status === 'approved' || quote.status === 'rejected'">
              <text class="info-label">审核时间</text>
              <text class="info-value">{{ formatDate(quote.updated_at || new Date()) }}</text>
            </view>
          </view>
        </view>
      </base-card>
      
      <!-- 底部操作按钮组 -->
      <view class="action-buttons" :class="quote.status">
        <!-- 审核中状态按钮组 -->
        <template v-if="quote.status === 'pending'">
          <button class="action-btn secondary" @click="handleCancel">
            <text class="btn-icon">🗑️</text>
            <text>取消报价</text>
          </button>
          <button class="action-btn primary" @click="handleEdit">
            <text class="btn-icon">✏️</text>
            <text>修改报价</text>
          </button>
        </template>
        
        <!-- 未通过状态按钮组 -->
        <template v-else-if="quote.status === 'rejected'">
          <button class="action-btn secondary" @click="goToMyQuotes">
            <text class="btn-icon">📋</text>
            <text>我的报价</text>
          </button>
          <button class="action-btn primary" @click="handleReQuote">
            <text class="btn-icon">🔄</text>
            <text>再次报价</text>
          </button>
        </template>
        
        <!-- 已通过状态按钮组 -->
        <template v-else-if="quote.status === 'approved'">
          <button class="action-btn secondary" @click="handleShare">
            <text class="btn-icon">📤</text>
            <text>分享</text>
          </button>
          <button class="action-btn primary" @click="handleContact">
            <text class="btn-icon">📞</text>
            <text>联系客服</text>
          </button>
        </template>
        
        <!-- 已过期状态按钮组 -->
        <template v-else-if="quote.status === 'expired'">
          <button class="action-btn secondary" @click="goToHome">
            <text class="btn-icon">🏠</text>
            <text>浏览产品</text>
          </button>
          <button class="action-btn primary" @click="goToMyQuotes">
            <text class="btn-icon">📋</text>
            <text>我的报价</text>
          </button>
        </template>
        
        <!-- 已取消状态按钮组 -->
        <template v-else-if="quote.status === 'cancelled'">
          <button class="action-btn secondary" @click="goToMyQuotes">
            <text class="btn-icon">📋</text>
            <text>我的报价</text>
          </button>
          <button class="action-btn primary" @click="handleReQuote">
            <text class="btn-icon">🔄</text>
            <text>重新报价</text>
          </button>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
import BaseCard from '../../components/BaseCard.vue'
import BaseButton from '../../components/BaseButton.vue'
import LoadingAnimation from '../../components/LoadingAnimation.vue'

export default {
  name: 'QuoteDetail',
  components: {
    BaseCard,
    BaseButton,
    LoadingAnimation
  },
  data() {
    return {
      productId: '',
      quoteId: '',
      quoteStatus: 'pending',
      quote: {
        status: 'pending',
        product_name: '加载中...',
        delivery_time: '-',
        total_cost: 0,
        price_per_kg: 0,
        customs_fee: 0,
        total_gross_weight: 0,
        total_freight: 0,
        created_at: new Date(),
        updated_at: null
      },
      isLoading: true,
      hasError: false,
      errorMessage: '',
      statusIcons: {
        pending: '⏳',
        approved: '✅',
        rejected: '❌',
        expired: '⏱️',
        cancelled: '🚫'
      },
      statusMessages: {
        pending: {
          title: '您的报价正在审核中',
          desc: '正常情况下，我们会在1-2个工作日内完成审核。您可以在这期间修改或取消报价。'
        },
        approved: {
          title: '恭喜！您的报价已通过',
          desc: '您的报价已被接受，请联系客服安排后续事宜。'
        },
        rejected: {
          title: '很遗憾，报价未通过审核',
          desc: '您可以根据市场行情调整价格后再次提交报价。'
        },
        expired: {
          title: '此报价已过期',
          desc: '该产品的报价期限已过，您可以浏览其他产品或联系客服了解更多信息。'
        },
        cancelled: {
          title: '此报价已取消',
          desc: '您已取消了该报价，可以随时重新报价。'
        }
      }
    }
  },
  computed: {
    ...mapGetters('user', ['isAdmin']),
    statusIndex() {
      const statusOrder = {
        pending: 1,
        approved: 2,
        rejected: 2,
        expired: 2,
        cancelled: 2
      }
      return statusOrder[this.quote.status] || 0
    },
    statusTimeline() {
      return [
        { label: '提交报价', date: this.formatDate(this.quote.created_at, 'MM-DD') },
        { label: '审核中', date: '' },
        { 
          label: this.getStatusText(this.quote.status), 
          date: this.quote.status !== 'pending' ? this.formatDate(this.quote.updated_at || new Date(), 'MM-DD') : '' 
        }
      ]
    }
  },
  onLoad(options) {
    this.productId = options.productId || '1'
    this.quoteId = options.quoteId || '1'
    this.quoteStatus = options.status || 'pending'
    this.fetchQuoteDetail()
  },
  methods: {
    ...mapActions('quote', ['fetchQuote', 'deleteQuote', 'selectBestQuote']),
    
    async fetchQuoteDetail() {
      this.isLoading = true
      
      try {
        // 直接使用模拟数据，不发送API请求
        const mockData = {
          quote_id: this.quoteId,
          product_id: this.productId,
          product_name: "模拟商品" + this.productId,
          delivery_time: "30天",
          total_cost: 5000,
          price_per_kg: 50,
          customs_fee: 500,
          total_gross_weight: 100,
          total_freight: 4500,
          status: this.quoteStatus || 'pending', // 使用URL参数中的状态
          remark: "这是关于报价的一些额外说明和备注信息，包括一些关于产品和配送方面的特殊要求。",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
          updated_at: this.quoteStatus !== 'pending' ? new Date() : null
        }
        
        // 使用模拟数据更新quote
        this.quote = mockData
      } catch (error) {
        console.error('模拟数据处理失败:', error)
        this.hasError = true
        this.errorMessage = '获取报价详情失败，请重试'
      } finally {
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      }
    },
    
    handleEdit() {
      uni.navigateTo({
        url: `/pages/quote/edit?productId=${this.productId}&quoteId=${this.quoteId}`
      })
    },
    
    handleReQuote() {
      uni.navigateTo({
        url: `/pages/quote/create?productId=${this.productId}`
      })
    },
    
    goToHome() {
      uni.switchTab({
        url: '/pages/index/index',
        fail: () => {
          uni.reLaunch({ url: '/pages/index/index' })
        }
      })
    },
    
    goToMyQuotes() {
      uni.navigateTo({
        url: '/pages/quote/my'
      })
    },
    
    handleContact() {
      // 这里可以添加联系客服的逻辑，例如拨打电话或跳转到客服页面
      uni.showModal({
        title: '联系客服',
        content: '客服电话：400-123-4567\n工作时间：周一至周五 9:00-18:00',
        confirmText: '拨打',
        success: (res) => {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: '4001234567',
              fail: () => {
                uni.showToast({
                  title: '拨打失败',
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    },
    
    handleShare() {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline'],
        success: () => {
          uni.showToast({
            title: '请点击右上角分享',
            icon: 'none'
          })
        }
      })
    },
    
    formatDate(date, format = 'YYYY-MM-DD HH:mm') {
      if (!date) return '-'
      return dayjs(date).format(format)
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
    
    handleCancel() {
      uni.showModal({
        title: '提示',
        content: '确定要取消该报价吗？',
        success: (res) => {
          if (res.confirm) {
            // 修改状态为已取消
            this.quote.status = 'cancelled';
            
            // 模拟API请求
            uni.showLoading({
              title: '取消中...'
            });
            
            setTimeout(() => {
              uni.hideLoading();
              uni.showToast({
                title: '报价已取消',
                icon: 'success'
              });
            }, 800);
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.detail-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding: $spacing-md;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.error-bar {
  background-color: #fcf0f0;
  border: 1px solid #ffccc7;
  padding: 20rpx 30rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .error-message {
    font-size: 26rpx;
    color: #f5222d;
  }
  
  .error-action {
    font-size: 26rpx;
    color: $primary-color;
    padding: 6rpx 16rpx;
    background-color: rgba($primary-color, 0.1);
    border-radius: 20rpx;
  }
}

/* 状态时间线 */
.status-timeline {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 40rpx;
  background-color: white;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50rpx;
    left: 70rpx;
    right: 70rpx;
    height: 2rpx;
    background-color: #e8e8e8;
    z-index: 1;
  }
  
  .timeline-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    flex: 1;
    
    .timeline-dot {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      background-color: #e8e8e8;
      border: 6rpx solid white;
      margin-bottom: 16rpx;
    }
    
    .timeline-label {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 8rpx;
    }
    
    .timeline-date {
      font-size: 22rpx;
      color: #bbb;
    }
    
    &.active {
      .timeline-dot {
        background-color: $primary-color;
      }
      
      .timeline-label {
        color: $text-primary;
        font-weight: 500;
      }
      
      .timeline-date {
        color: $text-secondary;
      }
    }
    
    &.current {
      .timeline-dot {
        width: 24rpx;
        height: 24rpx;
        background-color: $primary-color;
        box-shadow: 0 0 0 6rpx rgba($primary-color, 0.2);
      }
    }
  }
}

.quote-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;
    border-bottom: 1px solid #f5f5f5;
    
    .quote-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $text-primary;
    }
    
    .quote-status {
      display: flex;
      align-items: center;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
      font-weight: 500;
      
      .status-icon {
        margin-right: 8rpx;
        font-size: 28rpx;
      }
      
      &.pending { 
        background: rgba(158, 158, 158, 0.1); 
        color: #757575; 
      }
      &.approved { 
        background: rgba(76, 175, 80, 0.1); 
        color: #4caf50; 
      }
      &.rejected { 
        background: rgba(244, 67, 54, 0.1); 
        color: #f44336; 
      }
      &.expired { 
        background: rgba(255, 152, 0, 0.1); 
        color: #ff9800; 
      }
      &.cancelled {
        background: rgba(111, 66, 193, 0.1);
        color: #673ab7;
      }
    }
  }
}

/* 产品信息区 */
.product-section {
  background-color: #f9f9f9;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  
  .product-name {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 16rpx;
  }
  
  .product-meta {
    display: flex;
    justify-content: space-between;
    
    .meta-item {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: $text-secondary;
      
      .meta-icon {
        margin-right: 8rpx;
      }
    }
  }
}

/* 价格信息区 */
.price-section {
  margin-bottom: 30rpx;
  
  .total-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16rpx;
    margin-bottom: 20rpx;
    border-bottom: 1px dashed #eee;
    
    .price-label {
      font-size: 28rpx;
      color: $text-secondary;
    }
    
    .price-value {
      font-size: 40rpx;
      font-weight: bold;
      color: #ff5252;
    }
  }
  
  .price-details {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    
    .price-item {
      width: 30%;
      margin-bottom: 16rpx;
      
      .item-label {
        font-size: 24rpx;
        color: $text-light;
        margin-bottom: 8rpx;
        display: block;
      }
      
      .item-value {
        font-size: 28rpx;
        color: $text-primary;
        font-weight: 500;
      }
    }
  }
}

/* 备注信息区 */
.remark-section {
  margin-bottom: 30rpx;
  
  .section-title {
    font-size: 28rpx;
    color: $text-primary;
    font-weight: 500;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .remark-content {
    background-color: #f9f9f9;
    padding: 20rpx;
    border-radius: 12rpx;
    font-size: 26rpx;
    color: $text-secondary;
    line-height: 1.6;
  }
}

/* 状态卡片 */
.status-card {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  
  &.pending {
    background-color: rgba(158, 158, 158, 0.1);
    .status-icon { background-color: #757575; }
    .status-title { color: #757575; }
  }
  
  &.approved {
    background-color: rgba(76, 175, 80, 0.1);
    .status-icon { background-color: #4caf50; }
    .status-title { color: #4caf50; }
  }
  
  &.rejected {
    background-color: rgba(244, 67, 54, 0.1);
    .status-icon { background-color: #f44336; }
    .status-title { color: #f44336; }
  }
  
  &.expired {
    background-color: rgba(255, 152, 0, 0.1);
    .status-icon { background-color: #ff9800; }
    .status-title { color: #ff9800; }
  }
  
  &.cancelled {
    background-color: rgba(111, 66, 193, 0.1);
    .status-icon { background-color: #673ab7; }
    .status-title { color: #673ab7; }
  }
  
  .status-icon.large {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    margin-right: 24rpx;
    flex-shrink: 0;
  }
  
  .status-content {
    flex: 1;
    
    .status-title {
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 8rpx;
    }
    
    .status-desc {
      font-size: 26rpx;
      color: $text-secondary;
      line-height: 1.5;
    }
  }
}

/* 附加信息 */
.extra-info {
  background-color: #f5f5f5;
  padding: 20rpx;
  border-radius: 12rpx;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    margin-bottom: 8rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .info-label {
      color: $text-light;
    }
    
    .info-value {
      color: $text-secondary;
    }
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
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
      border: 2rpx solid rgba($primary-color, 0.3);
    }
    
    &.primary {
      background-color: $primary-color;
      color: white;
      border: none;
      box-shadow: 0 4rpx 16rpx rgba($primary-color, 0.2);
    }
  }
  
  /* 根据状态调整按钮颜色 */
  &.approved {
    .action-btn.primary {
      background-color: #4caf50;
      box-shadow: 0 4rpx 16rpx rgba(#4caf50, 0.2);
    }
    .action-btn.secondary {
      background-color: rgba(#4caf50, 0.1);
      color: #4caf50;
      border-color: rgba(#4caf50, 0.3);
    }
  }
  
  &.rejected {
    .action-btn.primary {
      background-color: #f44336;
      box-shadow: 0 4rpx 16rpx rgba(#f44336, 0.2);
    }
    .action-btn.secondary {
      background-color: rgba(#f44336, 0.1);
      color: #f44336;
      border-color: rgba(#f44336, 0.3);
    }
  }
  
  &.expired {
    .action-btn.primary {
      background-color: #ff9800;
      box-shadow: 0 4rpx 16rpx rgba(#ff9800, 0.2);
    }
    .action-btn.secondary {
      background-color: rgba(#ff9800, 0.1);
      color: #ff9800;
      border-color: rgba(#ff9800, 0.3);
    }
  }
  
  &.cancelled {
    .action-btn.primary {
      background-color: #673ab7;
      box-shadow: 0 4rpx 16rpx rgba(#673ab7, 0.2);
    }
    .action-btn.secondary {
      background-color: rgba(#673ab7, 0.1);
      color: #673ab7;
      border-color: rgba(#673ab7, 0.3);
    }
  }
}
</style> 