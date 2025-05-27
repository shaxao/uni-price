import { createStore } from 'vuex'
import user from './modules/user'
import product from './modules/product'
import quote from './modules/quote'

// 内联购物车模块
const cart = {
  namespaced: true,
  state: {
    cartItems: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_CART_ITEMS(state, items) {
      state.cartItems = items
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    ADD_CART_ITEM(state, item) {
      state.cartItems.push(item)
    },
    REMOVE_CART_ITEM(state, index) {
      state.cartItems.splice(index, 1)
    },
    CLEAR_CART(state) {
      state.cartItems = []
    }
  },
  actions: {
    // 从本地存储加载购物车数据
    loadCartItems({ commit }) {
      commit('SET_LOADING', true)
      try {
        const cartItems = uni.getStorageSync('cartItems') || []
        commit('SET_CART_ITEMS', cartItems)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 添加商品到购物车
    addToCart({ commit, state }, product) {
      try {
        // 检查商品是否已在购物车中
        const existingIndex = state.cartItems.findIndex(item => item.productId === product.productId)

        if (existingIndex !== -1) {
          return {
            success: false,
            message: '该商品已在购物车中'
          }
        }

        // 添加新商品
        const cartItem = {
          productId: product.productId,
          productName: product.productName,
          addTime: new Date().getTime()
        }

        commit('ADD_CART_ITEM', cartItem)

        // 保存到本地存储
        uni.setStorageSync('cartItems', state.cartItems)

        return {
          success: true,
          message: '已加入购物车'
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return {
          success: false,
          message: '添加失败，请重试'
        }
      }
    },

    // 从购物车中移除商品
    removeCartItem({ commit, state }, index) {
      try {
        commit('REMOVE_CART_ITEM', index)

        // 保存到本地存储
        uni.setStorageSync('cartItems', state.cartItems)

        return {
          success: true,
          message: '删除成功'
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return {
          success: false,
          message: '删除失败'
        }
      }
    },

    // 清空购物车
    clearCart({ commit }) {
      try {
        commit('CLEAR_CART')

        // 保存到本地存储
        uni.setStorageSync('cartItems', [])

        return {
          success: true,
          message: '购物车已清空'
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return {
          success: false,
          message: '操作失败'
        }
      }
    }
  },
  getters: {
    cartItemCount: state => state.cartItems.length
  }
}

const store = createStore({
  modules: {
    user,
    product,
    quote,
    cart
  }
})

export default store