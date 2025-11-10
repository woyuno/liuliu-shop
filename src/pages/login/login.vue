<template>
  <view class="login-container">
    <!-- 顶部背景 -->
    <view class="login-header">
      <view class="header-content">
        <image src="/static/logo.png" mode="scaleToFill" />
        <text class="app-name">宠物服务</text>
        <text class="app-slogan">让爱宠生活更美好</text>
      </view>
    </view>
    <!-- 登录表单 -->
    <view class="login-form">
      <view class="login-content">
        <view class="quick-login">
          <text class="login-title">手机号快捷登录</text>
          <text class="login-desc">使用微信授权快捷登录</text>
          <button class="wechat-login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            <up-icon name="weixin-fill" color="#fff" size="32" style="margin-right: 10rpx"></up-icon>
            微信获取手机号一键登录
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { post } from '@/utils/http'
const getPhoneNumber = async (e: any) => {
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    const phoneCode = e.detail.code // 用来获取手机号code
    const res = await uni.login()
    const loginCode = res.code //身份code，用来获取openid
    const data: any = await post('/auth/wxLogin', {
      loginCode,
      phoneCode,
      appid: 'wxd1d01fe323ba839d',
      secret: '3b3ef5f1126df0cf51ac75f0233bedf8'
    })
    uni.setStorageSync('token', data.token)
    uni.setStorageSync('user', data.user)
    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 500)
  } else {
    uni.showToast({
      title: '获取失败',
      icon: 'error'
    })
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #ffce2c 0%, #ffb347 100%);
  .login-header {
    height: 500rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .header-content {
      text-align: center;
      image {
        width: 120rpx;
        height: 120rpx;
        margin-bottom: 20rpx;
      }
      .app-name {
        display: block;
        font-size: 48rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 10rpx;
      }
      .app-slogan {
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .login-form {
    background-color: #fff;
    border-radius: 40rpx 40rpx 0 0;
    padding: 60rpx 40rpx;
    margin-top: -40rpx;
    height: calc(100vh - 580rpx);
    .login-content {
      .login-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        text-align: center;
        display: block;
      }
      .login-desc {
        font-size: 28rpx;
        color: #999;
        text-align: center;
        display: block;
        margin-bottom: 60rpx;
      }
      .wechat-login-btn {
        background-color: #07c160;
        color: #fff;
        border: none;
        border-radius: 16rpx;
        height: 88rpx;
        font-size: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 60rpx;
      }
    }
  }
}
</style>
