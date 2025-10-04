import { isRGB } from '@telegram-apps/sdk-react';
import { Cell, Checkbox, Section } from '@telegram-apps/telegram-ui';
import type { FC, ReactNode } from 'react';

import { Rgb } from '@/components/RGB';
import { Link } from '@/components/Link';
import block from 'bem-cn';

import './DisplayData.css';

const b = block('display-data');

/**
 * Represents a single row of data to be displayed.
 * Can be either a link type (with optional URL) or contain any React node as value.
 */
export type DisplayDataRow = { title: string } & (
  | { type: 'link'; value?: string }
  | { value: ReactNode }
);

/**
 * Props for the DisplayData component.
 */
export interface DisplayDataProps {
  /** Optional header content displayed at the top of the section */
  header?: ReactNode;
  /** Optional footer content displayed at the bottom of the section */
  footer?: ReactNode;
  /** Array of data rows to display */
  rows: DisplayDataRow[];
}

/**
 * Component for displaying structured data in a formatted list.
 * Automatically handles different data types including links, colors (RGB), booleans, and generic React nodes.
 * Renders each row as a Cell component with appropriate formatting based on the data type.
 *
 * @param props - The component props
 * @returns A Section containing formatted data rows
 */
export const DisplayData: FC<DisplayDataProps> = ({ header, footer, rows }) => (
  <Section header={header} footer={footer}>
    {rows.map((item, idx) => {
      let valueNode: ReactNode;

      if (item.value === undefined) {
        valueNode = <i>empty</i>;
      } else if ('type' in item) {
        valueNode = <Link to={item.value}>Open</Link>;
      } else if (typeof item.value === 'string') {
        valueNode = isRGB(item.value) ? <Rgb color={item.value} /> : item.value;
      } else if (typeof item.value === 'boolean') {
        valueNode = <Checkbox checked={item.value} disabled />;
      } else {
        valueNode = item.value;
      }

      return (
        <Cell
          className={b('line')}
          subhead={item.title}
          readOnly
          multiline={true}
          key={'DISPLAY_DATA' + idx}
        >
          <span className={b('line-value')}>{valueNode}</span>
        </Cell>
      );
    })}
  </Section>
);
