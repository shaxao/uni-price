/**
 * 网络请求工具函数
 */

const BASE_URL = 'https://api.example.com/v1';

/**
 * HTTP请求封装
 * @param {Object} options - 请求选项
 * @returns {Promise} Promise对象
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');

    const defaultOptions = {
      url: options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // 处理未授权的情况
          uni.removeStorageSync('token');
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
            duration: 2000
          });

          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/login/index'
            });
          }, 1500);

          reject({ message: '登录已过期，请重新登录' });
        } else {
          const errorMsg = res.data?.message || '请求失败';
          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          });
          reject({ message: errorMsg, statusCode: res.statusCode });
        }
      },
      fail: (err) => {
        const errorMsg = err.errMsg || '网络异常，请稍后再试';
        uni.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
        reject({ message: errorMsg, error: err });
      }
    };

    // 添加token到请求头
    if (token) {
      defaultOptions.header.Authorization = `Bearer ${token}`;
    }

    // 拼接完整URL
    defaultOptions.url = options.url.startsWith('http')
      ? options.url
      : BASE_URL + options.url;

    uni.request(defaultOptions);
  });
};

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} header - 请求头
 * @returns {Promise}
 */
export const get = (url, data = {}, header = {}) => {
  return request({ url, method: 'GET', data, header });
};

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} header - 请求头
 * @returns {Promise}
 */
export const post = (url, data = {}, header = {}) => {
  return request({ url, method: 'POST', data, header });
};

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} header - 请求头
 * @returns {Promise}
 */
export const put = (url, data = {}, header = {}) => {
  return request({ url, method: 'PUT', data, header });
};

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} header - 请求头
 * @returns {Promise}
 */
export const del = (url, data = {}, header = {}) => {
  return request({ url, method: 'DELETE', data, header });
};

/**
 * 上传文件
 * @param {string} url - 上传地址
 * @param {string} filePath - 文件路径
 * @param {string} name - 文件对应的 key
 * @param {Object} formData - 附加的表单数据
 * @returns {Promise}
 */
export const upload = (url, filePath, name = 'file', formData = {}) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');

    uni.uploadFile({
      url: url.startsWith('http') ? url : BASE_URL + url,
      filePath,
      name,
      formData,
      header: {
        Authorization: token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          let data;
          try {
            data = JSON.parse(res.data);
            resolve(data);
          } catch (e) {
            resolve(res.data);
          }
        } else {
          const errorMsg = '上传失败';
          uni.showToast({
            title: errorMsg,
            icon: 'none'
          });
          reject({ message: errorMsg, statusCode: res.statusCode });
        }
      },
      fail: (err) => {
        const errorMsg = err.errMsg || '网络异常，上传失败';
        uni.showToast({
          title: errorMsg,
          icon: 'none'
        });
        reject({ message: errorMsg, error: err });
      }
    });
  });
};

/**
 * 下载文件
 * @param {string} url - 下载地址
 * @returns {Promise}
 */
export const download = (url) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');

    uni.downloadFile({
      url: url.startsWith('http') ? url : BASE_URL + url,
      header: {
        Authorization: token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        } else {
          const errorMsg = '下载失败';
          uni.showToast({
            title: errorMsg,
            icon: 'none'
          });
          reject({ message: errorMsg, statusCode: res.statusCode });
        }
      },
      fail: (err) => {
        const errorMsg = err.errMsg || '网络异常，下载失败';
        uni.showToast({
          title: errorMsg,
          icon: 'none'
        });
        reject({ message: errorMsg, error: err });
      }
    });
  });
};

export default {
  request,
  get,
  post,
  put,
  delete: del,
  upload,
  download
}; 