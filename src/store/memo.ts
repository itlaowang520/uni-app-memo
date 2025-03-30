import { defineStore } from 'pinia'
import { ref } from 'vue'
import { memoApi } from '@/api'
import type { Memo } from '@/types/memo'

export const useMemoStore = defineStore('memo', () => {
  // 状态
  const memoList = ref<Memo[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const hasMore = ref(true)
  const pageSize = ref(10)

  // 获取备忘录列表
  const getMemoList = async (isLoadMore = false) => {
    
    if (loading.value) {
      console.log('正在加载中，跳过')
      return
    }
    
    if (!isLoadMore) {
      currentPage.value = 1
      hasMore.value = true
      memoList.value = []
    }
    
    if (!hasMore.value) {
      console.log('没有更多数据了')
      return
    }
    
    loading.value = true

    try {
      const res = await memoApi.getMemoList({
        page: currentPage.value,
        pageSize: pageSize.value
      })
      
      // 从返回的数据中获取 list 和 hasMore 字段
      const { list = [], hasMore: hasMoreData = false } = res
      
      if (isLoadMore) {
        memoList.value = [...memoList.value, ...list]
      } else {
        memoList.value = list
      }
      
      // 使用后端返回的 hasMore
      hasMore.value = hasMoreData
      currentPage.value++
    } catch (error) {
      console.error('获取备忘录列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取单个备忘录
  const getMemoById = (id: string) => {
    return memoList.value.find(memo => memo._id === id)
  }

  // 创建备忘录
  const createMemo = async (title: string, content: string) => {
    try {
      const res = await memoApi.createMemo({ title, content })
      memoList.value.unshift(res)
      return res
    } catch (error) {
      console.error('创建备忘录失败:', error)
      throw error
    }
  }

  // 更新备忘录
  const updateMemo = async (id: string, title: string, content: string) => {
    try {
      const res = await memoApi.updateMemo(id, { title, content })
      const index = memoList.value.findIndex(memo => memo._id === id)
      if (index !== -1) {
        memoList.value[index] = res
      }
      return res
    } catch (error) {
      console.error('更新备忘录失败:', error)
      throw error
    }
  }

  // 删除备忘录
  const deleteMemo = async (id: string) => {
    try {
      await memoApi.deleteMemo(id)
      const index = memoList.value.findIndex(memo => memo._id === id)
      if (index !== -1) {
        memoList.value.splice(index, 1)
      }
    } catch (error) {
      console.error('删除备忘录失败:', error)
      throw error
    }
  }

  // 重置状态
  const reset = () => {
    memoList.value = []
    currentPage.value = 1
    hasMore.value = true
    loading.value = false
  }

  return {
    memoList,
    loading,
    hasMore,
    getMemoList,
    getMemoById,
    createMemo,
    updateMemo,
    deleteMemo,
    reset
  }
})
