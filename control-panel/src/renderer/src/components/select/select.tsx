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
        {/* Render hidden options to set the width of the select element. */}
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
