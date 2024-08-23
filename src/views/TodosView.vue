<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { Ref, Reactive, ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import Swal from 'sweetalert2'
import { TodoModel, TodoErrorModel } from '../view-models/todo-models'
import { useAuthStore } from '../stores/auth'
import type { UserInfoInterface } from '../interfaces/auth-interfaces'
import { BASE_URL } from '../global-variables'
import axios, { AxiosError } from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const { cookies } = useCookies()
const userInfo = cookies.get('userInfo') as Object as UserInfoInterface
const curUser = userInfo ? userInfo.nickname : '未知'
const editForm: Reactive<TodoModel> = reactive(new TodoModel())
const editFormError: Reactive<TodoErrorModel> = reactive(new TodoErrorModel())
const applyType: Ref<string> = ref('all') // all, complete, uncomplete
const todoList: Ref<TodoModel[]> = ref([])
const todoFilterList: Ref<TodoModel[]> = ref([])
const completeNum: ComputedRef<number> = computed(() => {
  return todoFilterList.value.filter((item) => item.status === true).length
})

onMounted(async () => {
  // 檢查是否未登入，未登入則跳轉至登入頁
  const apiResult = await authStore.checkout()
  if (!apiResult) router.push('/sign-in')

  await getTodoList()

  console.log(todoList.value)
})

const singOutClickHandler = async () => {
  await authStore.signOut()
  router.push('/sign-in')
}

const changeApplyType = (type: string) => {
  applyType.value = type

  if (type === 'all') {
    todoFilterList.value = todoList.value
  } else if (type === 'complete') {
    todoFilterList.value = todoList.value.filter((item) => item.status === true)
  } else if (type === 'uncomplete') {
    todoFilterList.value = todoList.value.filter((item) => item.status === false)
  }
}

const getTodoList = async () => {
  // 驗證登入狀態
  const authResult = await authStore.checkout()
  if (!authResult) router.push('/sign-in')

  const url = `${BASE_URL}/todos/`
  const headers = { Authorization: userInfo.token }
  let apiResult: any
  let apiErrorMsg: any
  try {
    const resp = await axios.get(url, { headers })
    apiResult = resp.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const resp = error.response
      apiResult = resp?.data
      apiErrorMsg = apiResult?.message
        ? `取得待辦事項失敗，${apiResult.message}。`
        : '取得待辦事項失敗，請稍後再試。'
    } else {
      apiErrorMsg = '取得待辦事項失敗，請稍後再試。'
    }

    await Swal.fire({
      icon: 'error',
      title: '取得待辦事項失敗',
      text: apiErrorMsg
    })
  }
  if (!apiResult.status) return

  todoList.value = (apiResult.data as TodoModel[])
  todoFilterList.value = todoList.value
}

const addTodoItem = async () => {
  // 驗證登入狀態
  const authResult = await authStore.checkout()
  if (!authResult) router.push('/sign-in')

  // 驗證 TODO 資料
  const validateResult = addTodoItemValidate()
  if (!validateResult) return

  // 驗證 TODO 資料是否已存在，若有則提醒使用者，由使用者自行確認是否新增
  const duplicateResult = await duplicateTodoItemValidate()
  if (duplicateResult) {
    const userResult = await Swal.fire({
      icon: 'info',
      title: '已有相同待辦事項',
      text: '是否要新增相同的待辦事項？',
      showCancelButton: true,
      confirmButtonText: '是',
      cancelButtonText: '否',
    })

    if (!userResult.isConfirmed) return
  }

  // 資料預處理
  const postData = addTodoItemPreProcess()

  // 發送 POST 請求
  const url = `${BASE_URL}/todos/`
  const headers = { Authorization: userInfo.token }
  let apiResult: any
  let apiErrorMsg: any
  try {
    const resp = await axios.post(url, postData, { headers })
    apiResult = resp.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const resp = error.response
      apiResult = resp?.data
      apiErrorMsg = apiResult?.message
        ? `新增待辦事項失敗，${apiResult.message}。`
        : '新增待辦事項失敗，請稍後再試。'
    } else {
      apiErrorMsg = '新增待辦事項失敗，請稍後再試。'
    }

    await Swal.fire({
      icon: 'error',
      title: '新增待辦事項失敗',
      text: apiErrorMsg
    })

    return
  }

  if (!apiResult.status) return

  initEditForm()
  await getTodoList()

  await Swal.fire({
    icon: 'success',
    title: '新增待辦事項成功',
    showConfirmButton: false,
    timer: 1500
  })

}

const duplicateTodoItemValidate = async () => {
  const vaildateResult = ref(false)

  const existTodoItem = todoList.value.find((item) => item.content === editForm.content) as TodoModel
  if (!existTodoItem) return vaildateResult.value


  if (editForm.id !== existTodoItem.id) {
    vaildateResult.value = true
  }

  return vaildateResult.value
}

const addTodoItemValidate = () => {
  const validateResult = ref(true)
  let errorMsg = ''
  if (editForm.content === '') {
    errorMsg = '請輸入待辦事項'
    validateResult.value = false

    Swal.fire({
      icon: 'error',
      title: '新增待辦事項失敗',
      text: errorMsg
    })
    return validateResult.value
  }

  let tempContent = `${editForm.content}`
  tempContent = tempContent.replace(/\s+/g, '')
  // 前後不可有空白
  if (tempContent === '') {
    errorMsg = '待辦事項不可僅有空白'
    validateResult.value = false
  }

  if (!validateResult.value) {
    Swal.fire({
      icon: 'error',
      title: '新增待辦事項失敗',
      text: errorMsg
    })
  }

  return validateResult.value
}

const addTodoItemPreProcess = () => {
  const removePara = ['id', 'status', 'createTime']
  const postData = { ...editForm }

  // 清除不必要參數
  Object.keys(postData).forEach((key) => {
    if (removePara.includes(key)) {
      delete (postData as any)[key]
    }
  })

  return postData
}

const initEditForm = () => {
  editForm.id = null
  editForm.createTime = 0
  editForm.content = ''
  editForm.status = false
}

const toggleTodoItemStatus = async (item: TodoModel) => {
  // 驗證登入狀態
  const authResult = await authStore.checkout()
  if (!authResult) router.push('/sign-in')

  const url = `${BASE_URL}/todos/${item.id}/toggle`
  const headers = { Authorization: userInfo.token }

  let apiResult: any
  let apiErrorMsg: any

  try {
    const resp = await axios.patch(url, {}, { headers })
    apiResult = resp.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const resp = error.response
      apiResult = resp?.data
      apiErrorMsg = apiResult?.message
        ? `切換待辦事項狀態失敗，${apiResult.message}。`
        : '切換待辦事項狀態失敗，請稍後再試。'
    } else {
      apiErrorMsg = '切換待辦事項狀態失敗，請稍後再試。'
    }

    await Swal.fire({
      icon: 'error',
      title: '切換待辦事項狀態失敗',
      text: apiErrorMsg
    })

    return
  }

  if (!apiResult.status) {
    await Swal.fire({
      icon: 'error',
      title: '切換待辦事項狀態失敗',
      text: apiErrorMsg
    })
  }

  await getTodoList()
}

const removeTodoItem = async (item: TodoModel) => {
  // 驗證登入狀態
  const authResult = await authStore.checkout()
  if (!authResult) router.push('/sign-in')

  // 再次確認是否刪除
  const userResult = await Swal.fire({
    icon: 'warning',
    title: '刪除待辦事項',
    text: `確定要刪除「${item.content}」嗎?`,
    showCancelButton: true,
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  })

  if (!userResult.isConfirmed) return

  const url = `${BASE_URL}/todos/${item.id}`
  const headers = { Authorization: userInfo.token }

  let apiResult: any
  let apiErrorMsg: any

  try {
    const resp = await axios.delete(url, { headers })
    apiResult = resp.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const resp = error.response
      apiResult = resp?.data
      apiErrorMsg = apiResult?.message
        ? `刪除待辦事項失敗，${apiResult.message}。`
        : '刪除待辦事項失敗，請稍後再試。'
    } else {
      apiErrorMsg = '刪除待辦事項失敗，請稍後再試。'
    }

    await Swal.fire({
      icon: 'error',
      title: '刪除待辦事項失敗',
      text: apiErrorMsg
    })

    return
  }

  if (!apiResult.status) {
    await Swal.fire({
      icon: 'error',
      title: '刪除待辦事項失敗',
      text: apiErrorMsg
    })
  }

  await getTodoList()
}


</script>

<template>
  <!-- ToDo List -->
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm">
          <a href="#"><span>{{ curUser }}的代辦</span></a>
        </li>
        <li><a href="javascript:void(0)" @click.prevent="singOutClickHandler">登出</a></li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="editForm.content"/>
          <a href="javascript:void(0)" @click.prevent="addTodoItem">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <div class="todoList_list">
          <ul class="todoList_tab">
            <li><a href="javascript:void(0)" :class="{active: applyType === 'all'}" @click="changeApplyType('all')">全部</a></li>
            <li><a href="javascript:void(0)" :class="{active: applyType === 'uncomplete'}" @click="changeApplyType('uncomplete')">待完成</a></li>
            <li><a href="javascript:void(0)" :class="{active: applyType === 'complete'}" @click="changeApplyType('complete')">已完成</a></li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item">
              <li v-for="item in todoFilterList">
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" v-model="item.status" @click="toggleTodoItemStatus(item)"/>
                  <span>{{ item.content }}</span>
                </label>
                <a href="javascript:void(0)" @click.prevent="removeTodoItem(item)">
                  <i class="fa fa-times"></i>
                </a>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p>{{ completeNum }} 個已完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
