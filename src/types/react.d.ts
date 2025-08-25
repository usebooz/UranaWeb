import 'react';

// Расширение CSSProperties для поддержки CSS custom properties
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
