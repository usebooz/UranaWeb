import { Badge, BadgeProps } from '@telegram-apps/telegram-ui';
import { FC } from 'react';

/**
 *
 */
interface BadgeLoadingProps {
  mode?: BadgeProps['mode'];
  transparent?: boolean;
}

/**
 *
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
