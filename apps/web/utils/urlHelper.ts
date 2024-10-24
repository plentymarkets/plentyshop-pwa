export const extractImageName = (url: string) => {
  const fileNameWithExtension = url.slice(Math.max(0, url.lastIndexOf('/') + 1));
  return fileNameWithExtension.slice(0, Math.max(0, fileNameWithExtension.lastIndexOf('.')));
};
