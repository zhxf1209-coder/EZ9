import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
    { path: '/profiles', name: 'Profiles', component: () => import('@/views/Profiles.vue') },
    { path: '/profile-edit', name: 'ProfileEdit', component: () => import('@/views/ProfileEdit.vue') },
    { path: '/bazi-report', name: 'BaziReport', component: () => import('@/views/BaziReport.vue') },
    { path: '/bazi-report/:historyId', name: 'BaziReportHistory', component: () => import('@/views/BaziReport.vue') },
    { path: '/bazi', name: 'Bazi', component: () => import('@/views/BaziAnalysis.vue') },
    { path: '/daily', name: 'Daily', component: () => import('@/views/DailyFortune.vue') },
    { path: '/yearly', name: 'Yearly', component: () => import('@/views/YearlyFortune.vue') },
    { path: '/event', name: 'Event', component: () => import('@/views/EventAnalysis.vue') },
    { path: '/marriage-report', name: 'MarriageReport', component: () => import('@/views/MarriageReportPage.vue') },
    { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
    { path: '/history', name: 'History', component: () => import('@/views/History.vue') },
    { path: '/settings', name: 'Settings', component: () => import('@/views/Settings.vue') }
  ]
})

export default router
