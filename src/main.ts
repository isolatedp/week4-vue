import './assets/main.css'

import '@fortawesome/fontawesome-free/css/all.min.css'

// 引入 sweetalert2: https://www.npmjs.com/package/vue-sweetalert2
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// 引入 pinia-plugin-persist: https://github.com/prazdevs/pinia-plugin-persistedstate
import piniaPluginPersist from 'pinia-plugin-persistedstate'

// 引入 LoadingPlugin: https://www.npmjs.com/package/vue-loading-overlay
// import { LoadingPlugin } from 'vue-loading-overlay';
// import '../node_modules/vue-loading-overlay/dist/css/index.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersist))
app.use(router)
app.use(VueSweetalert2)
// app.use(LoadingPlugin)

app.mount('#app')
