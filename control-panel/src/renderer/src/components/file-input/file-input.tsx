import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  type ChangeEventHandler,
  type InputHTMLAttributes
} from 'react';
import { Button } from '../button';
import fileIcon from '/src/assets/icons/file.png';
import deleteIcon from '/src/assets/icons/delete.png';
import styles from './styles.module.scss';

type FileInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'multiple'
>;

/**
 * Renders a stylized input element of type "file" with a button that controls
 * the input. The component accepts all of the props that an input of type
 * "file" might receive, with the exception of `multiple`, and forwards them to
 * the input. Can also accept a ref of type {@link HTMLInputElement}.
 *
 * @param props - {@link FileInputProps}
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  function FileInput({ className, style, ...props }, ref) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => fileInputRef.current!);
    const [selectedFile, setSelectedFile] = useState('');

    function triggerFileInputClick() {
      fileInputRef.current?.click();
    }

    const onChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
      setFileName(target.files);
    };

    /**
     * Clears the files from the input by setting the value of the input to an
     * empty string, then calls `setFileName` with the updated file list in
     * order to clear the file name displayed to the user.
     */
    function clearFiles() {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        setFileName(fileInputRef.current.files);
      }
    }

    /**
     * Accepts a {@link FileList} or `null` and, if the list is not null and
     * contains items, sets `selectedFile` to the name of the first file in the
     * list, which should be the only file in the list since the input does not
     * accept the `multiple` attribute. Otherwise, sets `selectedFile` to an
     * empty string.
     *
     * @param files - An instance of {@link FileList} or `null`.
     */
    function setFileName(files: FileList | null) {
      if (files && files.length > 0) {
        const fileName = files[0].name;
        setSelectedFile(fileName);
      } else {
        setSelectedFile('');
      }
    }

    let containerClassName = styles.container;
    if (className) {
      containerClassName += ' ' + className;
    }

    return (
      <div className={containerClassName}>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={onChange}
          {...props}
        />
        <Button
          type="button"
          onClick={triggerFileInputClick}
          variant="solid-yellow"
          className={styles.file_picker_button}
        >
          Choose File
        </Button>
        {selectedFile && (
          <div className={styles.selected_file}>
            <img src={fileIcon} alt="" className={styles.file_icon} />
            <div className={styles.selected_file_name}>{selectedFile}</div>
            <button
              type="button"
              onClick={clearFiles}
              className={styles.delete_button}
            >
              <img
                src={deleteIcon}
                alt="Clear file"
                className={styles.delete_icon}
              />
            </button>
          </div>
        )}
      </div>
    );
  }
);
