import type { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';

type Variant = 'gradient' | 'gradient-text' | 'solid-yellow';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
}

export function Button({
  variant,
  className: customClassName,
  ...props
}: ButtonProps) {
  let className = styles[variant];
  if (customClassName) {
    className += ' ' + customClassName;
  }

  return (
    <div className={styles.wrapper}>
      <button {...props} className={className}>
        <div className={styles.contents}>{props.children}</div>
      </button>
    </div>
  );
}
