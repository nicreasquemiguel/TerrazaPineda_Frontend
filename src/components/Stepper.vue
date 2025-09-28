<template>
  <div class="relative overflow-hidden rounded-2xl background-transparent  p-2 w-full max-w-lg !bg-center !bg-no-repeat" >
    <div class="absolute inset-0 background-transparent pointer-events-none" />
    <div class="relative flex min-h-full flex-1 flex-col items-center justify-center">
      <SplitText text="Reservar" class="text-3xl font-bold text-white text-center mb-6" />
      <div class="mx-auto w-full">
        <div class="flex w-full items-center p-2 md:p-4">
          <template v-for="(step, index) in totalSteps" :key="index">
            <StepIndicator
              :step="index + 1"
              :currentStep="currentStep"
              :disableStepIndicators="disableStepIndicators"
              @clickStep="onStepClick"
            />
            <StepConnector v-if="index < totalSteps - 1" :isComplete="currentStep > index + 1" />
          </template>
        </div>
        <StepContentWrapper
          :isCompleted="isCompleted"
          :currentStep="currentStep"
          :direction="direction"
          class="space-y-2 px-4 md:px-8"
        >
          <slot :name="`step-${currentStep}`" />
        </StepContentWrapper>
        <div v-if="!isCompleted" class="px-4 md:px-8 pb-6">
          <div :class="['mt-8 flex', currentStep !== 1 ? 'justify-between' : 'justify-end']">
            <button
              v-if="currentStep !== 1"
              @click="handleBack"
              class="duration-350 rounded px-2 py-1 transition text-neutral-400 hover:text-neutral-700"
            >
              {{ backButtonText }}
            </button>
            <button
              @click="isLastStep ? handleComplete() : handleNext()"
              class="duration-350 flex items-center justify-center rounded-full bg-green-500 py-1.5 px-3.5 font-medium tracking-tight text-white transition hover:bg-green-600 active:bg-green-700"
            >
              {{ isLastStep ? 'Completar' : nextButtonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue';
import SplitText from '@/components/SplitText.vue';

const props = defineProps({
  initialStep: { type: Number, default: 1 },
  backButtonText: { type: String, default: 'Atrás' },
  nextButtonText: { type: String, default: 'Continuar' },
  disableStepIndicators: { type: Boolean, default: false },
  totalSteps: { type: Number, required: true },
});

const emit = defineEmits(['step-change', 'final-step-completed']);

const currentStep = ref(props.initialStep);
const direction = ref(0);
const isCompleted = computed(() => currentStep.value > props.totalSteps);
const isLastStep = computed(() => currentStep.value === props.totalSteps);

function updateStep(newStep) {
  currentStep.value = newStep;
  if (newStep > props.totalSteps) {
    emit('final-step-completed');
  } else {
    emit('step-change', newStep);
  }
}
function handleBack() {
  if (currentStep.value > 1) {
    direction.value = -1;
    updateStep(currentStep.value - 1);
  }
}
function handleNext() {
  if (!isLastStep.value) {
    direction.value = 1;
    updateStep(currentStep.value + 1);
  }
}
function handleComplete() {
  direction.value = 1;
  updateStep(props.totalSteps + 1);
}
function onStepClick(step) {
  if (step !== currentStep.value && !props.disableStepIndicators) {
    direction.value = step > currentStep.value ? 1 : -1;
    updateStep(step);
  }
}

const StepIndicator = defineComponent({
  props: ['step', 'currentStep', 'onClickStep', 'disableStepIndicators'],
  emits: ['clickStep'],
  setup(props, { emit }) {
    const status = computed(() =>
      props.currentStep === props.step
        ? 'active'
        : props.currentStep < props.step
        ? 'inactive'
        : 'complete'
    );
    function handleClick() {
      if (props.step !== props.currentStep && !props.disableStepIndicators) emit('clickStep', props.step);
    }
    return () =>
      h(
        'div',
        {
          class: 'relative cursor-pointer outline-none focus:outline-none',
          onClick: handleClick,
        },
        [
          h(
            'div',
            {
              class: [
                'flex items-center justify-center rounded-full font-semibold transition-all duration-300',
                'h-6 w-6 md:h-8 md:w-8',
                status.value === 'inactive'
                  ? 'bg-[#222] text-neutral-400'
                  : status.value === 'active'
                  ? 'bg-[#7c3aed] shadow-[0_0_12px_2px_#7c3aed99] text-white'
                  : 'bg-[#22d3ee] text-black',
              ],
            },
            [
              status.value === 'complete'
                ? h('svg', { class: 'h-3 w-3 md:h-4 md:w-4 text-black', fill: 'none', stroke: 'currentColor', strokeWidth: 2, viewBox: '0 0 24 24' }, [
                    h('path', { d: 'M5 13l4 4L19 7', strokeLinecap: 'round', strokeLinejoin: 'round' })
                  ])
                : status.value === 'active'
                ? h('div', { class: 'h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#060010]' })
                : h('span', { class: 'text-xs md:text-sm' }, props.step)
            ]
          ),
        ]
      );
  },
});

const StepConnector = defineComponent({
  props: ['isComplete'],
  setup(props) {
    return () =>
      h('div', { class: 'relative mx-1 md:mx-2 h-0.5 flex-1 overflow-hidden rounded bg-neutral-600' }, [
        h('div', {
          class: [
            'absolute left-0 top-0 h-full transition-all duration-400',
            props.isComplete ? 'w-full bg-[#7c3aed]' : 'w-0 bg-transparent',
          ],
        }),
      ]);
  },
});

const StepContentWrapper = defineComponent({
  props: ['isCompleted', 'currentStep', 'direction', 'className'],
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: [props.className, 'relative overflow-hidden'],
        },
        [!props.isCompleted && slots.default && slots.default()]
      );
  },
});
</script>

<style scoped>
/* No extra CSS needed, all handled by Tailwind */
</style> 