<template>
  <view class="admin-quote-list-container">
    <view class="header-bar">
      <input class="search-input" v-model="search" placeholder="搜索报价编号/用户/产品" @input="handleSearch" />
      <picker :range="statusOptions" :value="statusIndex" @change="onStatusChange">
        <view class="filter-item">{{ statusOptions[statusIndex] }}</view>
      </picker>
    </view>
    
    <view class="quote-list">
      <view v-for="(item, index) in filteredQuotes" :key="index" class="quote-card" :class="item.status">
        <view class="quote-header">
          <view class="header-left">
            <text class="quote-id">报价编号: {{ item.quote_id }}</text>
            <text class="status-tag" :class="item.status">{{ getStatusText(item.status) }}</text>
          </view>
          <text class="quote-date">{{ formatDate(item.created_at) }}</text>
        </view>
        
        <view class="quote-content">
          <view class="info-row">
            <text class="info-label">货代公司:</text>
            <text class="info-value">{{ item.forwarder_name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">出运线路:</text>
            <text class="info-value">{{ item.shipping_route }}</text>
          </view>
          <view class="info-row price-row">
            <view class="info-item">
              <text class="info-label">单价:</text>
              <text class="info-value">¥{{ item.price_per_kg }}/kg</text>
            </view>
            <view class="info-item">
              <text class="info-label">总费用:</text>
              <text class="info-value price">¥{{ item.total_cost }}</text>
            </view>
          </view>
        </view>
        
        <view class="quote-footer">
          <view class="user-info">
            <text class="user-name">{{ item.user_name }}</text>
            <text class="product-name">{{ item.product_name }}</text>
          </view>
          <view class="quote-actions">
            <button v-if="item.status === 'pending'" class="mini-btn approve" @click="handleApprove(item)">通过</button>
            <button v-if="item.status === 'pending'" class="mini-btn reject" @click="handleReject(item)">拒绝</button>
            <button class="mini-btn view" @click="viewDetail(item)">查看</button>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-if="filteredQuotes.length === 0">
        <text class="empty-text">暂无相关报价</text>
      </view>
    </view>
    
    <!-- 分页控制 -->
    <view class="pagination-bar">
      <button class="page-btn" :disabled="page === 1" @click="page--">上一页</button>
      <text class="page-info">第{{ page }}页</text>
      <button class="page-btn" :disabled="!hasNextPage" @click="page++">下一页</button>
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'AdminQuoteList',
  data() {
    return {
      search: '',
      page: 1,
      pageSize: 10,
      statusOptions: ['全部状态', '待审核', '已通过', '已拒绝', '已过期', '已取消'],
      statusIndex: 0,
      quotes: []
    }
  },
  computed: {
    filteredQuotes() {
      let list = this.quotes
      
      // 搜索过滤
      if (this.search) {
        const s = this.search.trim().toLowerCase()
        list = list.filter(item =>
          (item.quote_id && item.quote_id.toLowerCase().includes(s)) ||
          (item.user_name && item.user_name.toLowerCase().includes(s)) ||
          (item.product_name && item.product_name.toLowerCase().includes(s)) ||
          (item.forwarder_name && item.forwarder_name.toLowerCase().includes(s))
        )
      }
      
      // 状态过滤
      if (this.statusIndex > 0) {
        const statusMap = {
          1: 'pending',
          2: 'approved',
          3: 'rejected',
          4: 'expired',
          5: 'cancelled'
        }
        list = list.filter(item => item.status === statusMap[this.statusIndex])
      }
      
      // 分页
      const start = (this.page - 1) * this.pageSize
      return list.slice(start, start + this.pageSize)
    },
    hasNextPage() {
      let list = this.quotes
      
      if (this.search) {
        const s = this.search.trim().toLowerCase()
        list = list.filter(item =>
          (item.quote_id && item.quote_id.toLowerCase().includes(s)) ||
          (item.user_name && item.user_name.toLowerCase().includes(s)) ||
          (item.product_name && item.product_name.toLowerCase().includes(s)) ||
          (item.forwarder_name && item.forwarder_name.toLowerCase().includes(s))
        )
      }
      
      if (this.statusIndex > 0) {
        const statusMap = {
          1: 'pending',
          2: 'approved',
          3: 'rejected',
          4: 'expired',
          5: 'cancelled'
        }
        list = list.filter(item => item.status === statusMap[this.statusIndex])
      }
      
      return list.length > this.page * this.pageSize
    }
  },
  created() {
    this.loadQuotes()
  },
  methods: {
    loadQuotes() {
      // 生成模拟报价数据
      const mockUsers = [
        { id: 'U1001', name: '张三' },
        { id: 'U1002', name: '李四' },
        { id: 'U1003', name: '王五' }
      ]
      
      const mockProducts = [
        { id: 'P1001', name: '智能手表 Pro Max' },
        { id: 'P1002', name: '蓝牙耳机' },
        { id: 'P1003', name: '智能音箱' }
      ]
      
      const mockForwarders = [
        '环球快递',
        '海运物流',
        '航空货运',
        '京东物流',
        '顺丰速运'
      ]
      
      const mockRoutes = [
        '上海 - 洛杉矶',
        '深圳 - 纽约',
        '广州 - 伦敦',
        '杭州 - 温哥华',
        '南京 - 悉尼'
      ]
      
      const mockQuotes = []
      
      // 生成20条随机报价数据
      for (let i = 0; i < 20; i++) {
        const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        const product = mockProducts[Math.floor(Math.random() * mockProducts.length)]
        const price = Math.floor(40 + Math.random() * 20) // 40-60元/kg
        const weight = Math.floor(100 + Math.random() * 400) // 100-500kg
        const freight = price * weight
        const customsFee = Math.floor(300 + Math.random() * 500) // 300-800元
        const totalCost = freight + customsFee
        
        // 设置状态，确保有不同状态的数据
        let status
        if (i < 6) {
          status = 'pending' // 30%待审核
        } else if (i < 12) {
          status = 'approved' // 30%已通过
        } else if (i < 16) {
          status = 'rejected' // 20%已拒绝
        } else if (i < 18) {
          status = 'expired' // 10%已过期
        } else {
          status = 'cancelled' // 10%已取消
        }
        
        // 创建时间在过去30天内随机
        const createdDaysAgo = Math.floor(Math.random() * 30)
        const createdAt = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000)
        
        // 计算更新时间（如果已审核）
        let updatedAt = null
        if (status === 'approved' || status === 'rejected') {
          const updateDelay = Math.floor(Math.random() * 3) + 1 // 1-3天后审核
          updatedAt = new Date(createdAt.getTime() + updateDelay * 24 * 60 * 60 * 1000)
        }
        
        mockQuotes.push({
          quote_id: `Q${10001 + i}`,
          user_id: user.id,
          user_name: user.name,
          product_id: product.id,
          product_name: product.name,
          status: status,
          forwarder_name: mockForwarders[Math.floor(Math.random() * mockForwarders.length)],
          shipping_route: mockRoutes[Math.floor(Math.random() * mockRoutes.length)],
          delivery_time: `${Math.floor(5 + Math.random() * 10)}-${Math.floor(15 + Math.random() * 10)}天`,
          price_per_kg: price,
          total_gross_weight: weight,
          total_freight: freight,
          customs_fee: customsFee,
          total_cost: totalCost,
          remark: i % 3 === 0 ? '这是报价的备注信息。' : '',
          created_at: createdAt,
          updated_at: updatedAt,
          reviewer: updatedAt ? '管理员' : null
        })
      }
      
      // 按创建时间降序排序
      this.quotes = mockQuotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    
    formatDate(date) {
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
    
    handleSearch() {
      this.page = 1
    },
    
    onStatusChange(e) {
      this.statusIndex = e.detail.value
      this.page = 1
    },
    
    viewDetail(item) {
      uni.navigateTo({
        url: `/pages/admin/quote/detail?quoteId=${item.quote_id}&productId=${item.product_id}&status=${item.status}`
      })
    },
    
    handleApprove(item) {
      uni.showModal({
        title: '确认通过',
        content: `确定通过用户"${item.user_name}"的报价吗？`,
        success: (res) => {
          if (res.confirm) {
            // 更新报价状态
            item.status = 'approved'
            item.updated_at = new Date()
            item.reviewer = '管理员'
            
            uni.showToast({
              title: '已通过该报价',
              icon: 'success'
            })
          }
        }
      })
    },
    
    handleReject(item) {
      uni.showModal({
        title: '拒绝报价',
        content: `确定拒绝用户"${item.user_name}"的报价吗？`,
        success: (res) => {
          if (res.confirm) {
            // 更新报价状态
            item.status = 'rejected'
            item.updated_at = new Date()
            item.reviewer = '管理员'
            
            uni.showToast({
              title: '已拒绝该报价',
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

.admin-quote-list-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding: 24rpx 0;
}

.header-bar {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
  align-items: center;
  padding: 0 24rpx;
  
  .search-input {
    flex: 1;
    height: 64rpx;
    border: 1px solid #e0e0e0;
    border-radius: 8rpx;
    font-size: 26rpx;
    padding: 0 20rpx;
    background: #fff;
  }
  
  .filter-item {
    height: 64rpx;
    padding: 0 20rpx;
    background: #f5f5f5;
    color: $primary-color;
    border-radius: 8rpx;
    font-size: 26rpx;
    display: flex;
    align-items: center;
  }
}

.quote-list {
  padding: 0 24rpx;
  
  .quote-card {
    background: #fff;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    
    &.pending {
      border-left: 6rpx solid #9e9e9e;
    }
    
    &.approved {
      border-left: 6rpx solid #4caf50;
    }
    
    &.rejected {
      border-left: 6rpx solid #f44336;
    }
    
    &.expired {
      border-left: 6rpx solid #ff9800;
    }
    
    &.cancelled {
      border-left: 6rpx solid #673ab7;
    }
  }
}

.quote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .quote-id {
      font-size: 26rpx;
      color: $text-primary;
      font-weight: 500;
      margin-right: 16rpx;
    }
    
    .status-tag {
      font-size: 22rpx;
      padding: 4rpx 12rpx;
      border-radius: 4rpx;
      
      &.pending {
        background: #f5f5f5;
        color: #757575;
      }
      
      &.approved {
        background: #e8f5e9;
        color: #4caf50;
      }
      
      &.rejected {
        background: #ffebee;
        color: #f44336;
      }
      
      &.expired {
        background: #fff3e0;
        color: #ff9800;
      }
      
      &.cancelled {
        background: #ede7f6;
        color: #673ab7;
      }
    }
  }
  
  .quote-date {
    font-size: 24rpx;
    color: $text-secondary;
  }
}

.quote-content {
  margin-bottom: 16rpx;
  
  .info-row {
    display: flex;
    margin-bottom: 8rpx;
    font-size: 26rpx;
    
    .info-label {
      color: $text-secondary;
      margin-right: 12rpx;
      min-width: 120rpx;
    }
    
    .info-value {
      color: $text-primary;
      flex: 1;
    }
    
    &.price-row {
      display: flex;
      justify-content: space-between;
      
      .info-item {
        display: flex;
        
        .info-label {
          min-width: auto;
        }
        
        .info-value {
          &.price {
            color: #f44336;
            font-weight: 500;
          }
        }
      }
    }
  }
}

.quote-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1px dashed #eee;
  
  .user-info {
    .user-name {
      font-size: 26rpx;
      color: $text-primary;
      font-weight: 500;
      margin-right: 12rpx;
    }
    
    .product-name {
      font-size: 24rpx;
      color: $text-secondary;
    }
  }
  
  .quote-actions {
    display: flex;
    gap: 12rpx;
    
    .mini-btn {
      font-size: 22rpx;
      padding: 6rpx 16rpx;
      border-radius: 4rpx;
      line-height: 1.5;
      
      &.approve {
        background: #e8f5e9;
        color: #4caf50;
      }
      
      &.reject {
        background: #ffebee;
        color: #f44336;
      }
      
      &.view {
        background: #e3f2fd;
        color: #1976d2;
      }
    }
  }
}

.empty-state {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;
  
  .empty-text {
    font-size: 28rpx;
    color: $text-light;
  }
}

.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16rpx;
  margin: 24rpx 0;
  
  .page-btn {
    font-size: 24rpx;
    min-width: 80rpx;
    height: 48rpx;
    line-height: 48rpx;
    border-radius: 24rpx;
    background: #e3f2fd;
    color: #1976d2;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20rpx;
    
    &:disabled {
      background: #eee;
      color: #aaa;
    }
  }
  
  .page-info {
    font-size: 24rpx;
    color: $text-secondary;
  }
}
</style> 