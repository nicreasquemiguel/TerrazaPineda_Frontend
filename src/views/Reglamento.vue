<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 py-10 mx-auto max-w-2xl">
      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <img src="@/assets/tp.svg" alt="Logo Terraza Pineda" class="w-auto h-16" />
      </div>
      <!-- Título principal con gradiente en "General" -->
      <h1 class="mb-2 text-4xl font-extrabold text-center">
        <span class="text-gray-900">Reglamento</span>
        <span
          class="bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
        >
          General
        </span>
      </h1>
      <!-- Subtítulo -->
      <h2 class="mb-8 text-lg font-semibold text-center text-gray-500">
        Reglamento General – Renta de Terraza / Salón de Eventos
      </h2>
      <div class="space-y-6">
        <div
          v-for="(regla, idx) in reglas"
          :key="idx"
          class="flex gap-3 p-5 bg-white rounded-xl shadow"
        >
          <div class="flex items-start text-2xl text-blue-600">
            <i :class="regla.icono"></i>
          </div>
          <div>
            <h2 class="mb-1 text-lg font-bold">
              {{ idx + 1 }}. {{ regla.titulo }}
            </h2>
            <div class="text-gray-700 whitespace-pre-line">
              {{ regla.texto }}
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
const reglas = [
  {
    icono: "fa-solid fa-lock",
    titulo: "Apartado y pagos",
    texto: `La fecha solo se aparta con un anticipo de $1,000 MXN, el cual no es reembolsable, salvo la excepción descrita en el punto 3.

Al realizar el anticipo, el cliente acepta este reglamento en su totalidad y se considera como contrato de prestación de servicio.

El monto total del evento debe quedar liquidado como mínimo 24 horas antes del evento. No se entrega el lugar si no está liquidado.

Las reservas realizadas por cualquier medio digital (web, WhatsApp, Facebook u otros canales) aceptan automáticamente estos términos y condiciones, sin necesidad de firma física.`
  },
  {
    icono: "fa-solid fa-chair",
    titulo: "Qué incluye la renta",
    texto: `La renta incluye: uso del espacio, mobiliario básico (mesas y sillas), baños y estacionamiento si aplica.

Cualquier servicio adicional (decoración, carpas, limpieza, audio, etc.) deberá ser contratado por separado y con anticipación.`
  },
  {
    icono: "fa-solid fa-arrows-rotate",
    titulo: "Cambios de fecha y cancelaciones",
    texto: `Cancelaciones con más de 45 días de anticipación: se devolverá el 50% del anticipo. El resto se retiene por gastos administrativos.

Cancelaciones con 45 días o menos de anticipación: el anticipo no es reembolsable bajo ninguna circunstancia.

Cambios de fecha deben solicitarse con al menos 3 semanas de anticipación y están sujetos a disponibilidad.

Solo se permite un cambio de fecha por evento.`
  },
  {
    icono: "fa-solid fa-id-card",
    titulo: "Identificación y entrega",
    texto: `El responsable del evento deberá entregar una identificación oficial vigente y comprobante de domicilio para poder recibir el lugar.

El responsable firmará de conformidad la entrega y condiciones del espacio.`
  },
  {
    icono: "fa-solid fa-users",
    titulo: "Capacidad máxima",
    texto: `El número máximo de personas permitidas será el acordado previamente con el cliente.

Superar este número será causa de suspensión inmediata del evento sin derecho a reembolso.`
  },
  {
    icono: "fa-solid fa-clock",
    titulo: "Horarios",
    texto: `El horario incluido en el paquete es de 10:00 a.m. a 12:00 a.m. (medianoche).

Las horas extra tienen un costo adicional; pregunta por disponibilidad y tarifas.`
  },
  {
    icono: "fa-solid fa-ban",
    titulo: "Conducta y uso del lugar",
    texto: `Está prohibido causar daños, mal uso del mobiliario o actos de violencia dentro del evento.

En caso de mal uso, el evento podrá ser suspendido sin reembolso alguno.`
  },
  {
    icono: "fa-solid fa-triangle-exclamation",
    titulo: "Restricciones importantes",
    texto: `Está prohibido ingresar vehículos o motocicletas a las áreas verdes.

Está prohibido el uso de confeti, brillantina o materiales similares. Si se detectan residuos, se cobrará una cuota adicional de $300 MXN por limpieza.

La música está permitida, incluyendo norteños, bandas y música en vivo, pero debe respetar el límite de 65 decibeles establecido por el Ayuntamiento de Zapopan.

En caso de sanción por ruido, la multa será responsabilidad del contratante.

Consulta la normativa antirruido del Municipio de Zapopan.`
  },
  {
    icono: "fa-solid fa-cloud-rain",
    titulo: "Condiciones climáticas",
    texto: `En caso de lluvia el día del evento, no se otorgarán reembolsos ni cambios de fecha.

Se recomienda prever el uso de toldos o carpas si el evento será al aire libre.`
  },
  {
    icono: "fa-solid fa-broom",
    titulo: "Limpieza",
    texto: `El espacio debe entregarse limpio y libre de basura u objetos ajenos.

Si no se contrata el servicio de limpieza, el cliente debe recoger y retirar toda la basura.

Se considera limpio si: no hay basura visible, no hay confeti o brillantina, no hay comida o bebida derramada, y el mobiliario está en su lugar original.

Cualquier daño o pérdida en el mobiliario deberá ser cubierto o reemplazado por el responsable del evento.`
  },
  {
    icono: "fa-solid fa-shield-halved",
    titulo: "Incumplimientos",
    texto: `El incumplimiento de este reglamento autoriza a la administración a:

- Suspender el evento en curso sin derecho a reembolso.
- Retener la credencial de identificación entregada hasta que el incidente quede resuelto.`
  },
  {
    icono: "fa-solid fa-phone",
    titulo: "Contacto de emergencia",
    texto: `Para cualquier duda o consulta, no dude en comunicarse con nosotros.`
  }
]
</script>

<style scoped>
.faq-gradient-text {
  background: linear-gradient(90deg, #7c3aed, #f472b6, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
.regla-gradient-text {
  background: linear-gradient(90deg, #7c3aed, #f472b6, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
</style> 