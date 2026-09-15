import type { HTMLAttributes, ReactNode } from 'react';

import { classNames } from '../../../lib/classNames';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  title?: string;
}

export function Card({ children, className, description, footer, title, ...cardProps }: CardProps) {
  return (
    <section className={classNames(styles.card, className)} {...cardProps}>
      {title || description ? (
        <div className={styles.header}>
          {title ? <h3 className={styles.title}>{title}</h3> : null}
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
      ) : null}
      <div className={styles.content}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </section>
  );
}
