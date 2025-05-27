import { get, post, put } from '../../utils/request'

// 用户模块
const state = {
  userInfo: null,
  token: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  isAdmin: false
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    state.isLoggedIn = !!userInfo
    state.isAdmin = userInfo ? userInfo.role === 'admin' : false
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_USER(state) {
    state.userInfo = null
    state.token = null
    state.isLoggedIn = false
    state.isAdmin = false
  }
}

const actions = {
  // 用户登录
  async login({ commit }, { username, password }) {
    commit('SET_LOADING', true)
    try {
      const response = await post('/auth/login', { username, password })

      if (response.success) {
        const { token, user } = response.data

        // 存储token到本地存储
        uni.setStorageSync('token', token)

        commit('SET_TOKEN', token)
        commit('SET_USER_INFO', user)

        return {
          success: true,
          data: user
        }
      } else {
        commit('SET_ERROR', response.message || '登录失败')
        return {
          success: false,
          message: response.message || '登录失败'
        }
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return {
        success: false,
        message: error.message || '登录失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 用户注册
  async register({ commit }, userData) {
    commit('SET_LOADING', true)
    try {
      const response = await post('/auth/register', userData)

      return {
        success: response.success,
        message: response.message,
        data: response.data
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return {
        success: false,
        message: error.message || '注册失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 重置密码
  async resetPassword({ commit }, { email }) {
    commit('SET_LOADING', true)
    try {
      const response = await post('/auth/reset-password', { email })

      return {
        success: response.success,
        message: response.message
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return {
        success: false,
        message: error.message || '重置密码失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取用户信息
  async fetchUserInfo({ commit, state }) {
    // 如果已经有用户信息，直接返回
    if (state.userInfo) {
      return {
        success: true,
        data: state.userInfo
      }
    }

    // 检查本地存储中是否有token
    const token = state.token || uni.getStorageSync('token')
    if (!token) {
      return {
        success: false,
        message: '未登录'
      }
    }

    commit('SET_TOKEN', token)
    commit('SET_LOADING', true)

    try {
      const response = await get('/user/info')

      if (response.success) {
        commit('SET_USER_INFO', response.data)
        return {
          success: true,
          data: response.data
        }
      } else {
        commit('CLEAR_USER')
        uni.removeStorageSync('token')
        return {
          success: false,
          message: response.message || '获取用户信息失败'
        }
      }
    } catch (error) {
      commit('SET_ERROR', error.message)

      // 如果是401错误，清除本地token
      if (error.statusCode === 401) {
        commit('CLEAR_USER')
        uni.removeStorageSync('token')
      }

      return {
        success: false,
        message: error.message || '获取用户信息失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 更新用户信息
  async updateUserInfo({ commit }, userData) {
    commit('SET_LOADING', true)
    try {
      const response = await put('/user/info', userData)

      if (response.success) {
        commit('SET_USER_INFO', response.data)
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          message: response.message || '更新用户信息失败'
        }
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return {
        success: false,
        message: error.message || '更新用户信息失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 登出
  logout({ commit }) {
    commit('CLEAR_USER')
    uni.removeStorageSync('token')
    return {
      success: true,
      message: '已退出登录'
    }
  }
}

const getters = {
  isAuthenticated: state => !!state.token,
  isAdmin: state => state.isAdmin,
  userRole: state => state.userInfo ? state.userInfo.role : null
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 