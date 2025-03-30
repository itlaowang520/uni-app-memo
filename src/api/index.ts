import { http } from '@/utils/http'

const BASE_URL = 'https://ixqehzhvplyg.sealosbja.site/api/v1'

// 用户相关接口
export const authApi = {
  // 用户注册
  register: (data: { username: string; password: string; email: string }) => {
    return http.post(`${BASE_URL}/auth/register`, data)
  },

  // 用户登录
  login: (data: { username: string; password: string }) => {
    return http.post(`${BASE_URL}/auth/login`, data)
  },

  // 刷新 token
  refreshToken: () => {
    return http.post(`${BASE_URL}/auth/refresh`)
  }
}

// 备忘录相关接口
export const memoApi = {
  // 获取备忘录列表
  getMemoList: (params?: { page?: number; pageSize?: number }) => {
    return http.get(`${BASE_URL}/memos`, { params })
  },

  // 获取单个备忘录
  getMemoDetail: (id: string) => {
    return http.get(`${BASE_URL}/memos/${id}`)
  },

  // 创建备忘录
  createMemo: (data: { title: string; content: string }) => {
    return http.post(`${BASE_URL}/memos`, data)
  },

  // 更新备忘录
  updateMemo: (id: string, data: { title: string; content: string }) => {
    return http.put(`${BASE_URL}/memos/${id}`, data)
  },

  // 删除备忘录
  deleteMemo: (id: string) => {
    return http.delete(`${BASE_URL}/memos/${id}`)
  }
} 