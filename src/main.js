import Vue from 'vue';
import app from './app.vue';
import './registerServiceWorker';
import router from './router/router';
import store from './store/store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vuescroll from 'vuescroll';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft, faTimes, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUserSecret)
library.add(faChevronLeft)
library.add(faTimes)
library.add(faEllipsisH)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import './styles/styles.scss';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(vuescroll, {
    ops: {
        vuescroll: {
            mode: 'native',
            easing: 'easeInOutQuad',
            wheelScrollDuration: 600,
        },
        bar: {
            background: 'rgb(136, 136, 136)'
        }
    }
});

new Vue({
    router,
    store,
    render: h => h(app)
}).$mount('#app');