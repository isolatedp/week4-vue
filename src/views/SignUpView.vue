<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Ref, Reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import { AxiosError } from 'axios'
import Swal from 'sweetalert2'
import { BASE_URL } from '../global-variables'
import { SignUpModel, SignUpErrorModel } from '../view-models/auth-models'
import { useAuthStore } from '../stores/auth'


const authStore = useAuthStore()
const router = useRouter()
const editForm: Reactive<SignUpModel> = reactive(new SignUpModel())
const editFormError: Reactive<SignUpErrorModel> = reactive(new SignUpErrorModel())
  
onMounted(async () => {
  // 檢查是否已登入，已登入則跳轉至 Todo 功能頁
  const apiResult = await authStore.checkout(true)
  if (!apiResult) {
    await Swal.fire({
      icon: 'info',
      title: '登入狀態',
      text: '您已登入，將自動跳轉至 Todo 功能頁',
    showConfirmButton: false,
    timer: 1500
    })
  }
})


const signUpClickHandler = async () => {
  // 資料驗證
  const validateResult = signUpValidate()
  if (!validateResult) return

  // 資料預處理
  const postData = signUpPreProcess()

  const url = `${BASE_URL}/users/sign_up`
  let apiResult: any
  let apiErrorMsg: any

  try {
    const resp = await axios.post(url, postData)
    apiResult = resp.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const resp = error.response
      apiResult = resp?.data
      apiErrorMsg = apiResult?.message
        ? `註冊失敗，${apiResult.message}。`
        : '註冊失敗，請稍後再試。'
    } else {
      apiErrorMsg = '註冊失敗，請稍後再試。'
    }

    await Swal.fire({
      icon: 'error',
      title: '註冊失敗',
      text: apiErrorMsg
    })

    return
  }

  if (!apiResult.status) return

  await Swal.fire({
    icon: 'success',
    title: '註冊成功',
    text: '歡迎加入，將跳轉至登入頁面',
    showConfirmButton: false,
    timer: 1500
  })

  router.push('/sign-in')
}

const signUpValidate = () => {
  // 初始化 editFormError 狀態
  const validateResult = ref(true)
  Object.assign(editFormError, new SignUpErrorModel())

  if (editForm.email === '' || editForm.password === '' || editForm.passwordConfirm === '') {
    if (editForm.email === '') {
      editFormError.email = '請輸入 Email'
    }
    if (editForm.password === '') {
      editFormError.password = '請輸入密碼'
    }
    if (editForm.passwordConfirm === '') {
      editFormError.passwordConfirm = '請再次輸入密碼'
    }
  }

  // Email 驗證
  // 必須涵蓋 @, 中間與前後不可有空白
  if (editForm.email.indexOf('@') === -1 || editForm.email.indexOf(' ') !== -1) {
    editFormError.email = '請輸入正確 Email 格式，並注意不可有空白。'
    validateResult.value = false
  }

  // 密碼驗證
  // 長度不可小於 6
  if (editForm.password.length < 6) {
    editFormError.password = '密碼長度不可小於 6。'
    validateResult.value = false
  }

  // 確認密碼驗證
  if (editForm.password !== editForm.passwordConfirm) {
    editFormError.passwordConfirm = '兩次密碼不相符。'
    validateResult.value = false
  }

  if (!validateResult.value) return validateResult.value

  return validateResult.value
}

const signUpPreProcess = () => {
  const postData = {
    email: '',
    password: '',
    nickname: ''
  }
  Object.assign(postData, editForm)

  // 清除 email 空白
  postData.email = postData.email.split(' ').join('')

  // 刪除密碼驗證
  delete (postData as any).passwordConfirm

  // 沒有輸入暱稱就用 email @ 前面字串做預設
  if (postData.nickname === '') {
    postData.nickname = postData.email.split('@')[0]
  }

  return postData
}
</script>

<template>
  <!-- sign up -->
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <a href="javascript:void(0)"
          ><img class="logoImg" src="../assets/images//logo.png" alt=""
        /></a>
        <img class="d-m-n" src="../assets/images/img.png" alt="workImg" />
      </div>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="editForm.email"
          />
          <span v-if="editFormError.email !== null">{{ editFormError.email }}</span>
          <label class="formControls_label" for="name">您的暱稱</label>
          <input
            class="formControls_input"
            type="text"
            name="name"
            id="name"
            placeholder="請輸入您的暱稱"
            v-model="editForm.nickname"
          />
          <span v-if="editFormError.nickname !== null">{{ editFormError.nickname }}</span>
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="editForm.password"
          />
          <span v-if="editFormError.password !== null">{{ editFormError.password }}</span>
          <label class="formControls_label" for="pwdConfirm">再次輸入密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwdConfirm"
            id="pwdConfirm"
            placeholder="請再次輸入密碼"
            required
            v-model="editForm.passwordConfirm"
          />
          <span v-if="editFormError.passwordConfirm !== null">{{
            editFormError.passwordConfirm
          }}</span>
          <input
            class="formControls_btnSubmit"
            type="button"
            value="註冊帳號"
            @click.prevent="signUpClickHandler"
          />
          <router-link class="formControls_btnLink" to="/sign-in">登入</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
