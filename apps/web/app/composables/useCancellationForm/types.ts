export interface UseCancellationFormState {
  loading: boolean;
}

export type validateFormData = (formData: FormData) => boolean;
export type submitCancellation = (formData: FormData) => Promise<void>; 