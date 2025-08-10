import type { RGB as RGBType } from '@telegram-apps/sdk-react';
import type { FC, HTMLAttributes } from 'react';

import { bem } from '@/css/bem.ts';
import { classNames } from '@/css/classnames.ts';

import './RGB.css';

const [b, e] = bem('rgb');

export type RGBProps = HTMLAttributes<HTMLDivElement> & {
  color: RGBType;
};

export const RGB: FC<RGBProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={classNames(b(), className)}>
    <i className={e('icon')} style={{ backgroundColor: color }} />
    {color}
  </span>
);
