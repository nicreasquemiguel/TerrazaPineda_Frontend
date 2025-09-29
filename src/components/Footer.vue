<template>
  <footer class="px-4 py-12 w-full text-white border-t bg-black/90 border-white/10">
    <div class="flex justify-center mb-8">
      <img src="@/assets/tp-white.svg" alt="Terraza Pineda Logo" class="w-10 h-10" />
    </div>
    <div class="grid grid-cols-1 gap-10 justify-items-center items-start px-2 mx-auto w-full max-w-7xl md:grid-cols-4 lg:gap-20 md:justify-items-start md:px-8 lg:px-20">
      <!-- Info & Compañía as two columns on mobile, stack on md+ -->
      <div>
        <div class="grid grid-cols-2 gap-6 md:grid-cols-1">
          <!-- Info -->
          <div class="text-left">
            <h3 class="mb-4 text-lg font-bold tracking-wide text-left">INFO</h3>
            <ul class="space-y-2 text-left text-white/90">
              <li><router-link to="/" class="transition hover:text-cyan-300">Home</router-link></li>
              <li><router-link to="/reservar" class="transition hover:text-cyan-300">Reservar</router-link></li>
              <li><router-link to="/precios" class="transition hover:text-cyan-300">Precios</router-link></li>
              <li><router-link to="/preguntas-frecuentes" class="transition hover:text-cyan-300">Preguntas frecuentes</router-link></li>
            </ul>
          </div>
          <!-- Compañía -->
          <div class="text-left">
            <h3 class="mb-4 text-lg font-bold tracking-wide text-left">COMPAÑÍA</h3>
            <ul class="space-y-2 text-left text-white/90">
              <li><router-link to="/reglamento" class="transition hover:text-cyan-300">Reglamento</router-link></li>
              <li><a href="#" class="transition hover:text-cyan-300">Privacidad</a></li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Contacto -->
      <div class="flex flex-col items-center text-center md:items-start md:text-left">
        <h3 class="mb-4 text-lg font-bold tracking-wide">CONTACTO</h3>
        <div class="mb-4 space-y-1 text-sm text-white/90">
          <div>Privada Bugambilias 443,</div>
          <div>Vicente Guerrero, 45134</div>
          <div>Zapopan, Jal., México</div>
        </div>
        <div class="flex gap-2 justify-center items-center mb-1 md:justify-start">
          <div class="w-5 h-5 text-primary-400">
            <Icon icon="mdi:email-outline" />
          </div>
          <a href="mailto:terrazapineda7@gmail.com" class="text-sm underline transition hover:text-cyan-300">terrazapineda7@gmail.com</a>
        </div>
        <div class="flex flex-col gap-1 items-center w-full md:items-start">
          <div class="flex gap-2 justify-center items-center md:justify-start">
            <div class="w-5 h-5 text-primary-400">
              <Icon icon="mdi:phone-outline" />
            </div>
            <a href="tel:+523323439936" class="text-lg underline transition hover:text-cyan-300">33 2343 9936</a>
          </div>
          <div class="flex gap-2 justify-center items-center md:justify-start">
            <div class="w-5 h-5 text-primary-400">
              <Icon icon="mdi:phone-outline" />
            </div>
            <a href="tel:+523334952066" class="text-sm underline transition hover:text-cyan-300">33 3495 2066</a>
          </div>
          <div class="flex gap-2 justify-center items-center md:justify-start">
            <div class="w-5 h-5 text-primary-400">
              <Icon icon="mdi:phone-outline" />
            </div>
            <a href="tel:+523338094228" class="text-sm underline transition hover:text-cyan-300">33 3809 4228</a>
          </div>
        </div>
      </div>
      <!-- Newsletter & Social -->
      <div class="flex flex-col items-center">
        <h3 class="mb-4 text-lg font-bold tracking-wide text-center">Suscríbete</h3>
        <form @submit.prevent class="flex flex-col gap-2 justify-center items-center mb-4 w-full md:flex-row">
          <input type="email" placeholder="Tu email" class="flex-1 px-3 py-2 w-full text-black rounded-lg md:rounded-l-lg md:rounded-r-none focus:outline-none md:w-auto" />
          <button type="submit" class="rounded-lg md:rounded-r-lg md:rounded-l-none px-4 py-2 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white font-bold hover:opacity-90 transition w-full md:w-auto">Suscribirse</button>
        </form>
        <div class="flex flex-col items-center w-full">
          <span class="block mb-2 text-center text-white/80">Síguenos</span>
          <div class="flex gap-3 justify-center">
            <a href="https://www.facebook.com/terrazapineda" target="_blank" rel="noopener" class="rounded-lg p-2 bg-[#1877F3] hover:opacity-80 transition">
              <div class="w-6 h-6 text-white">
                <Icon icon="mdi:facebook" />
              </div>
            </a>
            <a href="https://www.instagram.com/terrazapineda/" target="_blank" rel="noopener" class="rounded-lg p-2 bg-[#DD2A7B] hover:opacity-80 transition">
              <div class="w-6 h-6 text-white">
                <Icon icon="mdi:instagram" />
              </div>
            </a>
            <a href="https://www.tiktok.com/@terrazapineda" target="_blank" rel="noopener" class="rounded-lg p-2 bg-[#010101] hover:opacity-80 transition">
              <div class="w-6 h-6 text-white">
                <Icon icon="simple-icons:tiktok" />
              </div>
            </a>
            <a href="https://api.whatsapp.com/send?phone=523323439936&text=Hola%20quiero%20rentar%20Terraza%20Pineda" target="_blank" rel="noopener" class="rounded-lg p-2 bg-[#25D366] hover:opacity-80 transition">
              <div class="w-6 h-6 text-white">
                <Icon icon="mdi:whatsapp" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10 text-xs text-center text-white/60">&copy; {{ new Date().getFullYear() }} Terraza Pineda. Todos los derechos reservados.</div>
  </footer>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script> 