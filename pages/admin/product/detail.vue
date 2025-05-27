<template>
  <view class="admin-product-detail-container">
    <loading-animation :loading="isLoading" text="加载产品详情..." />
    <view class="content-wrapper" v-if="!isLoading">
      <view class="page-header">
        <text class="page-title">产品详情</text>
        <text class="page-subtitle">查看产品详细信息及管理操作</text>
      </view>
      <base-card class="form-card">
        <view class="form-content">
          <view class="form-row">
            <image :src="product.product_image || defaultImg" class="product-image" mode="aspectFill" />
            <view class="product-info-main">
              <text class="product-title">{{ product.product_name || '-' }}</text>
              <text class="product-desc">{{ product.description || '-' }}</text>
            </view>
          </view>
          <view class="info-section">
            <text class="section-title">基本信息</text>
            <view class="info-item"><text class="label">产品编号：</text><text class="value">{{ product.product_id || '-' }}</text></view>
            <view class="info-item"><text class="label">仓库地址：</text><text class="value">{{ product.warehouse || '-' }}</text></view>
            <view class="info-item"><text class="label">邮编：</text><text class="value">{{ product.zipcode || '-' }}</text></view>
          </view>
          <view class="info-section">
            <text class="section-title">尺寸信息</text>
            <view class="info-grid">
              <view class="info-item"><text class="label">长度：</text><text class="value">{{ product.length || '-' }}cm</text></view>
              <view class="info-item"><text class="label">宽度：</text><text class="value">{{ product.width || '-' }}cm</text></view>
              <view class="info-item"><text class="label">高度：</text><text class="value">{{ product.height || '-' }}cm</text></view>
            </view>
          </view>
          <view class="info-section">
            <text class="section-title">重量信息</text>
            <view class="info-grid">
              <view class="info-item"><text class="label">毛重：</text><text class="value">{{ product.gross_weight || '-' }}kg</text></view>
              <view class="info-item"><text class="label">箱体重：</text><text class="value">{{ product.package_weight || '-' }}kg</text></view>
              <view class="info-item"><text class="label">计费重：</text><text class="value">{{ product.chargeable_weight || '-' }}kg</text></view>
            </view>
          </view>
          <view class="info-section">
            <text class="section-title">数量信息</text>
            <view class="info-grid">
              <view class="info-item"><text class="label">装箱量：</text><text class="value">{{ product.box_quantity || '-' }}</text></view>
              <view class="info-item"><text class="label">单位数量：</text><text class="value">{{ product.unit_quantity || '-' }}</text></view>
              <view class="info-item"><text class="label">总件数：</text><text class="value">{{ product.total_quantity || '-' }}</text></view>
            </view>
          </view>
          <view class="info-section">
            <text class="section-title">总量信息</text>
            <view class="info-grid">
              <view class="info-item"><text class="label">总体积：</text><text class="value">{{ product.total_volume || '-' }}m³</text></view>
              <view class="info-item"><text class="label">总毛重：</text><text class="value">{{ product.total_gross_weight || '-' }}kg</text></view>
            </view>
          </view>
        </view>
      </base-card>
      
      <!-- 用户报价列表 -->
      <base-card class="quotes-card">
        <view class="quotes-header">
          <text class="quotes-title">用户报价 ({{ quotes.length }})</text>
          <view class="quotes-filter">
            <picker :range="statusOptions" :value="statusFilterIndex" @change="onStatusFilterChange">
              <view class="filter-item">{{ statusOptions[statusFilterIndex] }}</view>
            </picker>
          </view>
        </view>
        
        <view class="empty-state" v-if="filteredQuotes.length === 0">
          <text class="empty-text">暂无相关报价</text>
        </view>
        
        <view class="quotes-list" v-else>
          <view class="quote-item" v-for="(quote, index) in filteredQuotes" :key="index" :class="quote.status">
            <view class="quote-content">
              <view class="quote-user-info">
                <text class="user-name">{{ quote.user_name }}</text>
                <text class="quote-date">{{ formatDate(quote.created_at) }}</text>
              </view>
              <view class="quote-details">
                <view class="quote-row">
                  <text class="quote-label">报价单价:</text>
                  <text class="quote-value price">￥{{ quote.price_per_kg }}/kg</text>
                </view>
                <view class="quote-row">
                  <text class="quote-label">交货期:</text>
                  <text class="quote-value">{{ quote.delivery_time }}</text>
                </view>
                <view class="quote-row">
                  <text class="quote-label">总费用:</text>
                  <text class="quote-value price">￥{{ quote.total_cost }}</text>
                </view>
              </view>
            </view>
            <view class="quote-status">
              <view class="status-tag" :class="quote.status">
                {{ getStatusText(quote.status) }}
              </view>
              <view class="quote-actions">
                <button v-if="quote.status === 'pending'" class="mini-btn approve" @click="handleApprove(quote)">通过</button>
                <button v-if="quote.status === 'pending'" class="mini-btn reject" @click="handleReject(quote)">拒绝</button>
                <button class="mini-btn view" @click="viewQuoteDetail(quote)">查看</button>
              </view>
            </view>
          </view>
        </view>
      </base-card>
      
      <view class="action-buttons">
        <button class="action-btn secondary" @click="handleDelete">删除</button>
        <button class="action-btn primary" @click="handleEdit">编辑</button>
      </view>
    </view>
  </view>
</template>

<script>
import BaseCard from '../../../components/BaseCard.vue'
import LoadingAnimation from '../../../components/LoadingAnimation.vue'
import { get } from '../../../utils/request'
import dayjs from 'dayjs'

export default {
  name: 'AdminProductDetail',
  components: { BaseCard, LoadingAnimation },
  data() {
    return {
      productId: '',
      product: {},
      quotes: [],
      isLoading: true,
      defaultImg: '/static/images/default-product.png',
      statusOptions: ['全部', '待审核', '已通过', '已拒绝'],
      statusFilterIndex: 0,
      scrollToQuotes: false
    }
  },
  computed: {
    filteredQuotes() {
      if (this.statusFilterIndex === 0) return this.quotes;
      
      const statusMap = {
        1: 'pending',
        2: 'approved', 
        3: 'rejected'
      };
      
      return this.quotes.filter(quote => quote.status === statusMap[this.statusFilterIndex]);
    }
  },
  onLoad(options) {
    this.productId = options.id
    this.fetchProductDetail()
    
    // 如果有滚动到报价列表的参数
    this.scrollToQuotes = options.scrollToQuotes === 'true'
  },
  onReady() {
    // 如果需要滚动到报价列表
    if (this.scrollToQuotes) {
      // 等待页面渲染完成后滚动
      setTimeout(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.quotes-card').boundingClientRect(data => {
          uni.pageScrollTo({
            scrollTop: data.top,
            duration: 300
          });
        }).exec();
      }, 500);
    }
  },
  methods: {
    async fetchProductDetail() {
      this.isLoading = true
      try {
        // 使用模拟数据
        this.product = {
          product_id: this.productId || 'P1001',
          product_name: '智能手表 Pro Max',
          description: '多功能健康监测智能手表，支持心率、血压、血氧监测',
          product_image: 'https://cdn.example.com/img/watch.jpg',
          warehouse: '上海仓',
          zipcode: '200001',
          length: 5.5,
          width: 4.2,
          height: 1.8,
          gross_weight: 0.35,
          package_weight: 0.15,
          chargeable_weight: 0.5,
          box_quantity: 50, // 装箱量
          unit_quantity: 200, // 单位数量
          total_quantity: 1000,
          total_volume: 2.5,
          total_gross_weight: 350
        };
        
        // 模拟用户报价数据
        this.quotes = this.generateMockQuotes();
      } catch (error) {
        uni.showToast({ title: error.message || '获取产品详情失败', icon: 'none' })
      } finally {
        setTimeout(() => { this.isLoading = false }, 400)
      }
    },
    
    // 生成模拟报价数据
    generateMockQuotes() {
      const mockUsers = [
        { id: 'U1001', name: '张三' },
        { id: 'U1002', name: '李四' },
        { id: 'U1003', name: '王五' },
        { id: 'U1004', name: '赵六' },
        { id: 'U1005', name: '钱七' }
      ];
      
      const statusOptions = ['pending', 'approved', 'rejected'];
      const quotes = [];
      
      // 生成8条随机报价
      for (let i = 0; i < 8; i++) {
        const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const price = Math.floor(40 + Math.random() * 20); // 40-60元/kg
        const totalCost = price * this.product.total_gross_weight;
        
        quotes.push({
          quote_id: `Q${1000 + i}`,
          user_id: user.id,
          user_name: user.name,
          product_id: this.productId,
          price_per_kg: price,
          delivery_time: `${Math.floor(5 + Math.random() * 10)}-${Math.floor(15 + Math.random() * 10)}天`,
          total_cost: totalCost,
          status: i < 3 ? 'pending' : statusOptions[Math.floor(Math.random() * 3)],
          created_at: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
          remarks: i % 2 === 0 ? '这是一些额外的备注说明' : ''
        });
      }
      
      // 按照创建时间倒序排序
      return quotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm');
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝',
        expired: '已过期'
      };
      return statusMap[status] || status;
    },
    
    onStatusFilterChange(e) {
      this.statusFilterIndex = e.detail.value;
    },
    
    handleEdit() {
      uni.navigateTo({ url: `/pages/admin/product/edit?id=${this.productId}` })
    },
    
    handleDelete() {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除产品「${this.product.product_name}」吗？`,
        success: (res) => {
          if (res.confirm) {
            // 这里可调用后端删除接口，当前仅做前端提示
            uni.showToast({ title: '已删除', icon: 'success' })
            setTimeout(() => {
              uni.navigateBack()
            }, 1000)
          }
        }
      })
    },
    
    handleApprove(quote) {
      uni.showModal({
        title: '确认通过',
        content: `确定通过用户"${quote.user_name}"的报价？`,
        success: (res) => {
          if (res.confirm) {
            // 更新报价状态
            quote.status = 'approved';
            uni.showToast({ title: '已通过该报价', icon: 'success' });
          }
        }
      });
    },
    
    handleReject(quote) {
      uni.showModal({
        title: '确认拒绝',
        content: `确定拒绝用户"${quote.user_name}"的报价？`,
        success: (res) => {
          if (res.confirm) {
            // 更新报价状态
            quote.status = 'rejected';
            uni.showToast({ title: '已拒绝该报价', icon: 'success' });
          }
        }
      });
    },
    
    viewQuoteDetail(quote) {
      // 跳转到管理员报价详情页面
      uni.navigateTo({
        url: `/pages/admin/quote/detail?quoteId=${quote.quote_id}&productId=${this.productId}&status=${quote.status}`
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/theme.scss';
.admin-product-detail-container {
  min-height: 100vh;
  background: $bg-secondary;
  padding: 32rpx 0;
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
    gap: 32rpx;
    margin-bottom: 32rpx;
    .product-image {
      width: 140rpx;
      height: 140rpx;
      border-radius: 12rpx;
      margin-right: 24rpx;
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
    }
  }
  .info-section {
    margin-bottom: 24rpx;
    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: $text-primary;
      margin-bottom: 12rpx;
      display: block;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18rpx;
    }
    .info-item {
      margin-bottom: 8rpx;
      .label {
        font-size: 24rpx;
        color: $text-secondary;
        margin-right: 8rpx;
      }
      .value {
        font-size: 24rpx;
        color: $text-primary;
      }
    }
  }
}

/* 报价列表样式 */
.quotes-card {
  margin-bottom: 24rpx;
}

.quotes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  .quotes-title {
    font-size: 30rpx;
    font-weight: bold;
    color: $text-primary;
  }
  
  .quotes-filter {
    .filter-item {
      font-size: 24rpx;
      color: $primary-color;
      background: rgba($primary-color, 0.1);
      border-radius: 6rpx;
      padding: 8rpx 16rpx;
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

.quotes-list {
  .quote-item {
    display: flex;
    justify-content: space-between;
    padding: 24rpx;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    &.pending {
      background-color: rgba(#fafafa, 0.6);
    }
    
    &.approved {
      background-color: rgba(#e8f5e9, 0.4);
    }
    
    &.rejected {
      background-color: rgba(#ffebee, 0.4);
    }
  }
  
  .quote-content {
    flex: 1;
    
    .quote-user-info {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .user-name {
        font-size: 28rpx;
        font-weight: 500;
        color: $text-primary;
      }
      
      .quote-date {
        font-size: 22rpx;
        color: $text-light;
        margin-left: 16rpx;
      }
    }
    
    .quote-details {
      .quote-row {
        display: flex;
        margin-bottom: 8rpx;
        
        .quote-label {
          font-size: 24rpx;
          color: $text-secondary;
          width: 120rpx;
        }
        
        .quote-value {
          font-size: 24rpx;
          color: $text-primary;
          
          &.price {
            color: #f44336;
          }
        }
      }
    }
  }
  
  .quote-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    
    .status-tag {
      font-size: 22rpx;
      padding: 4rpx 12rpx;
      border-radius: 6rpx;
      
      &.pending {
        background-color: #e0e0e0;
        color: #757575;
      }
      
      &.approved {
        background-color: #e8f5e9;
        color: #4caf50;
      }
      
      &.rejected {
        background-color: #ffebee;
        color: #f44336;
      }
    }
    
    .quote-actions {
      display: flex;
      gap: 8rpx;
      margin-top: 16rpx;
      
      .mini-btn {
        font-size: 22rpx;
        padding: 4rpx 12rpx;
        border-radius: 4rpx;
        line-height: 1.5;
        
        &.approve {
          background-color: #e8f5e9;
          color: #4caf50;
        }
        
        &.reject {
          background-color: #ffebee;
          color: #f44336;
        }
        
        &.view {
          background-color: #e3f2fd;
          color: #1976d2;
        }
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 32rpx;
  margin-top: 24rpx;
  padding: 24rpx 0;
  .action-btn {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: 500;
    &.secondary {
      background-color: #fbe9e7;
      color: #f44336;
      border: none;
    }
    &.primary {
      background-color: #1976D2;
      color: #fff;
      border: none;
    }
  }
}
</style> 