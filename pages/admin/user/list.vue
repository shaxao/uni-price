<template>
  <view class="admin-user-list-container">
    <TopBar title="用户管理" :showBack="false" :withBorder="true" />
    <AdminNavBar currentPath="/pages/admin/user/list" />
    
    <view class="header-bar">
      <input class="search-input" v-model="search" placeholder="搜索用户名/手机号" @input="handleSearch" />
      <button class="add-btn" @click="handleAdd">+ 新增用户</button>
    </view>
    
    <view class="filter-bar">
      <picker :range="roleOptions" :value="roleIndex" @change="onRoleChange">
        <view class="filter-item">{{ roleOptions[roleIndex] }}</view>
      </picker>
      <picker :range="statusOptions" :value="statusIndex" @change="onStatusChange">
        <view class="filter-item">{{ statusOptions[statusIndex] }}</view>
      </picker>
      <picker :range="dateOptions" :value="dateIndex" @change="onDateChange">
        <view class="filter-item">{{ dateOptions[dateIndex] }}</view>
      </picker>
    </view>
    
    <view class="user-list">
      <view v-for="item in filteredUsers" :key="item.user_id" class="user-card">
        <view class="card-left">
          <image :src="item.avatar || defaultAvatar" class="user-avatar" mode="aspectFill" />
        </view>
        <view class="card-right">
          <view class="card-header">
            <text class="user-name">{{ item.username }}</text>
            <text class="role-tag" :class="item.role">{{ getRoleText(item.role) }}</text>
          </view>
          <view class="user-info">
            <text class="user-id">ID：{{ item.user_id }}</text>
            <text class="user-phone">手机：{{ item.phone || '未设置' }}</text>
            <text class="user-email">邮箱：{{ item.email || '未设置' }}</text>
            <text class="user-date">注册时间：{{ formatDate(item.created_at) }}</text>
          </view>
          <view class="card-actions">
            <button class="mini-btn" @click="onView(item)">查看</button>
            <button class="mini-btn" @click="onEdit(item)">编辑</button>
            <button class="mini-btn danger" @click="onDelete(item)">删除</button>
            <button class="mini-btn" v-if="item.status === 'active'" @click="onChangeStatus(item, 'inactive')">禁用</button>
            <button class="mini-btn" v-else @click="onChangeStatus(item, 'active')">启用</button>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 分页组件 -->
    <view class="pagination-bar" v-if="users.length > 0">
      <button class="page-btn" :disabled="page === 1" @click="page--">上一页</button>
      <text class="page-info">第{{ page }}页</text>
      <button class="page-btn" :disabled="!hasNextPage" @click="page++">下一页</button>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-if="users.length === 0">
      <image src="/static/images/empty-user.png" class="empty-image" mode="aspectFit" />
      <text class="empty-text">暂无用户数据</text>
    </view>
  </view>
</template>

<script>
import TopBar from '../../../components/TopBar.vue'
import AdminNavBar from '../../../components/AdminNavBar.vue'

export default {
  name: 'AdminUserList',
  components: { TopBar, AdminNavBar },
  data() {
    return {
      search: '',
      page: 1,
      pageSize: 10,
      roleOptions: ['全部角色', '管理员', '普通用户', '供应商'],
      roleIndex: 0,
      statusOptions: ['全部状态', '正常', '已禁用'],
      statusIndex: 0,
      dateOptions: ['默认排序', '注册时间从新到旧', '注册时间从旧到新'],
      dateIndex: 0,
      users: [],
      defaultAvatar: '/static/images/default-avatar.png'
    }
  },
  computed: {
    filteredUsers() {
      let list = this.users
      
      // 搜索过滤
      if (this.search) {
        const s = this.search.trim().toLowerCase()
        list = list.filter(item =>
          (item.username && item.username.toLowerCase().includes(s)) ||
          (item.phone && item.phone.includes(s)) ||
          (item.email && item.email.toLowerCase().includes(s))
        )
      }
      
      // 角色过滤
      if (this.roleIndex === 1) list = list.filter(i => i.role === 'admin')
      if (this.roleIndex === 2) list = list.filter(i => i.role === 'user')
      if (this.roleIndex === 3) list = list.filter(i => i.role === 'supplier')
      
      // 状态过滤
      if (this.statusIndex === 1) list = list.filter(i => i.status === 'active')
      if (this.statusIndex === 2) list = list.filter(i => i.status === 'inactive')
      
      // 日期排序
      if (this.dateIndex === 1) {
        list = list.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
      if (this.dateIndex === 2) {
        list = list.slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      }
      
      // 分页
      const start = (this.page - 1) * this.pageSize
      return list.slice(start, start + this.pageSize)
    },
    hasNextPage() {
      let list = this.users
      
      if (this.search) {
        const s = this.search.trim().toLowerCase()
        list = list.filter(item =>
          (item.username && item.username.toLowerCase().includes(s)) ||
          (item.phone && item.phone.includes(s)) ||
          (item.email && item.email.toLowerCase().includes(s))
        )
      }
      
      if (this.roleIndex === 1) list = list.filter(i => i.role === 'admin')
      if (this.roleIndex === 2) list = list.filter(i => i.role === 'user')
      if (this.roleIndex === 3) list = list.filter(i => i.role === 'supplier')
      
      if (this.statusIndex === 1) list = list.filter(i => i.status === 'active')
      if (this.statusIndex === 2) list = list.filter(i => i.status === 'inactive')
      
      return list.length > this.page * this.pageSize
    }
  },
  created() {
    this.loadUsers()
  },
  methods: {
    loadUsers() {
      // 模拟加载用户数据
      const mockUsers = [
        {
          user_id: 'U10001',
          username: '张三',
          role: 'admin',
          phone: '13800138001',
          email: 'zhangsan@example.com',
          status: 'active',
          created_at: '2023-01-15T08:30:00Z',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
          user_id: 'U10002',
          username: '李四',
          role: 'user',
          phone: '13800138002',
          email: 'lisi@example.com',
          status: 'active',
          created_at: '2023-02-10T14:20:00Z',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
        },
        {
          user_id: 'U10003',
          username: '王五',
          role: 'supplier',
          phone: '13800138003',
          email: 'wangwu@example.com',
          status: 'inactive',
          created_at: '2023-03-05T11:45:00Z',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
        },
        {
          user_id: 'U10004',
          username: '赵六',
          role: 'user',
          phone: '13800138004',
          email: 'zhaoliu@example.com',
          status: 'active',
          created_at: '2023-04-20T09:15:00Z',
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
        },
        {
          user_id: 'U10005',
          username: '钱七',
          role: 'supplier',
          phone: '13800138005',
          email: 'qianqi@example.com',
          status: 'active',
          created_at: '2023-05-18T16:30:00Z',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
        }
      ];
      
      this.users = mockUsers;
    },
    handleSearch() {
      this.page = 1
    },
    onRoleChange(e) {
      this.roleIndex = e.detail.value
      this.page = 1
    },
    onStatusChange(e) {
      this.statusIndex = e.detail.value
      this.page = 1
    },
    onDateChange(e) {
      this.dateIndex = e.detail.value
      this.page = 1
    },
    handleAdd() {
      uni.navigateTo({ url: '/pages/admin/user/edit' })
    },
    onView(item) {
      uni.navigateTo({ url: `/pages/admin/user/detail?id=${item.user_id}` })
    },
    onEdit(item) {
      uni.navigateTo({ url: `/pages/admin/user/edit?id=${item.user_id}` })
    },
    onDelete(item) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除用户「${item.username}」吗？`,
        success: (res) => {
          if (res.confirm) {
            this.users = this.users.filter(u => u.user_id !== item.user_id)
            uni.showToast({ title: '已删除', icon: 'success' })
          }
        }
      })
    },
    onChangeStatus(item, status) {
      const statusText = status === 'active' ? '启用' : '禁用'
      uni.showModal({
        title: `确认${statusText}`,
        content: `确定要${statusText}用户「${item.username}」吗？`,
        success: (res) => {
          if (res.confirm) {
            item.status = status
            uni.showToast({ title: `已${statusText}`, icon: 'success' })
          }
        }
      })
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },
    getRoleText(role) {
      const roleMap = {
        'admin': '管理员',
        'user': '普通用户',
        'supplier': '供应商'
      }
      return roleMap[role] || role
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-user-list-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 24rpx;
}
.header-bar {
  display: flex;
  gap: 12rpx;
  margin: 20rpx 0;
  align-items: center;
  padding: 0 16rpx;
  .search-input {
    flex: 1;
    height: 56rpx;
    border: 1px solid #e0e0e0;
    border-radius: 8rpx;
    font-size: 26rpx;
    padding: 0 16rpx;
    background: #fff;
  }
  .add-btn {
    height: 56rpx;
    padding: 0 15rpx;
    border-radius: 8rpx;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: normal;
    background: #1976d2;
    color: #fff;
    border: none;
  }
}
.filter-bar {
  display: flex;
  gap: 18rpx;
  margin-bottom: 18rpx;
  padding: 0 16rpx;
  .filter-item {
    font-size: 24rpx;
    color: #1976d2;
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 10rpx 24rpx;
    min-width: 120rpx;
    text-align: center;
  }
}
.user-list {
  padding: 0 12rpx;
}
.user-card {
  display: flex;
  background: #fff;
  border-radius: 14rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  margin-bottom: 18rpx;
  padding: 16rpx 12rpx;
  align-items: flex-start;
}
.card-left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #f5f5f5;
  object-fit: cover;
}
.card-right {
  flex: 1;
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6rpx;
}
.user-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #222;
}
.role-tag {
  font-size: 22rpx;
  padding: 2rpx 12rpx;
  border-radius: 12rpx;
  margin-left: 8rpx;
  
  &.admin {
    background: #e3f2fd;
    color: #1976d2;
  }
  &.user {
    background: #e8f5e9;
    color: #43a047;
  }
  &.supplier {
    background: #fff3e0;
    color: #ef6c00;
  }
}
.user-info {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  .user-id, .user-phone, .user-email, .user-date {
    display: block;
    margin-bottom: 2rpx;
  }
}
.card-actions {
  display: flex;
  gap: 12rpx;
  margin-top: 8rpx;
  
  .mini-btn {
    font-size: 22rpx;
    min-width: 72rpx;
    height: 44rpx;
    line-height: 44rpx;
    border-radius: 22rpx;
    background: #f5f5f5;
    color: #1976d2;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 18rpx;
    box-sizing: border-box;
    
    &.danger {
      background: #fbe9e7;
      color: #f44336;
    }
  }
}
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16rpx;
  margin: 24rpx 0 8rpx 0;
  
  .page-btn {
    font-size: 22rpx;
    min-width: 80rpx;
    height: 44rpx;
    line-height: 44rpx;
    border-radius: 22rpx;
    background: #e3f2fd;
    color: #1976d2;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 18rpx;
    box-sizing: border-box;
    
    &:disabled {
      background: #eee;
      color: #aaa;
    }
  }
  
  .page-info {
    font-size: 22rpx;
    color: #666;
  }
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  
  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style> 