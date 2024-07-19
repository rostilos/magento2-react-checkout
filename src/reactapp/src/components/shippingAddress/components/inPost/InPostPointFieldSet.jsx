import React from 'react';
import { bool } from 'prop-types';
import useShippingAddressFormikContext from '../../hooks/useShippingAddressFormikContext';
import { __ } from '../../../../i18n';
import { formikDataShape } from '../../../../utils/propTypes';
import InPostTextInput from './InPostTextInput';

function InPostPointFieldSet({ formikData, isPointSelected }) {
  const { fields, shippingValues } = useShippingAddressFormikContext();
  const website = window.location.host.includes('angelprof')
    ? 'angelprof'
    : undefined;
  if (!isPointSelected) {
    return (
      <div className="-mt-1 border-container-lightner border-2 mb-2 border-t-0 p-1">
        <p className="text-gray my-2 text-base">
          {__('Point is not selected')}
        </p>
        <InPostTextInput
          name={fields.city}
          id="location_city"
          required={website === 'angelprof'}
          formikData={formikData}
          className="border-0 p-0 m-0 text-base  mb-0.5 w-full"
          type="hidden"
        />
        <InPostTextInput
          name={`${fields.street}[0]`}
          id="line1"
          required={website === 'angelprof'}
          formikData={formikData}
          className="border-0 p-0 m-0 text-base  mb-0.5 w-full"
          type="hidden"
        />
        <InPostTextInput
          name={fields.zipcode}
          id="location_postcode"
          formikData={formikData}
          className="border-0 p-0 m-0 text-base  mb-0.5 w-full"
          type="hidden"
        />
      </div>
    );
  }
  return (
    <div className="-mt-1 border-container-lightner border-2 mb-2 border-t-0 p-1">
      <InPostTextInput
        name={fields.city}
        id="location_city"
        formikData={formikData}
        className="border-0 p-0 m-0 text-base  mb-0.5 w-full"
        type="hidden"
      />
      <InPostTextInput
        name={`${fields.street}[0]`}
        id="line1"
        formikData={formikData}
        className="border-0 p-0 m-0 text-base  mb-0.5 w-full"
        type="hidden"
      />
      <InPostTextInput
        name={fields.zipcode}
        id="location_postcode"
        formikData={formikData}
        className="border-0 p-0 m-0 text-base  mb-0.5 w-full"
        type="hidden"
      />
      <p className="text-gray my-2 text-base">{__('Selected Point:')}</p>
      <ul>
        <li className="relative pl-4 flex flex-wrap content-center align-center mb-0 w-full">
          <span className="absolute left-1 top-2 w-1 h-1 bg-old_green-main flex" />
          <p className="text-base  mb-2 w-full">{shippingValues.city}</p>
        </li>
        <li className="relative pl-4 flex flex-wrap content-center align-center mb-0 w-full">
          <span className="absolute left-1 top-2 w-1 h-1 bg-old_green-main flex" />
          <p className="text-base  mb-2 w-full">{shippingValues.street[0]}</p>
        </li>
        <li className="relative pl-4 flex flex-wrap content-center align-center mb-0 w-full">
          <span className="absolute left-1 top-2 w-1 h-1 bg-old_green-main flex" />
          <p className="text-base  mb-2 w-full">{shippingValues.zipcode}</p>
        </li>
      </ul>
    </div>
  );
}

InPostPointFieldSet.propTypes = {
  formikData: formikDataShape.isRequired,
  isPointSelected: bool,
};
InPostPointFieldSet.defaultProps = {
  isPointSelected: false,
};

export default InPostPointFieldSet;
