<template>
  <view class="search-bar">
    <view class="search-input-wrapper" :class="{ focus: isFocus }">
      <text class="search-icon">🔍</text>
      <input
        class="search-input"
        :placeholder="placeholder"
        :value="value"
        :focus="autoFocus"
        confirm-type="search"
        @input="handleInput"
        @confirm="handleConfirm"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <text v-if="value" class="clear-icon" @click="handleClear">✕</text>
    </view>
    <text v-if="showCancel" class="cancel-text" @click="handleCancel">取消</text>
  </view>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '搜索'
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isFocus: false
    }
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value)
    },
    handleConfirm(e) {
      this.$emit('confirm', e.target.value)
    },
    handleClear() {
      this.$emit('input', '')
      this.$emit('clear')
    },
    handleCancel() {
      this.handleClear()
      this.$emit('cancel')
    },
    handleFocus() {
      this.isFocus = true
      this.$emit('focus')
    },
    handleBlur() {
      this.isFocus = false
      this.$emit('blur')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.search-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  background-color: #fff;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  height: 68rpx;
  background-color: #f5f5f5;
  border-radius: 34rpx;
  padding: 0 24rpx;
  transition: all 0.3s;
  
  &.focus {
    background-color: #eee;
  }
}

.search-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
  color: $text-secondary;
}

.search-input {
  flex: 1;
  height: 68rpx;
  line-height: 68rpx;
  font-size: 28rpx;
  color: $text-primary;
}

.clear-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: $text-secondary;
}

.cancel-text {
  padding: 0 20rpx;
  font-size: 28rpx;
  color: $primary-color;
}
</style> 