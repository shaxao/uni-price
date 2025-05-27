"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://api.example.com/v1";
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    const defaultOptions = {
      url: options.url,
      method: options.method || "GET",
      data: options.data,
      header: {
        "Content-Type": "application/json",
        ...options.header
      },
      success: (res) => {
        var _a;
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.showToast({
            title: "登录已过期，请重新登录",
            icon: "none",
            duration: 2e3
          });
          setTimeout(() => {
            common_vendor.index.redirectTo({
              url: "/pages/login/index"
            });
          }, 1500);
          reject({ message: "登录已过期，请重新登录" });
        } else {
          const errorMsg = ((_a = res.data) == null ? void 0 : _a.message) || "请求失败";
          common_vendor.index.showToast({
            title: errorMsg,
            icon: "none",
            duration: 2e3
          });
          reject({ message: errorMsg, statusCode: res.statusCode });
        }
      },
      fail: (err) => {
        const errorMsg = err.errMsg || "网络异常，请稍后再试";
        common_vendor.index.showToast({
          title: errorMsg,
          icon: "none",
          duration: 2e3
        });
        reject({ message: errorMsg, error: err });
      }
    };
    if (token) {
      defaultOptions.header.Authorization = `Bearer ${token}`;
    }
    defaultOptions.url = options.url.startsWith("http") ? options.url : BASE_URL + options.url;
    common_vendor.index.request(defaultOptions);
  });
};
const get = (url, data = {}, header = {}) => {
  return request({ url, method: "GET", data, header });
};
const post = (url, data = {}, header = {}) => {
  return request({ url, method: "POST", data, header });
};
const put = (url, data = {}, header = {}) => {
  return request({ url, method: "PUT", data, header });
};
exports.get = get;
exports.post = post;
exports.put = put;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
