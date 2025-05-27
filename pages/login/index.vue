<template>
  <view class="login-container">
    <view class="logo-section">
      <image class="logo" src="/static/images/logo.png" mode="aspectFit" />
      <text class="title">纵远报价管理系统</text>
      <text class="subtitle">专业供应链报价管理平台</text>
    </view>
    
    <!-- 登录类型选择 -->
    <view class="login-type-section">
      <view 
        class="login-type-item" 
        :class="{ active: loginType === 'admin' }" 
        @click="setLoginType('admin')"
      >
        <view class="type-icon admin-icon">
          <image src="/static/images/admin-icon.png" mode="aspectFit" />
        </view>
        <text class="type-text">管理员入口</text>
      </view>
      
      <view 
        class="login-type-item" 
        :class="{ active: loginType === 'supplier' }" 
        @click="setLoginType('supplier')"
      >
        <view class="type-icon supplier-icon">
          <image src="/static/images/supplier-icon.png" mode="aspectFit" />
        </view>
        <text class="type-text">供应商入口</text>
      </view>
    </view>
    
    <!-- 管理员登录表单 -->
    <view class="login-form" v-if="loginType === 'admin'">
      <view class="form-item username">
        <text class="form-icon">👤</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="admin.username" 
          placeholder="请输入账号" 
        />
      </view>
      
      <view class="form-item password">
        <text class="form-icon">🔒</text>
        <input 
          class="form-input" 
          :type="showPassword ? 'text' : 'password'" 
          v-model="admin.password" 
          placeholder="请输入密码" 
        />
        <text class="toggle-password" @click="togglePassword">
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </text>
      </view>
      
      <button class="login-btn admin-login-btn" @click="handleAdminLogin">
        登 录
      </button>
    </view>
    
    <!-- 供应商登录 -->
    <view class="login-form" v-if="loginType === 'supplier'">
      <button class="login-btn supplier-login-btn" @click="handleSupplierLogin">
        微信一键登录
      </button>
    </view>
    
    <!-- 底部链接 -->
    <view class="bottom-links">
      <text class="link" @click="handleForgotPassword">忘记密码</text>
      <text class="separator">•</text>
      <text class="link" @click="handleRegister">注册账号</text>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loginType: 'admin', // 默认管理员登录
      showPassword: false,
      loading: false,
      admin: {
        username: '',
        password: ''
      }
    }
  },
  onLoad() {
    // 检查是否已登录
    this.checkLoginStatus()
  },
  methods: {
    ...mapActions('user', ['login']),
    
    async checkLoginStatus() {
      const token = uni.getStorageSync('token')
      if (token) {
        // 已登录，跳转到首页
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }
    },
    
    setLoginType(type) {
      this.loginType = type
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    async handleAdminLogin() {
      if (this.loading) return
      
      // 验证输入
      if (!this.admin.username || !this.admin.username.trim()) {
        return uni.showToast({
          title: '请输入账号',
          icon: 'none'
        })
      }
      
      if (!this.admin.password) {
        return uni.showToast({
          title: '请输入密码',
          icon: 'none'
        })
      }
      
      this.loading = true
      try {
        // 调用管理员登录接口
        await this.login({
          type: 'admin',
          username: this.admin.username,
          password: this.admin.password
        })
        
        // 登录成功，跳转到首页
        uni.reLaunch({
          url: '/pages/admin/product/list'
        })
      } catch (error) {
        uni.showToast({
          title: error.message || '登录失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    async handleSupplierLogin() {
      if (this.loading) return
      
      this.loading = true
      try {
        // 获取微信登录凭证
        const { code } = await uni.login()
        
        // 调用供应商登录接口
        await this.login({ 
          type: 'supplier',
          code 
        })
        
        // 登录成功，跳转到首页
        uni.reLaunch({
          url: '/pages/index/index'
        })
      } catch (error) {
        uni.showToast({
          title: error.message || '登录失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    handleForgotPassword() {
      // 跳转到忘记密码页面
      uni.navigateTo({
        url: '/pages/forgot-password/index'
      })
    },
    
    handleRegister() {
      // 跳转到注册账号页面
      uni.navigateTo({
        url: '/pages/register/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.login-container {
  min-height: 100vh;
  background-color: $bg-primary;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40rpx;
}

.logo-section {
  margin-top: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .logo {
    width: 180rpx;
    height: 180rpx;
    margin-bottom: 30rpx;
    border-radius: 30rpx;
  }
  
  .title {
    font-size: 44rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 16rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: $text-secondary;
  }
}

.login-type-section {
  display: flex;
  width: 100%;
  margin-top: 80rpx;
  margin-bottom: 60rpx;
  justify-content: space-between;
  
  .login-type-item {
    width: 48%;
    height: 200rpx;
    background-color: #fff;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
    
    &.active {
      box-shadow: 0 4rpx 24rpx rgba(25, 118, 210, 0.15);
      border: 2rpx solid $primary-color;
    }
    
    .type-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      
      image {
        width: 60rpx;
        height: 60rpx;
      }
    }
    
    .admin-icon {
      background-color: rgba(25, 118, 210, 0.1);
    }
    
    .supplier-icon {
      background-color: rgba(245, 124, 0, 0.1);
    }
    
    .type-text {
      font-size: 28rpx;
      color: $text-primary;
      font-weight: 500;
    }
  }
}

.login-form {
  width: 100%;
  
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
    
    .get-code-btn {
      padding: 10rpx 20rpx;
      background-color: $primary-color;
      color: #fff;
      font-size: 26rpx;
      border-radius: 100rpx;
    }
  }
}
  
  .login-btn {
    width: 100%;
  height: 100rpx;
  border-radius: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 60rpx;
  color: #fff;
  
  &.admin-login-btn {
    background-color: $primary-color;
  }
  
  &.supplier-login-btn {
    background-color: #07c160; // 微信绿色
  }
}

.bottom-links {
  position: absolute;
  bottom: 60rpx;
  display: flex;
  align-items: center;
  
  .link {
    font-size: 28rpx;
    color: $primary-color;
  }
  
  .separator {
    margin: 0 20rpx;
    color: $text-secondary;
  }
}
</style> 