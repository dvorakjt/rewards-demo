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

    function clearFiles() {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        setFileName(fileInputRef.current.files);
      }
    }

    function setFileName(files: FileList | null) {
      if (files && files.length > 0) {
        const fileName = files[0].name;
        setSelectedFile(fileName);
      } else {
        setSelectedFile('');
      }
    }

    return (
      <div className={styles.container}>
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
