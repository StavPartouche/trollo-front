import Vue from 'vue'
import VueRouter from 'vue-router'
import homePage from '../views/home-page.vue'
import boardList from '../views/board-list.vue'

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
]

const router = new VueRouter({
  routes
})

export default router
