<template>
  <view class="loading-container" v-if="loading">
    <view class="loading-overlay"></view>
    <view class="loading-content">
      <view class="loading-spinner">
        <view class="loading-circle"></view>
      </view>
      <text class="loading-text" v-if="text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LoadingAnimation',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
}

.loading-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 12rpx;
  min-width: 200rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 16rpx;
  position: relative;
}

.loading-circle {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid transparent;
  border-top-color: #ffffff;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 