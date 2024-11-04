export default defineNuxtRouteMiddleware(async () => {
    const { isAuthorized, getSession } = useCustomer();
    const localePath = useLocalePath();

    if (isAuthorized.value) return;

    await getSession();

    if (!isAuthorized.value) {
        return navigateTo(localePath(paths.authLogin));
    }
    return;
});
