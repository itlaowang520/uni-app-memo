<template>
  <view class="memo-container">
    <!-- 毛玻璃背景 -->
    <view class="backdrop-blur"></view>
    
    <view class="memo-content">
      <!-- 备忘录列表 -->
      <view class="memo-grid">
        <view 
          class="memo-item" 
          v-for="item in memoStore.memoList" 
          :key="item.id"
          hover-class="memo-item-hover"
          :hover-stay-time="70"
          @tap="handleMemoClick(item)"
        >
          <text class="memo-title">{{ item.title }}</text>
          <text class="memo-desc">{{ item.content }}</text>
        </view>
      </view>

      <!-- 添加按钮 -->
      <view class="add-button-wrapper">
        <view class="add-button" @tap="handleAddMemo" hover-class="add-button-hover">
          <text class="plus">+</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMemoStore } from '@/store'

// 使用备忘录 store
const memoStore = useMemoStore()

// 页面加载时初始化数据
onMounted(() => {
  memoStore.initMemoList()
})

// 添加备忘录
const handleAddMemo = () => {
  uni.navigateTo({
    url: '/pages/memo/detail?type=add'
  })
}

// 点击备忘录
const handleMemoClick = (item: any) => {
  uni.navigateTo({
    url: `/pages/memo/detail?type=edit&id=${item.id}`
  })
}
</script>

<style>
.memo-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #a5c0fe 0%, #c2a8fd 100%);
  position: relative;
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

.memo-content {
  position: relative;
  z-index: 1;
}

.memo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
}

.memo-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 240rpx;
  transition: all 0.2s ease;
}

.memo-item-hover {
  transform: scale(0.97);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.95);
}

.memo-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.memo-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

.add-button-wrapper {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.add-button {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #a5c0fe 0%, #c2a8fd 100%);
  border-radius: 50%;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-button-hover {
  transform: scale(0.9);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.plus {
  font-size: 60rpx;
  color: #ffffff;
  font-weight: 300;
  height: 60rpx;
  line-height: 54rpx;
}
</style>
