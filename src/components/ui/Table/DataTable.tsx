import type { ReactNode } from 'react';

import { classNames } from '../../../lib/classNames';
import styles from './DataTable.module.css';

export interface DataTableColumn<Row> {
  align?: 'end' | 'start';
  header: string;
  key: string;
  render: (row: Row) => ReactNode;
}

interface DataTableProps<Row> {
  caption: string;
  className?: string;
  columns: DataTableColumn<Row>[];
  getRowKey: (row: Row) => string;
  rows: Row[];
}

export function DataTable<Row>({
  caption,
  className,
  columns,
  getRowKey,
  rows,
}: DataTableProps<Row>) {
  return (
    <div className={classNames(styles.tableScroll, className)}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={classNames(styles.headerCell, column.align === 'end' && styles.alignEnd)}
                key={column.key}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className={styles.row} key={getRowKey(row)}>
              {columns.map((column) => (
                <td
                  className={classNames(styles.cell, column.align === 'end' && styles.alignEnd)}
                  key={column.key}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
