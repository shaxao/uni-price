"use strict";
const utils_request = require("../../utils/request.js");
const state = {
  quotes: [],
  currentQuote: null,
  myQuotes: [],
  loading: false,
  error: null
};
const mutations = {
  SET_QUOTES(state2, quotes) {
    state2.quotes = quotes;
  },
  SET_CURRENT_QUOTE(state2, quote2) {
    state2.currentQuote = quote2;
  },
  SET_MY_QUOTES(state2, quotes) {
    state2.myQuotes = quotes;
  },
  ADD_QUOTE(state2, quote2) {
    state2.myQuotes.unshift(quote2);
  },
  UPDATE_QUOTE(state2, { quoteId, data }) {
    const index = state2.myQuotes.findIndex((q) => q.quote_id === quoteId);
    if (index !== -1) {
      state2.myQuotes[index] = { ...state2.myQuotes[index], ...data };
    }
  },
  SET_LOADING(state2, status) {
    state2.loading = status;
  },
  SET_ERROR(state2, error) {
    state2.error = error;
  }
};
const actions = {
  // 获取某个产品的所有报价
  async fetchQuotes({ commit }, productId) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.get(`/quotes?product_id=${productId}`);
      commit("SET_QUOTES", response.data || []);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 获取特定报价详情
  async fetchQuoteDetail({ commit }, quoteId) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.get(`/quotes/${quoteId}`);
      commit("SET_CURRENT_QUOTE", response.data);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 获取我的报价列表
  async fetchMyQuotes({ commit }) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.get("/quotes?self=1");
      commit("SET_MY_QUOTES", response.data || []);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 提交新报价
  async submitQuote({ commit }, quoteData) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.post("/quotes", quoteData);
      commit("ADD_QUOTE", response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      commit("SET_ERROR", error.message);
      return {
        success: false,
        message: error.message || "提交报价失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 更新报价
  async updateQuote({ commit }, { quoteId, data }) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.put(`/quotes/${quoteId}`, data);
      commit("UPDATE_QUOTE", { quoteId, data: response.data });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      commit("SET_ERROR", error.message);
      return {
        success: false,
        message: error.message || "更新报价失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 取消报价
  async cancelQuote({ commit }, quoteId) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.put(`/quotes/${quoteId}/cancel`, {});
      commit("UPDATE_QUOTE", {
        quoteId,
        data: { status: "cancelled" }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      commit("SET_ERROR", error.message);
      return {
        success: false,
        message: error.message || "取消报价失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  }
};
const getters = {
  pendingQuotes: (state2) => state2.myQuotes.filter((quote2) => quote2.status === "pending"),
  approvedQuotes: (state2) => state2.myQuotes.filter((quote2) => quote2.status === "approved"),
  rejectedQuotes: (state2) => state2.myQuotes.filter((quote2) => quote2.status === "rejected")
};
const quote = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
exports.quote = quote;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/quote.js.map
