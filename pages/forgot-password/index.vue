<template>
  <view class="forgot-password-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title">忘记密码</text>
    </view>
    
    <view class="form-container">
      <text class="form-title">重置密码</text>
      <text class="form-desc">请输入您的账号和管理员口令码，完成身份验证后可重置密码</text>
      
      <view class="form-item">
        <text class="form-icon">👤</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="username" 
          placeholder="请输入账号" 
        />
      </view>
      
      <view class="form-item">
        <text class="form-icon">🔑</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="authCode" 
          placeholder="请输入6位口令码" 
          maxlength="6"
        />
      </view>
      
      <view class="form-item">
        <text class="form-icon">🔒</text>
        <input 
          class="form-input" 
          :type="showPassword ? 'text' : 'password'" 
          v-model="newPassword" 
          placeholder="请输入新密码" 
        />
        <text class="toggle-password" @click="togglePassword">
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </text>
      </view>
      
      <button class="submit-btn" @click="handleSubmit">重置密码</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      username: '',
      authCode: '',
      newPassword: '',
      showPassword: false,
      loading: false
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    handleSubmit() {
      if (this.loading) return
      
      // 验证输入
      if (!this.username.trim()) {
        return uni.showToast({
          title: '请输入账号',
          icon: 'none'
        })
      }
      
      if (!this.authCode || this.authCode.length !== 6) {
        return uni.showToast({
          title: '请输入6位口令码',
          icon: 'none'
        })
      }
      
      if (!this.newPassword || this.newPassword.length < 6) {
        return uni.showToast({
          title: '密码长度至少6位',
          icon: 'none'
        })
      }
      
      this.loading = true
      
      // 模拟重置密码
      setTimeout(() => {
        this.loading = false
        uni.showToast({
          title: '密码重置成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.forgot-password-container {
  min-height: 100vh;
  background-color: $bg-primary;
  padding: 0 40rpx;
}

.header {
  height: 120rpx;
  display: flex;
  align-items: center;
  position: relative;
  
  .back-btn {
    position: absolute;
    left: 0;
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .back-icon {
      font-size: 40rpx;
      color: $text-primary;
    }
  }
  
  .title {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    color: $text-primary;
  }
}

.form-container {
  padding: 60rpx 0;
  
  .form-title {
    font-size: 40rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 20rpx;
  }
  
  .form-desc {
    font-size: 28rpx;
    color: $text-secondary;
    margin-bottom: 60rpx;
    line-height: 1.5;
  }
  
  .form-item {
    height: 100rpx;
    background-color: #f5f5f5;
    border-radius: 100rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    margin-bottom: 30rpx;
    
    .form-icon {
      font-size: 40rpx;
      margin-right: 20rpx;
    }
    
    .form-input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
    }
    
    .toggle-password {
      font-size: 40rpx;
      padding: 0 10rpx;
    }
  }
  
  .submit-btn {
    width: 100%;
    height: 100rpx;
    border-radius: 100rpx;
    background-color: $primary-color;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 60rpx;
  }
}
</style> 