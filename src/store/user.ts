import { defineStore } from 'pinia'
import { authApi } from '@/api'

interface User {
  id: string
  username: string
  email: string
  createTime: number
}

interface UserState {
  token: string | null
  user: User | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: uni.getStorageSync('token'),
    user: uni.getStorageSync('user')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    async login(username: string, password: string) {
      try {
        const { token, user } = await authApi.login({ username, password })
        if (token && user) {
          this.token = token
          this.user = user
          uni.setStorageSync('token', token)
          uni.setStorageSync('user', user)
          return true
        }
        return false
      } catch (error) {
        return false
      }
    },

    async register(username: string, password: string, email: string) {
      try {
        const { token, user } = await authApi.register({ username, password, email })
        if (token && user) {
          this.token = token
          this.user = user
          uni.setStorageSync('token', token)
          uni.setStorageSync('user', user)
          return true
        }
        return false
      } catch (error) {
        return false
      }
    },

    logout() {
      this.token = null
      this.user = null
      uni.removeStorageSync('token')
      uni.removeStorageSync('user')
    }
  }
}) 