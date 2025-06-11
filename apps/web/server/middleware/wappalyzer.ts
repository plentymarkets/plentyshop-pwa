export default defineEventHandler((event) => {
  setHeader(event, 'X-Plenty-Shop', 'PlentyONE Shop');
});
