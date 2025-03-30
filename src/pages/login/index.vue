<template>
  <view class="login-container">
    <!-- 毛玻璃背景 -->
    <view class="backdrop-blur"></view>
    
    <view class="login-content">
      <view class="login-box">
        <view class="title">登录</view>
        <view class="form">
          <input
            type="text"
            v-model="username"
            placeholder="请输入用户名"
            class="input"
          />
          <input
            type="password"
            v-model="password"
            placeholder="请输入密码"
            class="input"
          />
        </view>
        <view class="buttons">
          <button class="login-btn" @tap="handleLogin" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
          <button class="register-btn" @tap="handleRegister" :disabled="loading">
            注册账号
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

export default {
  setup() {
    const userStore = useUserStore()
    const username = ref('')
    const password = ref('')
    const loading = ref(false)

    // 处理登录
    const handleLogin = async () => {
      if (!username.value.trim() || !password.value.trim()) {
        uni.showToast({
          title: '请输入用户名和密码',
          icon: 'none'
        })
        return
      }

      loading.value = true
      try {
        const success = await userStore.login(username.value, password.value)
        if (success) {
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          })
          // 等待 toast 显示完成后再跳转
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/index/index'
            })
          }, 1500)
        } else {
          uni.showToast({
            title: '登录失败，请检查用户名和密码',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '登录失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        loading.value = false
      }
    }

    // 处理注册
    const handleRegister = () => {
      uni.navigateTo({
        url: '/pages/register/index'
      })
    }

    return {
      username,
      password,
      loading,
      handleLogin,
      handleRegister
    }
  }
}
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #a5c0fe 0%, #c2a8fd 100%);
  position: relative;
  padding: 0;
  padding-top: var(--status-bar-height);
  box-sizing: border-box;
}

.backdrop-blur {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.3);
}

.login-content {
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  box-sizing: border-box;
}

.login-box {
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  box-sizing: border-box;

  .title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 40rpx;
  }

  .form {
    margin-bottom: 40rpx;
    width: 100%;
    box-sizing: border-box;

    .input {
      width: 100%;
      height: 88rpx;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 10rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      margin-bottom: 20rpx;
      border: 2rpx solid rgba(0, 0, 0, 0.1);
      box-sizing: border-box;

      &:last-child {
        margin-bottom: 0;
      }

      &:focus {
        border-color: #a5c0fe;
        background: rgba(255, 255, 255, 0.95);
      }
    }
  }

  .buttons {
    width: 100%;
    box-sizing: border-box;

    .login-btn {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      background: linear-gradient(135deg, #a5c0fe 0%, #c2a8fd 100%);
      color: #fff;
      font-size: 32rpx;
      border-radius: 10rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 4rpx 12rpx rgba(165, 192, 254, 0.3);
      transition: all 0.3s ease;
      box-sizing: border-box;

      &[disabled] {
        opacity: 0.7;
        box-shadow: none;
      }

      &:active {
        transform: translateY(2rpx);
        box-shadow: 0 2rpx 6rpx rgba(165, 192, 254, 0.2);
      }
    }

    .register-btn {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      background: transparent;
      color: #a5c0fe;
      font-size: 32rpx;
      border-radius: 10rpx;
      border: 2rpx solid #a5c0fe;
      transition: all 0.3s ease;
      box-sizing: border-box;

      &[disabled] {
        opacity: 0.7;
      }

      &:active {
        background: rgba(165, 192, 254, 0.1);
      }
    }
  }
}
</style>
