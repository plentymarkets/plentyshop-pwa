export default defineEventHandler((event) => {
  const overrideCookie = getCookie(event, '_e2e_config');
  if (!overrideCookie) return;

  try {
    const overrides = JSON.parse(overrideCookie);
    const config = useRuntimeConfig(event);
    Object.assign(config.public, overrides);
  } catch {
    console.error('[E2E] Invalid _e2e_config cookie – could not parse JSON:', overrideCookie);
  }
});
