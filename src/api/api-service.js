import axios from "axios";


class ApiService {
  constructor() {
    this.apiUrl = 'http://80.78.243.125/api/';
    // this.apiUrl = 'http://localhost:11864/api/';
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

  stopRound() {
    return axios.patch(this.#createUrl('game/round/stop'));
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

  getSetting(options) {
    return axios.get(this.#createUrl('settings'), options)
  }
  
  updateSetting(options) {
    return axios.put(this.#createUrl('settings'), options)
  }


  // Companies START

  createCompany(options) {
    return axios.post(this.#createUrl('company'), options);
  }

  getCompanies() {
    return axios.get(this.#createUrl('company'))
  }

  updateCompany(options, company) {
    return axios.put(this.#createUrl(`company/${company}`), options)
  }

  deleteCompany(company) {
    return axios.patch(this.#createUrl(`company/${company}`))
  }

  // Companies END

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

  resetTrade(options) {
    return axios.post(this.#createUrl(`team/${options.teamId}/purchase/reset`))
  }



  buyNew(options) {
    return axios.post(this.#createUrl(`team/purchase/additional-info/${options.teamId}`))
  }


  // Новости

  createNew(options) {
    return axios.post(this.#createUrl('additional-info'), options)
  }

  updateNew(options, newId) {
    return axios.put(this.#createUrl(`additional-info/${newId}`), options)
  }

  getNews() {
    return axios.get(this.#createUrl(`additional-info?type=1`))
  }

  deleteNew(newId) {
    return axios.delete(this.#createUrl(`additional-info/${newId}`))
  }

  // Статистика
  getStatistics() {
    return axios.get(this.#createUrl('team/statistics'))
  }

  // Public methods

  refreshToken() {
    return axios.post(this.#createUrl('auth/refresh'))
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
