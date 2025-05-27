<template>
  <view class="top-bar">
    <view class="left" @click="handleBack" v-if="showBack">
      <text class="back-icon">←</text>
    </view>
    <view class="center">
      <text class="title">{{ title }}</text>
    </view>
    <view class="right">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TopBar',
  props: {
    title: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleBack() {
      this.$emit('back');
      uni.navigateBack({
        delta: 1,
        fail: () => {
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.top-bar {
  display: flex;
  align-items: center;
  height: 90rpx;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding-top: env(safe-area-inset-top); /* 兼容iPhone X及以上机型顶部安全区 */
}

.left {
  width: 100rpx;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-icon {
  font-size: 40rpx;
  color: $text-primary;
}

.center {
  flex: 1;
  text-align: center;
  padding: 0 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: 500;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right {
  width: 100rpx;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 