import type { InputHTMLAttributes } from 'react';
import styles from './styles.module.scss';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/**
 * Renders a stylized input element with a type of "checkbox." Accepts all
 * props that such an element might receive and forwards them to the element.
 *
 * @param props {@link CheckboxProps}
 */
export function Checkbox(props: CheckboxProps) {
  let className = styles.checkbox;

  if (props.className) {
    className += ' ' + props.className;
  }

  return <input type="checkbox" {...props} className={className} />;
}
