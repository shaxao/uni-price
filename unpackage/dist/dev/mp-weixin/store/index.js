"use strict";
const common_vendor = require("../common/vendor.js");
const store_modules_user = require("./modules/user.js");
const store_modules_product = require("./modules/product.js");
const store_modules_quote = require("./modules/quote.js");
const cart = {
  namespaced: true,
  state: {
    cartItems: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_CART_ITEMS(state, items) {
      state.cartItems = items;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    ADD_CART_ITEM(state, item) {
      state.cartItems.push(item);
    },
    REMOVE_CART_ITEM(state, index) {
      state.cartItems.splice(index, 1);
    },
    CLEAR_CART(state) {
      state.cartItems = [];
    }
  },
  actions: {
    // 从本地存储加载购物车数据
    loadCartItems({ commit }) {
      commit("SET_LOADING", true);
      try {
        const cartItems = common_vendor.index.getStorageSync("cartItems") || [];
        commit("SET_CART_ITEMS", cartItems);
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    // 添加商品到购物车
    addToCart({ commit, state }, product) {
      try {
        const existingIndex = state.cartItems.findIndex((item) => item.productId === product.productId);
        if (existingIndex !== -1) {
          return {
            success: false,
            message: "该商品已在购物车中"
          };
        }
        const cartItem = {
          productId: product.productId,
          productName: product.productName,
          addTime: (/* @__PURE__ */ new Date()).getTime()
        };
        commit("ADD_CART_ITEM", cartItem);
        common_vendor.index.setStorageSync("cartItems", state.cartItems);
        return {
          success: true,
          message: "已加入购物车"
        };
      } catch (error) {
        commit("SET_ERROR", error.message);
        return {
          success: false,
          message: "添加失败，请重试"
        };
      }
    },
    // 从购物车中移除商品
    removeCartItem({ commit, state }, index) {
      try {
        commit("REMOVE_CART_ITEM", index);
        common_vendor.index.setStorageSync("cartItems", state.cartItems);
        return {
          success: true,
          message: "删除成功"
        };
      } catch (error) {
        commit("SET_ERROR", error.message);
        return {
          success: false,
          message: "删除失败"
        };
      }
    },
    // 清空购物车
    clearCart({ commit }) {
      try {
        commit("CLEAR_CART");
        common_vendor.index.setStorageSync("cartItems", []);
        return {
          success: true,
          message: "购物车已清空"
        };
      } catch (error) {
        commit("SET_ERROR", error.message);
        return {
          success: false,
          message: "操作失败"
        };
      }
    }
  },
  getters: {
    cartItemCount: (state) => state.cartItems.length
  }
};
const store = common_vendor.createStore({
  modules: {
    user: store_modules_user.user,
    product: store_modules_product.product,
    quote: store_modules_quote.quote,
    cart
  }
});
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
