import { Label } from '../label';
import { Input } from '../input';
import { Messages } from '../messages';
import { usePipe, type FieldOfType, type IGroup } from 'fully-formed';
import type { CSSProperties, ReactNode } from 'react';
import styles from './styles.module.scss';

/**
 * Props accepted by the {@link InputGroup} component.
 */
type InputGroupProps = {
  /**
   * A {@link Field} that will control the state of the input, label, and
   * messages.
   */
  field: FieldOfType<string>;
  /**
   * An array of {@link Group}s. If these groups' validators have
   * executed and returned an invalid result, the input will appear invalid.
   */
  groups?: IGroup[];
  /**
   * The `type` attribute of the input.
   */
  type: string;
  /**
   * If `'floating'`, the label will be positioned inside the input element
   * until the user interacts with it, at which point it will float up above
   * the input element.
   */
  labelVariant: 'floating' | 'stationary';
  /**
   * The React element, text, etc. to render inside the label.
   */
  labelContent: ReactNode;
  /**
   * Applies an additional CSS class to the outer container rendered by the
   * component. Useful for applying things like margins.
   */
  containerClassName?: string;
  /**
   * Applies CSS styles to the outer container rendered by the component. Useful
   * for applying things like margins.
   */
  containerStyle?: CSSProperties;
  /**
   * A regular expression or an array of characters that the user is allowed to
   * type into the input. All characters are allowed by default.
   */
  allowedCharacters?: RegExp | string[];
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  maxLength?: number;
  max?: string;
  ['aria-required']?: boolean;
};

/**
 * Renders a {@link Label}, {@link Input} and {@link Messages} inside a
 * container.
 *
 * @remarks
 * The `htmlFor` attribute is set to the `id` of the provided field, and
 * the `aria-describedby` attribute of the input is set to the id provided to
 * the messages component, making the component optimized for screen readers.
 *
 * The messages will be hidden until the user has modified it, the input has
 * received focus and was then blurred, or the user submitted the form.
 *
 * The container can be styled, which facilitates changing the width of the
 * input, etc.
 *
 * @param props - {@link InputGroupProps}
 */
export function InputGroup({
  field,
  groups = [],
  type,
  labelVariant,
  labelContent,
  containerClassName,
  containerStyle,
  placeholder,
  disabled,
  autoComplete,
  maxLength,
  max,
  ['aria-required']: ariaRequired,
  allowedCharacters
}: InputGroupProps) {
  const messagesId = `${field.id}-messages`;
  const hideMessages = usePipe(field, (state) => {
    return !(state.hasBeenModified || state.hasBeenBlurred || state.submitted);
  });

  return (
    <div className={containerClassName} style={containerStyle}>
      <Label field={field} variant={labelVariant}>
        {labelContent}
      </Label>
      <Input
        field={field}
        groups={groups}
        type={type}
        showText={labelVariant === 'stationary'}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-required={ariaRequired}
        aria-describedby={messagesId}
        maxLength={maxLength}
        max={max}
        allowedCharacters={allowedCharacters}
      />
      <div className={styles.messages_container}>
        <Messages
          messageBearers={[field, ...groups]}
          id={messagesId}
          hideMessages={hideMessages}
        />
      </div>
    </div>
  );
}
