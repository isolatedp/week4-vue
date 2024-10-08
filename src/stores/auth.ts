import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { AxiosError } from 'axios'
import Swal from 'sweetalert2'
import { useCookies } from 'vue3-cookies'
import { BASE_URL } from '../global-variables'
import { SignInModel } from '../view-models/auth-models'
import type { UserInfoInterface } from '../interfaces/auth-interfaces'
import { useLoadingStore } from '../stores/loading'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const status: Ref<boolean> = ref(false)

    const { cookies } = useCookies()
    const getStatus = computed(() => status.value)

    const loadingStore = useLoadingStore()

    const signIn = async (signInForm: SignInModel) => {
      // 初始化登入狀態(TODO: 含清除使用者 Cookie)
      status.value = false
      cookies.remove('userInfo')

      const apiStatus = ref(true)

      loadingStore.show()

      let apiResp: any
      let apiErrorMsg: any
      const url = `${BASE_URL}/users/sign_in`
      try {
        const resp = await axios.post(url, signInForm)
        apiResp = resp.data

        loadingStore.hide()
      } catch (error: any) {
        if (error instanceof AxiosError) {
          const resp = error.response
          apiResp = resp!.data

          // 後端 API 格式僅有錯誤代碼有所差異，錯誤訊息皆為相同，如需文字提示可改用 switch
          apiErrorMsg = apiResp?.message
            ? `登入失敗，${apiResp.message}。`
            : '登入失敗，請稍後再試。'
          // switch (resp!.status) {
          //   case 400:
          //     apiErrorMsg = '登入失敗，欄位驗證失敗。'
          //     break
          //   case 401:
          //     apiErrorMsg = '登入失敗，帳號密碼驗證錯誤。'
          //     break
          //   case 404:
          //     apiErrorMsg = '登入失敗，用戶不存在。'
          //     break
          //   default:
          //     apiErrorMsg = '登入失敗，請稍後再試。'
          // }
        } else {
          apiErrorMsg = '登入失敗，請稍後再試。'
        }

        loadingStore.hide()

        await Swal.fire({
          icon: 'error',
          title: '登入失敗',
          text: apiErrorMsg
        })

        apiStatus.value = false
        return apiStatus.value
      }

      if (!apiResp.status) {
        await Swal.fire({
          icon: 'error',
          title: '登入失敗',
          text: apiResp.message
        })

        apiStatus.value = false
        return apiStatus.value
      }

      const userInfo = { ...apiResp }
      cookies.set('userInfo', JSON.stringify(userInfo))

      status.value = true
      return apiStatus.value
    }

    const signOut = async () => {
      const apiStatus = ref(true)

      const userInfo = cookies.get('userInfo') as Object as UserInfoInterface
      if (!userInfo) {
        status.value = false
        cookies.remove('userInfo')
        return apiStatus.value
      }

      loadingStore.show()

      let apiResp: any
      let apiErrorMsg: any
      const url = `${BASE_URL}/users/sign_out`
      const headers = { Authorization: `${userInfo.token}` }
      try {
        const resp = await axios.post(url, {}, { headers })
        apiResp = resp.data

        loadingStore.hide()
      } catch (error: any) {
        if (error instanceof AxiosError) {
          const resp = error.response
          apiResp = resp!.data
          apiErrorMsg = apiResp?.message ? 
          `登出失敗，${apiResp.message}，將強制清空登入資訊並跳轉回登入頁面。` :
          '登出失敗，將強制清空登入資訊並跳轉回登入頁面。'
        } else {
          apiErrorMsg = '登出失敗，將強制清空登入資訊並跳轉回登入頁面。'
        }

        loadingStore.hide()

        await Swal.fire({
          icon: 'error',
          title: '登出失敗',
          text: apiErrorMsg,
        })
      }

      status.value = false
      cookies.remove('userInfo')
      return apiStatus.value
    }

    const checkout = async (signPageFlag: boolean = false) => {
      // signPageFlag: 是否在登入或註冊頁面
      const apiStatus = ref(true)
      const userInfo = cookies.get('userInfo') as Object as UserInfoInterface
      if (!userInfo && signPageFlag) {
        status.value = false
        cookies.remove('userInfo')
        return apiStatus.value
      } else if (!userInfo && !signPageFlag) {
        status.value = false
        cookies.remove('userInfo')
        await Swal.fire({
          icon: 'error',
          title: '登入狀態驗證錯誤',
          text: '登入狀態驗證錯誤，無法取得已登入資訊，將強制清空登入資訊並跳轉回登入頁面。'
        })
        apiStatus.value = false
        return apiStatus.value
      }

      // 檢查登入資訊是否正確
      const signInExp = new Date(userInfo.exp * 1000)
      if (signInExp < new Date()) {
        status.value = false
        cookies.remove('userInfo')

        await Swal.fire({
          icon: 'error',
          title: '登入狀態驗證錯誤',
          text: '登入狀態驗證錯誤，登入資訊已過期，將強制清空登入資訊並跳轉回登入頁面。'
        })

        apiStatus.value = false
        return apiStatus.value
      }

      // 後端驗證登入狀態
      loadingStore.show()

      const url = `${BASE_URL}/users/checkout`
      let apiResp: any
      let apiErrorMsg: any
      const headers = { Authorization: `${userInfo.token}` }
      try {
        const resp = await axios.get(url, { headers })
        apiResp = resp.data

        loadingStore.hide()
      } catch (error: any) {
        if (error instanceof AxiosError) {
          const resp = error.response
          apiResp = resp!.data
          apiErrorMsg = apiResp?.message ? 
          `登入狀態驗證錯誤，${apiResp.message}，將強制清空登入資訊並跳轉回登入頁面。` :
          '登入狀態驗證錯誤，將強制清空登入資訊並跳轉回登入頁面。'
        } else {
          apiErrorMsg = '登入狀態驗證錯誤，將強制清空登入資訊並跳轉回登入頁面。'
        }

        loadingStore.hide()

        await Swal.fire({
          icon: 'error',
          title: '登入狀態驗證錯誤',
          text: apiErrorMsg,
        })

        status.value = false
        cookies.remove('userInfo')
        apiStatus.value = false
        return apiStatus.value
      }

      if (!apiResp.status) {
        status.value = false
        cookies.remove('userInfo')

        await Swal.fire({
          icon: 'error',
          title: '登入狀態驗證錯誤',
          text: '登入狀態驗證錯誤，將強制清空登入資訊並跳轉回登入頁面。'
        })

        apiStatus.value = false
        return apiStatus.value
      }

      status.value = true
      return apiStatus.value
    }

    return { status, getStatus, signIn, signOut, checkout }
  },
  { persist: true }
)
