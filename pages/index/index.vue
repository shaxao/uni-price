<template>
  <view class="index-container">
    <!-- 搜索框 -->
    <search-bar 
      v-model="searchText" 
      placeholder="搜索产品" 
      @clear="searchText = ''"
      @input="onSearch"
      @confirm="onSearchConfirm" 
    />
    
    <!-- 筛选栏 -->
    <filter-bar 
      :selectedFilter="currentFilter"
      @filter-change="handleFilterChange"
    />
    
    <!-- 产品卡片列表 -->
      <view class="product-list">
      <loading-animation :loading="isLoading" text="加载产品中..." />
      
      <product-card
        v-for="product in sortedProducts"
        :key="product.product_id"
        :product="product"
        :price="getProductTotalCost(product.product_id)"
        :expiry-date="formatExpiryDate(product.expiry_date)"
        @view="handleViewProduct"
        v-if="!isLoading"
      />
      <view v-if="sortedProducts.length === 0 && !isLoading" class="empty-tip">
        <text class="empty-icon">📭</text>
        <text>暂无相关产品</text>
      </view>
      </view>
      
    <!-- 底部菜单栏 -->
    <tab-bar :current-tab="0" @tab-change="handleTabChange" />
  </view>
</template>

<script>
import { mapActions } from 'vuex'
import SearchBar from '../../components/SearchBar.vue'
import FilterBar from '../../components/FilterBar.vue'
import ProductCard from '../../components/ProductCard.vue'
import TabBar from '../../components/TabBar.vue'
import LoadingAnimation from '../../components/LoadingAnimation.vue'
import { get } from '../../utils/request'
import dayjs from 'dayjs'

export default {
  name: 'Index',
  components: {
    SearchBar,
    FilterBar,
    ProductCard,
    TabBar,
    LoadingAnimation
  },
  data() {
    return {
      products: [],
      quotes: [],
      searchText: '',
      productId: null,
      isLoading: true,
      currentFilter: 'default'
    }
  },
  computed: {
    filteredProducts() {
      if (!this.searchText) return this.products
      return this.products.filter(p => 
        p.product_name.toLowerCase().includes(this.searchText.toLowerCase()) || 
        p.description?.toLowerCase().includes(this.searchText.toLowerCase())
      )
    },
    sortedProducts() {
      const products = [...this.filteredProducts];
      
      // 检查当前筛选条件是否是复合筛选（JSON字符串）
      if (typeof this.currentFilter === 'string' && this.currentFilter.startsWith('{')) {
        try {
          // 解析复合筛选条件
          const filters = JSON.parse(this.currentFilter);
          
          // 应用复合筛选条件
          return this.applyComplexFilters(products, filters);
        } catch (error) {
          console.error('解析筛选条件出错:', error);
          return products;
        }
      }
      
      // 单一筛选条件
      switch (this.currentFilter) {
        case 'priceHigh': // 价格从高到低
          return products.sort((a, b) => {
            const priceA = this.getProductTotalCostNumber(a.product_id);
            const priceB = this.getProductTotalCostNumber(b.product_id);
            return priceB - priceA;
          });
          
        case 'priceLow': // 价格从低到高
          return products.sort((a, b) => {
            const priceA = this.getProductTotalCostNumber(a.product_id);
            const priceB = this.getProductTotalCostNumber(b.product_id);
            return priceA - priceB;
          });
          
        case 'dateFar': // 截止日期从远到近
          return products.sort((a, b) => {
            const dateA = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
            const dateB = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
            return dateB - dateA;
          });
          
        case 'dateNear': // 截止日期从近到远
          return products.sort((a, b) => {
            const dateA = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
            const dateB = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
            return dateA - dateB;
          });
          
        default: // 默认排序
          return products;
      }
    }
  },
  onLoad(options) {
    this.productId = options.id
    this.fetchProducts()
    this.fetchQuotes()
  },
  methods: {
    ...mapActions('product', ['fetchProducts']),
    async fetchProducts() {
      this.isLoading = true
      try {
        const res = await get('/products')
        this.products = res.data
      } catch (error) {
        uni.showToast({
          title: error.message || '获取产品列表失败',
          icon: 'none'
        })
      } finally {
        setTimeout(() => {
          this.isLoading = false
        }, 500) // 添加延迟，使动画效果更明显
      }
    },
    async fetchQuotes() {
      try {
        const res = await get('/quotes')
        this.quotes = res.data
      } catch (error) {
        // 可忽略
      }
    },
    handleViewProduct(id) {
      uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
    },
    handleTabChange(index) {
      // 页签切换处理，已移除三角菜单相关逻辑
    },
    // 筛选相关方法
    handleFilterChange(filter) {
      this.currentFilter = filter;
    },
    // 获取产品最低报价
    getProductTotalCost(productId) {
      const quote = this.quotes.filter(q => q.product_id === productId)
      if (!quote.length) return '-'
      // 取最低总价
      return Math.min(...quote.map(q => q.total_cost))
    },
    // 获取产品最低报价(数字)，用于排序
    getProductTotalCostNumber(productId) {
      const quote = this.quotes.filter(q => q.product_id === productId)
      if (!quote.length) return 0
      // 取最低总价
      return Math.min(...quote.map(q => q.total_cost))
    },
    formatExpiryDate(expiryDate) {
      if (!expiryDate) return '-'
      return dayjs(expiryDate).format('YYYY-MM-DD')
    },
    // 应用复合筛选条件
    applyComplexFilters(products, filters) {
      let result = [...products];
      
      // 先应用价格筛选
      if (filters.price === 'high') {
        result.sort((a, b) => {
          const priceA = this.getProductTotalCostNumber(a.product_id);
          const priceB = this.getProductTotalCostNumber(b.product_id);
          return priceB - priceA;
        });
      } else if (filters.price === 'low') {
        result.sort((a, b) => {
          const priceA = this.getProductTotalCostNumber(a.product_id);
          const priceB = this.getProductTotalCostNumber(b.product_id);
          return priceA - priceB;
        });
      }
      
      // 如果同时有日期筛选，需要稳定排序保持价格排序的结果
      if (filters.date !== null) {
        // 使用自定义稳定排序，保持价格排序的结果
        result = this.stableSortByDate(result, filters.date);
      }
      
      return result;
    },
    
    // 稳定排序按日期（保持价格排序的结果）
    stableSortByDate(products, dateFilter) {
      // 创建带索引的数组，保存原始顺序
      const indexed = products.map((item, index) => ({ item, index }));
      
      // 根据日期和原始索引排序
      indexed.sort((a, b) => {
        const dateA = a.item.expiry_date ? new Date(a.item.expiry_date).getTime() : 0;
        const dateB = b.item.expiry_date ? new Date(b.item.expiry_date).getTime() : 0;
        
        // 日期排序
        const dateDiff = dateFilter === 'far' ? (dateB - dateA) : (dateA - dateB);
        
        // 如果日期相同，保持原始顺序
        return dateDiff !== 0 ? dateDiff : (a.index - b.index);
      });
      
      // 返回排序后的产品
      return indexed.map(x => x.item);
    },
    // 添加搜索处理方法
    onSearch(value) {
      this.searchText = value;
      // 可以在这里添加搜索延迟或其他处理逻辑
    },
    
    // 添加搜索确认方法
    onSearchConfirm(value) {
      this.searchText = value;
      uni.showToast({
        title: '搜索: ' + value,
        icon: 'none',
        duration: 2000
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.index-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding-bottom: 120rpx;
}

.product-list {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-tip {
  margin-top: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $text-light;
  
  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 24rpx;
    opacity: 0.6;
  }
  
  text {
    font-size: $font-size-md;
  }
}
</style> 