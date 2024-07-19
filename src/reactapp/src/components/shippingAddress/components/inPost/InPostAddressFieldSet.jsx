import React from 'react';
import useShippingAddressFormikContext from '../../hooks/useShippingAddressFormikContext';
import { __ } from '../../../../i18n';
import { formikDataShape } from '../../../../utils/propTypes';
import TextInput from '../../../common/Form/TextInput';

function InPostAddressFieldSet({ formikData, ...rest }) {
  const { fields } = useShippingAddressFormikContext();
  const { onBlur, onFocus } = rest;
  const website = window.location.host.includes('angelprof')
    ? 'angelprof'
    : undefined;
  return (
    <div>
      <div className="w-full grow-1">
        <TextInput
          label={__('City')}
          name={fields.city}
          id="cityInPost"
          required={website === 'angelprof'}
          formikData={formikData}
          className="border-2 w-full form-input"
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>
      <div className="flex justify-between space-x-2 items-end -mt-1">
        <div className="w-full grow-1">
          <TextInput
            label={__('Street')}
            name={`${fields.street}[0]`}
            id="streetInPost"
            required={website === 'angelprof'}
            formikData={formikData}
            className="border-2 w-full form-input"
            onBlur={onBlur}
            onFocus={onFocus}
          />
        </div>
        <div className="basis-1/5 grow-1">
          <TextInput
            label={__('House')}
            name={`${fields.street}[1]`}
            id="houseNumberInpost"
            required={website === 'angelprof'}
            formikData={formikData}
            className="border-2 w-full form-input"
            onBlur={onBlur}
            onFocus={onFocus}
          />
        </div>
        <div className="basis-1/5 grow-1">
          <TextInput
            label={__('Apartment')}
            name={`${fields.street}[2]`}
            id="apartInPost"
            formikData={formikData}
            className="border-2 w-full form-input"
            onBlur={onBlur}
            onFocus={onFocus}
          />
        </div>
      </div>
      <div className="pb-3 -mt-1">
        <div className="w-full">
          <TextInput
            label={__('Zipcode')}
            name={fields.zipcode}
            id="zipcodeInPost"
            formikData={formikData}
            className="border-2 w-full form-input"
            onBlur={onBlur}
            onFocus={onFocus}
          />
        </div>
      </div>
    </div>
  );
}

InPostAddressFieldSet.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default InPostAddressFieldSet;
