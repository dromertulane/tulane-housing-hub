// Shared result shape for the auth and post Server Actions, consumed by
// `useActionState`. On a rejected submission, `values` carries the raw
// submitted fields back to the form so they can be repopulated.
export type ActionState = {
  error?: string;
  message?: string;
  values?: Record<string, string>;
};
