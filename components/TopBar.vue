<template>
  <view class="top-bar" :class="{ 'with-border': withBorder }">
    <view class="left-area">
      <view class="back-btn" v-if="showBack" @click="goBack">
        <view class="icon-back"></view>
      </view>
      <slot name="left"></slot>
    </view>
    
    <view class="title-area">
      <slot name="title">
        <text class="page-title">{{ title }}</text>
      </slot>
    </view>
    
    <view class="right-area">
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
      default: false
    },
    withBorder: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 92rpx;
  padding: 0 24rpx;
  background-color: #ffffff;
  position: relative;
  z-index: 100;
  
  &.with-border {
    border-bottom: 1rpx solid #eaeaea;
  }
  
  .left-area, .right-area {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .left-area {
    justify-content: flex-start;
  }
  
  .right-area {
    justify-content: flex-end;
  }
  
  .title-area {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .page-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .icon-back {
      width: 36rpx;
      height: 36rpx;
      border-top: 4rpx solid #333;
      border-left: 4rpx solid #333;
      transform: rotate(-45deg);
    }
  }
}
</style> 