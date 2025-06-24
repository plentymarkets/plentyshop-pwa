<template>
  <div ref="turnstileDiv" />
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const turnstileDiv = ref(null)
const scriptLoaded = ref(false)
const widgetRendered = ref(false)

const emit = defineEmits(['verify', 'error'])

const loadScript = async () => {
  if (scriptLoaded.value || import.meta.server) return

  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
  script.async = true
  script.defer = true

  return new Promise((resolve, reject) => {
    script.onload = () => {
      scriptLoaded.value = true
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const renderWidget = async () => {
  if (widgetRendered.value || !turnstileDiv.value) return

  if (!scriptLoaded.value) {
    await loadScript()
  }

  await nextTick()

  if (window.turnstile && turnstileDiv.value) {
    window.turnstile.render(turnstileDiv.value, {
      sitekey: runtimeConfig.public.turnstileSiteKey,
      theme: 'light',
      callback: (token) => emit('verify', token),
      'error-callback': (error) => emit('error', error)
    })
    widgetRendered.value = true
  }
}

onMounted(() => {
  renderWidget()
})
</script>