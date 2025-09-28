<script setup>
import { ref } from 'vue';
import DatePicker from 'primevue/datepicker';

const date = ref(null);
</script>

<template>
  <DatePicker v-model="date" />
</template> 