import Vue from 'vue'
import app from './app.vue'
import './registerServiceWorker'
import router from './router/router'
import store from './store/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vuescroll from 'vuescroll';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'


import './styles/styles.scss'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(vuescroll, {
    ops: {
        vuescroll: {
            mode: 'native',
            easing: 'easeInOutQuad',
            wheelScrollDuration: 600,
        },
    }
});

new Vue({
    router,
    store,
    render: h => h(app)
}).$mount('#app')