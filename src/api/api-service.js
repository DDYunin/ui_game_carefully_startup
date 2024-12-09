import axios from "axios";


class ApiService {
  constructor() {
    this.apiUrl = 'http://localhost:11864/api/';
    console.log('Я создался c адрессом = ', this.apiUrl);
  }

  getTeams(options) {
    return axios.get(this.#createUrl('team'), options);
  }

  stopTrade(options) {
    return axios.patch(this.#createUrl('game/trade/stop'), options);
  }

  startTrade(options) {
    return axios.patch(this.#createUrl('game/trade/start'), options);
  }

  startRound(options) {
    return axios.patch(this.#createUrl('game/round/start'), options);
  }

  stopRegistration(options) {
    return axios.patch(this.#createUrl('game/registration/stop'), options);
  }

  openRegistration(options) {
    return axios.patch(this.#createUrl('game/registration/start'), options);
  }

  stopGame(options) {
    return axios.patch(this.#createUrl('game/stop'), options);
  }

  startGame(options) {
    return axios.patch(this.#createUrl('game/start'), options);
  }

  createGame(options) {
    return axios.patch(this.#createUrl('game/create'), options);
  }

  getGame(options) {
    return axios.get(this.#createUrl('game'), options);
  }

  createCompany(options) {
    return axios.post(this.#createUrl('company'), options);
  }

  getCompanies() {
    return axios.get(this.#createUrl('company'))
  }

  registration(options) {
    return axios.post(this.#createUrl('auth/registration'), options)
  }

  login(options) {
    return axios.post(this.#createUrl('auth/login'), options)
  }

  updateTeam(options) {
    return axios.patch(this.#createUrl('team'), options)
  }

  getTeam(options) {
    return axios.get(this.#createUrl(`team/${options.teamId}`), options)
  }

  buyPapers(options) {
    return axios.post(this.#createUrl('team/purchase'), options)
  }
  // Public methods
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

  #createUrl(path) {
    return this.apiUrl + path;
  }
};

export const API = new ApiService();