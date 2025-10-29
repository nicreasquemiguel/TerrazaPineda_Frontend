import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Reserve from '@/views/Reserve.vue'
import Faq from '@/views/Faq.vue'
import Reglamento from '@/views/Reglamento.vue'
import Register from '@/views/Register.vue'
import Gallery from '@/views/Gallery.vue'
import PerfilUsuario from '@/views/auth/PerfilUsuario.vue'
import MisReservas from '@/views/auth/MisReservas.vue'
import DetalleReserva from '@/views/auth/DetalleReserva.vue'
import VerifyEmail from '@/views/auth/VerifyEmail.vue'
import ActivateAccount from '@/views/auth/ActivateAccount.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Login' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  {
    path: '/reservar',
    name: 'Reserve',
    component: Reserve,
    meta: { title: 'Reservar' }
  },
  {
    path: '/fotos',
    name: 'Gallery',
    component: Gallery,
    meta: { title: 'Galería de Fotos' }
  },
  {
    path: '/preguntas-frecuentes',
    name: 'Faq',
    component: Faq,
    meta: { title: 'Preguntas Frecuentes' },
    alias: '/faq'
  },
  {
    path: '/precios',
    name: 'Precios',
    component: () => import('@/views/Prices.vue'),
    meta: { title: 'Precios' }
  },
  {
    path: '/reglamento',
    name: 'Reglamento',
    component: Reglamento,
    meta: { title: 'Reglamento' }
  },
  {
    path: '/registrar',
    name: 'Register',
    component: Register,
    meta: { title: 'Registrar' }
  },
  {
    path: '/perfil',
    name: 'PerfilUsuario',
    component: PerfilUsuario,
    meta: { title: 'Perfil de Usuario', requiresAuth: true }
  },
  {
    path: '/mis-reservas',
    name: 'MisReservas',
    component: MisReservas,
    meta: { title: 'Mis Reservas', requiresAuth: true }
  },
  {
    path: '/mis-reservas',
    name: 'Reservas',
    component: MisReservas,
    meta: { title: 'Reservas', requiresAuth: true }
  },
  {
    path: '/detalle-reserva/:id',
    name: 'DetalleReserva',
    component: DetalleReserva,
    meta: { title: 'Detalle de Reserva', requiresAuth: true }
  },
  {
    path: '/register',
    redirect: '/registrar'
  },
  // Email verification and activation routes
  {
    path: '/auth/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail,
    meta: { title: 'Verificar Email' }
  },
  {
    path: '/auth/activate/:uid/:token',
    name: 'ActivateAccount',
    component: ActivateAccount,
    meta: { title: 'Activar Cuenta' }
  },
  {
    path: '/auth/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { title: 'Restablecer Contraseña' }
  },
  {
    path: '/auth/reset-password/:uid/:token',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { title: 'Nueva Contraseña' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Terraza Pineda` : 'Terraza Pineda'

  const authStore = useAuthStore()
  const isAuthenticated = !!localStorage.getItem('accessToken') && authStore.user

  // Redirect authenticated users away from login/register
  if ((to.path === '/login' || to.path === '/registrar') && isAuthenticated) {
    next('/dashboard') // or '/' if you prefer
    return
  }

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      next({ path: '/login', query: { next: to.fullPath } })
      return
    }
  }

  // Role-based redirects
  const user = authStore.user
  if (to.path === '/dashboard' && user && !(user.is_staff || user.role === 'admin')) {
    next('/mis-reservas')
    return
  }
  if (to.path === '/mis-reservas' && user && (user.is_staff || user.role === 'admin')) {
    next('/dashboard')
    return
  }

  next()
})

export default router 