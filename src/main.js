import Vue from 'vue';
import app from './app.vue';
import './registerServiceWorker';
import router from './router/router';
import store from './store/store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft ,faClock , faTimes, faChartBar, faEllipsisH,faTrashAlt, faEllipsisV, faAlignJustify, faHistory, faUserPlus, faTasks, faPlus, faAlignLeft, faComment ,faPaperclip,faHome, faThLarge, faCheck  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import VueCharts from 'vue-chartjs'
// import { Bar, Line } from 'vue-chartjs'
library.add(faUserSecret)
library.add(faChevronLeft)
library.add(faTimes)
library.add(faEllipsisH)
library.add(faEllipsisV)
library.add(faAlignJustify)
library.add(faUserPlus)
library.add(faPlus)
library.add(faAlignLeft)
library.add(faPaperclip)
library.add(faComment)
library.add(faTasks)
library.add(faHistory)
library.add(faTrashAlt)
library.add(faHome)
library.add(faThLarge)
library.add(faClock)
library.add(faChartBar)
library.add(faCheck)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import './styles/styles.scss';

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(app)
}).$mount('#app');