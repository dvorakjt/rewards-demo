import type { CSSProperties } from 'react';
import caretUp from '/src/assets/icons/caret-up.svg';
import caretDown from '/src/assets/icons/caret-down.svg';
import './styles.scss';

/**
 * Represents an option that should be rendered by the {@link Select} component.
 */
interface Option<T extends string> {
  /**
   * The text to display to the user for an option.
   */
  text: string;
  /**
   * The actual value of the option.
   */
  value: T;
}

/**
 * Props expected by the {@link Select} component.
 */
interface SelectProps<T extends string> {
  /**
   * The id attribute of the select element.
   */
  id: string;
  /**
   * The name attribute of the select element.
   */
  name: string;
  /**
   * An array of objects containing values and text to display.
   */
  options: Option<T>[];
  /**
   * The currently selected value.
   */
  value: string;
  /**
   * A function for updating the value of the select element.
   * @param value
   * @returns
   */
  setValue: (value: T) => void;
  /**
   * A CSS class to be applied to the select element. Optional.
   */
  className?: string;
  /**
   * CSS styles to be applied to the select element. Optional.
   */
  style?: CSSProperties;
}

/**
 * A customized select component that leverages the customizable select element.
 *
 * @param props {@link SelectProps}
 *
 * @remarks
 * At the time of writing, the customizable select element is available in
 * Chromium when the `experimental-web-platform-features` flag is enabled.
 * In this application, this flag is enabled in `/src/main/index.ts`.
 *
 * For more information about this element, see
 * {@link https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select}
 *
 * For more information about the availability of this element,
 * see {@link https://caniuse.com/selectlist}
 */
export function Select<T extends string = string>({
  setValue,
  options,
  ...props
}: SelectProps<T>) {
  let selectedOption: Option<T> | null = null;
  const otherOptions: Option<T>[] = [];

  for (const option of options) {
    if (option.value === props.value) {
      selectedOption = option;
    } else {
      otherOptions.push(option);
    }
  }

  return (
    <select {...props} onChange={({ target }) => setValue(target.value as T)}>
      <button>
        <div>
          {selectedOption?.text}
          <img src={caretDown} />
        </div>
        {/* 
          Render hidden options to set the width of the select element. The 
          text plus the caret are rendered so as to match the actual with of 
          the options displayed in the picker.
        */}
        {options.map((option) => {
          return (
            <span>
              {option.text}
              <img src={caretUp} />
            </span>
          );
        })}
      </button>
      {selectedOption && (
        <option value={selectedOption.value}>
          {selectedOption.text}
          <img src={caretUp} />
        </option>
      )}
      {otherOptions.map((option) => {
        return <option value={option.value}>{option.text}</option>;
      })}
    </select>
  );
}
