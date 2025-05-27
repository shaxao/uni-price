<template>
  <view class="register-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title">注册账号</text>
    </view>
    
    <view class="form-container">
      <text class="form-title">创建新账号</text>
      <text class="form-desc">请填写您的信息，完成注册后可立即使用系统</text>
      
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
          v-model="password" 
          placeholder="请设置密码" 
        />
        <text class="toggle-password" @click="togglePassword">
          <text v-if="showPassword">👁️</text>
          <text v-else>👁️‍🗨️</text>
        </text>
      </view>
      
      <view class="form-item">
        <text class="form-icon">🔒</text>
        <input 
          class="form-input" 
          :type="showPassword ? 'text' : 'password'" 
          v-model="confirmPassword" 
          placeholder="请确认密码" 
        />
        <text class="toggle-password" @click="togglePassword">
          <text v-if="showPassword">👁️</text>
          <text v-else>👁️‍🗨️</text>
        </text>
      </view>
      
      <view class="agreement">
        <view class="checkbox" :class="{ checked: agreed }" @click="toggleAgreement"></view>
        <text class="agreement-text">
          我已阅读并同意
          <text class="link" @click="handlePrivacy">《用户协议和隐私政策》</text>
        </text>
      </view>
      
      <button class="submit-btn" :disabled="!agreed" @click="handleSubmit">注册账号</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      username: '',
      authCode: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      agreed: false,
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
    
    toggleAgreement() {
      this.agreed = !this.agreed
    },
    
    handlePrivacy() {
      // 跳转到隐私政策页面
      uni.navigateTo({
        url: '/pages/privacy/index'
      })
    },
    
    handleSubmit() {
      if (this.loading || !this.agreed) return
      
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
      
      if (!this.password || this.password.length < 6) {
        return uni.showToast({
          title: '密码长度至少6位',
          icon: 'none'
        })
      }
      
      if (this.password !== this.confirmPassword) {
        return uni.showToast({
          title: '两次密码输入不一致',
          icon: 'none'
        })
      }
      
      this.loading = true
      
      // 模拟注册
      setTimeout(() => {
        this.loading = false
        uni.showToast({
          title: '注册成功',
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

.register-container {
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
  }
  
  .back-icon {
    font-size: 40rpx;
    color: $text-primary;
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
  padding: 40rpx 0;
}

.form-title {
  font-size: 40rpx;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 20rpx;
}

.form-desc {
  font-size: 28rpx;
  color: $text-secondary;
  margin-bottom: 40rpx;
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
}

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
  cursor: pointer;
}

.agreement {
  display: flex;
  align-items: center;
  margin: 20rpx 0 40rpx;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  margin-right: 20rpx;
  position: relative;
}

.checkbox.checked {
  background-color: $primary-color;
  border-color: $primary-color;
}

.checkbox.checked::after {
  content: '';
  position: absolute;
  width: 20rpx;
  height: 10rpx;
  border-left: 4rpx solid #fff;
  border-bottom: 4rpx solid #fff;
  transform: rotate(-45deg);
  left: 8rpx;
  top: 10rpx;
}

.agreement-text {
  font-size: 26rpx;
  color: $text-secondary;
}

.link {
  color: $primary-color;
}

.submit-btn {
  width: 100%;
  height: 100rpx;
  border-radius: 100rpx;
  background-color: $primary-color;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.submit-btn[disabled] {
  opacity: 0.6;
}
</style> 