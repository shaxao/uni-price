"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const state = {
  userInfo: null,
  token: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  isAdmin: false
};
const mutations = {
  SET_USER_INFO(state2, userInfo) {
    state2.userInfo = userInfo;
    state2.isLoggedIn = !!userInfo;
    state2.isAdmin = userInfo ? userInfo.role === "admin" : false;
  },
  SET_TOKEN(state2, token) {
    state2.token = token;
  },
  SET_LOADING(state2, status) {
    state2.loading = status;
  },
  SET_ERROR(state2, error) {
    state2.error = error;
  },
  CLEAR_USER(state2) {
    state2.userInfo = null;
    state2.token = null;
    state2.isLoggedIn = false;
    state2.isAdmin = false;
  }
};
const actions = {
  // 用户登录
  async login({ commit }, { username, password }) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.post("/auth/login", { username, password });
      if (response.success) {
        const { token, user: user2 } = response.data;
        common_vendor.index.setStorageSync("token", token);
        commit("SET_TOKEN", token);
        commit("SET_USER_INFO", user2);
        return {
          success: true,
          data: user2
        };
      } else {
        commit("SET_ERROR", response.message || "登录失败");
        return {
          success: false,
          message: response.message || "登录失败"
        };
      }
    } catch (error) {
      commit("SET_ERROR", error.message);
      return {
        success: false,
        message: error.message || "登录失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 用户注册
  async register({ commit }, userData) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.post("/auth/register", userData);
      return {
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      commit("SET_ERROR", error.message);
      return {
        success: false,
        message: error.message || "注册失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 重置密码
  async resetPassword({ commit }, { email }) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.post("/auth/reset-password", { email });
      return {
        success: response.success,
        message: response.message
      };
    } catch (error) {
      commit("SET_ERROR", error.message);
      return {
        success: false,
        message: error.message || "重置密码失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 获取用户信息
  async fetchUserInfo({ commit, state: state2 }) {
    if (state2.userInfo) {
      return {
        success: true,
        data: state2.userInfo
      };
    }
    const token = state2.token || common_vendor.index.getStorageSync("token");
    if (!token) {
      return {
        success: false,
        message: "未登录"
      };
    }
    commit("SET_TOKEN", token);
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.get("/user/info");
      if (response.success) {
        commit("SET_USER_INFO", response.data);
        return {
          success: true,
          data: response.data
        };
      } else {
        commit("CLEAR_USER");
        common_vendor.index.removeStorageSync("token");
        return {
          success: false,
          message: response.message || "获取用户信息失败"
        };
      }
    } catch (error) {
      commit("SET_ERROR", error.message);
      if (error.statusCode === 401) {
        commit("CLEAR_USER");
        common_vendor.index.removeStorageSync("token");
      }
      return {
        success: false,
        message: error.message || "获取用户信息失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 更新用户信息
  async updateUserInfo({ commit }, userData) {
    commit("SET_LOADING", true);
    try {
      const response = await utils_request.put("/user/info", userData);
      if (response.success) {
        commit("SET_USER_INFO", response.data);
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || "更新用户信息失败"
        };
      }
    } catch (error) {
      commit("SET_ERROR", error.message);
      return {
        success: false,
        message: error.message || "更新用户信息失败"
      };
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // 登出
  logout({ commit }) {
    commit("CLEAR_USER");
    common_vendor.index.removeStorageSync("token");
    return {
      success: true,
      message: "已退出登录"
    };
  }
};
const getters = {
  isAuthenticated: (state2) => !!state2.token,
  isAdmin: (state2) => state2.isAdmin,
  userRole: (state2) => state2.userInfo ? state2.userInfo.role : null
};
const user = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
exports.user = user;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/user.js.map
