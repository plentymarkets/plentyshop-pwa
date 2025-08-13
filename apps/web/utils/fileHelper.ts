export const base64ToBlob = (base64: string, contentType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers: number[] = Array.from({ length: byteCharacters.length });

  for (let index = 0; index < byteCharacters.length; index++) {
    byteNumbers[index] = byteCharacters.codePointAt(index) ?? -1;
  }
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: contentType });
};

export const fileToBase64 = async (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = (): void => {
      if (!reader.result) {
        resolve(null);
        return;
      }
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1];

        resolve(base64String);
      }
    };

    reader.onerror = (): void => {
      resolve(null);
    };

    reader.readAsDataURL(file);
  });
};
