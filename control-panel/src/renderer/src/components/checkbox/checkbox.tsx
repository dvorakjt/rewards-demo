import type { InputHTMLAttributes } from 'react';
import styles from './styles.module.scss';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function Checkbox(props: CheckboxProps) {
  let className = styles.checkbox;

  if (props.className) {
    className += ' ' + props.className;
  }

  return <input type="checkbox" {...props} className={className} />;
}
