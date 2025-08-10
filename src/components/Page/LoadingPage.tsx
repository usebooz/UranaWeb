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
export const LoadingPage: FC<LoadingStateProps> = ({
  size = 'l',
  children,
  withPage = true,
  style = {},
}) => {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    gap: '16px',
    ...style,
  };

  const content = (
    <div style={containerStyle}>
      <Spinner size={size} />
      {children}
    </div>
  );

  return withPage ? <Page>{content}</Page> : content;
};
