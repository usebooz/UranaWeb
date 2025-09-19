import { type FC } from 'react';
import { Placeholder, Spinner } from '@telegram-apps/telegram-ui';

/**
 * Props for the Loading component
 */
interface PlaceSpinnerProps {
  /** Size of the spinner */
  size?: 's' | 'm' | 'l';
  /** Loading text */
  text?: string;
}

/**
 * Loading component for displaying loading state
 * Shows a spinner with optional loading text
 */
export const PlaceSpinner: FC<PlaceSpinnerProps> = ({ size = 'l', text }) => (
  <Placeholder>
    <Spinner size={size} />
    {text && <div>{text}</div>}
  </Placeholder>
);
