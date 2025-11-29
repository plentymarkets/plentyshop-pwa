/**
 * Sends a notification to inform users about example data in editor preview mode.
 *
 * This notification only appears when the application is running in PlentyONE editor
 * preview mode ($isPreview is true). It informs users that fields without product data
 * are displaying example data for editing purposes, and suggests switching to preview
 * mode to view only real data.
 *
 * @example
 * ```ts
 * // Call when displaying fake/example data in the editor
 * sendFakeDataNotification();
 * ```
 */
export const sendFakeDataNotification = () => {
  const { $isPreview } = useNuxtApp();
  if (!$isPreview) return;

  const { send } = useNotification();
  send({
    type: 'warning',
    message:
      'Example Data in Edit Mode: Fields without product data are shown with example data for editing purposes. To view only real data, please click the preview link.',
  });
};
