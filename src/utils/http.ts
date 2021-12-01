import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { Cookies } from 'quasar';

class Http {
  private service = axios.create({
    withCredentials: true,
    baseURL:
      process.env.NODE_ENV === 'production' || process.env.SERVER
        ? process.env.VUE_APP_HTTP_HOST
        : '/dev',
    timeout: 30000,
  });

  constructor() {
    this.service.defaults.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
    };

    this.service.interceptors.request.use(
      (config: AxiosRequestConfig, cookies?: Cookies) => {
        if (cookies) {
          config.headers = 'token= ' + cookies.get('token');
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    this.service.interceptors.response.use(
      (response) => {
        if (response.status === 200) {
          if (response.data) {
            return Promise.resolve(response);
          }
          return Promise.reject(response);
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  public async get<T>(url: string, params = {}) {
    return this.service.get<T>(url, { params });
  }
  public async post(url: string, data = {}, config = {}) {
    data = qs.stringify(data); // form-data传参
    return this.service.post(url, data, config);
  }
  public async put(url: string, data = {}, config = {}) {
    return this.service.put(url, data, config);
  }
}

export default new Http();
