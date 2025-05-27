<template>
  <view class="base-card" :class="[rounded ? 'rounded' : '', shadow ? 'shadow' : '', { 'no-padding': noPadding }]">
    <div v-if="$slots.header" class="base-card__header">
      <slot name="header"></slot>
    </div>
    <div class="base-card__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer"></slot>
    </div>
  </view>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    rounded: {
      type: Boolean,
      default: true
    },
    shadow: {
      type: Boolean,
      default: true
    },
    noPadding: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.base-card {
  background-color: #fff;
  padding: 24rpx;
  width: 100%;
  box-sizing: border-box;
  
  &.rounded {
    border-radius: 12rpx;
  }
  
  &.shadow {
    box-shadow: $box-shadow-card;
  }
  
  &.no-padding {
    padding: 0;
  }

  &__header {
    padding: $spacing-md;
    border-bottom: 1px solid $border-color;
  }

  &__body {
    padding: $spacing-md;
  }

  &__footer {
    padding: $spacing-md;
    border-top: 1px solid $border-color;
  }
}
</style> 