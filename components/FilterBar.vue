<template>
  <view class="filter-bar-container">
    <!-- 标题栏筛选按钮 -->
    <view class="filter-header" @click="openDrawer">
      <text class="filter-title">筛选</text>
      <text class="filter-icon">▾</text>
      <view class="active-badge" v-if="hasActiveFilters"></view>
    </view>
    
    <!-- 侧边抽屉 -->
    <view class="filter-drawer" :class="{ 'drawer-open': drawerVisible }">
      <view class="drawer-mask" @click="closeDrawer" v-if="drawerVisible"></view>
      <view class="drawer-content">
        <view class="drawer-header">
          <text class="drawer-title">筛选条件</text>
          <text class="close-icon" @click="closeDrawer">×</text>
        </view>
        
        <!-- 价格排序 -->
        <view class="filter-section">
          <text class="section-title">价格排序</text>
          <view class="option-list">
            <view 
              class="option-item" 
              v-for="(item, index) in priceOptions" 
              :key="`price-${index}`"
              :class="{ active: filters.priceSort === item.value }"
              @click="selectPriceSort(item.value)"
            >
              <text class="option-text">{{ item.label }}</text>
              <text class="check-icon" v-if="filters.priceSort === item.value">✓</text>
            </view>
          </view>
        </view>
        
        <!-- 截止日期排序 -->
        <view class="filter-section">
          <text class="section-title">截止日期</text>
          <view class="option-list">
            <view 
              class="option-item" 
              v-for="(item, index) in dateOptions" 
              :key="`date-${index}`"
              :class="{ active: filters.dateSort === item.value }"
              @click="selectDateSort(item.value)"
            >
              <text class="option-text">{{ item.label }}</text>
              <text class="check-icon" v-if="filters.dateSort === item.value">✓</text>
            </view>
          </view>
        </view>
        
        <!-- 产品类型 -->
        <view class="filter-section">
          <text class="section-title">产品类型</text>
          <view class="tag-list">
            <view 
              v-for="(tag, index) in productTypes" 
              :key="`type-${index}`"
              class="filter-tag" 
              :class="{ active: filters.productTypes.includes(tag.value) }"
              @click="toggleProductType(tag.value)"
            >
              <text>{{ tag.label }}</text>
            </view>
          </view>
        </view>
        
        <!-- 重量范围 -->
        <view class="filter-section">
          <text class="section-title">重量范围</text>
          <view class="range-slider">
            <view class="range-values">
              <text>{{ filters.weightRange[0] }}kg</text>
              <text>{{ filters.weightRange[1] }}kg</text>
            </view>
            <slider 
              class="slider" 
              :min="0"
              :max="1000"
              :value="filters.weightRange[0]"
              @change="onMinWeightChange"
            />
            <slider 
              class="slider" 
              :min="0"
              :max="1000"
              :value="filters.weightRange[1]"
              @change="onMaxWeightChange"
            />
          </view>
        </view>
        
        <view class="drawer-footer">
          <button class="reset-btn" @click="resetFilters">重置</button>
          <button class="apply-btn" @click="applyFilters">应用筛选</button>
        </view>
      </view>
    </view>
    
    <!-- 激活的筛选条件标签 -->
    <view class="active-filters" v-if="hasActiveFilters && showActiveTags">
      <view class="filter-tag active" v-if="filters.priceSort !== 'default'">
        <text>{{ getPriceSortLabel(filters.priceSort) }}</text>
        <text class="tag-close" @click="clearPriceSort">×</text>
      </view>
      <view class="filter-tag active" v-if="filters.dateSort !== 'default'">
        <text>{{ getDateSortLabel(filters.dateSort) }}</text>
        <text class="tag-close" @click="clearDateSort">×</text>
      </view>
      <view 
        class="filter-tag active" 
        v-for="(type, index) in filters.productTypes" 
        :key="`active-${index}`"
      >
        <text>{{ getProductTypeLabel(type) }}</text>
        <text class="tag-close" @click="removeProductType(type)">×</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    showActiveTags: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawerVisible: false,
      filters: {
        priceSort: 'default',
        dateSort: 'default',
        productTypes: [],
        weightRange: [0, 500]
      },
      priceOptions: [
        { label: '默认排序', value: 'default' },
        { label: '价格从低到高', value: 'asc' },
        { label: '价格从高到低', value: 'desc' }
      ],
      dateOptions: [
        { label: '默认排序', value: 'default' },
        { label: '截止日期最近', value: 'asc' },
        { label: '截止日期最远', value: 'desc' }
      ],
      productTypes: [
        { label: '电子产品', value: 'electronics' },
        { label: '服装', value: 'clothing' },
        { label: '家居', value: 'home' },
        { label: '玩具', value: 'toys' },
        { label: '运动户外', value: 'sports' },
        { label: '美容个护', value: 'beauty' },
        { label: '食品', value: 'food' },
        { label: '书籍', value: 'books' }
      ]
    }
  },
  computed: {
    hasActiveFilters() {
      return this.filters.priceSort !== 'default' || 
             this.filters.dateSort !== 'default' ||
             this.filters.productTypes.length > 0 ||
             this.filters.weightRange[0] > 0 ||
             this.filters.weightRange[1] < 500
    }
  },
  methods: {
    openDrawer() {
      this.drawerVisible = true
    },
    closeDrawer() {
      this.drawerVisible = false
    },
    selectPriceSort(value) {
      this.filters.priceSort = value
    },
    selectDateSort(value) {
      this.filters.dateSort = value
    },
    toggleProductType(value) {
      const index = this.filters.productTypes.indexOf(value)
      if (index > -1) {
        this.filters.productTypes.splice(index, 1)
      } else {
        this.filters.productTypes.push(value)
      }
    },
    onMinWeightChange(e) {
      const value = e.detail.value
      if (value > this.filters.weightRange[1]) {
        this.filters.weightRange[0] = this.filters.weightRange[1]
      } else {
        this.filters.weightRange[0] = value
      }
    },
    onMaxWeightChange(e) {
      const value = e.detail.value
      if (value < this.filters.weightRange[0]) {
        this.filters.weightRange[1] = this.filters.weightRange[0]
      } else {
        this.filters.weightRange[1] = value
      }
    },
    resetFilters() {
      this.filters = {
        priceSort: 'default',
        dateSort: 'default',
        productTypes: [],
        weightRange: [0, 500]
      }
    },
    applyFilters() {
      this.$emit('filter', { ...this.filters })
      this.closeDrawer()
    },
    clearPriceSort() {
      this.filters.priceSort = 'default'
      this.$emit('filter', { ...this.filters })
    },
    clearDateSort() {
      this.filters.dateSort = 'default'
      this.$emit('filter', { ...this.filters })
    },
    removeProductType(type) {
      const index = this.filters.productTypes.indexOf(type)
      if (index > -1) {
        this.filters.productTypes.splice(index, 1)
        this.$emit('filter', { ...this.filters })
      }
    },
    getPriceSortLabel(value) {
      const option = this.priceOptions.find(item => item.value === value)
      return option ? option.label : ''
    },
    getDateSortLabel(value) {
      const option = this.dateOptions.find(item => item.value === value)
      return option ? option.label : ''
    },
    getProductTypeLabel(value) {
      const option = this.productTypes.find(item => item.value === value)
      return option ? option.label : ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.filter-bar-container {
  width: 100%;
  position: relative;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 24rpx;
  background-color: #fff;
  position: relative;
}

.filter-title {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 500;
}

.filter-icon {
  font-size: 24rpx;
  color: $text-primary;
  margin-left: 8rpx;
  transition: transform 0.3s;
}

.active-badge {
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  background-color: $primary-color;
  border-radius: 50%;
  right: 20rpx;
  top: 16rpx;
}

/* 抽屉样式 */
.filter-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  pointer-events: none;
}

.drawer-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.drawer-content {
  position: absolute;
  top: 0;
  right: -80%;
  width: 80%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  transition: right 0.3s ease-out;
  pointer-events: auto;
}

.drawer-open {
  pointer-events: auto;
  
  .drawer-content {
    right: 0;
  }
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 24rpx;
  border-bottom: 1px solid #f0f0f0;
}

.drawer-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-primary;
}

.close-icon {
  font-size: 40rpx;
  color: $text-secondary;
  padding: 10rpx;
}

.filter-section {
  padding: 24rpx;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 20rpx;
  display: block;
}

.option-list {
  display: flex;
  flex-direction: column;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 10rpx;
  border-radius: 8rpx;
  transition: background-color 0.3s;
  
  &.active {
    background-color: rgba($primary-color, 0.1);
    
    .option-text {
      color: $primary-color;
      font-weight: 500;
    }
  }
}

.option-text {
  font-size: 26rpx;
  color: $text-primary;
}

.check-icon {
  font-size: 28rpx;
  color: $primary-color;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.filter-tag {
  padding: 10rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: $text-secondary;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s;
  
  &.active {
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border: 1px solid rgba($primary-color, 0.3);
  }
}

.range-slider {
  padding: 10rpx 0;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.slider {
  margin: 16rpx 0;
}

.drawer-footer {
  margin-top: auto;
  padding: 24rpx;
  display: flex;
  gap: 16rpx;
  border-top: 1px solid #f0f0f0;
}

.reset-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #f5f5f5;
  color: $text-primary;
  font-size: 28rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apply-btn {
  flex: 2;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: $primary-color;
  color: #ffffff;
  font-size: 28rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 激活的筛选条件标签 */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx 16rpx;
  gap: 12rpx;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
}

.tag-close {
  font-size: 24rpx;
  margin-left: 8rpx;
}
</style> 