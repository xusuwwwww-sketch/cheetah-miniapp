const BASE_URL = 'http://10.60.128.98:3000'

const getToken = () => {
  try { return uni.getStorageSync('token') || '' } catch(e) { return '' }
}

const request = (method, url, data = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      timeout: 30000,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail(err) {
        console.error('请求失败:', url, err)
        reject(err)
      }
    })
  })
}

const get = (url, params = {}) => {
  const entries = Object.entries(params).filter(([,v]) => v !== undefined && v !== '')
  const query = entries.length ? '?' + entries.map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&') : ''
  return request('GET', url + query)
}

const post = (url, data) => request('POST', url, data)

export const api = {
  // 配置
  getBanners: () => get('/api/config/banners'),
  getCommunities: () => get('/api/config/communities'),
  // 活动
  getActivities: (params = {}) => get('/api/activities', params),
  getActivityDetail: (id) => get(`/api/activities/${id}`),
  signupActivity: (id) => post(`/api/activities/${id}/signup`),
  // 报告
  getReports: (params = {}) => get('/api/reports', params),
  getReportDetail: (id) => get(`/api/reports/${id}`),
  viewReport: (id) => post(`/api/reports/${id}/view`),
  // 资料
  getMaterials: (params = {}) => get('/api/materials', params),
  getMaterialCategories: () => get('/api/materials/categories'),
  getMaterialDetail: (id) => get(`/api/materials/${id}`),
  // 咨询
  submitConsult: (data) => post('/api/consult', data),
  // 用户
  login: (code) => post('/api/user/login', { code }),
  updateBasic: (data) => post('/api/user/update-basic', data),
  updateDeep: (data) => post('/api/user/update-deep', data),
  getProfile: () => get('/api/user/profile'),
  getFavorites: (params = {}) => get('/api/user/favorites', params),
  toggleFavorite: (data) => post('/api/user/favorites/toggle', data),
  getDownloads: (params = {}) => get('/api/user/downloads', params),
  getSignups: () => get('/api/user/signups'),
  getConsults: () => get('/api/user/consults'),
  // 资料下载
  downloadMaterial: (id) => post(`/api/materials/${id}/download`),
  // 社群
  joinCommunity: (data) => post('/api/config/communities/join', data),
  getTags: (params = {}) => get('/api/config/tags', params),
  trackView: (data) => post('/api/config/track', data),
  getPopup: () => get('/api/config/popup'),
}

export default api
