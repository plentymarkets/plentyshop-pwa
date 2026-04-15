export const useCancellationForm = () => {
    const state = useState<UseCancellationFormState>(`useCancellationForm`, () => ({
        loading: false,
    }));

    const validateFormData: validateFormData = (formData: FormData): boolean => {
        const orderId = formData.get('orderId');
        const name = formData.get('name');
        const email = formData.get('email');

        if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
            return false;
        }

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return false;
        }

        if (!email || typeof email !== 'string' || email.trim() === '') {
            return false;
        }

        return true;
    }

    const submitCancellation: submitCancellation = async (formData: FormData) => {
        console.log('Submitting cancellation with data:', formData);
    }

    return {
        ...toRefs(state),
        validateFormData,
        submitCancellation,
    };
}