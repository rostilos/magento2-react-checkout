import React, { useEffect, useMemo } from 'react';
import _get from 'lodash.get';
import { Form, useFormikContext } from 'formik';
import { node } from 'prop-types';
import { string as YupString, bool as YupBool } from 'yup';

import { __ } from '../../../i18n';
import { LOGIN_FORM } from '../../../config';
import useFormSection from '../../../hook/useFormSection';
import LoginFormContext from '../context/LoginFormContext';
import { formikDataShape } from '../../../utils/propTypes';
import useFormEditMode from '../../../hook/useFormEditMode';
import useLoginAppContext from '../hooks/useLoginAppContext';
import useLoginCartContext from '../hooks/useLoginCartContext';
import useEnterActionInForm from '../../../hook/useEnterActionInForm';

const initialValues = {
  email: '',
  password: '',
  customerWantsToSignIn: false,
};
const requiredMessage = __('%1 - required field');

/* Временно добавлена валидация на поле с эмейлом для вывода для вывода ошибки, т.к. сообщение об ошибке
   при не установленном емейле, которое выводилось вверху страницы, сейчас не выводится */
const validationSchema = {
  customerWantsToSignIn: YupBool(),
  email: YupString().nullable(),
  password: YupString().test(
    'requiredIfSignIn',
    __('Password is required'),
    (value, context) => {
      const sigInStatus = _get(context, 'parent.customerWantsToSignIn');

      if (sigInStatus) {
        return !!value;
      }

      return true;
    }
  ),
};

const przelewy24Mehods = ['przelewy24', 'przelewy24_card'];

function LoginFormManager({ children, formikData }) {
  const {
    ajaxLogin,
    setMessage,
    setPageLoader,
    setErrorMessage,
    setSuccessMessage,
    isLoggedIn,
  } = useLoginAppContext();
  const {
    cartEmail,
    setEmailOnGuestCart,
    selectedPaymentMethodCode: cartPaymentMethod,
  } = useLoginCartContext();
  const { editMode, setFormToEditMode, setFormToViewMode } = useFormEditMode();
  const { values } = useFormikContext();
  const { loginFormValues, setFieldTouched } = formikData;

  const selectedPaymentMethod = useMemo(
    () => values?.payment_method?.code,
    [values]
  );

  useEffect(() => {
    const isPrzelewy24Selected = przelewy24Mehods.some(
      (method) =>
        method === cartPaymentMethod || method === selectedPaymentMethod
    );

    if (isPrzelewy24Selected && !isLoggedIn) {
      validationSchema.email = YupString()
        .email(__('Email is invalid'))
        .required(requiredMessage);
    }
  }, [cartPaymentMethod, selectedPaymentMethod]);

  /**
   * Sign-in submit is handled here
   *
   * If user choose to continue as guest user, then attach the email address
   * provided to the cart.
   *
   * If user choose to login and proceed, then sign-in the user, then retrieve
   * customer cart details, then finally, merge the guest cart with the customer
   * cart.
   */
  const formSubmit = async () => {
    setMessage(false);

    const email = _get(loginFormValues, 'email');
    const password = _get(loginFormValues, 'password');
    const customerWantsToSignIn = _get(
      loginFormValues,
      'customerWantsToSignIn'
    );

    try {
      setPageLoader(true);

      if (!customerWantsToSignIn) {
        await setEmailOnGuestCart(email);
        setSuccessMessage(__('Email address is saved.'));
        setFormToViewMode();
        setFieldTouched(`${LOGIN_FORM}.email`, false);
        setPageLoader(false);
        return;
      }

      const loginData = await ajaxLogin({ username: email, password });

      if (loginData.errors) {
        setErrorMessage(__(loginData.message || 'Login failed.'));
      }
      setPageLoader(false);
    } catch (error) {
      setPageLoader(false);
      console.error(error);
    }
  };

  const handleKeyDown = useEnterActionInForm({
    formikData,
    validationSchema,
    submitHandler: formSubmit,
  });

  const formSectionContext = useFormSection({
    formikData,
    initialValues,
    id: LOGIN_FORM,
    validationSchema,
    submitHandler: formSubmit,
  });

  useEffect(() => {
    if (cartEmail) {
      setFormToViewMode();
    }
  }, [cartEmail, setFormToViewMode]);

  const context = {
    ...formikData,
    ...formSectionContext,
    editMode,
    formikData,
    handleKeyDown,
    setFormToEditMode,
  };

  return (
    <LoginFormContext.Provider value={context}>
      <Form id={LOGIN_FORM}>{children}</Form>
    </LoginFormContext.Provider>
  );
}

LoginFormManager.propTypes = {
  children: node.isRequired,
  formikData: formikDataShape.isRequired,
};

export default LoginFormManager;
