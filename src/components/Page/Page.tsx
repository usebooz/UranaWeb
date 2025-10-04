import { useNavigate } from 'react-router-dom';
import {
  hideBackButton,
  onBackButtonClick,
  showBackButton,
} from '@telegram-apps/sdk-react';
import { type PropsWithChildren, useEffect } from 'react';

/**
 * Page wrapper component that manages Telegram Web App back button behavior.
 * Automatically shows/hides the back button based on the `back` prop and
 * handles navigation when the back button is pressed.
 *
 * @param props - Component props
 * @param props.children - Child components to render
 * @param props.back - Whether to show the back button (default: true)
 * @returns Page wrapper with back button management
 */
export function Page({
  children,
  back = true,
}: PropsWithChildren<{
  /** True if it is allowed to go back from this page */
  back?: boolean;
}>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (back) {
      showBackButton();
      const cleanup = onBackButtonClick(async () => {
        await navigate(-1);
      });
      return cleanup;
    }
    hideBackButton();
  }, [back]);

  return <>{children}</>;
}
