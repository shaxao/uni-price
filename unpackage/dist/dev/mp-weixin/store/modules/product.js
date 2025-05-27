"use strict";
const utils_request = require("../../utils/request.js");
const state = {
  products: [],
  currentProduct: null,
  filteredProducts: [],
  productFilter: {
    sort: "default",
    // default, priceAsc, priceDesc, dateNear, dateFar
    category: null,
    search: ""
  },
  loading: false,
  error: null
};
const mutations = {
  SET_PRODUCTS(state2, products) {
    state2.products = products;
  },
  SET_FILTERED_PRODUCTS(state2, products) {
    state2.filteredProducts = products;
  },
  SET_CURRENT_PRODUCT(state2, product2) {
    state2.currentProduct = product2;
  },
  SET_PRODUCT_FILTER(state2, filter) {
    state2.productFilter = { ...state2.productFilter, ...filter };
  },
  SET_LOADING(state2, status) {
    state2.loading = status;
  },
  SET_ERROR(state2, error) {
    state2.error = error;
  }
};
const actions = {
  // 获取产品列表
  async fetchProducts({ commit, dispatch }) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.get("/products");
      commit("SET_PRODUCTS", response.data || []);
      dispatch("applyFilters");
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 获取产品详情
  async fetchProductDetail({ commit }, productId) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.get(`/products/${productId}`);
      commit("SET_CURRENT_PRODUCT", response.data);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 应用筛选条件
  applyFilters({ commit, state: state2 }) {
    let filtered = [...state2.products];
    if (state2.productFilter.search) {
      const search = state2.productFilter.search.toLowerCase();
      filtered = filtered.filter(
        (product2) => product2.product_name.toLowerCase().includes(search) || product2.description && product2.description.toLowerCase().includes(search)
      );
    }
    if (state2.productFilter.category) {
      filtered = filtered.filter(
        (product2) => product2.category === state2.productFilter.category
      );
    }
    switch (state2.productFilter.sort) {
      case "priceAsc":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceDesc":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "dateNear":
        filtered.sort((a, b) => {
          const dateA = a.expiry_date ? new Date(a.expiry_date) : new Date(9999, 11, 31);
          const dateB = b.expiry_date ? new Date(b.expiry_date) : new Date(9999, 11, 31);
          return dateA - dateB;
        });
        break;
      case "dateFar":
        filtered.sort((a, b) => {
          const dateA = a.expiry_date ? new Date(a.expiry_date) : /* @__PURE__ */ new Date(0);
          const dateB = b.expiry_date ? new Date(b.expiry_date) : /* @__PURE__ */ new Date(0);
          return dateB - dateA;
        });
        break;
    }
    commit("SET_FILTERED_PRODUCTS", filtered);
  },
  // 更新筛选条件
  updateFilter({ commit, dispatch }, filter) {
    commit("SET_PRODUCT_FILTER", filter);
    dispatch("applyFilters");
  },
  // 重置筛选条件
  resetFilters({ commit, dispatch }) {
    commit("SET_PRODUCT_FILTER", {
      sort: "default",
      category: null,
      search: ""
    });
    dispatch("applyFilters");
  },
  // 创建新产品（管理员功能）
  async createProduct({ commit }, productData) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.post("/products", productData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      commit("SET_ERROR", error.message);
      return {
        success: false,
        message: error.message || "创建产品失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 更新产品（管理员功能）
  async updateProduct({ commit }, { productId, data }) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.put(`/products/${productId}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      commit("SET_ERROR", error.message);
      return {
        success: false,
        message: error.message || "更新产品失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  }
};
const getters = {
  productList: (state2) => state2.filteredProducts.length > 0 ? state2.filteredProducts : state2.products,
  productById: (state2) => (id) => state2.products.find((p) => p.product_id === id)
};
const product = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
exports.product = product;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/product.js.map
