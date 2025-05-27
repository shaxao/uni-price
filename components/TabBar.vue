<template>
  <view class="tab-bar">
    <view 
      v-for="(tab, index) in tabs" 
      :key="index" 
      class="tab-item"
      :class="{ active: activeIndex === index }"
      @click="handleTabClick(index, tab)"
    >
      <image 
        class="tab-icon" 
        :src="activeIndex === index ? tab.activeIcon : tab.icon"
        mode="aspectFit"
      />
      <text class="tab-text">{{ tab.title }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    tabs: {
      type: Array,
      required: true,
      validator: tabs => {
        return tabs.every(tab => {
          return typeof tab.title === 'string' && 
                 typeof tab.icon === 'string' && 
                 typeof tab.activeIcon === 'string' &&
                 typeof tab.url === 'string';
        });
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleTabClick(index, tab) {
      if (this.activeIndex !== index) {
        this.$emit('change', index);
        
        // 判断是否需要使用switchTab或其他方式跳转
        if (tab.url) {
          uni.switchTab({
            url: tab.url,
            fail: () => {
              // 如果不是tabBar页面，则使用普通导航
              uni.navigateTo({
                url: tab.url
              });
            }
          });
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.tab-bar {
  display: flex;
  height: 100rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom); // 兼容iPhone X等机型底部安全区
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rpx 0;
  
  &.active {
    .tab-text {
      color: $primary-color;
    }
  }
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 4rpx;
}

.tab-text {
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.2;
}
</style> 