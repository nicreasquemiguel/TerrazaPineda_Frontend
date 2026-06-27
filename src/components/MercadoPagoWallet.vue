<template>
  <div id="walletBrick_container" style="min-height: 52px;"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  preferenceId: { type: String, required: true },
  publicKey: { type: String, required: true }
})

let brickController = null

async function waitForSDK(maxMs = 6000) {
  const step = 200
  let elapsed = 0
  while (!window.MercadoPago && elapsed < maxMs) {
    await new Promise(r => setTimeout(r, step))
    elapsed += step
  }
  return !!window.MercadoPago
}

async function initBrick() {
  if (brickController) {
    brickController.unmount()
    brickController = null
  }

  if (!props.preferenceId || !props.publicKey) return

  const ready = await waitForSDK()
  if (!ready) {
    console.error('[MercadoPago] SDK did not load in time')
    return
  }

  await nextTick()

  const mp = new window.MercadoPago(props.publicKey)
  const bricksBuilder = mp.bricks()

  brickController = await bricksBuilder.create('wallet', 'walletBrick_container', {
    initialization: {
      preferenceId: props.preferenceId
    }
  })
}

onMounted(initBrick)

watch(() => props.preferenceId, initBrick)

onBeforeUnmount(() => {
  if (brickController) {
    brickController.unmount()
    brickController = null
  }
})
</script>
