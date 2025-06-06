import { useContext } from 'react';
import { PartnersContext } from '@renderer/contexts/partners-context/partners-context';
import { useForm, useValue } from 'fully-formed';
import { NewPartnerForm } from './new-partner-form';
import { InputGroup } from '../input-group';
import { ImageInput } from '../image-input';
import styles from './styles.module.scss';

export function NewPartnerFormComponent() {
  const { partners } = useContext(PartnersContext)!;
  const form = useForm(new NewPartnerForm(partners));
  const partnerName = useValue(form.fields.name);
  const logoAltText = `${partnerName || 'Partner'} Logo`;

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
