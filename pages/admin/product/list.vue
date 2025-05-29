<template>
  <view class="admin-product-list-container">
    <TopBar title="产品管理" :showBack="false" :withBorder="true" />
    <AdminNavBar currentPath="/pages/admin/product/list" />
    
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
      <view v-for="item in filteredProducts" :key="item.product_id" class="product-card">
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
            <text class="product-price" v-if="item.price">价格：¥{{ item.price.toFixed(2) }}</text>
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
    
    <LoadingAnimation v-if="loading" />
    
    <!-- 空状态 -->
    <view class="empty-state" v-if="filteredProducts.length === 0">
      <image src="/static/images/empty-product.png" class="empty-image" mode="aspectFit" />
      <text class="empty-text">{{ search ? '未找到匹配的产品' : '暂无产品数据' }}</text>
    </view>
  </view>
</template>

<script>
import BaseCard from '../../../components/BaseCard.vue'
import TopBar from '../../../components/TopBar.vue'
import AdminNavBar from '../../../components/AdminNavBar.vue'
import LoadingAnimation from '../../../components/LoadingAnimation.vue'

export default {
  name: 'AdminProductList',
  components: { BaseCard, TopBar, AdminNavBar, LoadingAnimation },
  data() {
    return {
      loading: false,
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
  onLoad() {
    this.loadProducts()
  },
  methods: {
    loadProducts() {
      this.loading = true
      // 生成模拟产品数据
      setTimeout(() => {
        const mockProducts = [
          {
            product_id: 'P1001',
            product_name: '智能手表',
            description: '多功能健康监测智能手表',
            product_image: 'https://cdn.example.com/img/watch.jpg',
            quantity: 120,
            warehouse: '上海仓',
            status: 'on',
            price: 1280.00,
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
            price: 299.00,
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
            price: 799.00,
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
            price: 159.00,
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
            price: 199.00,
            pendingQuotes: 0,
            totalQuotes: 0,
            hasNewQuotes: false
          }
        ];
        
        this.products = mockProducts;
        this.loading = false;
      }, 800);
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
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-product-list-container {
  padding-bottom: 30rpx;
  
  .header-bar {
    padding: 20rpx;
    display: flex;
    align-items: center;
    
    .search-input {
      flex: 1;
      height: 72rpx;
      background-color: #f5f7fa;
      border-radius: 36rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      border: 1rpx solid #eaeaea;
    }
    
    .add-btn {
      width: 200rpx;
      height: 72rpx;
      background-color: #1976d2;
      color: #ffffff;
      font-size: 28rpx;
      border-radius: 36rpx;
      margin-left: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .filter-bar {
    padding: 0 20rpx 20rpx;
    display: flex;
    
    .filter-item {
      padding: 10rpx 24rpx;
      background-color: #f5f7fa;
      border-radius: 30rpx;
      font-size: 26rpx;
      color: #666;
      margin-right: 20rpx;
    }
  }
  
  .product-list {
    padding: 0 20rpx;
    
    .product-card {
      background-color: #fff;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      padding: 20rpx;
      display: flex;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      
      .card-left {
        width: 160rpx;
        height: 160rpx;
        margin-right: 20rpx;
        
        .product-img {
          width: 100%;
          height: 100%;
          border-radius: 8rpx;
        }
      }
      
      .card-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16rpx;
          
          .product-title {
            font-size: 32rpx;
            color: #333;
            font-weight: 500;
          }
          
          .status-tag {
            font-size: 24rpx;
            padding: 4rpx 16rpx;
            border-radius: 20rpx;
            
            &.on {
              background-color: #e8f5e9;
              color: #43a047;
            }
            
            &.off {
              background-color: #ffebee;
              color: #e53935;
            }
          }
        }
        
        .product-info {
          flex: 1;
          
          text {
            font-size: 26rpx;
            color: #666;
            display: block;
            margin-bottom: 8rpx;
          }
          
          .product-price {
            color: #f44336;
            font-weight: 500;
          }
        }
        
        .card-actions {
          margin-top: 20rpx;
          display: flex;
          align-items: center;
          position: relative;
          
          .mini-btn {
            padding: 8rpx 20rpx;
            font-size: 24rpx;
            margin-right: 20rpx;
            border-radius: 30rpx;
            background-color: #f5f7fa;
            color: #333;
            
            &.danger {
              color: #f44336;
            }
          }
          
          .quote-badge {
            position: absolute;
            right: 0;
            top: 0;
            min-width: 40rpx;
            height: 40rpx;
            border-radius: 20rpx;
            background-color: #f44336;
            color: #fff;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 10rpx;
          }
        }
      }
    }
  }
  
  .pagination-bar {
    padding: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .page-btn {
      width: 150rpx;
      height: 70rpx;
      border-radius: 35rpx;
      font-size: 28rpx;
      background-color: #1976d2;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:disabled {
        background-color: #ccc;
      }
    }
    
    .page-info {
      margin: 0 30rpx;
      font-size: 28rpx;
      color: #333;
    }
  }
  
  .empty-state {
    padding: 100rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .empty-image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 30rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style> 