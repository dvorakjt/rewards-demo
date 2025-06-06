import {
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
  type MouseEventHandler,
  type DragEventHandler,
  type CSSProperties
} from 'react';
import uploadImage from '/src/assets/icons/upload-image.png';
import deleteIcon from '/src/assets/icons/delete.png';
import editIcon from '/src/assets/icons/edit.png';
import styles from './styles.module.scss';

interface ImageInputProps {
  label: string;
  name: string;
  id: string;
  thumbnailAlt: string;
  containerClassName?: string;
  containerStyle?: CSSProperties;
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  function ImageInput(
    { label, name, id, thumbnailAlt, containerClassName, containerStyle },
    ref
  ) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => fileInputRef.current!);
    const fileReaderRef = useRef<FileReader | null>(null);
    const [imageSrc, setImageSrc] = useState('');

    const triggerFileInputClick: MouseEventHandler<HTMLButtonElement> = () => {
      fileInputRef.current?.click();
    };

    const onDragOver: DragEventHandler = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };

    const onDrop: DragEventHandler = (e) => {
      e.preventDefault();
      if (canDropFiles(e.dataTransfer.files)) {
        fileInputRef.current!.files = e.dataTransfer.files;
        displayThumbnail(fileInputRef.current!.files);
      }
    };

    function canDropFiles(files: FileList) {
      return files.length === 1 && files[0].type.startsWith('image/');
    }

    function deleteImage() {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        displayThumbnail(fileInputRef.current.files);
      }
    }

    function displayThumbnail(files: FileList | null) {
      if (fileReaderRef.current) {
        fileReaderRef.current.onload = null;
      }
      if (!files?.length) {
        setImageSrc('');
      } else {
        const image = files[0];
        fileReaderRef.current = new FileReader();
        fileReaderRef.current.onload = (e) => {
          setImageSrc(e.target!.result!.toString());
        };
        fileReaderRef.current.readAsDataURL(image);
      }
    }

    let className = styles.container;
    if (containerClassName) {
      className += ' ' + containerClassName;
    }

    return (
      <div className={className} style={containerStyle}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <input
          id={id}
          name={name}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={({ target }) => {
            const { files } = target;
            displayThumbnail(files);
          }}
          hidden
        />
        <div
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={styles.drop_zone}
        >
          {imageSrc ? (
            <div className={styles.image_container}>
              <img src={imageSrc} alt={thumbnailAlt} className={styles.image} />
              <div className={styles.edit_image_buttons}>
                <button
                  type="button"
                  onClick={deleteImage}
                  className={styles.edit_image_button}
                >
                  <img
                    src={deleteIcon}
                    alt="Delete image"
                    className={styles.edit_image_icon}
                  />
                </button>
                <button
                  type="button"
                  onClick={triggerFileInputClick}
                  className={styles.edit_image_button}
                >
                  <img
                    src={editIcon}
                    alt="Replace image"
                    className={styles.edit_image_icon}
                  />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={styles.no_image_uploaded}
              onClick={triggerFileInputClick}
            >
              <img src={uploadImage} width="40px" height="auto" />
              <p className={styles.instructions}>
                <span className={styles.bold}>Upload Image</span>
                <br />
                or
                <br />
                <span className={styles.bold}>Drop a File</span>
              </p>
            </button>
          )}
        </div>
      </div>
    );
  }
);
