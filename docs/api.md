# 备忘录应用 API 文档

## 基础信息
- 基础路径: `https://ixqehzhvplyg.sealosbja.site/api/v1`
- 响应格式: JSON
- 认证方式: Bearer Token

## 数据结构

### 用户(User)
```typescript
interface User {
  id: string;          // 用户ID
  username: string;    // 用户名
  email: string;       // 邮箱
  createTime: number;  // 创建时间戳
}
```

### 备忘录(Memo)
```typescript
interface Memo {
  id: string;          // 备忘录ID
  userId: string;      // 用户ID
  title: string;       // 标题
  content: string;     // 内容
  createTime: number;  // 创建时间戳
  updateTime: number;  // 更新时间戳
}
```

## 认证接口

### 1. 用户注册
- 请求方法: `POST`
- 路径: `/auth/register`
- 请求头: 
  ```
  Content-Type: application/json
  ```
- 请求体:
  ```json
  {
    "username": "testuser",    // 用户名，长度 4-20
    "password": "password123", // 密码，长度 6-20
    "email": "test@example.com" // 邮箱
  }
  ```
- 成功响应 (200):
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": "1234567890",
        "username": "testuser",
        "email": "test@example.com",
        "createTime": 1648888888888
      }
    }
  }
  ```
- 失败响应:
  - 参数错误 (400):
    ```json
    {
      "code": 400,
      "message": "请求参数错误",
      "errors": [
        {
          "msg": "用户名长度必须在4-20个字符之间",
          "param": "username",
          "location": "body"
        }
      ]
    }
    ```
  - 用户名已存在 (409):
    ```json
    {
      "code": 409,
      "message": "用户名或邮箱已存在"
    }
    ```

### 2. 用户登录
- 请求方法: `POST`
- 路径: `/auth/login`
- 请求头:
  ```
  Content-Type: application/json
  ```
- 请求体:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- 成功响应 (200):
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": "1234567890",
        "username": "testuser",
        "email": "test@example.com",
        "createTime": 1648888888888
      }
    }
  }
  ```
- 失败响应:
  - 参数错误 (400):
    ```json
    {
      "code": 400,
      "message": "请求参数错误",
      "errors": [
        {
          "msg": "用户名不能为空",
          "param": "username",
          "location": "body"
        }
      ]
    }
    ```
  - 认证失败 (401):
    ```json
    {
      "code": 401,
      "message": "用户名或密码错误"
    }
    ```

## 备忘录接口

### 1. 获取备忘录列表
- 请求方法: `GET`
- 路径: `/memos`
- 请求头:
  ```
  Authorization: Bearer <token>
  ```
- 查询参数:
  ```
  page?: number     // 页码，默认 1
  pageSize?: number // 每页数量，默认 20
  keyword?: string  // 搜索关键词，可选
  ```
- 成功响应 (200):
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": 100,
      "list": [
        {
          "id": "1234567890",
          "userId": "user123",
          "title": "会议记录",
          "content": "今天下午3点开产品评审会...",
          "createTime": 1648888888888,
          "updateTime": 1648888888888
        }
      ]
    }
  }
  ```
- 失败响应:
  - 未认证 (401):
    ```json
    {
      "code": 401,
      "message": "未提供认证令牌"
    }
    ```

### 2. 获取单个备忘录
- 请求方法: `GET`
- 路径: `/memos/:id`
- 请求头:
  ```
  Authorization: Bearer <token>
  ```
- 成功响应 (200):
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "1234567890",
      "userId": "user123",
      "title": "会议记录",
      "content": "今天下午3点开产品评审会...",
      "createTime": 1648888888888,
      "updateTime": 1648888888888
    }
  }
  ```
- 失败响应:
  - 未找到 (404):
    ```json
    {
      "code": 404,
      "message": "备忘录不存在"
    }
    ```

### 3. 创建备忘录
- 请求方法: `POST`
- 路径: `/memos`
- 请求头:
  ```
  Content-Type: application/json
  Authorization: Bearer <token>
  ```
- 请求体:
  ```json
  {
    "title": "会议记录",
    "content": "今天下午3点开产品评审会..."
  }
  ```
- 成功响应 (201):
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "1234567890",
      "userId": "user123",
      "title": "会议记录",
      "content": "今天下午3点开产品评审会...",
      "createTime": 1648888888888,
      "updateTime": 1648888888888
    }
  }
  ```
- 失败响应:
  - 参数错误 (400):
    ```json
    {
      "code": 400,
      "message": "请求参数错误",
      "errors": [
        {
          "msg": "标题不能为空",
          "param": "title",
          "location": "body"
        }
      ]
    }
    ```

### 4. 更新备忘录
- 请求方法: `PUT`
- 路径: `/memos/:id`
- 请求头:
  ```
  Content-Type: application/json
  Authorization: Bearer <token>
  ```
- 请求体:
  ```json
  {
    "title": "更新后的标题",
    "content": "更新后的内容"
  }
  ```
- 成功响应 (200):
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "1234567890",
      "userId": "user123",
      "title": "更新后的标题",
      "content": "更新后的内容",
      "createTime": 1648888888888,
      "updateTime": 1648888888889
    }
  }
  ```
- 失败响应:
  - 未找到 (404):
    ```json
    {
      "code": 404,
      "message": "备忘录不存在"
    }
    ```

### 5. 删除备忘录
- 请求方法: `DELETE`
- 路径: `/memos/:id`
- 请求头:
  ```
  Authorization: Bearer <token>
  ```
- 成功响应 (200):
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```
- 失败响应:
  - 未找到 (404):
    ```json
    {
      "code": 404,
      "message": "备忘录不存在"
    }
    ```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200    | 成功 |
| 201    | 创建成功 |
| 400    | 请求参数错误 |
| 401    | 未认证或认证失败 |
| 403    | 无权限 |
| 404    | 资源不存在 |
| 409    | 资源冲突（如用户名已存在） |
| 500    | 服务器内部错误 |

## 注意事项

1. 所有时间戳使用毫秒级时间戳
2. 除了注册和登录接口，其他接口都需要在请求头包含 `Authorization: Bearer <token>`
3. Token 有效期为 24 小时，过期需要重新登录
4. 分页接口的 `page` 从 1 开始计数
5. 更新接口支持部分字段更新
6. 删除操作为软删除，数据库中保留记录但不再返回给前端
7. 用户名不允许重复
8. 密码在传输和存储时都需要加密处理
9. 每个用户只能操作自己的备忘录 