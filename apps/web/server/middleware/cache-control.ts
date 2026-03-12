export default defineEventHandler((event) => {
  const pwaCookie = getCookie(event, 'pwa');
  const config = useRuntimeConfig(event);
  const isPreview = !!pwaCookie || config.public.isPreview;

  if (!isPreview) {
    setHeader(event, 'Cache-Control', 'public, max-age=30, stale-while-revalidate=900');
  } else {
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate');
    setHeader(event, 'Pragma', 'no-cache');
    setHeader(event, 'Expires', '0');
  }
});
