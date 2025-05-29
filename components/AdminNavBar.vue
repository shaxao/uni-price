<template>
  <view class="admin-nav-bar">
    <scroll-view scroll-x class="nav-scroll" show-scrollbar="false">
      <view 
        v-for="(item, index) in navItems" 
        :key="index" 
        class="nav-item" 
        :class="{ active: currentPath === item.path }"
        @click="navigate(item)"
      >
        <image v-if="item.icon" :src="item.icon" class="nav-icon" mode="aspectFit" />
        <text class="nav-text">{{ item.name }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'AdminNavBar',
  props: {
    currentPath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      navItems: [
        { name: '首页', path: '/pages/admin/index/index', icon: '/static/images/home.png' },
        { name: '产品管理', path: '/pages/admin/product/list', icon: '/static/images/product-icon.png' },
        { name: '报价管理', path: '/pages/admin/quote/list', icon: '/static/images/price.png' },
        { name: '用户管理', path: '/pages/admin/user/list', icon: '/static/images/user-icon.png' },
        { name: '订单管理', path: '/pages/admin/tasks/list', icon: '/static/images/order-icon.png' },
        { name: '消息中心', path: '/pages/admin/message/list', icon: '/static/images/message-icon.png' },
        { name: '系统设置', path: '/pages/admin/profile/settings', icon: '/static/images/settings-icon.png' }
      ]
    }
  },
  methods: {
    navigate(item) {
      if (item.path === this.currentPath) return;
      
      uni.navigateTo({
        url: item.path,
        fail: () => {
          // 如果navigateTo失败，可能是因为已经在tabbar页面，尝试switchTab
          uni.switchTab({
            url: item.path,
            fail: (err) => {
              console.error('导航失败:', err);
              // 提示用户导航失败
              uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
              });
            }
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-nav-bar {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1rpx solid #eaeaea;
  padding: 12rpx 0;
  
  .nav-scroll {
    white-space: nowrap;
    width: 100%;
    padding: 0 12rpx;
    box-sizing: border-box;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  .nav-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 16rpx 24rpx;
    margin: 0 8rpx;
    border-radius: 8rpx;
    background-color: #f5f7fa;
    transition: all 0.2s ease;
    
    &.active {
      background-color: #e3f2fd;
      color: #1976d2;
      font-weight: 500;
    }
    
    .nav-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 8rpx;
    }
    
    .nav-text {
      font-size: 28rpx;
      color: #333;
    }
    
    &.active .nav-text {
      color: #1976d2;
    }
  }
}
</style> 