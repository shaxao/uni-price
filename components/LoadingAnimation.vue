<template>
  <view class="loading-container" v-if="loading">
    <view class="loading-spinner">
      <view class="spinner-circle"></view>
      <view class="spinner-circle"></view>
      <view class="spinner-circle"></view>
      <view class="spinner-circle"></view>
    </view>
    <text class="loading-text">{{ text }}</text>
  </view>
</template>

<script>
export default {
  name: 'LoadingAnimation',
  props: {
    text: {
      type: String,
      default: '加载中...'
    },
    loading: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999;
  
  .loading-spinner {
    width: 80rpx;
    height: 80rpx;
    position: relative;
    margin-bottom: 20rpx;
    
    .spinner-circle {
      width: 30rpx;
      height: 30rpx;
      background-color: #1976d2;
      border-radius: 100%;
      position: absolute;
      opacity: 0.6;
      animation: bounce 2s infinite ease-in-out;
      
      &:nth-child(1) {
        top: 0;
        left: 0;
        animation-delay: -0.75s;
      }
      
      &:nth-child(2) {
        top: 0;
        right: 0;
        animation-delay: -0.5s;
      }
      
      &:nth-child(3) {
        bottom: 0;
        left: 0;
        animation-delay: -0.25s;
      }
      
      &:nth-child(4) {
        bottom: 0;
        right: 0;
        animation-delay: 0s;
      }
    }
  }
  
  .loading-text {
    font-size: 28rpx;
    color: #666;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: scale(0.6);
  }
  50% {
    transform: scale(1.0);
  }
}
</style> 