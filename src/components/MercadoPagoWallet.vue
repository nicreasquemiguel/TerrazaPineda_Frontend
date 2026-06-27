<template>
  <div id="walletBrick_container" style="min-height: 52px; width: 100%;"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  preferenceId: { type: String, required: true },
  publicKey: { type: String, required: true }
})

let brickController = null

function wait(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function waitForSDK(maxMs = 8000) {
  let elapsed = 0
  while (!window.MercadoPago && elapsed < maxMs) {
    await wait(200)
    elapsed += 200
  }
  return !!window.MercadoPago
}

async function waitForContainer(maxMs = 3000) {
  let elapsed = 0
  while (!document.getElementById('walletBrick_container') && elapsed < maxMs) {
    await wait(50)
    elapsed += 50
  }
  return !!document.getElementById('walletBrick_container')
}

async function initBrick() {
  if (brickController) {
    try { brickController.unmount() } catch {}
    brickController = null
  }

  if (!props.preferenceId || !props.publicKey) return

  const [sdkReady, containerReady] = await Promise.all([
    waitForSDK(),
    waitForContainer()
  ])

  if (!sdkReady || !containerReady) {
    console.error('[MP Wallet] not ready — SDK:', sdkReady, 'container:', containerReady)
    return
  }

  await wait(100)

  try {
    const mp = new window.MercadoPago(props.publicKey)
    const bricksBuilder = mp.bricks()
    brickController = await bricksBuilder.create('wallet', 'walletBrick_container', {
      initialization: { preferenceId: props.preferenceId }
    })
  } catch (err) {
    console.error('[MP Wallet] brick creation failed:', err)
  }
}

onMounted(initBrick)
watch(() => props.preferenceId, initBrick)

onBeforeUnmount(() => {
  if (brickController) {
    try { brickController.unmount() } catch {}
    brickController = null
  }
})
</script>
