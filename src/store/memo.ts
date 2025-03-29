import { defineStore } from 'pinia'

interface MemoItem {
  id: string
  title: string
  content: string
  createTime?: number
  updateTime?: number
}

interface MemoState {
  memoList: MemoItem[]
  currentMemo: MemoItem | null
}

export const useMemoStore = defineStore('memo', {
  state: (): MemoState => ({
    memoList: [],
    currentMemo: null
  }),
  
  getters: {
    getMemoById: (state) => {
      return (id: string) => state.memoList.find(memo => memo.id === id)
    }
  },
  
  actions: {
    addMemo(memo: Omit<MemoItem, 'id' | 'createTime' | 'updateTime'>) {
      const newMemo: MemoItem = {
        id: Date.now().toString(),
        title: memo.title,
        content: memo.content,
        createTime: Date.now(),
        updateTime: Date.now()
      }
      this.memoList.push(newMemo)
      uni.setStorageSync('memoList', this.memoList)
    },
    
    updateMemo(memo: MemoItem) {
      const index = this.memoList.findIndex(item => item.id === memo.id)
      if (index > -1) {
        this.memoList[index] = {
          ...memo,
          updateTime: Date.now()
        }
        uni.setStorageSync('memoList', this.memoList)
      }
    },
    
    deleteMemo(id: string) {
      this.memoList = this.memoList.filter(memo => memo.id !== id)
      uni.setStorageSync('memoList', this.memoList)
    },
    
    initMemoList() {
      const storageList = uni.getStorageSync('memoList')
      if (storageList) {
        this.memoList = storageList
      }
    },

    clearMemoList() {
      this.memoList = []
      uni.removeStorageSync('memoList')
    }
  }
})
