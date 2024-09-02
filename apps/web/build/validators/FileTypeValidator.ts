export class FileTypeValidator {
  private static readonly allowedFileTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'avif', 'webp'];

  public static isImage(fileName: string): boolean {
    const fileType = fileName.split('.').pop();

    if (!fileType) {
      return false;
    }

    return FileTypeValidator.allowedFileTypes.includes(fileType);
  }

  public static isIcon(fileName: string): boolean {
    return fileName.split('.').pop() === 'ico';
  }
}
