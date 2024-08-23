import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const active = ref(false)
  const fullScreen = ref(true)

  function show(isFull: boolean = true) {
    active.value = true
    fullScreen.value = isFull
  }

  function hide() {
    active.value = false
    fullScreen.value = true
  }

  return { active, fullScreen, show, hide }
})
