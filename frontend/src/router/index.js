import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import(/* webpackChunkName: "signup" */ '../views/Signup.vue')
  },
  {
    path: '/posts',
    name: 'Homepage',
    component: () => import(/* webpackChunkName: "homepage" */ '../views/Homepage.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue')
  },
  {
    path: '/posts/post/:id',
    name: 'Post',
    component: () => import(/* webpackChunkName: "post" */ '../views/uniquePost.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
