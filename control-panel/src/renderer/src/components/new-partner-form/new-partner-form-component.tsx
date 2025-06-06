import { useContext } from 'react';
import { useForm, useValue, usePipe } from 'fully-formed';
import { PartnersContext } from '@renderer/contexts/partners-context/partners-context';
import { NewPartnerForm } from './new-partner-form';
import { InputGroup } from '../input-group';
import { ImageInput } from '../image-input';
import { Label } from '../label';
import { TextArea } from '../textarea/textarea';
import { Messages } from '../messages';
import styles from './styles.module.scss';

export function NewPartnerFormComponent() {
  const { partners } = useContext(PartnersContext)!;
  const form = useForm(new NewPartnerForm(partners));
  const partnerName = useValue(form.fields.name);
  const logoAltText = `${partnerName || 'Partner'} Logo`;
  const hideDescriptionMessages = usePipe(form.fields.description, (state) => {
    return !(state.hasBeenModified || state.hasBeenBlurred || state.submitted);
  });

  return (
    <form className={styles.form}>
      <InputGroup
        type="text"
        field={form.fields.name}
        labelContent="Name *"
        labelVariant="floating"
        containerClassName={styles.input_group}
      />
      <InputGroup
        type="text"
        field={form.fields.id}
        labelContent="Partner ID *"
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
      />
      <Label field={form.fields.description} variant="floating">
        Description*
      </Label>
      <TextArea field={form.fields.description} />
      <Messages
        messageBearers={[form.fields.description]}
        hideMessages={hideDescriptionMessages}
        containerClassName={styles.messages}
      />
      <InputGroup
        type="text"
        field={form.fields.website}
        labelContent="Website"
        labelVariant="floating"
        containerClassName={styles.input_group}
      />
    </form>
  );
}
