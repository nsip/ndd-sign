// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

///////////////////////////////////////////////////////////////////

// npm i @fortawesome/vue-fontawesome@latest-3
// npm i @fortawesome/fontawesome-svg-core
// npm i @fortawesome/free-solid-svg-icons

import App from "@/App.vue";
import vue3Spinner from 'vue3-spinner';
import Notifications from '@kyvg/vue3-notification'
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faPhone,
    faPlus,
    faThumbsUp,
    faCheck,
    faSearch,
    faBookmark,
    faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPhone, faPlus, faThumbsUp, faCheck, faSearch, faBookmark, faPen);

// import { globalCookiesConfig } from "vue3-cookies";
// globalCookiesConfig({
//     expireTimes: "30d",
//     path: "/",
//     domain: "",
//     secure: false,
//     sameSite: "Lax",
// });

// createApp(App).mount('#app')
createApp(App).component("font-awesome-icon", FontAwesomeIcon).use(vue3Spinner).use(Notifications).mount("#app");

