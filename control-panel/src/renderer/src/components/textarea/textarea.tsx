import { useRef, useId, useEffect, type CSSProperties } from 'react';
import {
  useFocusEvents,
  useMultiPipe,
  useUserInput,
  ValidityUtils,
  type FieldOfType,
  type IGroup,
  type Field,
  type Group
} from 'fully-formed';
import styles from './styles.module.scss';

interface TextAreaProps {
  /**
   * A {@link Field} that will control the state of the textarea.
   */
  field: FieldOfType<string>;
  /**
   * An array of {@link Group}s. If these groups' validators have
   * executed and returned an invalid result, the textarea will appear invalid.
   */
  groups?: IGroup[];
  /**
   * If true, the placeholder and value text will be opaque even before the user
   * has interacted with the field. Set this to true if you are pairing the
   * textarea with a stationary label. Set this to false if you are pairing the
   * textarea with a floating label.
   */
  showText?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
  style?: CSSProperties;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
}

/**
 * Renders an HTML textarea element whose value and appearance are controlled by
 * the state of a {@link Field}.
 *
 * @param props - {@link TextAreaProps}
 *
 * @remarks
 * If the provide field is invalid, the returned textarea element will appear
 * invalid once the user has interacted with it.
 *
 * If `groups` are provided, the textarea will appear invalid if any of those
 * groups' validators have failed and the user has interacted with it.
 */
export function TextArea({
  field,
  groups = [],
  showText,
  placeholder,
  disabled,
  maxLength,
  className: classNameProp,
  style,
  ['aria-required']: ariaRequired,
  ['aria-describedby']: ariaDescribedBy
}: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { value, onChange } = useUserInput(field);
  const className = useMultiPipe([field, ...groups], (states) => {
    const classNames = [styles.textarea];
    const fieldState = states[0];

    if (
      showText ||
      fieldState.isInFocus ||
      fieldState.hasBeenBlurred ||
      fieldState.value
    ) {
      classNames.push(styles.show_text);
    }

    const validity = ValidityUtils.minValidity(states, {
      pruneUnvalidatedGroups: true
    });

    if (
      fieldState.hasBeenModified ||
      fieldState.hasBeenBlurred ||
      fieldState.submitted
    ) {
      if (ValidityUtils.isCaution(validity)) {
        classNames.push(styles.caution);
      } else if (ValidityUtils.isInvalid(validity)) {
        classNames.push(styles.invalid);
      }
    }

    if (classNameProp) {
      classNames.push(classNameProp);
    }

    return classNames.join(' ');
  });

  const ariaInvalid = useMultiPipe([field, ...groups], (states) => {
    const validity = ValidityUtils.minValidity(states);
    const fieldState = states[0];

    return (
      ValidityUtils.isInvalid(validity) &&
      (fieldState.hasBeenModified ||
        fieldState.hasBeenBlurred ||
        fieldState.submitted)
    );
  });

  const warningMessage = useMultiPipe([field, ...groups], (states) => {
    const validity = ValidityUtils.minValidity(states);
    const fieldState = states[0];

    return ValidityUtils.isCaution(validity) &&
      (fieldState.hasBeenModified ||
        fieldState.hasBeenBlurred ||
        fieldState.submitted)
      ? 'The value of this field could not be confirmed. Please verify that it is correct.'
      : undefined;
  });

  const warningMessageId = useId();

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '43px';
      const newHeight = Math.max(textAreaRef.current.scrollHeight, 43);
      textAreaRef.current.style.height = newHeight + 'px';
    }
  }, [value]);

  return (
    <>
      <textarea
        name={field.name}
        id={field.id}
        ref={textAreaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        aria-required={ariaRequired}
        aria-describedby={
          ariaDescribedBy
            ? `${ariaDescribedBy} ${warningMessageId}`
            : warningMessageId
        }
        aria-invalid={ariaInvalid}
        {...useFocusEvents(field)}
        className={className}
        style={style}
      />
      <span
        style={{ position: 'fixed', visibility: 'hidden' }}
        id={warningMessageId}
      >
        {warningMessage}
      </span>
    </>
  );
}
