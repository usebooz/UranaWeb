import type { RGB as RGBType } from '@telegram-apps/sdk-react';
import type { FC, HTMLAttributes } from 'react';

import block from 'bem-cn';
import { clsx as classNames } from 'clsx';

import './RGB.css';

const b = block('rgb');

/**
 * Props for RGB component.
 */
export type RgbProps = HTMLAttributes<HTMLDivElement> & {
  /** RGB color value to display */
  color: RGBType;
};

/**
 * Component for displaying RGB color values with a color preview.
 * Shows a colored icon alongside the RGB hex value string.
 * Useful for debugging theme parameters and color values.
 *
 * @param props - Component props extending standard div attributes
 * @returns Span element with color preview icon and RGB value text
 */
export const Rgb: FC<RgbProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={classNames(b(), className)}>
    <i className={b('icon')} style={{ backgroundColor: color }} />
    {color}
  </span>
);
