import Vue from 'vue'
import VueRouter from 'vue-router'
import homePage from '../views/home-page.vue'
import boardList from '../views/board-list.vue'
import loginPage from '../views/login-page.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home-page',
    component: homePage
  },
  {
    path: '/board',
    name: 'board-list',
    component: boardList
  },
  {
    path: '/login',
    name: 'login-page',
    component: loginPage
  },
]

const router = new VueRouter({
  routes
})

export default router
