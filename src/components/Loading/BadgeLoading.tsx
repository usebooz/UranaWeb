import { Badge, BadgeProps } from '@telegram-apps/telegram-ui';
import { FC } from 'react';

/**
 * Props for BadgeLoading component.
 */
interface BadgeLoadingProps {
  /** Badge visual mode (color scheme) */
  mode?: BadgeProps['mode'];
  /** Whether to use transparent background */
  transparent?: boolean;
}

/**
 * Loading badge component that displays a "?" symbol during data loading.
 * Used as a placeholder while actual badge data is being fetched.
 *
 * @param props - The component props
 * @returns Badge component with loading indicator
 */
export const BadgeLoading: FC<BadgeLoadingProps> = ({
  mode,
  transparent = false,
}) => (
  <Badge
    type="number"
    mode={mode}
    className={transparent ? 'transparent-bg-color' : undefined}
  >
    ?
  </Badge>
);
