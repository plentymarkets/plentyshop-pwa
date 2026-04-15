export interface UseCancellationFormState {
  loading: boolean;
}

export type SubmitCancellation = (params: {
  email: string;
  name: string;
  orderId: number;
  lang: string;
  'cf-turnstile-response': string;
}) => Promise<string | null>;

export type UseCancellationFormReturn = () => {
  loading: Ref<boolean>;
  submitCancellation: SubmitCancellation;
};