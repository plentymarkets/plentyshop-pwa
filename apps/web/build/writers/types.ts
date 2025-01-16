export interface Writer {
  write(data: string, destination: string): void;
  writeMissing(data: string, destination: string): void;
}
