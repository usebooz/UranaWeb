import type { RGB as RGBType } from '@telegram-apps/sdk-react';
import type { FC, HTMLAttributes } from 'react';

import block from 'bem-cn';
import { clsx as classNames } from 'clsx';

import './RGB.css';

const b = block('rgb');

export type RgbProps = HTMLAttributes<HTMLDivElement> & {
  color: RGBType;
};

export const Rgb: FC<RgbProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={classNames(b(), className)}>
    <i className={b('icon')} style={{ backgroundColor: color }} />
    {color}
  </span>
);
