<template>
  <view class="register-container">
    <!-- 毛玻璃背景 -->
    <view class="backdrop-blur"></view>
    
    <view class="register-form">
      <view class="welcome">
        <text class="title">创建账号</text>
        <text class="subtitle">填写信息完成注册</text>
      </view>
      
      <!-- 表单区域 -->
      <view class="input-group">
        <text class="label">用户名</text>
        <view class="input-wrapper">
          <input 
            type="text" 
            v-model="formData.username" 
            placeholder="请输入用户名" 
            placeholder-class="placeholder"
          />
          <image class="icon" src="/static/user-icon.png" mode="aspectFit"></image>
        </view>
      </view>
      
      <view class="input-group">
        <text class="label">密码</text>
        <view class="input-wrapper">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="formData.password" 
            placeholder="请输入密码" 
            placeholder-class="placeholder"
          />
          <image 
            class="icon clickable" 
            :src="showPassword ? '/static/eye-open.png' : '/static/eye-close.png'"
            @tap="togglePassword"
            mode="aspectFit"
          ></image>
        </view>
      </view>

      <view class="input-group">
        <text class="label">确认密码</text>
        <view class="input-wrapper">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="formData.confirmPassword" 
            placeholder="请再次输入密码" 
            placeholder-class="placeholder"
          />
          <image 
            class="icon clickable" 
            :src="showConfirmPassword ? '/static/eye-open.png' : '/static/eye-close.png'"
            @tap="toggleConfirmPassword"
            mode="aspectFit"
          ></image>
        </view>
      </view>
      
      <button class="register-btn" hover-class="button-hover" @tap="handleRegister">注册</button>
      
      <view class="login-link">
        <text>已有账号？</text>
        <text class="link" @tap="handleBackToLogin">返回登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 表单数据
const formData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 控制密码显示
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 切换密码显示
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 注册处理
const handleRegister = () => {
  if (!formData.value.username || !formData.value.password || !formData.value.confirmPassword) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return
  }
  
  uni.showToast({
    title: '注册成功',
    icon: 'success',
    duration: 1500,
    success: () => {
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  })
}

// 返回登录页
const handleBackToLogin = () => {
  uni.navigateBack()
}
</script>

<style>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #a5c0fe 0%, #c2a8fd 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.backdrop-blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.3);
}

.register-form {
  position: relative;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 32rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.welcome {
  text-align: center;
  margin-bottom: 60rpx;
}

.welcome .title {
  font-size: 48rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 16rpx;
  display: block;
}

.welcome .subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-group .label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  flex: 1;
  height: 96rpx;
  background: #f5f7fa;
  border: 2rpx solid transparent;
  border-radius: 16rpx;
  padding: 0 88rpx 0 32rpx;
  font-size: 32rpx;
  color: #333;
  transition: all 0.3s;
}

.input-wrapper input:focus {
  border-color: #a5c0fe;
  background: #fff;
  box-shadow: 0 0 0 4rpx rgba(165, 192, 254, 0.2);
}

.input-wrapper .icon {
  position: absolute;
  right: 32rpx;
  width: 40rpx;
  height: 40rpx;
}

.input-wrapper .icon.clickable {
  cursor: pointer;
}

.placeholder {
  color: #999;
}

.register-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #a5c0fe 0%, #c2a8fd 100%);
  border-radius: 16rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  margin-bottom: 40rpx;
}

.button-hover {
  opacity: 0.9;
  transform: translateY(2rpx);
}

.login-link {
  text-align: center;
  font-size: 28rpx;
  color: #666;
}

.login-link .link {
  color: #a5c0fe;
  margin-left: 12rpx;
}
</style> 