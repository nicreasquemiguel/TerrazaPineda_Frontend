<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-20 text-white bg-gradient-to-r from-primary-600 to-primary-800">
      <div class="px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
        <h1 class="mb-6 text-4xl font-bold md:text-6xl">
          About Terraza Pineda
        </h1>
        <p class="mx-auto max-w-3xl text-xl md:text-2xl text-primary-100">
          We're passionate about building modern web applications with cutting-edge technologies.
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20 bg-white">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="grid gap-12 items-center lg:grid-cols-2">
          <div>
            <h2 class="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              Our Mission
            </h2>
            <p class="mb-6 text-lg text-gray-600">
              At Terraza Pineda, we believe in creating exceptional user experiences through innovative technology solutions. 
              Our mission is to build scalable, maintainable, and beautiful web applications that solve real-world problems.
            </p>
            <p class="mb-8 text-lg text-gray-600">
              We leverage the latest frontend technologies including Vue 3, Tailwind CSS, and modern state management 
              to deliver applications that are not only functional but also delightful to use.
            </p>
            <div class="flex flex-col gap-4 sm:flex-row">
              <router-link
                to="/products"
                class="px-8 py-3 text-lg font-semibold btn-primary"
              >
                View Our Work
              </router-link>
              <router-link
                to="/precios"
                class="px-8 py-3 text-lg font-semibold btn-secondary"
              >
                Get in Touch
              </router-link>
            </div>
          </div>
          <div class="relative">
            <div class="flex justify-center items-center w-full h-96 bg-gradient-to-br rounded-2xl from-primary-100 to-primary-200">
              <div class="text-center">
                <img src="/src/assets/tp.svg" alt="Terraza Pineda Logo" class="flex justify-center items-center mx-auto mb-4 w-24 h-24 rounded-full bg-primary-600" />
                <h3 class="text-2xl font-bold text-primary-900">Terraza Pineda</h3>
                <p class="text-primary-700">Modern Web Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-20 bg-gray-50">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Our Values
          </h2>
          <p class="mx-auto max-w-3xl text-xl text-gray-600">
            These core values guide everything we do and help us deliver exceptional results.
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="value in values"
            :key="value.title"
            class="text-center transition-shadow duration-300 card hover:shadow-lg"
          >
            <div class="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-full bg-primary-100">
              <component :is="value.icon" class="w-8 h-8 text-primary-600" />
            </div>
            <h3 class="mb-3 text-xl font-semibold text-gray-900">
              {{ value.title }}
            </h3>
            <p class="text-gray-600">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-white">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Meet Our Team
          </h2>
          <p class="mx-auto max-w-3xl text-xl text-gray-600">
            We're a team of passionate developers and designers dedicated to creating amazing web experiences.
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="member in team"
            :key="member.name"
            class="text-center transition-shadow duration-300 card hover:shadow-lg"
          >
            <div class="flex justify-center items-center mx-auto mb-4 w-24 h-24 bg-gradient-to-br rounded-full from-primary-400 to-primary-600">
              <span class="text-2xl font-bold text-white">{{ member.initials }}</span>
            </div>
            <h3 class="mb-2 text-xl font-semibold text-gray-900">
              {{ member.name }}
            </h3>
            <p class="mb-3 font-medium text-primary-600">
              {{ member.role }}
            </p>
            <p class="text-sm text-gray-600">
              {{ member.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 text-white bg-primary-600">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="grid gap-8 text-center md:grid-cols-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="space-y-2"
          >
            <div class="text-3xl font-bold md:text-4xl">
              {{ stat.value }}
            </div>
            <div class="text-primary-100">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { 
  InnovationIcon, 
  QualityIcon, 
  CollaborationIcon 
} from '@/components/icons'

const values = [
  {
    title: 'Innovation',
    description: 'We constantly explore new technologies and approaches to deliver cutting-edge solutions.',
    icon: InnovationIcon
  },
  {
    title: 'Quality',
    description: 'Every line of code we write is crafted with attention to detail and best practices.',
    icon: QualityIcon
  },
  {
    title: 'Collaboration',
    description: 'We believe in the power of teamwork and open communication to achieve great results.',
    icon: CollaborationIcon
  }
]

const team = [
  {
    name: 'Sarah Johnson',
    role: 'Frontend Lead',
    initials: 'SJ',
    description: 'Vue.js expert with 5+ years of experience building modern web applications.'
  },
  {
    name: 'Mike Chen',
    role: 'UI/UX Designer',
    initials: 'MC',
    description: 'Passionate about creating beautiful and intuitive user interfaces.'
  },
  {
    name: 'Alex Rodriguez',
    role: 'Backend Developer',
    initials: 'AR',
    description: 'Full-stack developer specializing in Node.js and database design.'
  }
]

const stats = [
  { value: '50+', label: 'Projects Completed' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Support Available' },
  { value: '3+', label: 'Years Experience' }
]
</script> 