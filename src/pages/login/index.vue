<template>
  <view class="login-container">
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
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx;

  .login-box {
    width: 100%;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

    .title {
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
      text-align: center;
      margin-bottom: 40rpx;
    }

    .form {
      margin-bottom: 40rpx;

      .input {
        width: 100%;
        height: 88rpx;
        background-color: #f5f5f5;
        border-radius: 10rpx;
        padding: 0 30rpx;
        font-size: 28rpx;
        margin-bottom: 20rpx;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .buttons {
      .login-btn {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        background-color: #007AFF;
        color: #fff;
        font-size: 32rpx;
        border-radius: 10rpx;
        margin-bottom: 20rpx;

        &[disabled] {
          opacity: 0.7;
        }
      }

      .register-btn {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        background-color: #fff;
        color: #007AFF;
        font-size: 32rpx;
        border-radius: 10rpx;
        border: 2rpx solid #007AFF;

        &[disabled] {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
