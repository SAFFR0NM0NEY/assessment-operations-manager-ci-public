import { Link } from 'react-router';

import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className={styles.item} key={item.to ?? item.label}>
              {item.to && !isCurrent ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined} className={styles.current}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
