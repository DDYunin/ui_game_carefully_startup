import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/api/api-service";

const TIME_EXPIRED_ACCESS_TOKEN = 10 * 60

export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref({
    token: '',
    refreshToken: '',
    expireIn: TIME_EXPIRED_ACCESS_TOKEN
  })
  const error = ref(false)

  const signIn = async (options) => {
    try {
      const { data } = await API.signIn(options);
      console.log(data)
      localStorage.setItem('userTokens', JSON.stringify({
        token: data.accessToken,
        refresh: data.refreshToken,
        expireIn: TIME_EXPIRED_ACCESS_TOKEN
      }))
      userInfo.value = {
        token: data.accessToken,
        refreshToken: data.refreshToken,
        expireIn: TIME_EXPIRED_ACCESS_TOKEN
      }
      // const response = await API.refreshToken();
      // console.log(response)
    } catch (err) {
      error.value = true
      setTimeout(() => {
        error.value = false
      }, 5000)
      throw error.value
    }
  }

  const logout = () => {
    userInfo.value = {
      token: '',
      refreshToken: '',
      expireIn: ''
    }
  }

  return {
    signIn,
    logout,
    userInfo,
    error
  }
})