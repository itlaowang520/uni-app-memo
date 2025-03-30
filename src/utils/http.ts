import { useUserStore } from '@/store/user'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  params?: any
  headers?: Record<string, string>
}

interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

class Http {
  private static instance: Http
  private baseURL: string

  private constructor() {
    this.baseURL = ''
  }

  public static getInstance(): Http {
    if (!Http.instance) {
      Http.instance = new Http()
    }
    return Http.instance
  }

  private async request<T>(options: RequestOptions): Promise<T> {
    const { url, method = 'GET', data, params, headers = {} } = options
    const userStore = useUserStore()

    // 添加 token 到请求头
    if (userStore.token) {
      headers['Authorization'] = `Bearer ${userStore.token}`
    }

    try {
      const response = await uni.request({
        url: this.baseURL + url,
        method,
        data: method === 'GET' ? params : data,
        header: {
          'Content-Type': 'application/json',
          ...headers
        }
      })

      const res = response.data as ResponseData<T>

      // 处理响应
      if (res.code === 200) {
        return res.data
      }

      // 处理 token 过期或未认证
      if (res.code === 401) {
        userStore.logout()
        uni.showToast({
          title: '登录已过期，请重新登录',
          icon: 'none'
        })
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/login/index'
          })
        }, 1500)
        throw new Error('登录已过期')
      }

      // 处理其他错误
      uni.showToast({
        title: res.message || '请求失败',
        icon: 'none'
      })
      throw new Error(res.message || '请求失败')
    } catch (error) {
      uni.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      })
      throw error
    }
  }

  public get<T = any>(url: string, params?: any): Promise<T> {
    return this.request<T>({ url, method: 'GET', params })
  }

  public post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, method: 'POST', data })
  }

  public put<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, method: 'PUT', data })
  }

  public delete<T = any>(url: string): Promise<T> {
    return this.request<T>({ url, method: 'DELETE' })
  }
}

export const http = Http.getInstance() 