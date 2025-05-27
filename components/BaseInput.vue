<template>
  <view class="base-input-wrapper">
    <view v-if="label" class="base-input-label">{{ label }}</view>
    <input
      v-if="type !== 'textarea'"
      class="base-input"
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
    />
    <textarea
      v-else
      class="base-input textarea"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      rows="3"
    />
    <view v-if="error" class="base-input-error">{{ error }}</view>
  </view>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  },
  methods: {
    onInput(e) {
      // 兼容uni-app input/textarea的e.detail.value和e.target.value
      const value = e.detail && e.detail.value !== undefined ? e.detail.value : e.target.value
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 32rpx;
}
.base-input-label {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 12rpx;
  font-weight: 500;
}
.base-input {
  width: 100%;
  font-size: 30rpx;
  padding: 22rpx 24rpx;
  border: 1px solid #d0d0d0;
  border-radius: 14rpx;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s;
  outline: none;
  min-height: 100rpx;
  line-height: 1.6;
}
.base-input:focus {
  border-color: #1976d2;
}
.base-input::placeholder {
  color: #bbb;
  opacity: 1;
  font-size: 25rpx;
  line-height: 1.4;
}
.base-input.textarea {
  min-height: 100rpx;
  resize: none;
  line-height: 1.6;
  padding: 22rpx 24rpx;
}
.base-input.textarea::placeholder {
  color: #bbb;
  opacity: 1;
  font-size: 25rpx;
  line-height: 1.4;
}
.base-input-error {
  color: #f44336;
  font-size: 26rpx;
  margin-top: 8rpx;
}
</style> 