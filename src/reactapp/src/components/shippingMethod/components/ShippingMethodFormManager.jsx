import React from 'react';
import { node } from 'prop-types';
import { Form } from 'formik';
import { string as YupString } from 'yup';

import { __ } from '../../../i18n';
import { SHIPPING_METHOD } from '../../../config';
import useFormSection from '../../../hook/useFormSection';
import { formikDataShape } from '../../../utils/propTypes';
import ShippingMethodFormContext from '../context/ShippingMethodFormContext';
import useShippingMethodAppContext from '../hooks/useShippingMethodAppContext';
import useShippingMethodCartContext from '../hooks/useShippingMethodCartContext';

const initialValues = {
  methodCode: '',
  carrierCode: '',
};

const requiredMessage = __('Required');

const validationSchema = {
  methodCode: YupString().required(requiredMessage),
  carrierCode: YupString().required(requiredMessage),
};

function ShippingMethodFormManager({ children, formikData }) {
  const { setMessage, setPageLoader, setErrorMessage } =
    useShippingMethodAppContext();

  const { setShippingMethod } = useShippingMethodCartContext();

  const formSubmit = async (shippingMethod) => {
    setMessage(false);

    if (!shippingMethod.carrierCode || !shippingMethod.methodCode) {
      return;
    }

    try {
      setPageLoader(true);
      await setShippingMethod(shippingMethod);
      setPageLoader(false);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        __('Something went wrong while updating shipping method')
      );
      setPageLoader(false);
    }
  };

  /**
   * Side effect to reset shipping method formik state when the cart states
   * missing selected shipping method. This can happen when we update shipping
   * address which will eventually reset shipping method on quote.
   */
  // useEffect(() => {
  //   if (_isObjEmpty(selectedMethod)) {
  //     setFieldValue(SHIPPING_METHOD, { ...initialValues });
  //   }
  // }, [selectedMethod]);

  let context = useFormSection({
    formikData,
    initialValues,
    validationSchema,
    id: SHIPPING_METHOD,
    submitHandler: formSubmit,
  });

  context = { ...context, ...formikData, formikData };

  return (
    <ShippingMethodFormContext.Provider value={context}>
      <Form id={SHIPPING_METHOD}>{children}</Form>
    </ShippingMethodFormContext.Provider>
  );
}

ShippingMethodFormManager.propTypes = {
  children: node.isRequired,
  formikData: formikDataShape.isRequired,
};

export default ShippingMethodFormManager;
