<template>
  <view class="admin-product-list-container">
    <view class="header-bar">
      <input class="search-input" v-model="search" placeholder="搜索产品名称/编号" @input="handleSearch" />
      <button class="add-btn" @click="handleAdd">+ 新增产品</button>
    </view>
    <view class="filter-bar">
      <picker :range="priceOptions" :value="priceIndex" @change="onPriceChange">
        <view class="filter-item">{{ priceOptions[priceIndex] }}</view>
      </picker>
      <picker :range="statusOptions" :value="statusIndex" @change="onStatusChange">
        <view class="filter-item">{{ statusOptions[statusIndex] }}</view>
      </picker>
      <picker :range="warehouseOptions" :value="warehouseIndex" @change="onWarehouseChange">
        <view class="filter-item">{{ warehouseOptions[warehouseIndex] }}</view>
      </picker>
    </view>
    <view class="product-list">
      <view v-for="item in products" :key="item.product_id" class="product-card">
        <view class="card-left">
          <image
            :src="defaultImg || item.product_image"
            class="product-img"
            mode="aspectFill"
          />
        </view>
        <view class="card-right">
          <view class="card-header">
            <text class="product-title">{{ item.product_name }}</text>
            <text
              class="status-tag"
              :class="item.status === 'on' ? 'on' : 'off'"
            >{{ item.status === 'on' ? '上架' : '下架' }}</text>
          </view>
          <view class="product-info">
            <text class="product-id">编号：{{ item.product_id }}</text>
            <text class="product-desc">{{ item.description }}</text>
            <text class="product-stock">库存：{{ item.quantity }}</text>
            <text class="product-warehouse">仓库：{{ item.warehouse }}</text>
            </view>
          <view class="card-actions">
            <button class="mini-btn" @click="onView(item)">查看</button>
            <button class="mini-btn" @click="onEdit(item)">编辑</button>
            <button class="mini-btn danger" @click="onDelete(item)">删除</button>
            <button
              class="mini-btn"
              v-if="item.status === 'on'"
              @click="onChangeStatus(item, 'off')"
            >下架</button>
            <button
              class="mini-btn"
              v-else
              @click="onChangeStatus(item, 'on')"
            >上架</button>
            <!-- 显示报价数量 -->
            <view class="quote-badge" v-if="item.pendingQuotes > 0" @click="onViewQuotes(item)">
              {{ item.pendingQuotes }}
            </view>
          </view>
        </view>
        </view>
    </view>
    <!-- 分页组件占位 -->
    <view class="pagination-bar">
      <button class="page-btn" :disabled="page === 1" @click="page--">上一页</button>
      <text class="page-info">第{{ page }}页</text>
      <button class="page-btn" :disabled="!hasNextPage" @click="page++">下一页</button>
    </view>
  </view>
</template>

<script>
import BaseCard from '../../../components/BaseCard.vue'

export default {
  name: 'AdminProductList',
  components: { BaseCard },
  data() {
    return {
      search: '',
      page: 1,
      pageSize: 10,
      priceOptions: ['默认排序', '价格从高到低', '价格从低到高'],
      priceIndex: 0,
      statusOptions: ['全部状态', '上架', '下架'],
      statusIndex: 0,
      warehouseOptions: ['全部仓库', '上海仓', '深圳仓'],
      warehouseIndex: 0,
      products: [],
      defaultImg: '/static/images/default-product.png',
    }
  },
  computed: {
    filteredProducts() {
      let list = this.products
      // 搜索
      if (this.search) {
        const s = this.search.trim().toLowerCase()
        list = list.filter(item =>
          item.product_name.toLowerCase().includes(s) ||
          item.product_id.toLowerCase().includes(s)
        )
      }
      // 状态筛选
      if (this.statusIndex === 1) list = list.filter(i => i.status === 'on')
      if (this.statusIndex === 2) list = list.filter(i => i.status === 'off')
      // 仓库筛选
      if (this.warehouseIndex > 0) list = list.filter(i => i.warehouse === this.warehouseOptions[this.warehouseIndex])
      // 价格排序
      if (this.priceIndex === 1) list = list.slice().sort((a, b) => (b.price || 0) - (a.price || 0))
      if (this.priceIndex === 2) list = list.slice().sort((a, b) => (a.price || 0) - (b.price || 0))
      // 分页
      const start = (this.page - 1) * this.pageSize
      return list.slice(start, start + this.pageSize)
    },
    hasNextPage() {
      let list = this.products
      if (this.search) {
        const s = this.search.trim().toLowerCase()
        list = list.filter(item =>
          item.product_name.toLowerCase().includes(s) ||
          item.product_id.toLowerCase().includes(s)
        )
      }
      if (this.statusIndex === 1) list = list.filter(i => i.status === 'on')
      if (this.statusIndex === 2) list = list.filter(i => i.status === 'off')
      if (this.warehouseIndex > 0) list = list.filter(i => i.warehouse === this.warehouseOptions[this.warehouseIndex])
      return list.length > this.page * this.pageSize
    }
  },
  created() {
    this.loadProducts()
  },
  methods: {
    loadProducts() {
      // 生成模拟产品数据
      const mockProducts = [
        {
          product_id: 'P1001',
          product_name: '智能手表',
          description: '多功能健康监测智能手表',
          product_image: 'https://cdn.example.com/img/watch.jpg',
          quantity: 120,
          warehouse: '上海仓',
          status: 'on',
          pendingQuotes: 3, // 待审核报价数量
          totalQuotes: 5,   // 总报价数量
          hasNewQuotes: true // 是否有新报价
        },
        {
          product_id: 'P1002',
          product_name: '蓝牙耳机',
          description: '降噪无线蓝牙耳机',
          product_image: 'https://cdn.example.com/img/earphone.jpg',
          quantity: 80,
          warehouse: '深圳仓',
          status: 'off',
          pendingQuotes: 0,
          totalQuotes: 2,
          hasNewQuotes: false
        },
        {
          product_id: 'P1003',
          product_name: '智能音箱',
          description: '高音质智能语音音箱',
          product_image: 'https://cdn.example.com/img/speaker.jpg',
          quantity: 50,
          warehouse: '上海仓',
          status: 'on',
          pendingQuotes: 2,
          totalQuotes: 3,
          hasNewQuotes: true
        },
        {
          product_id: 'P1004',
          product_name: '无线充电器',
          description: '快充无线充电板',
          product_image: 'https://cdn.example.com/img/charger.jpg',
          quantity: 200,
          warehouse: '深圳仓',
          status: 'on',
          pendingQuotes: 1,
          totalQuotes: 1,
          hasNewQuotes: true
        },
        {
          product_id: 'P1005',
          product_name: '智能手环',
          description: '运动监测智能手环',
          product_image: 'https://cdn.example.com/img/band.jpg',
          quantity: 150,
          warehouse: '上海仓',
          status: 'on',
          pendingQuotes: 0,
          totalQuotes: 0,
          hasNewQuotes: false
        }
      ];
      
      this.products = mockProducts;
    },
    handleSearch() {
      this.page = 1
    },
    onPriceChange(e) {
      this.priceIndex = e.detail.value
      this.page = 1
    },
    onStatusChange(e) {
      this.statusIndex = e.detail.value
      this.page = 1
    },
    onWarehouseChange(e) {
      this.warehouseIndex = e.detail.value
      this.page = 1
    },
    handleAdd() {
      uni.navigateTo({ url: '/pages/admin/product/edit' })
    },
    onView(item) {
      uni.navigateTo({ url: `/pages/admin/product/detail?id=${item.product_id}` })
    },
    onEdit(item) {
      uni.navigateTo({ url: `/pages/admin/product/edit?id=${item.product_id}` })
    },
    onDelete(item) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除产品「${item.product_name}」吗？`,
        success: (res) => {
          if (res.confirm) {
            this.products = this.products.filter(p => p.product_id !== item.product_id)
            uni.showToast({ title: '已删除', icon: 'success' })
          }
        }
      })
    },
    onChangeStatus(item, status) {
      item.status = status
      uni.showToast({ title: `已${status === 'on' ? '上架' : '下架'}`, icon: 'success' })
    },
    onViewQuotes(item) {
      // 跳转到产品详情页，自动滚动到报价列表
      uni.navigateTo({ 
        url: `/pages/admin/product/detail?id=${item.product_id}&scrollToQuotes=true`,
        success: () => {
          // 标记报价已查看
          item.hasNewQuotes = false;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/theme.scss';
.admin-product-list-container {
  min-height: 100vh;
  background: $bg-secondary;
  padding: 24rpx 0;
}
.header-bar {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
  align-items: center;
  padding: 0 16rpx;
  .search-input {
    flex: 1;
    height: 56rpx;
    border: 1px solid #e0e0e0;
    border-radius: 8rpx;
    font-size: 26rpx;
    padding: 0 16rpx;
    background: #fff;
  }
  .add-btn {
    height: 56rpx;
    padding: 0 15rpx;
    border-radius: 8rpx;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: normal;
    background: #1976d2;
    color: #fff;
    border: none;
  }
}
.product-list {
  padding: 0 8rpx;
}
.product-card {
  display: flex;
  background: #fff;
  border-radius: 14rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  margin-bottom: 18rpx;
  padding: 16rpx 12rpx;
  align-items: flex-start;
  position: relative;
}
.card-left {
  flex-shrink: 0;
    display: flex;
    align-items: center;
  justify-content: center;
}
.product-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  background: #f5f5f5;
      object-fit: cover;
    }
.card-right {
      flex: 1;
  margin-left: 16rpx;
      display: flex;
      flex-direction: column;
  justify-content: center;
}
.card-header {
        display: flex;
        align-items: center;
  justify-content: space-between;
  margin-bottom: 6rpx;
}
        .product-title {
  font-size: 30rpx;
          font-weight: bold;
          color: #222;
        }
.status-tag {
  font-size: 22rpx;
  padding: 2rpx 12rpx;
  border-radius: 12rpx;
  margin-left: 8rpx;
  &.on {
          background: #e3f2fd;
          color: #1976d2;
  }
          &.off {
    background: #ffebee;
            color: #f44336;
          }
        }
.product-info {
  font-size: 24rpx;
        color: #666;
  margin-bottom: 8rpx;
  .product-id, .product-desc, .product-stock, .product-warehouse {
    display: block;
    margin-bottom: 2rpx;
    }
  }
  .card-actions {
    display: flex;
  gap: 12rpx;
  margin-top: 8rpx;
  position: relative;
  .mini-btn {
    font-size: 22rpx;
    min-width: 72rpx;
    height: 44rpx;
    line-height: 44rpx;
    border-radius: 22rpx;
      background: #f5f5f5;
      color: #1976d2;
      border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 18rpx;
    box-sizing: border-box;
      &.danger {
        background: #fbe9e7;
        color: #f44336;
    }
  }
    
  /* 报价数量角标 */
  .quote-badge {
    position: absolute;
    right: 0;
    top: -30rpx;
    min-width: 40rpx;
    height: 40rpx;
    border-radius: 20rpx;
    background-color: #f44336;
    color: white;
    font-size: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.15);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
}
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16rpx;
  margin: 24rpx 0 8rpx 0;
  .page-btn {
    font-size: 22rpx;
    min-width: 80rpx;
    height: 44rpx;
    line-height: 44rpx;
    border-radius: 22rpx;
    background: #e3f2fd;
    color: #1976d2;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 18rpx;
    box-sizing: border-box;
    &:disabled {
      background: #eee;
      color: #aaa;
    }
  }
  .page-info {
    font-size: 22rpx;
    color: #666;
  }
}
.filter-bar {
  display: flex;
  gap: 18rpx;
  margin-bottom: 18rpx;
  padding: 0 16rpx;
  .filter-item {
    font-size: 24rpx;
    color: #1976d2;
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 10rpx 24rpx;
    min-width: 120rpx;
    text-align: center;
  }
}
</style> 