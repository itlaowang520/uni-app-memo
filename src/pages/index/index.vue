<template>
  <view class="memo-container">
    <!-- 毛玻璃背景 -->
    <view class="backdrop-blur"></view>
    
    <view class="memo-content">
      <!-- 顶部标题 -->
      <view class="header">
        <text class="title">备忘录</text>
      </view>

      <!-- 备忘录列表 -->
      <scroll-view 
        class="memo-list"
        scroll-y
        :refresher-enabled="true"
        :refresher-triggered="isRefreshing"
        @refresherrefresh="handleRefresh"
        @scrolltolower="handleLoadMore"
        :lower-threshold="100"
      >
        <!-- 首次加载中 -->
        <view v-if="memoStore.loading && !isLoadMore" class="loading-container">
          <view class="loading-spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>

        <template v-else>
          <view v-if="memoStore.memoList.length === 0" class="empty-tip">
            <text>暂无备忘录，点击右下角添加</text>
          </view>
          
          <view v-else class="memo-items">
            <view 
              v-for="memo in memoStore.memoList" 
              :key="memo._id"
              class="memo-item"
              @tap="handleEdit(memo)"
              hover-class="memo-item-hover"
            >
              <view class="memo-title">{{ memo.title }}</view>
              <view class="memo-content">{{ memo.content }}</view>
              <view class="memo-time">{{ formatTime(memo.updateTime) }}</view>
            </view>
          </view>

          <!-- 加载更多 -->
          <view v-if="isLoadMore" class="loading-more">
            <view class="loading-spinner-small"></view>
            <text class="loading-text-small">加载中...</text>
          </view>
          <view v-else-if="!memoStore.hasMore && memoStore.memoList.length > 0" class="no-more">
            <text>没有更多了</text>
          </view>
        </template>
      </scroll-view>

      <!-- 悬浮添加按钮 -->
      <view class="add-button-wrapper">
        <view class="add-button" @tap="handleAdd" hover-class="add-button-hover">
          <text class="plus">+</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useMemoStore } from '@/store/memo'
import { formatTime } from '@/utils/format'
import type { Memo } from '@/types/memo'

const memoStore = useMemoStore()
const isRefreshing = ref(false)
const isLoadMore = ref(false)

// 添加备忘录
const handleAdd = () => {
  uni.navigateTo({
    url: '/pages/memo/detail'
  })
}

// 编辑备忘录
const handleEdit = (memo: Memo) => {
  uni.navigateTo({
    url: `/pages/memo/detail?id=${memo._id}&title=${encodeURIComponent(memo.title)}&content=${encodeURIComponent(memo.content)}`
  })
}

// 加载更多
const handleLoadMore = () => {
  if (!memoStore.loading && memoStore.hasMore) {
    isLoadMore.value = true
    memoStore.getMemoList(true).catch(error => {
      console.error('加载更多失败:', error)
      uni.showToast({
        title: '加载更多失败',
        icon: 'none'
      })
    }).finally(() => {
      isLoadMore.value = false
    })
  }
}

// 下拉刷新
const handleRefresh = async () => {
  isRefreshing.value = true
  isLoadMore.value = false
  try {
    await memoStore.getMemoList()
  } finally {
    isRefreshing.value = false
  }
}

// 页面加载时获取备忘录列表
onLoad(() => {
  console.log('页面加载，开始获取备忘录列表')
  isLoadMore.value = false
  memoStore.getMemoList().catch(error => {
    console.error('获取备忘录列表失败:', error)
    uni.showToast({
      title: '获取备忘录列表失败',
      icon: 'none'
    })
  })
})
</script>

<style>
.memo-container {
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

.memo-content {
  position: relative;
  z-index: 1;
  height: 100vh;
  box-sizing: border-box;
  padding-top: var(--status-bar-height);
}

.header {
  position: fixed;
  top: var(--status-bar-height);
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 40rpx;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.memo-list {
  height: calc(100vh - 90rpx);
  padding-top: 90rpx;
  box-sizing: border-box;
  overflow-y: auto;
}

.empty-tip {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  padding: 40rpx;
}

.memo-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx 40rpx 140rpx;
  box-sizing: border-box;
}

.memo-item {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.memo-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.memo-content {
  font-size: 28rpx;
  color: #666;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.memo-time {
  font-size: 24rpx;
  color: #999;
  margin-top: auto;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #a5c0fe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 20rpx 0;
}

.loading-spinner-small {
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #a5c0fe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text-small {
  font-size: 24rpx;
  color: #999;
}

.no-more {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  padding: 20rpx 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.memo-item-hover {
  transform: scale(0.98);
  opacity: 0.9;
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
