import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { API } from "./api-service";

axios.interceptors.request.use((config) => {
  const methods = ['post', 'delete', 'put'];
  if (methods.includes(config.method)) {
    const authStore = useAuthStore();
    config.headers['Authorization'] = `Bearer ${authStore.userInfo.token}`;
  }
  return config
})

axios.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const response = await API.refreshToken()
    console.log('test ', response)
  }
})