import Vue from 'vue';
import VueRouter from 'vue-router';
import homePage from '../views/home-page.vue';
import boardList from '../views/board-list.vue';
import boardEdit from '../views/board-edit.vue';
import loginPage from '../views/login-page.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
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
      path: '/board/:id',
      name: 'board-edit',
      component: boardEdit
    },
    {
      path: '/login',
      name: 'login-page',
      component: loginPage
    },
  ]
});
