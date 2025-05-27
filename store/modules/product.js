import { get, post, put } from '../../utils/request'

// 产品模块
const state = {
  products: [],
  currentProduct: null,
  filteredProducts: [],
  productFilter: {
    sort: 'default', // default, priceAsc, priceDesc, dateNear, dateFar
    category: null,
    search: ''
  },
  loading: false,
  error: null
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_FILTERED_PRODUCTS(state, products) {
    state.filteredProducts = products
  },
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
  },
  SET_PRODUCT_FILTER(state, filter) {
    state.productFilter = { ...state.productFilter, ...filter }
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  // 获取产品列表
  async fetchProducts({ commit, dispatch }) {
    commit('SET_LOADING', true)
    try {
      const response = await get('/products')
      commit('SET_PRODUCTS', response.data || [])

      // 应用当前筛选条件
      dispatch('applyFilters')

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取产品详情
  async fetchProductDetail({ commit }, productId) {
    commit('SET_LOADING', true)
    try {
      const response = await get(`/products/${productId}`)
      commit('SET_CURRENT_PRODUCT', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 应用筛选条件
  applyFilters({ commit, state }) {
    let filtered = [...state.products]

    // 关键词搜索
    if (state.productFilter.search) {
      const search = state.productFilter.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.product_name.toLowerCase().includes(search) ||
        (product.description && product.description.toLowerCase().includes(search))
      )
    }

    // 分类筛选
    if (state.productFilter.category) {
      filtered = filtered.filter(product =>
        product.category === state.productFilter.category
      )
    }

    // 排序
    switch (state.productFilter.sort) {
      case 'priceAsc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'priceDesc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'dateNear':
        filtered.sort((a, b) => {
          const dateA = a.expiry_date ? new Date(a.expiry_date) : new Date(9999, 11, 31)
          const dateB = b.expiry_date ? new Date(b.expiry_date) : new Date(9999, 11, 31)
          return dateA - dateB
        })
        break
      case 'dateFar':
        filtered.sort((a, b) => {
          const dateA = a.expiry_date ? new Date(a.expiry_date) : new Date(0)
          const dateB = b.expiry_date ? new Date(b.expiry_date) : new Date(0)
          return dateB - dateA
        })
        break
    }

    commit('SET_FILTERED_PRODUCTS', filtered)
  },

  // 更新筛选条件
  updateFilter({ commit, dispatch }, filter) {
    commit('SET_PRODUCT_FILTER', filter)
    dispatch('applyFilters')
  },

  // 重置筛选条件
  resetFilters({ commit, dispatch }) {
    commit('SET_PRODUCT_FILTER', {
      sort: 'default',
      category: null,
      search: ''
    })
    dispatch('applyFilters')
  },

  // 创建新产品（管理员功能）
  async createProduct({ commit }, productData) {
    commit('SET_LOADING', true)
    try {
      const response = await post('/products', productData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return {
        success: false,
        message: error.message || '创建产品失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 更新产品（管理员功能）
  async updateProduct({ commit }, { productId, data }) {
    commit('SET_LOADING', true)
    try {
      const response = await put(`/products/${productId}`, data)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return {
        success: false,
        message: error.message || '更新产品失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  productList: state => state.filteredProducts.length > 0 ? state.filteredProducts : state.products,
  productById: state => id => state.products.find(p => p.product_id === id)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 