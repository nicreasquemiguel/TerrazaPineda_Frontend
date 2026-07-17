<template>
  <div class="min-h-screen bg-gray-50 pt-14 md:pt-0">
    <AdminSidebar />
    <div class="md:ml-64">
      <!-- Page header -->
      <div class="px-6 py-5 border-b border-gray-200 bg-white">
        <h1 class="text-2xl font-bold text-gray-900">Métricas del Negocio</h1>
        <p class="mt-1 text-sm text-gray-500">Indicadores de dinero, paquetes y actividad. Solo accesible para staff.</p>
      </div>

      <div class="px-4 py-6 md:px-6">
        <div v-if="loading" class="py-16 text-center text-gray-500">
          <div class="inline-block w-6 h-6 rounded-full border-b-2 border-blue-500 animate-spin"></div>
          <p class="mt-2 text-sm">Cargando métricas...</p>
        </div>

        <div v-else-if="error" class="py-16 text-center">
          <div class="flex justify-center items-center mx-auto mb-2 w-8 h-8 bg-red-100 rounded-full">
            <i class="text-sm text-red-500 fa-solid fa-exclamation-triangle"></i>
          </div>
          <p class="text-sm text-red-500">{{ error }}</p>
        </div>

        <div v-else class="max-w-6xl space-y-6">
          <!-- KPI cards -->
          <div class="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <div
              v-for="kpi in kpiCards"
              :key="kpi.key"
              class="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div class="flex items-center justify-center mb-3 w-9 h-9 rounded-lg" :class="kpi.accent">
                <i :class="kpi.icon"></i>
              </div>
              <div class="text-xl font-bold text-gray-900 truncate" :title="String(kpi.value)">{{ kpi.value }}</div>
              <div class="text-xs font-semibold text-gray-600 mt-0.5">{{ kpi.label }}</div>
              <div class="text-[11px] text-gray-400 mt-0.5">{{ kpi.sub }}</div>
            </div>
          </div>

          <!-- Revenue + Packages -->
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <!-- Revenue trend -->
            <div class="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h4 class="mb-1 text-sm font-bold text-gray-700">Ingresos (últimos 6 meses)</h4>
              <p class="mb-4 text-xs text-gray-400">Pagos recibidos por mes</p>
              <div class="flex gap-2 items-end h-44 md:gap-3">
                <div
                  v-for="row in metrics?.revenue_by_month || []"
                  :key="row.month"
                  class="flex flex-col flex-1 justify-end items-center h-full"
                >
                  <span class="mb-1 text-[10px] font-semibold text-gray-500">{{ fmtMoneyShort(row.revenue) }}</span>
                  <div
                    class="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-md transition-all"
                    :style="{ height: `${Math.max(4, (row.revenue / maxMonthlyRevenue) * 100)}%` }"
                  ></div>
                  <span class="mt-1.5 text-[11px] font-medium text-gray-500 capitalize">{{ row.label }}</span>
                </div>
              </div>
            </div>

            <!-- Popular packages -->
            <div class="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h4 class="mb-1 text-sm font-bold text-gray-700">Paquetes Más Reservados</h4>
              <p class="mb-4 text-xs text-gray-400">Reservas activas por paquete</p>
              <div v-if="popularPackages.length" class="space-y-3">
                <div v-for="pkg in popularPackages" :key="pkg.title">
                  <div class="flex justify-between items-center mb-1 text-xs">
                    <span class="font-semibold text-gray-700 truncate">{{ pkg.title }}</span>
                    <span class="flex-shrink-0 ml-2 text-gray-500">{{ pkg.count }} · {{ fmtMoney(pkg.revenue) }}</span>
                  </div>
                  <div class="w-full h-2.5 bg-gray-100 rounded-full">
                    <div
                      class="h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      :style="{ width: `${(pkg.count / maxPackageCount) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-else class="py-8 text-sm text-center text-gray-400">Sin datos de paquetes.</div>
            </div>
          </div>

          <!-- Status breakdown -->
          <div class="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h4 class="mb-1 text-sm font-bold text-gray-700">Reservas por Estatus</h4>
            <p class="mb-4 text-xs text-gray-400">Distribución histórica de todas las reservas</p>
            <div v-if="statusRows.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div
                v-for="row in statusRows"
                :key="row.status"
                class="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
              >
                <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="statusBadge(row.status)">
                  {{ statusText(row.status) }}
                </span>
                <span class="ml-auto text-lg font-bold text-gray-900">{{ row.count }}</span>
              </div>
            </div>
            <div v-else class="py-8 text-sm text-center text-gray-400">Sin reservas registradas.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import AdminSidebar from '@/components/AdminSidebar.vue'

const loading = ref(true)
const error = ref(null)
const metrics = ref(null)

const fmtMoney = (n) => `$${Math.round(parseFloat(n || 0)).toLocaleString('es-MX')}`
const fmtMoneyShort = (n) => {
  const v = parseFloat(n || 0)
  if (v >= 1000) return `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
  return `$${Math.round(v)}`
}

const STATUS_BADGE = {
  solicitud: 'bg-gray-200 text-gray-800',
  aceptacion: 'bg-blue-100 text-blue-800',
  apartado: 'bg-orange-100 text-orange-800',
  liquidado: 'bg-green-100 text-green-800',
  liquidado_entregado: 'bg-green-100 text-green-800',
  entregado: 'bg-teal-100 text-teal-800',
  finalizado: 'bg-purple-100 text-purple-800',
  rechazado: 'bg-red-100 text-red-800',
  cancelado: 'bg-gray-100 text-gray-500',
}
const STATUS_TEXT = {
  solicitud: 'Solicitud',
  aceptacion: 'Aceptado',
  apartado: 'Apartado',
  liquidado: 'Liquidado',
  liquidado_entregado: 'Liquidado y Entregado',
  entregado: 'Entregado',
  finalizado: 'Finalizado',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado',
}
const statusBadge = (s) => STATUS_BADGE[s] || 'bg-gray-100 text-gray-800'
const statusText = (s) => STATUS_TEXT[s] || s

const kpiCards = computed(() => {
  const m = metrics.value
  if (!m) return []
  return [
    {
      key: 'pending', label: 'Por Cobrar',
      value: fmtMoney(m.money?.pending_collections),
      sub: `${m.dates?.upcoming_confirmed || 0} eventos confirmados`,
      icon: 'fa-solid fa-hand-holding-dollar', accent: 'text-amber-600 bg-amber-50',
    },
    {
      key: 'avg', label: 'Valor Promedio',
      value: fmtMoney(m.money?.avg_booking_value),
      sub: 'por evento confirmado',
      icon: 'fa-solid fa-tags', accent: 'text-blue-600 bg-blue-50',
    },
    {
      key: 'total', label: 'Cobrado Histórico',
      value: fmtMoney(m.money?.total_collected_all_time),
      sub: 'pagos recibidos',
      icon: 'fa-solid fa-vault', accent: 'text-green-600 bg-green-50',
    },
    {
      key: 'conversion', label: 'Conversión del Mes',
      value: `${m.month?.conversion_rate ?? 0}%`,
      sub: `${m.month?.confirmed || 0} de ${m.month?.requests || 0} solicitudes`,
      icon: 'fa-solid fa-arrow-trend-up', accent: 'text-purple-600 bg-purple-50',
    },
    {
      key: 'events', label: 'Eventos del Mes',
      value: m.dates?.events_this_month ?? 0,
      sub: 'programados este mes',
      icon: 'fa-solid fa-calendar-day', accent: 'text-teal-600 bg-teal-50',
    },
    {
      key: 'upcoming', label: 'Próximos Eventos',
      value: m.dates?.upcoming_confirmed ?? 0,
      sub: 'confirmados a futuro',
      icon: 'fa-solid fa-clock', accent: 'text-indigo-600 bg-indigo-50',
    },
  ]
})

const maxMonthlyRevenue = computed(() =>
  Math.max(1, ...(metrics.value?.revenue_by_month || []).map(r => r.revenue))
)
const popularPackages = computed(() => metrics.value?.popular_packages || [])
const maxPackageCount = computed(() =>
  Math.max(1, ...popularPackages.value.map(p => p.count))
)
const statusRows = computed(() => {
  const breakdown = metrics.value?.status_breakdown || {}
  const order = ['solicitud', 'aceptacion', 'apartado', 'liquidado', 'liquidado_entregado', 'entregado', 'finalizado', 'cancelado', 'rechazado']
  return order
    .filter(s => breakdown[s])
    .map(s => ({ status: s, count: breakdown[s] }))
})

onMounted(async () => {
  try {
    const response = await api.get('/api/dashboard/dashboard/metrics/')
    metrics.value = response.data
  } catch (err) {
    console.error('Error fetching metrics:', err)
    error.value = 'No se pudieron cargar las métricas.'
  } finally {
    loading.value = false
  }
})
</script>
