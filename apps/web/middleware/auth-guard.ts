/**
 * This middleware is used to check if the user is authorized.
 * 
 * Use this auth guard to protect routes that require the user to be logged in.
 * 
 * If the user is not authorized, the user will be redirected to the login page.
 */

export default defineNuxtRouteMiddleware(async () => {
    const { isAuthorized, getSession } = useCustomer();
    const localePath = useLocalePath();

    // if the user is or was authorized once we don't need to load the login state
    // if the user is not authorized following rest calls will fail or wont return any data
    if (isAuthorized.value) return;

    await getSession();

    if (!isAuthorized.value) {
        return navigateTo(localePath(paths.authLogin));
    }
    return;
});
