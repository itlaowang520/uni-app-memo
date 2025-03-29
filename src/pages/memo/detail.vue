<template>
  <view class="detail-container">
    <!-- 毛玻璃背景 -->
    <view class="backdrop-blur"></view>
    
    <view class="detail-content">
      <!-- 顶部操作区 -->
      <view class="header">
        <view class="back-button">
          <button size="mini" type="primary" @tap="handleBack">返回</button>
        </view>
        
        <view 
          v-if="type === 'edit'"
          class="delete-button" 
          @tap="handleDelete"
          hover-class="delete-button-hover"
        >
          <text class="delete-icon">×</text>
        </view>
      </view>

      <!-- 标题输入框 -->
      <input 
        class="title-input"
        type="text"
        v-model="title"
        placeholder="请输入标题"
        placeholder-class="input-placeholder"
      />
      
      <!-- 内容输入框 -->
      <textarea
        class="content-input"
        v-model="content"
        placeholder="请输入内容"
        placeholder-class="input-placeholder"
        :maxlength="-1"
      />

      <!-- 底部按钮区 -->
      <view class="button-group">
        <button 
          class="save-button" 
          @tap="handleSave"
          hover-class="button-hover"
        >保存</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useMemoStore } from '@/store'

const memoStore = useMemoStore()

// 页面数据
const type = ref('add')
const id = ref('')
const title = ref('')
const content = ref('')

// 使用uni-app的onLoad生命周期
onLoad((options: any) => {
  const { type: typeVal = 'add', id: idVal = '', title: titleVal = '', content: contentVal = '' } = options
  type.value = typeVal
  id.value = idVal
  
  if (type.value === 'edit' && id.value) {
    // 编辑模式：从store中获取数据
    const memo = memoStore.getMemoById(id.value)
    if (memo) {
      title.value = memo.title
      content.value = memo.content
    } else {
      // 如果找不到数据，可能是刷新页面导致store数据丢失，则使用URL参数
      title.value = decodeURIComponent(titleVal)
      content.value = decodeURIComponent(contentVal)
    }
  }
})

// 返回上一页
const handleBack = () => {
  uni.navigateBack()
}

// 保存备忘录
const handleSave = () => {
  if (!title.value.trim()) {
    uni.showToast({
      title: '请输入标题',
      icon: 'none'
    })
    return
  }
  
  if (!content.value.trim()) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    })
    return
  }

  if (type.value === 'edit' && id.value) {
    // 更新备忘录
    memoStore.updateMemo({
      id: id.value,
      title: title.value,
      content: content.value
    })
  } else {
    // 添加新备忘录
    memoStore.addMemo({
      title: title.value,
      content: content.value
    })
  }

  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}

// 删除备忘录
const handleDelete = () => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条备忘录吗？',
    success: (res) => {
      if (res.confirm && id.value) {
        memoStore.deleteMemo(id.value)
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}
</script>

<style>
.detail-container {
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

.detail-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  min-height: calc(100vh - 80rpx);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
  font-weight: 300;
  line-height: 1;
  margin-left: -4rpx;
}

.delete-icon {
  font-size: 40rpx;
  color: #ff6b6b;
  font-weight: 300;
  line-height: 1;
}

.title-input {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 32rpx;
  color: #333;
}

.content-input {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  min-height: 400rpx;
  width: auto;
  flex: 1;
}

.input-placeholder {
  color: #999;
}

.button-group {
  margin-top: auto;
  padding-top: 40rpx;
}

.save-button {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  border-radius: 44rpx;
  font-size: 32rpx;
  color: #fff;
  border: none;
  background: linear-gradient(135deg, #a5c0fe 0%, #c2a8fd 100%);
}

.button-hover {
  opacity: 0.9;
  transform: scale(0.98);
}
</style>