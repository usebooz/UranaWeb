import { openLink } from '@telegram-apps/sdk-react';
import { type FC, type MouseEventHandler, useCallback } from 'react';
import { Link as RouterLink, type LinkProps } from 'react-router-dom';

import { clsx as classNames } from 'clsx';

import './Link.css';

/**
 * Enhanced Link component that handles both internal routing and external links.
 * Automatically detects external URLs and opens them using Telegram's openLink method.
 * For internal links, uses React Router's Link component for client-side navigation.
 *
 * @param props - Standard React Router LinkProps
 * @returns Link component with Telegram Web App external link handling
 */
export const Link: FC<LinkProps> = ({
  className,
  onClick: propsOnClick,
  to,
  ...rest
}) => {
  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    e => {
      propsOnClick?.(e);

      // Compute if target path is external. In this case we would like to open
      // link using Telegram Mini App method.
      let path: string;
      if (typeof to === 'string') {
        path = to;
      } else {
        const { search = '', pathname = '', hash = '' } = to;
        path = `${pathname}?${search}#${hash}`;
      }

      const targetUrl = new URL(path, globalThis.location.toString());
      const currentUrl = new URL(globalThis.location.toString());
      const isExternal =
        targetUrl.protocol !== currentUrl.protocol ||
        targetUrl.host !== currentUrl.host;

      // Open external links using Telegram's openLink method
      if (isExternal) {
        e.preventDefault();
        openLink(targetUrl.toString());
      }
    },
    [to, propsOnClick]
  );

  return (
    <RouterLink
      {...rest}
      to={to}
      onClick={onClick}
      className={classNames(className, 'link')}
    />
  );
};
