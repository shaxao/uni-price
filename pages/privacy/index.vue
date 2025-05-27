<template>
  <view class="privacy-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title">用户协议和隐私政策</text>
    </view>
    
    <scroll-view class="content" scroll-y>
      <view class="section">
        <text class="section-title">1. 总则</text>
        <text class="section-text">欢迎您使用纵远报价管理系统（以下简称"本系统"）。本系统是专为供应链管理和报价管理设计的专业软件服务。在您使用本系统前，请仔细阅读本协议的所有条款。使用本系统即表示您已同意本协议的全部内容。</text>
      </view>
      
      <view class="section">
        <text class="section-title">2. 用户权利与义务</text>
        <text class="section-text">2.1 用户需保证注册信息的真实性和完整性，并对账户安全负责。</text>
        <text class="section-text">2.2 用户有权通过本系统进行合法的供应链和报价管理活动。</text>
        <text class="section-text">2.3 用户不得利用本系统从事任何违法或不当行为，包括但不限于传播虚假信息、侵犯他人权益等。</text>
      </view>
      
      <view class="section">
        <text class="section-title">3. 信息收集与使用</text>
        <text class="section-text">3.1 为提供服务，我们会收集您的账号信息、企业信息、产品信息和报价数据等必要信息。</text>
        <text class="section-text">3.2 我们会采取合理措施保护您的信息安全，未经您同意，不会向第三方披露您的个人信息。</text>
        <text class="section-text">3.3 我们可能会以匿名的形式对数据进行统计分析，以改进服务质量。</text>
      </view>
      
      <view class="section">
        <text class="section-title">4. 数据安全</text>
        <text class="section-text">4.1 我们采用行业标准的技术措施保护您的数据安全。</text>
        <text class="section-text">4.2 用户需妥善保管自己的登录凭证，因用户自身原因导致的账号被盗用等情况，本系统不承担责任。</text>
      </view>
      
      <view class="section">
        <text class="section-title">5. 知识产权</text>
        <text class="section-text">5.1 本系统的所有权和知识产权归我公司所有。</text>
        <text class="section-text">5.2 用户不得对本系统进行反向工程、反编译或以其他方式尝试获取源代码。</text>
      </view>
      
      <view class="section">
        <text class="section-title">6. 免责声明</text>
        <text class="section-text">6.1 本系统不对因网络故障、系统维护等不可抗力因素导致的服务中断承担责任。</text>
        <text class="section-text">6.2 用户通过本系统所进行的交易行为，其风险和责任由交易各方自行承担。</text>
      </view>
      
      <view class="section">
        <text class="section-title">7. 协议变更</text>
        <text class="section-text">我们保留随时修改本协议的权利。协议修改后，将在系统内显著位置公布通知。如您继续使用本系统，即表示您接受修改后的协议。</text>
      </view>
      
      <view class="section">
        <text class="section-title">8. 联系方式</text>
        <text class="section-text">如您对本协议有任何疑问，或在使用过程中遇到问题，请联系我们的客服部门：</text>
        <text class="section-text">电话：400-123-4567</text>
        <text class="section-text">邮箱：support@zongyuan.com</text>
      </view>
      
      <view class="section last">
        <text class="section-text center">最后更新日期：2023年12月1日</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'Privacy',
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.privacy-container {
  min-height: 100vh;
  background-color: $bg-primary;
  display: flex;
  flex-direction: column;
}

.header {
  height: 120rpx;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 40rpx;
}

.back-btn {
  position: absolute;
  left: 40rpx;
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

.content {
  flex: 1;
  padding: 40rpx;
}

.section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 20rpx;
  display: block;
}

.section-text {
  font-size: 28rpx;
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: 16rpx;
  display: block;
}

.section-text.center {
  text-align: center;
}

.section.last {
  margin-bottom: 100rpx;
}
</style> 