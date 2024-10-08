import React, { useContext } from 'react';
import { node } from 'prop-types';
import useFormValidateThenSubmit from '../../../hook/useFormValidateThenSubmit';
import OrderAdditionalsFormikContext from '../context/OrderAdditionalsFormikContext';
import TextInput from '../../common/Form/TextInput';
import { __ } from '../../../i18n';

function OrderAdditionalsForm({ children }) {
  const { fields, formId, formikData, submitHandler, handleKeyDown } =
    useContext(OrderAdditionalsFormikContext);

  const formSubmitHandler = useFormValidateThenSubmit({
    formId,
    formikData,
    submitHandler,
  });
  if (false) {
    formSubmitHandler();
  }

  return (
    <div className="px-4">
      <div>{children}</div>
      <TextInput
        name={fields.customer_notes}
        formikData={formikData}
        label={__('Comment to the order')}
        onKeyDown={handleKeyDown}
        placeholder=""
        as="textarea"
        className="h-28 py-2"
      />
    </div>
  );
}
OrderAdditionalsForm.propTypes = {
  children: node.isRequired,
};

export default OrderAdditionalsForm;
