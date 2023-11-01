import { SetCsrf, UseCsrfReturn, UseCsrfState } from './types';

export const useCsrf: UseCsrfReturn = () => {

    const state = useState<UseCsrfState>(`useCsrf`, () => ({
        csrf: null,
    }));

    const setCsrf: SetCsrf = (csrf: string | null) => {
        state.value.csrf = csrf;
    };

    const setCsrfHeader = (config: any) => {
        console.log(config);
        console.log(state.value.csrf)
        if (state.value.csrf) {
            if (!config.headers) {
                config.headers = {};
            }
            if (config.method && ['POST', 'PUT', 'DELETE'].includes(config.method.toUpperCase())) {
                config.headers['X-CSRF-TOKEN'] = state.value.csrf;
            }
        }
        return config;
    };

    return {
        setCsrf,
        setCsrfHeader,
        ...toRefs(state.value)
    };
}