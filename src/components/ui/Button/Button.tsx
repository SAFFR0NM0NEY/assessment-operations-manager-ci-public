import type { ButtonHTMLAttributes } from 'react';

import { classNames } from '../../../lib/classNames';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'normal';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  className,
  size = 'normal',
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={classNames(styles.button, styles[size], styles[variant], className)}
      type={type}
      {...buttonProps}
    />
  );
}
