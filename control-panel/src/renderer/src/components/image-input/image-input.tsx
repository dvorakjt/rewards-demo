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

/**
 * Props accepted by the {@link ImageInput} component.
 */
interface ImageInputProps {
  /**
   * The text that should be displayed in the label at the top of the component.
   */
  label: string;
  /**
   * The `name` attribute of the input element.
   */
  name: string;
  /**
   * The `id` attribute of the input element.
   */
  id: string;
  /**
   * Alt text to be displayed when the user has selected an image and the
   * component displays that image.
   */
  thumbnailAlt: string;
  /**
   * Applies an additional CSS class to the outer container rendered by the
   * component. Useful for applying margins.
   */
  containerClassName?: string;
  /**
   * Applies CSS styles to the outer container rendered by the component. Useful
   * for applying margins.
   */
  containerStyle?: CSSProperties;
}

/**
 * Renders a stylized input of type "file" which can accept image-type files.
 * The user can trigger the input either by clicking on the input area when
 * no file has been selected or dragging and dropping an image into this area.
 * When a file has been chosen, buttons are rendered for replacing and removing
 * the image, and the user can still drag and drop a new image into the input
 * area. Accepts a ref of type {@link HTMLInputElement}.
 *
 * @param props - {@link ImageInputProps}
 */
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

    /**
     * Determines whether or not the user can drop files they are currently
     * dragging. Only one file can be dropped and it must be an image.
     *
     * @param files - The {@link FileList} to evaluate.
     * @returns `true` if the user is permitted to drop the files they are
     * dragging, `false` otherwise.
     */
    function canDropFiles(files: FileList) {
      return files.length === 1 && files[0].type.startsWith('image/');
    }

    /**
     * Clears the current value of the input element and then calls
     * `displayThumbnail` with the updated {@link FileList} to reset `imageSrc`.
     */
    function deleteImage() {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        displayThumbnail(fileInputRef.current.files);
      }
    }

    /**
     * Clears the event listener associated with the current {@link FileReader}
     * instance (if one exists) and instantiates a new {@link FileReader} whose
     * `onload` function instructs the component to display the image the user
     * has selected or no image if none has been selected.
     *
     * @param files
     */
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
