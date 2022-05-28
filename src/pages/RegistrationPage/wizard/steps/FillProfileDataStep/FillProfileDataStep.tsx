import React from 'react';

import { Spacing } from '@common';
import { Button } from '@common/buttons';
import { DateInput, Input } from '@common/fields';
import { IntlText, useIntl, useMutation } from '@features';
import { changeUser } from '@utils/api';
import { useStore } from '@utils/contextes';
import { validateIsEmpty } from '@utils/helpers';
import { useForm } from '@utils/hooks';

import { RegistrationWizardContainer } from '../../RegistrationWizardContainer/RegistrationWizardContainer';

import { FillProfilePanelData } from './FillProfilePanelData/FillProfilePanelData';

import styles from '../../../RegistrationPage.module.css';

const fillProfileDataStepValidateSchema = {
  name: (value: string) => validateIsEmpty(value),
  registrationAddress: (value: string) => validateIsEmpty(value)
};

interface FillProfileDataStepValues {
  name: string;
  registrationAddress: string;
  birthDate: Date;
}

interface FillProfileDataStepProps {
  initialData: FillProfileData;
  nextStep: (fillProfileData: FillProfileData) => void;
}

export const FillProfileDataStep: React.FC<FillProfileDataStepProps> = ({
  initialData,
  nextStep
}) => {
  const intl = useIntl();
  const [focusedField, setFocuseField] = React.useState<'name' | 'registrationAddress' | null>(
    null
  );

  const { mutationAsync: changeUserMutation, isLoading: changeUserLoading } = useMutation(
    'changeUser',
    (params: UsersReqPatchParams) => changeUser({ params })
  );

  const { values, errors, setFieldValue, handleSubmit } = useForm<FillProfileDataStepValues>({
    intialValues: { ...initialData, birthDate: new Date(initialData.birthDate) },
    validateSchema: fillProfileDataStepValidateSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      // if (!user?.id) return;

      // const changeUserMutationParams: UsersReqPatchParams = {
      //   ...values,
      //   id: user.id,
      //   birthDate: values.birthDate.getTime()
      // };
      // const response = await changeUserMutation(changeUserMutationParams);

      // if (!response.success) {
      //   return;
      // }

      // setStore({ user: response.data });
      nextStep({ ...values, birthDate: values.birthDate.getTime() });
    }
  });

  return (
    <RegistrationWizardContainer
      activeStep={1}
      panel={{
        ...(focusedField && { data: <FillProfilePanelData focusedField={focusedField} /> }),
        footer: (
          <div
            role='link'
            tabIndex={0}
            aria-hidden
            onClick={() => nextStep({ ...values, birthDate: values.birthDate.getTime() })}
          >
            <IntlText path='page.registration.skipAndFillInLater' />
          </div>
        )
      }}
      form={{
        title: <IntlText path='page.registration.step.fillProfileData.title' />,
        content: (
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <Input
              disabled={changeUserLoading}
              value={values.name}
              label={intl.translateMessage('field.input.name.label')}
              onFocus={() => setFocuseField('name')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const username = event.target.value;
                setFieldValue('name', username);
              }}
              {...(!!errors &&
                !!errors.name && {
                  isError: !!errors.name,
                  helperText: errors.name
                })}
            />
            <Spacing spacing={15} />

            <Input
              disabled={changeUserLoading}
              value={values.registrationAddress}
              label={intl.translateMessage('field.input.registrationAddress.label')}
              onFocus={() => setFocuseField('registrationAddress')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const password = event.target.value;
                setFieldValue('registrationAddress', password);
              }}
              {...(!!errors &&
                !!errors.registrationAddress && {
                  isError: !!errors.registrationAddress,
                  helperText: errors.registrationAddress
                })}
            />
            <Spacing spacing={15} />

            <DateInput
              locale={intl.locale}
              disabled={changeUserLoading}
              value={values.birthDate}
              label={intl.translateMessage('field.input.birthDate.label')}
              onFocus={() => setFocuseField(null)}
              onChange={(date) => {
                setFieldValue('birthDate', date);
              }}
              {...(!!errors &&
                !!errors.birthDate && {
                  isError: !!errors.birthDate,
                  helperText: errors.birthDate
                })}
            />
            <Spacing spacing={15} />
            <Button type='submit' isLoading={changeUserLoading}>
              <IntlText path='button.next' />
            </Button>
          </form>
        )
      }}
    />
  );
};
