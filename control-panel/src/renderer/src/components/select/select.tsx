import type { CSSProperties } from 'react';
import caretUp from '/src/assets/icons/caret-up.svg';
import caretDown from '/src/assets/icons/caret-down.svg';
import './styles.scss';

interface Option {
  text: string;
  value: string;
}

interface SelectProps {
  id: string;
  name: string;
  options: Option[];
  value: string;
  setValue: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * A customized select component that leverages the customizable select element.
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
export function Select({ setValue, options, ...props }: SelectProps) {
  let selectedOption: Option | null = null;
  const otherOptions: Option[] = [];

  for (const option of options) {
    if (option.value === props.value) {
      selectedOption = option;
    } else {
      otherOptions.push(option);
    }
  }

  return (
    <select {...props} onChange={({ target }) => setValue(target.value)}>
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
