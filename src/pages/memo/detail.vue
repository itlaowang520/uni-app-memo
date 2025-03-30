<template>
  <view class="memo-detail">
    <!-- 毛玻璃背景 -->
    <view class="backdrop-blur"></view>
    
    <view class="header">
      <view class="back-button" @tap="handleBack" hover-class="back-button-hover">
        <text class="back-icon">←</text>
      </view>
      <view v-if="type === 'edit'" class="delete-button" @tap="handleDelete" hover-class="delete-button-hover">
        <text class="delete-icon">×</text>
      </view>
    </view>

    <view class="content">
      <input
        type="text"
        v-model="title"
        placeholder="请输入标题"
        class="title-input"
      />
      <textarea
        v-model="content"
        placeholder="请输入内容"
        class="content-input"
        :auto-height="true"
      />
    </view>

    <view class="footer">
      <button class="save-button" @tap="handleSave" hover-class="save-button-hover">
        保存
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useMemoStore } from '@/store/memo'

export default {
  setup() {
    const memoStore = useMemoStore()
    const type = ref<'add' | 'edit'>('add')
    const id = ref('')
    const title = ref('')
    const content = ref('')

    // 处理返回
    const handleBack = () => {
      uni.navigateBack()
    }

    // 处理保存
    const handleSave = async () => {
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

      try {
        if (type.value === 'add') {
          await memoStore.createMemo(title.value, content.value)
        } else {
          await memoStore.updateMemo(id.value, title.value, content.value)
        }

        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    }

    // 处理删除
    const handleDelete = () => {
      uni.showModal({
        title: '提示',
        content: '确定要删除这条备忘录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await memoStore.deleteMemo(id.value)
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
              setTimeout(() => {
                uni.navigateBack()
              }, 1500)
            } catch (error) {
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    }

    onMounted(() => {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = (currentPage as any).options || {}

      if (options.id) {
        type.value = 'edit'
        id.value = options.id
        title.value = decodeURIComponent(options.title || '')
        content.value = decodeURIComponent(options.content || '')
      }
    })

    return {
      type,
      title,
      content,
      handleBack,
      handleSave,
      handleDelete
    }
  }
}
</script>

<style lang="scss">
.memo-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #a5c0fe 0%, #c2a8fd 100%);
  position: relative;
  padding: 0;
  padding-top: var(--status-bar-height);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .backdrop-blur {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.3);
  }

  .header {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);

    .back-button {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      .back-icon {
        font-size: 48rpx;
        color: #333;
      }

      &-hover {
        opacity: 0.8;
      }
    }

    .delete-button {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      .delete-icon {
        font-size: 48rpx;
        color: #ff3b30;
      }

      &-hover {
        opacity: 0.8;
      }
    }
  }

  .content {
    position: relative;
    z-index: 1;
    flex: 1;
    padding: 20rpx;

    .title-input {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      padding: 20rpx;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    }

    .content-input {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      padding: 20rpx;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
      min-height: 400rpx;
      width: 100%;
      box-sizing: border-box;
    }
  }

  .footer {
    position: relative;
    z-index: 1;
    padding: 20rpx;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);

    .save-button {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: linear-gradient(135deg, #a5c0fe 0%, #c2a8fd 100%);
      color: #fff;
      font-size: 32rpx;
      border-radius: 16rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;

      &-hover {
        transform: scale(0.98);
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>