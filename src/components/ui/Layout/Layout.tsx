import type { HTMLAttributes, ReactNode } from 'react';

import { classNames } from '../../../lib/classNames';
import styles from './Layout.module.css';

type Gap = 'large' | 'medium' | 'small' | 'extraLarge';

const gapClassBySize: Record<Gap, string> = {
  extraLarge: styles.gapExtraLarge,
  large: styles.gapLarge,
  medium: styles.gapMedium,
  small: styles.gapSmall,
};

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: Gap;
}

export function Stack({ children, className, gap = 'medium', ...stackProps }: StackProps) {
  return (
    <div className={classNames(styles.stack, gapClassBySize[gap], className)} {...stackProps}>
      {children}
    </div>
  );
}

interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'center' | 'end' | 'start';
  children: ReactNode;
  gap?: Gap;
  justify?: 'between' | 'end' | 'start';
  wrap?: boolean;
}

const alignClassByValue: Record<NonNullable<InlineProps['align']>, string> = {
  center: styles.alignCenter,
  end: styles.alignEnd,
  start: styles.alignStart,
};

const justifyClassByValue: Record<NonNullable<InlineProps['justify']>, string> = {
  between: styles.justifyBetween,
  end: styles.justifyEnd,
  start: styles.justifyStart,
};

export function Inline({
  align = 'center',
  children,
  className,
  gap = 'medium',
  justify = 'start',
  wrap = true,
  ...inlineProps
}: InlineProps) {
  return (
    <div
      className={classNames(
        styles.inline,
        gapClassBySize[gap],
        alignClassByValue[align],
        justifyClassByValue[justify],
        wrap && styles.wrap,
        className,
      )}
      {...inlineProps}
    >
      {children}
    </div>
  );
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  description?: string;
  title?: string;
}

export function Section({
  children,
  className,
  description,
  title,
  ...sectionProps
}: SectionProps) {
  return (
    <section className={classNames(styles.section, className)} {...sectionProps}>
      {title || description ? (
        <div className={styles.sectionHeader}>
          {title ? <h2 className={styles.sectionTitle}>{title}</h2> : null}
          {description ? <p className={styles.sectionDescription}>{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
