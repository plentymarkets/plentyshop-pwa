import extensionConfig from '../extension.config';

export function useHelloWorld() {
  if (!extensionConfig.isActive()) {
    return;
  }

  // TODO: add your extension logic
}
