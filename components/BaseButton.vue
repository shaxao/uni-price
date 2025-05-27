<template>
  <button
    class="base-button"
    :class="[
      type,
      size,
      {
        'is-plain': plain,
        'is-disabled': disabled,
        'is-loading': loading,
        'is-round': round,
        'is-block': block
      }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <view class="button-content">
      <view class="loading-icon" v-if="loading"></view>
      <slot></slot>
    </view>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: value => ['primary', 'success', 'warning', 'danger', 'info', 'default'].includes(value)
    },
    size: {
      type: String,
      default: 'normal',
      validator: value => ['large', 'normal', 'small', 'mini'].includes(value)
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(e) {
      if (this.disabled || this.loading) return
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.base-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: all 0.2s;
  font-weight: 500;
  user-select: none;
  vertical-align: middle;
  border: 1px solid transparent;
  
  &.is-disabled,
  &.is-loading {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.is-block {
    display: flex;
    width: 100%;
  }
  
  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loading-icon {
    width: 12px;
    height: 12px;
    margin-right: 6px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: button-loading 0.8s linear infinite;
  }
  
  // 尺寸
  &.large {
    height: 88rpx;
    padding: 0 30rpx;
    font-size: 32rpx;
    border-radius: 8rpx;
  }
  
  &.normal {
    height: 72rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    border-radius: 6rpx;
  }
  
  &.small {
    height: 56rpx;
    padding: 0 16rpx;
    font-size: 24rpx;
    border-radius: 4rpx;
  }
  
  &.mini {
    height: 48rpx;
    padding: 0 12rpx;
    font-size: 22rpx;
    border-radius: 4rpx;
  }
  
  // 圆角
  &.is-round {
    &.large {
      border-radius: 44rpx;
    }
    
    &.normal {
      border-radius: 36rpx;
    }
    
    &.small {
      border-radius: 28rpx;
    }
    
    &.mini {
      border-radius: 24rpx;
    }
  }
  
  // 默认类型
  &.default {
    color: $text-primary;
    background-color: #fff;
    border-color: #dcdfe6;
    
    &:active {
      border-color: #c6c6c6;
      background-color: #f2f2f2;
    }
    
    &.is-plain {
      color: $text-primary;
      background: transparent;
      
      &:active {
        background-color: #f2f2f2;
      }
    }
    
    .loading-icon {
      border-color: $text-primary;
      border-top-color: transparent;
    }
  }
  
  // 主要类型
  &.primary {
    color: #fff;
    background-color: $primary-color;
    border-color: $primary-color;
    
    &:active {
      background-color: darken($primary-color, 10%);
      border-color: darken($primary-color, 10%);
    }
    
    &.is-plain {
      color: $primary-color;
      background: lighten($primary-color, 35%);
      border-color: lighten($primary-color, 20%);
      
      &:active {
        background-color: lighten($primary-color, 30%);
      }
    }
  }
  
  // 成功类型
  &.success {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
    
    &:active {
      background-color: darken(#67c23a, 10%);
      border-color: darken(#67c23a, 10%);
    }
    
    &.is-plain {
      color: #67c23a;
      background: lighten(#67c23a, 35%);
      border-color: lighten(#67c23a, 20%);
      
      &:active {
        background-color: lighten(#67c23a, 30%);
      }
    }
  }
  
  // 警告类型
  &.warning {
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
    
    &:active {
      background-color: darken(#e6a23c, 10%);
      border-color: darken(#e6a23c, 10%);
    }
    
    &.is-plain {
      color: #e6a23c;
      background: lighten(#e6a23c, 35%);
      border-color: lighten(#e6a23c, 20%);
      
      &:active {
        background-color: lighten(#e6a23c, 30%);
      }
    }
  }
  
  // 危险类型
  &.danger {
    color: #fff;
    background-color: #f56c6c;
    border-color: #f56c6c;
    
    &:active {
      background-color: darken(#f56c6c, 10%);
      border-color: darken(#f56c6c, 10%);
    }
    
    &.is-plain {
      color: #f56c6c;
      background: lighten(#f56c6c, 35%);
      border-color: lighten(#f56c6c, 20%);
      
      &:active {
        background-color: lighten(#f56c6c, 30%);
      }
    }
  }
  
  // 信息类型
  &.info {
    color: #fff;
    background-color: #909399;
    border-color: #909399;
    
    &:active {
      background-color: darken(#909399, 10%);
      border-color: darken(#909399, 10%);
    }
    
    &.is-plain {
      color: #909399;
      background: lighten(#909399, 35%);
      border-color: lighten(#909399, 20%);
      
      &:active {
        background-color: lighten(#909399, 30%);
      }
    }
  }
}

@keyframes button-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 