<script setup lang="ts">
import { RouterView } from 'vue-router'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { useLoadingStore } from './stores/loading'

const loadingStore = useLoadingStore()

</script>

<template>
    <loading :active="loadingStore.active" :is-full-page="loadingStore.fullScreen"/>
  <RouterView />
</template>

<style scoped></style>
