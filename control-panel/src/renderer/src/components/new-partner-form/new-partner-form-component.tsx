import {
  useContext,
  useState,
  useRef,
  useEffect,
  type FormEventHandler
} from 'react';
import { useForm, useValue, usePipe, ValidityUtils } from 'fully-formed';
import { PartnersContext } from '@renderer/contexts/partners-context';
import { NewPartnerForm } from './new-partner-form';
import { InputGroup } from '../input-group';
import { ImageInput } from '../image-input';
import { Label } from '../label';
import { TextArea } from '../textarea';
import { Messages } from '../messages';
import { FileInput } from '../file-input';
import { Button } from '../button';
import styles from './styles.module.scss';

export function NewPartnerFormComponent() {
  const { partners } = useContext(PartnersContext)!;
  const form = useForm(new NewPartnerForm(partners));
  const partnerName = useValue(form.fields.name);
  const logoAltText = `${partnerName || 'Partner'} Logo`;
  const hideDescriptionMessages = usePipe(form.fields.description, (state) => {
    return !(state.hasBeenModified || state.hasBeenBlurred || state.submitted);
  });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const locationsInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState('');

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setLogoError('');
    form.setSubmitted();

    const hasLogo =
      !!logoInputRef.current?.files && !!logoInputRef.current.files[0];
    if (!hasLogo) {
      setLogoError('Please upload a logo.');
    }

    const isValid = ValidityUtils.isValid(form) && hasLogo;
    if (!isValid) {
      // focus on first invalid input
      return;
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <InputGroup
        type="text"
        field={form.fields.name}
        labelContent="Name*"
        labelVariant="floating"
        containerClassName={styles.input_group}
      />
      <InputGroup
        type="text"
        field={form.fields.id}
        labelContent="Partner ID*"
        labelVariant="floating"
        allowedCharacters={/^[a-z0-9\-_]*$/}
        containerClassName={styles.input_group}
      />
      <ImageInput
        id="logo"
        name="logo"
        label="Logo*"
        thumbnailAlt={logoAltText}
        containerClassName={styles.logo_input}
        ref={logoInputRef}
      />
      <div className={styles.logo_error}>{logoError}</div>
      <Label field={form.fields.description} variant="floating">
        Description*
      </Label>
      <TextArea field={form.fields.description} />
      <div className={styles.messages}>
        <Messages
          messageBearers={[form.fields.description]}
          hideMessages={hideDescriptionMessages}
          containerClassName={styles.messages}
        />
      </div>
      <InputGroup
        type="text"
        field={form.fields.website}
        labelContent="Website"
        labelVariant="floating"
        containerClassName={styles.input_group}
      />
      <label htmlFor="locations" className={styles.label}>
        Locations
      </label>
      <FileInput
        name="locations"
        id="locations"
        className={styles.file_input}
        ref={locationsInputRef}
      />
      <div className={styles.save_and_cancel_buttons}>
        <Button type="button" variant="gradient-text">
          Cancel
        </Button>
        <Button type="submit" variant="gradient">
          Save
        </Button>
      </div>
    </form>
  );
}
