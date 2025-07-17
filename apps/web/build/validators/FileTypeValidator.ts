// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FileTypeValidator {
  public static isImage(fileName: string): boolean {
    const allowedImageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'avif', 'webp'];
    const fileType = fileName.split('.').pop();
    return fileType ? allowedImageTypes.includes(fileType) : false;
  }

  public static isIcon(fileName: string): boolean {
    const fileType = fileName.split('.').pop();
    return fileType === 'ico';
  }
}
