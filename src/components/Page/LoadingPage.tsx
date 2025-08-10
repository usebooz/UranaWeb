import { Spinner } from '@telegram-apps/telegram-ui';
import type { FC, ReactNode, CSSProperties } from 'react';

import { Page } from '@/components/Page/Page';

interface LoadingStateProps {
  size?: 's' | 'm' | 'l';
  children?: ReactNode;
  withPage?: boolean;
  style?: CSSProperties;
}

/**
 * Универсальный компонент для отображения состояния загрузки
 * Показывает только спиннер без текстовых сообщений
 */
export const LoadingPage: FC<LoadingStateProps> = () => {
  const content = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <Spinner size={'l'} />
    </div>
  );
  return <Page>{content}</Page>;
};
