<template>
  <view class="triangle-menu-mask" @click.self="$emit('close')">
    <view class="triangle-menu">
      <view class="triangle"></view>
      <view class="menu-list">
        <view class="menu-item" @click="$emit('myQuotes')">我的报价</view>
        <view class="menu-item" @click="$emit('cart')">购物车</view>
        <view class="menu-item" @click="$emit('logout')">退出登录</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TriangleMenu'
}
</script>

<style lang="scss" scoped>
.triangle-menu-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.triangle-menu {
  position: relative;
  margin-bottom: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.triangle {
  width: 0;
  height: 0;
  border-left: 30rpx solid transparent;
  border-right: 30rpx solid transparent;
  border-bottom: 30rpx solid #fff;
  margin-bottom: -2rpx;
}
.menu-list {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.08);
  overflow: hidden;
  min-width: 220rpx;
}
.menu-item {
  padding: 32rpx 0;
  text-align: center;
  font-size: 32rpx;
  color: #333;
  border-bottom: 1rpx solid #f0f0f0;
  background: #fff;
  transition: background 0.2s;
  &:last-child {
    border-bottom: none;
  }
  &:active {
    background: #f5f5f5;
  }
}
</style> 