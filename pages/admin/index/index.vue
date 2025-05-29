<template>
  <view class="admin-dashboard-container">
    <!-- 顶部导航区 -->
    <TopBar title="管理后台" :showBack="false" :withBorder="true" />
    <AdminNavBar currentPath="/pages/admin/index/index" />
    
    <!-- 统计数据卡片区 -->
    <view class="stats-row">
      <view class="stats-card" @click="navigateTo('/pages/admin/product/list')">
        <view class="stats-icon" style="background-color: #e3f2fd;">
          <image src="/static/images/product-icon.png" mode="aspectFit" />
        </view>
        <view class="stats-content">
          <text class="stats-title">产品总数</text>
          <text class="stats-value">{{ stats.productCount }}</text>
        </view>
      </view>
      
      <view class="stats-card" @click="navigateTo('/pages/admin/quote/list')">
        <view class="stats-icon" style="background-color: #e8f5e9;">
          <image src="/static/images/price.png" mode="aspectFit" />
        </view>
        <view class="stats-content">
          <text class="stats-title">报价总数</text>
          <text class="stats-value">{{ stats.quoteCount }}</text>
        </view>
      </view>
      
      <view class="stats-card" @click="navigateTo('/pages/admin/user/list')">
        <view class="stats-icon" style="background-color: #fff3e0;">
          <image src="/static/images/user-icon.png" mode="aspectFit" />
        </view>
        <view class="stats-content">
          <text class="stats-title">用户总数</text>
          <text class="stats-value">{{ stats.userCount }}</text>
        </view>
      </view>
      
      <view class="stats-card" @click="navigateTo('/pages/admin/message/list')">
        <view class="stats-icon" style="background-color: #e1f5fe;">
          <image src="/static/images/message-icon.png" mode="aspectFit" />
        </view>
        <view class="stats-content">
          <text class="stats-title">未读消息</text>
          <text class="stats-value">{{ stats.unreadMessages }}</text>
        </view>
      </view>
    </view>
    
    <!-- 快速导航区 -->
    <view class="section-title">快速导航</view>
    <view class="quick-nav-grid">
      <view class="nav-item" v-for="(item, index) in navItems" :key="index" @click="navigateTo(item.path)">
        <image :src="item.icon" class="nav-icon" mode="aspectFit" />
        <text class="nav-text">{{ item.name }}</text>
      </view>
    </view>
    
    <!-- 最新报价区 -->
    <view class="section-title">最新报价</view>
    <view class="recent-quotes">
      <view class="quote-item" v-for="(quote, index) in recentQuotes" :key="index" @click="viewQuoteDetail(quote.quote_id, quote.product_id)">
        <view class="quote-header">
          <text class="quote-product">{{ quote.product_name }}</text>
          <text class="quote-status" :class="quote.status">{{ getStatusText(quote.status) }}</text>
        </view>
        <view class="quote-info">
          <text class="quote-user">供应商: {{ quote.username }}</text>
          <text class="quote-price">¥{{ quote.price.toFixed(2) }}</text>
        </view>
        <view class="quote-footer">
          <text class="quote-date">{{ formatDate(quote.created_at) }}</text>
          <text class="view-detail">查看详情 ></text>
        </view>
      </view>
    </view>
    
    <LoadingAnimation :loading="loading" />
  </view>
</template>

<script>
import TopBar from '../../../components/TopBar.vue'
import AdminNavBar from '../../../components/AdminNavBar.vue'
import LoadingAnimation from '../../../components/LoadingAnimation.vue'

export default {
  name: 'AdminDashboard',
  components: { TopBar, AdminNavBar, LoadingAnimation },
  data() {
    return {
      loading: false,
      stats: {
        productCount: 0,
        quoteCount: 0,
        userCount: 0,
        unreadMessages: 0
      },
      navItems: [
        { name: '产品管理', path: '/pages/admin/product/list', icon: '/static/images/product-icon.png' },
        { name: '报价管理', path: '/pages/admin/quote/list', icon: '/static/images/price.png' },
        { name: '用户管理', path: '/pages/admin/user/list', icon: '/static/images/user-icon.png' },
        { name: '消息中心', path: '/pages/admin/message/list', icon: '/static/images/message-icon.png' },
        { name: '系统设置', path: '/pages/admin/profile/settings', icon: '/static/images/settings-icon.png' }
      ],
      recentQuotes: []
    }
  },
  created() {
    this.fetchDashboardData()
  },
  methods: {
    fetchDashboardData() {
      this.loading = true
      
      // 模拟加载统计数据
      setTimeout(() => {
        this.stats = {
          productCount: 127,
          quoteCount: 358,
          userCount: 86,
          unreadMessages: 12
        }
        
        // 模拟最近报价数据
        this.recentQuotes = [
          {
            quote_id: 'Q10001',
            product_id: 'P1001',
            product_name: '智能手表',
            username: '李四',
            price: 1280.00,
            status: 'pending',
            created_at: '2023-08-25T09:30:00Z'
          },
          {
            quote_id: 'Q10002',
            product_id: 'P1002',
            product_name: '蓝牙耳机',
            username: '王五',
            price: 299.00,
            status: 'approved',
            created_at: '2023-08-24T16:45:00Z'
          },
          {
            quote_id: 'Q10003',
            product_id: 'P1003',
            product_name: '智能音箱',
            username: '赵六',
            price: 799.00,
            status: 'rejected',
            created_at: '2023-08-24T10:20:00Z'
          },
          {
            quote_id: 'Q10004',
            product_id: 'P1004',
            product_name: '无线充电器',
            username: '钱七',
            price: 159.00,
            status: 'pending',
            created_at: '2023-08-23T14:10:00Z'
          }
        ]
        
        this.loading = false
      }, 300) // 减少加载时间以提高响应速度
    },
    navigateTo(path) {
      uni.navigateTo({
        url: path,
        fail: () => {
          // 如果navigateTo失败，尝试switchTab
          uni.switchTab({
            url: path,
            fail: (err) => {
              console.error('导航失败:', err)
              uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
              })
            }
          })
        }
      })
    },
    viewQuoteDetail(quoteId, productId) {
      uni.navigateTo({
        url: `/pages/admin/quote/detail?id=${quoteId}&productId=${productId}`
      })
    },
    getStatusText(status) {
      const statusMap = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已拒绝'
      }
      return statusMap[status] || status
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-dashboard-container {
  padding-bottom: 30rpx;
  
  .stats-row {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;
  }
  
  .stats-card {
    width: calc(50% - 20rpx);
    background-color: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    margin: 10rpx;
    padding: 20rpx;
    display: flex;
    align-items: center;
    
    .stats-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      
      image {
        width: 48rpx;
        height: 48rpx;
      }
    }
    
    .stats-content {
      flex: 1;
      
      .stats-title {
        font-size: 26rpx;
        color: #666;
      }
      
      .stats-value {
        font-size: 36rpx;
        color: #333;
        font-weight: bold;
      }
    }
  }
  
  .section-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    margin: 30rpx 20rpx 20rpx;
  }
  
  .quick-nav-grid {
    padding: 0 10rpx;
    display: flex;
    flex-wrap: wrap;
    
    .nav-item {
      width: calc(33.33% - 20rpx);
      margin: 10rpx;
      height: 180rpx;
      background-color: #fff;
      border-radius: 12rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      
      .nav-icon {
        width: 64rpx;
        height: 64rpx;
        margin-bottom: 16rpx;
      }
      
      .nav-text {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
  
  .recent-quotes {
    padding: 0 20rpx;
    
    .quote-item {
      background-color: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      
      .quote-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;
        
        .quote-product {
          font-size: 30rpx;
          font-weight: 500;
          color: #333;
        }
        
        .quote-status {
          font-size: 24rpx;
          padding: 4rpx 16rpx;
          border-radius: 30rpx;
          
          &.pending {
            background-color: #fff8e1;
            color: #ff8f00;
          }
          
          &.approved {
            background-color: #e8f5e9;
            color: #43a047;
          }
          
          &.rejected {
            background-color: #ffebee;
            color: #e53935;
          }
        }
      }
      
      .quote-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16rpx;
        
        .quote-user {
          font-size: 26rpx;
          color: #666;
        }
        
        .quote-price {
          font-size: 28rpx;
          color: #f44336;
          font-weight: 500;
        }
      }
      
      .quote-footer {
        .quote-date {
          font-size: 24rpx;
          color: #999;
        }
        .view-detail {
          font-size: 24rpx;
          color: #999;
          margin-left: 16rpx;
        }
      }
    }
  }
}
</style> 