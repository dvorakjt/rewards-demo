import {
  FormTemplate,
  Field,
  ControlledField,
  FormFactory,
  StringValidators,
  Validity,
  Adapter,
  type NonTransientField,
  type TransientField,
  type IValidator,
  type IAdapter
} from 'fully-formed';
import { generateSuggestedId } from '@renderer/util/generate-suggested-id';
import type { Partner } from '@renderer/model/partner';

type NewPartnerFormFields = [
  NonTransientField<'name', string>,
  NonTransientField<'id', string>,
  NonTransientField<'description', string>,
  TransientField<'website', string>,
  NonTransientField<'createWorkflow', boolean>
];

type NewPartnerFormAdapters = [IAdapter<'website', string>];

class NewPartnerTemplate extends FormTemplate {
  public fields: NewPartnerFormFields;
  public adapters: NewPartnerFormAdapters;
  public autoTrim = true;

  constructor(existingPartners: Partner[]) {
    super();

    const name = new Field({
      name: 'name',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Name is required.',
          trimBeforeValidation: true
        })
      ]
    });

    const existingPartnerNames = new Set(existingPartners.map((p) => p.name));

    class PartnerIDValidator implements IValidator<string> {
      validate(value: string) {
        if (!value.trim()) {
          return {
            validity: Validity.Invalid,
            message: {
              text: 'ID is required.',
              validity: Validity.Invalid
            }
          };
        }

        if (existingPartnerNames.has(value)) {
          return {
            validity: Validity.Invalid,
            message: {
              text: 'ID is already in use.',
              validity: Validity.Invalid
            }
          };
        }

        return {
          validity: Validity.Valid
        };
      }
    }

    class URLValidator implements IValidator<string> {
      validate(value: string) {
        {
          value = value.trim();
          if (!value) {
            return {
              validity: Validity.Valid
            };
          }

          try {
            new URL(value);
            return {
              validity: Validity.Valid
            };
          } catch (e) {
            return {
              validity: Validity.Invalid,
              message: {
                text: 'Please enter a valid url.',
                validity: Validity.Invalid
              }
            };
          }
        }
      }
    }

    const website = new Field({
      name: 'website',
      defaultValue: '',
      validators: [new URLValidator()],
      transient: true
    });

    this.fields = [
      name,
      new ControlledField({
        name: 'id',
        controller: name,
        initFn: ({ value }) => {
          return generateSuggestedId(value, existingPartnerNames);
        },
        controlFn: ({ value, didPropertyChange }) => {
          if (!didPropertyChange('value')) return;
          return generateSuggestedId(value, existingPartnerNames);
        },
        validators: [new PartnerIDValidator()]
      }),
      new Field({
        name: 'description',
        defaultValue: '',
        validators: [
          StringValidators.required({
            invalidMessage: 'Description is required.',
            trimBeforeValidation: true
          })
        ]
      }),
      website,
      new Field({
        name: 'createWorkflow',
        defaultValue: false
      })
    ];

    this.adapters = [
      new Adapter({
        name: 'website',
        source: website,
        adaptFn: ({ value, validity }) => {
          if (validity !== Validity.Valid) return '';
          return new URL(value).toString();
        }
      })
    ];
  }
}

export const NewPartnerForm = FormFactory.createForm(NewPartnerTemplate);
