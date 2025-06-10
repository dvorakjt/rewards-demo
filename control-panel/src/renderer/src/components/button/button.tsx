import type { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';

type Variant = 'gradient' | 'gradient-text' | 'solid-yellow';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
}

/**
 * Renders a stylized button that can receive all of the props that a normal
 * HTML button element would. Also accepts a `variant` prop which determines
 * the color theme of the button.
 *
 * @param props - {@link ButtonProps}
 */
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
