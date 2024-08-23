<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Ref, Reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '../stores/auth'
import { SignInModel, SignInErrorModel } from '../view-models/auth-models'


const authStore = useAuthStore()
const router = useRouter()
const editForm: Reactive<SignInModel> = reactive(new SignInModel())
const editFormError: Reactive<SignInErrorModel> = reactive(new SignInErrorModel())

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

const signInClickHandler = async () => {
  // 資料驗證
  const validateResult = signInValidate()
  if (!validateResult) return

  // 資料預處理
  const postData = signInPreProcess()

  // 登入動作
  const signInResult = await authStore.signIn(postData)

  if (!signInResult) return

  // 跳轉 Todo 功能頁
  router.push('/todos')
}

const signInValidate = () => {
  // 初始化 editFormError 狀態
  const validateResult = ref(true)
  Object.assign(editFormError, new SignInErrorModel())

  if (editForm.email === '' || editForm.password === '') {
    if (editForm.email === '') {
      editFormError.email = '請輸入 Email'
    }
    if (editForm.password === '') {
      editFormError.password = '請輸入密碼'
    }

    validateResult.value = false
    return validateResult.value
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

  if (!validateResult.value) return validateResult.value

  return validateResult.value
}

const signInPreProcess = () => {
  const postData = new SignInModel()
  Object.assign(postData, editForm)

  // 清除 email 空白
  postData.email = postData.email.replace(' ', '')

  return postData
}
</script>

<template>
  <!-- login_page -->
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer">
      <div class="side">
        <a href="javascript:void(0)"
          ><img class="logoImg" src="../assets/images/logo.png" alt=""
        /></a>
        <img class="d-m-n" src="../assets/images/img.png" alt="workImg" />
      </div>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
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
          <input
            class="formControls_btnSubmit"
            type="button"
            value="登入"
            @click.prevent="signInClickHandler"
          />
          <router-link class="formControls_btnLink" to="/sign-up">註冊帳號</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
