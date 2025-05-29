<template>
  <view class="admin-quote-detail-container">
    <loading-animation :loading="isLoading" text="加载报价详情..." />
    
    <!-- 错误提示条 -->
    <view class="error-bar" v-if="hasError && !isLoading">
      <text class="error-message">{{ errorMessage }}</text>
      <view class="error-action" @click="fetchQuoteDetail">重试</view>
    </view>
    
    <view class="content-wrapper" v-if="!isLoading">
      <!-- 页面标题 -->
      <view class="page-header">
        <text class="page-title">报价详情</text>
        <text class="page-subtitle">查看并管理用户提交的报价</text>
      </view>
      
      <!-- 状态卡片 -->
      <view class="status-card" :class="quote.status">
        <view class="status-icon">{{ statusIcons[quote.status] }}</view>
        <view class="status-content">
          <text class="status-title">{{ getStatusText(quote.status) }}</text>
          <text class="status-desc">{{ statusMessages[quote.status].desc }}</text>
        </view>
      </view>
      
      <!-- 主卡片内容 -->
      <base-card class="quote-card">
        <view class="quote-header">
          <text class="quote-title">基本信息</text>
        </view>
        
        <view class="quote-content">
          <!-- 用户信息区域 -->
          <view class="user-section">
            <view class="user-info">
              <text class="user-name">{{ quote.user_name }}</text>
              <text class="user-id">用户ID: {{ quote.user_id }}</text>
            </view>
            <view class="quote-date">
              <text>提交时间: {{ formatDate(quote.created_at) }}</text>
            </view>
          </view>
          
          <!-- 产品信息区域 -->
          <view class="product-section">
            <view class="product-info">
              <text class="product-name">{{ quote.product_name }}</text>
              <text class="product-id">产品ID: {{ quote.product_id }}</text>
            </view>
          </view>
          
          <!-- 报价详情信息 -->
          <view class="detail-section">
            <view class="info-grid">
              <view class="info-item">
                <text class="info-label">货代公司</text>
                <text class="info-value">{{ quote.forwarder_name }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">出运线路</text>
                <text class="info-value">{{ quote.shipping_route }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">时效</text>
                <text class="info-value">{{ quote.delivery_time }}</text>
              </view>
            </view>
            
            <view class="info-grid">
              <view class="info-item">
                <text class="info-label">单价</text>
                <text class="info-value">¥{{ quote.price_per_kg }}/kg</text>
              </view>
              <view class="info-item">
                <text class="info-label">总毛重</text>
                <text class="info-value">{{ quote.total_gross_weight }}kg</text>
              </view>
              <view class="info-item">
                <text class="info-label">总运费</text>
                <text class="info-value price">¥{{ quote.total_freight }}</text>
              </view>
            </view>
            
            <view class="info-grid">
              <view class="info-item">
                <text class="info-label">报关费用/票</text>
                <text class="info-value">¥{{ quote.customs_fee }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">总费用</text>
                <text class="info-value price">¥{{ quote.total_cost }}</text>
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
          
          <!-- 附加信息 -->
          <view class="extra-info">
            <view class="info-item">
              <text class="info-label">报价编号</text>
              <text class="info-value">{{ quoteId }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">提交时间</text>
              <text class="info-value">{{ formatDate(quote.created_at) }}</text>
            </view>
            <view class="info-item" v-if="quote.status === 'approved' || quote.status === 'rejected'">
              <text class="info-label">审核时间</text>
              <text class="info-value">{{ formatDate(quote.updated_at) }}</text>
            </view>
            <view class="info-item" v-if="quote.status === 'approved' || quote.status === 'rejected'">
              <text class="info-label">审核人</text>
              <text class="info-value">{{ quote.reviewer || '系统管理员' }}</text>
            </view>
          </view>
        </view>
      </base-card>
      
      <!-- 底部操作按钮组 -->
      <view class="action-buttons" v-if="quote.status === 'pending'">
        <button class="action-btn secondary" @click="handleReject">
          <text class="btn-icon">✕</text>
          <text>拒绝报价</text>
        </button>
        <button class="action-btn primary" @click="handleApprove">
          <text class="btn-icon">✓</text>
          <text>通过报价</text>
        </button>
      </view>
      
      <!-- 已审核状态按钮组 -->
      <view class="action-buttons" v-else>
        <button class="action-btn secondary" @click="handleGoBack">
          <text class="btn-icon">←</text>
          <text>返回列表</text>
        </button>
        <button class="action-btn primary" @click="handleContact">
          <text class="btn-icon">📞</text>
          <text>联系用户</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import BaseCard from '../../../components/BaseCard.vue'
import BaseButton from '../../../components/BaseButton.vue'
import LoadingAnimation from '../../../components/LoadingAnimation.vue'
import dayjs from 'dayjs'

export default {
  name: 'AdminQuoteDetail',
  components: {
    BaseCard,
    BaseButton,
    LoadingAnimation
  },
  data() {
    return {
      quoteId: '',
      productId: '',
      quote: {
        user_id: '',
        user_name: '',
        product_id: '',
        product_name: '',
        status: 'pending',
        forwarder_name: '',
        shipping_route: '',
        delivery_time: '',
        price_per_kg: 0,
        total_gross_weight: 0,
        total_freight: 0,
        customs_fee: 0,
        total_cost: 0,
        remark: '',
        created_at: new Date(),
        updated_at: null,
        reviewer: ''
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
          title: '待审核',
          desc: '该报价正在等待审核，您可以选择通过或拒绝。'
        },
        approved: {
          title: '已通过',
          desc: '您已经通过了该报价，用户可以查看并继续后续流程。'
        },
        rejected: {
          title: '已拒绝',
          desc: '您已拒绝了该报价，用户可以查看拒绝原因并重新提交。'
        },
        expired: {
          title: '已过期',
          desc: '该报价已过期，不需要进一步操作。'
        },
        cancelled: {
          title: '已取消',
          desc: '用户已取消了该报价，不需要进一步操作。'
        }
      },
      shouldFail: false // 用于开发时模拟请求失败的开关
    }
  },
  onLoad(options) {
    this.quoteId = options.quoteId || ''
    this.productId = options.productId || ''
    
    // 开发环境下随机决定是否模拟失败 (10%的概率失败)
    if (process.env.NODE_ENV === 'development') {
      this.shouldFail = Math.random() < 0.1
    }
    
    this.fetchQuoteDetail()
  },
  methods: {
    async fetchQuoteDetail() {
      this.isLoading = true
      this.hasError = false
      
      try {
        // 模拟API请求，减少加载时间以便调试
        setTimeout(() => {
          // 如果shouldFail为true，则模拟请求失败
          if (this.shouldFail) {
            this.handleError(new Error('模拟请求失败，这是一个随机测试错误'))
            return
          }
          
          // 模拟数据
          const mockData = {
            quote_id: this.quoteId || 'Q10001',
            user_id: 'U1002',
            user_name: '李四',
            product_id: this.productId || 'P1001',
            product_name: '智能手表 Pro Max',
            status: 'pending',
            forwarder_name: '环球快递',
            shipping_route: '上海 - 洛杉矶',
            delivery_time: '15-20天',
            price_per_kg: 45,
            total_gross_weight: 350,
            total_freight: 15750,
            customs_fee: 500,
            total_cost: 16250,
            remark: '需要特殊包装，请在运输过程中注意防震。',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
            updated_at: null,
            reviewer: ''
          }
          
          this.quote = mockData
          this.isLoading = false
        }, 300) // 将模拟延迟从800ms降低到300ms，提高响应速度
      } catch (error) {
        this.handleError(error)
      }
    },
    
    handleError(error) {
      console.error('获取报价详情失败:', error)
      this.hasError = true
      this.errorMessage = error.message || '获取报价详情失败，请重试'
      this.isLoading = false
    },
    
    formatDate(date) {
      if (!date) return '-'
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝',
        expired: '已过期',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    },
    
    handleApprove() {
      uni.showModal({
        title: '确认通过',
        content: '确定要通过该报价吗？通过后将通知用户。',
        success: (res) => {
          if (res.confirm) {
            // 更新状态
            this.quote.status = 'approved'
            this.quote.updated_at = new Date()
            this.quote.reviewer = '管理员'
            
            // 显示成功提示
            uni.showToast({
              title: '已通过该报价',
              icon: 'success'
            })
          }
        }
      })
    },
    
    handleReject() {
      uni.showModal({
        title: '拒绝报价',
        content: '确定要拒绝该报价吗？拒绝后将通知用户。',
        success: (res) => {
          if (res.confirm) {
            // 更新状态
            this.quote.status = 'rejected'
            this.quote.updated_at = new Date()
            this.quote.reviewer = '管理员'
            
            // 显示成功提示
            uni.showToast({
              title: '已拒绝该报价',
              icon: 'success'
            })
          }
        }
      })
    },
    
    handleGoBack() {
      uni.navigateBack()
    },
    
    handleContact() {
      uni.showModal({
        title: '联系用户',
        content: `是否联系用户 ${this.quote.user_name}？`,
        success: (res) => {
          if (res.confirm) {
            // 模拟联系操作
            uni.showToast({
              title: '已发送消息给用户',
              icon: 'success'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/theme.scss';

.admin-quote-detail-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding: 24rpx;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.page-header {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 8rpx;
    display: block;
  }
  
  .page-subtitle {
    font-size: 26rpx;
    color: $text-secondary;
  }
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

/* 状态卡片 */
.status-card {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  background-color: white;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  &.pending {
    border-left: 8rpx solid #9e9e9e;
    .status-icon { color: #9e9e9e; }
    .status-title { color: #9e9e9e; }
  }
  
  &.approved {
    border-left: 8rpx solid #4caf50;
    .status-icon { color: #4caf50; }
    .status-title { color: #4caf50; }
  }
  
  &.rejected {
    border-left: 8rpx solid #f44336;
    .status-icon { color: #f44336; }
    .status-title { color: #f44336; }
  }
  
  &.expired {
    border-left: 8rpx solid #ff9800;
    .status-icon { color: #ff9800; }
    .status-title { color: #ff9800; }
  }
  
  &.cancelled {
    border-left: 8rpx solid #673ab7;
    .status-icon { color: #673ab7; }
    .status-title { color: #673ab7; }
  }
  
  .status-icon {
    font-size: 40rpx;
    margin-right: 24rpx;
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

.quote-card {
  margin-bottom: 24rpx;
  
  .quote-header {
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;
    border-bottom: 1px solid #f5f5f5;
    
    .quote-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $text-primary;
    }
  }
}

/* 用户信息区 */
.user-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px dashed #f0f0f0;
  
  .user-info {
    .user-name {
      font-size: 28rpx;
      font-weight: 500;
      color: $text-primary;
      margin-right: 16rpx;
    }
    
    .user-id {
      font-size: 24rpx;
      color: $text-secondary;
    }
  }
  
  .quote-date {
    font-size: 24rpx;
    color: $text-secondary;
  }
}

/* 产品信息区 */
.product-section {
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px dashed #f0f0f0;
  
  .product-info {
    .product-name {
      font-size: 28rpx;
      font-weight: 500;
      color: $text-primary;
      margin-right: 16rpx;
    }
    
    .product-id {
      font-size: 24rpx;
      color: $text-secondary;
    }
  }
}

/* 详细信息区 */
.detail-section {
  margin-bottom: 30rpx;
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24rpx 30rpx;
    margin-bottom: 24rpx;
    
    .info-item {
      display: flex;
      flex-direction: column;
      
      .info-label {
        font-size: 24rpx;
        color: $text-secondary;
        margin-bottom: 8rpx;
      }
      
      .info-value {
        font-size: 28rpx;
        color: $text-primary;
        font-weight: 500;
        
        &.price {
          color: #f44336;
        }
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

/* 附加信息 */
.extra-info {
  background-color: #f5f5f5;
  padding: 20rpx;
  border-radius: 12rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  
  .info-item {
    font-size: 24rpx;
    
    .info-label {
      color: $text-light;
      margin-right: 8rpx;
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
    }
  }
}
</style> 