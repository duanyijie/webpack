import Error from '@/views/error'
import Home from '@/views/home/home.vue'

export const routes = [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/error',
    component: Error
  },
  {
    path: '/Home',
    component: Home,
    name: 'home'
  }
]

export default routes
