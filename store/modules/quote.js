import { get, post, put } from '../../utils/request'

// 报价模块
const state = {
  quotes: [],
  currentQuote: null,
  myQuotes: [],
  loading: false,
  error: null
}

const mutations = {
  SET_QUOTES(state, quotes) {
    state.quotes = quotes
  },
  SET_CURRENT_QUOTE(state, quote) {
    state.currentQuote = quote
  },
  SET_MY_QUOTES(state, quotes) {
    state.myQuotes = quotes
  },
  ADD_QUOTE(state, quote) {
    state.myQuotes.unshift(quote)
  },
  UPDATE_QUOTE(state, { quoteId, data }) {
    const index = state.myQuotes.findIndex(q => q.quote_id === quoteId)
    if (index !== -1) {
      state.myQuotes[index] = { ...state.myQuotes[index], ...data }
    }
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  // 获取某个产品的所有报价
  async fetchQuotes({ commit }, productId) {
    commit('SET_LOADING', true)
    try {
      const response = await get(`/quotes?product_id=${productId}`)
      commit('SET_QUOTES', response.data || [])
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取特定报价详情
  async fetchQuoteDetail({ commit }, quoteId) {
    commit('SET_LOADING', true)
    try {
      const response = await get(`/quotes/${quoteId}`)
      commit('SET_CURRENT_QUOTE', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取我的报价列表
  async fetchMyQuotes({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await get('/quotes?self=1')
      commit('SET_MY_QUOTES', response.data || [])
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 提交新报价
  async submitQuote({ commit }, quoteData) {
    commit('SET_LOADING', true)
    try {
      const response = await post('/quotes', quoteData)
      commit('ADD_QUOTE', response.data)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return {
        success: false,
        message: error.message || '提交报价失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 更新报价
  async updateQuote({ commit }, { quoteId, data }) {
    commit('SET_LOADING', true)
    try {
      const response = await put(`/quotes/${quoteId}`, data)
      commit('UPDATE_QUOTE', { quoteId, data: response.data })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return {
        success: false,
        message: error.message || '更新报价失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 取消报价
  async cancelQuote({ commit }, quoteId) {
    commit('SET_LOADING', true)
    try {
      const response = await put(`/quotes/${quoteId}/cancel`, {})
      commit('UPDATE_QUOTE', {
        quoteId,
        data: { status: 'cancelled' }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return {
        success: false,
        message: error.message || '取消报价失败'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  pendingQuotes: state => state.myQuotes.filter(quote => quote.status === 'pending'),
  approvedQuotes: state => state.myQuotes.filter(quote => quote.status === 'approved'),
  rejectedQuotes: state => state.myQuotes.filter(quote => quote.status === 'rejected')
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 