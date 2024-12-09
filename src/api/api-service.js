import axios from "axios";


class ApiService {
  constructor() {
    this.apiUrl = '';
    console.log('Я создался c адрессом = ', this.apiUrl);
  }

  // Public methods
  getArticles(options = {}) {
    return axios.get(`${this.apiUrl}/article${this.#createQueryParams(options)}`);
  }

  createArticle(options = {}) {
    return axios.post(`${this.apiUrl}/article`, options);
  }

  updateArticle(options = {}) {
    return axios.put(`${this.apiUrl}/article/${options.id}`, options);
  }

  deleteArticle(options = {}) {
    return axios.delete(`${this.apiUrl}/article/${options.id}`);
  }

  getArticle(options = {}) {
    return axios.get(`${this.apiUrl}/article/${options.id}`);
  }

  getMedia(options = {}) {
    return axios.get(`${this.apiUrl}/content${this.#createQueryParams(options)}`);
  }

  createMedia(options = {}) {
    return axios.post(`${this.apiUrl}/content${this.#createQueryParams(options)}`, options.image)
  }

  deleteMedia(options = {}) {
    return axios.delete(`${this.apiUrl}/content/${options.id}`);
  }

  signIn(options = {}) {
    return axios.post(`${this.apiUrl}/auth/sign-in`, options)
  }

  refreshToken() {
    return axios.post(`${this.apiUrl}/auth/refresh`)
  }

  // private methods
  #createQueryParams(options) {
    const params = [];
    let paramsString = '';
    if (options.limit) {
      params.push(`limit=${options.limit}`);
    }
    if (options.offset) {
      params.push(`offset=${options.offset}`);
    }
    if (options.category) {
      params.push(`category=${options.category}`);
    }
    if (params.length) {
      paramsString = `?${params.join('&')}`;
    }
    return paramsString;
  }
};

export const API = new ApiService();