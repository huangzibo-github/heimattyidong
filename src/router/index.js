import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/login/index.vue'

Vue.use(VueRouter)

// 配置路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    name: 'TabBar',
    component: () => import('@/views/tab-bar'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my')
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      }
    ]
  }, {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat')
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/user/:userId',
    name: 'user',
    component: () => import('@/views/user')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true
  },
  {
    // 我的作品
    path: '/my-article/:type?',
    name: 'my-article',
    component: () => import('@/views/user-articles'),
    props: true
  }
  // {
  //   // 我的收藏
  //   path: '/my-article/collect',
  //   component: () => import('@/views/user-articles')
  // },
  // {
  //   // 我的历史
  //   path: '/my-article/history',
  //   component: () => import('@/views/user-articles')
  // }
]
const router = new VueRouter({
  routes
})

export default router
