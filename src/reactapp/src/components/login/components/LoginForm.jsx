import React from 'react';
import _get from 'lodash.get';

// import Button from '../../common/Button';
import TextInput from '../../common/Form/TextInput';
import { __ } from '../../../i18n';
import useLoginFormContext from '../hooks/useLoginFormContext';
// import useFormValidateThenSubmit from '../../../hook/useFormValidateThenSubmit';

function LoginForm() {
  const {
    fields,
    // formId,
    // editMode,
    formikData,
    // submitHandler,
    handleKeyDown,
    loginFormValues,
    // validationSchema,
    // formSectionTouched,
  } = useLoginFormContext();
  const customerWantsToSignIn = _get(loginFormValues, 'customerWantsToSignIn');
  // const isLoginFormTouched = _get(formSectionTouched, 'email') || false;
  // const handleButtonClick = useFormValidateThenSubmit({
  //   formId,
  //   formikData,
  //   submitHandler,
  //   validationSchema,
  // });

  // if (!editMode) {
  //   return <></>;
  // }

  return (
    <>
      <div>
        <TextInput
          type="email"
          label={__('Email')}
          name={fields.email}
          formikData={formikData}
          onKeyDown={handleKeyDown}
        />
        <p className="text-gray-extralighter text-base mt-1">
          {__('Here we will send all documents confirming the purchase')}
        </p>

        {customerWantsToSignIn && (
          <div>
            <TextInput
              type="password"
              autoComplete="on"
              label={__('Password')}
              name={fields.password}
              formikData={formikData}
              onKeyDown={handleKeyDown}
              placeholder={__('Password')}
            />
          </div>
        )}
      </div>
      {/* <div className="flex items-center justify-center">
        <Button
          variant="primary"
          click={handleButtonClick}
          disable={!isLoginFormTouched}
        >
          {customerWantsToSignIn ? __('Sign In') : __('Update')}
        </Button>
      </div> */}
    </>
  );
}

export default LoginForm;
