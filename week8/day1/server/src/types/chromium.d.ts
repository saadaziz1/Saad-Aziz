declare module '@sparticuz/chromium' {
  export const args: string[];
  export const defaultViewport: any;
  export const executablePath: () => Promise<string>;
  export const headless: boolean;
}
