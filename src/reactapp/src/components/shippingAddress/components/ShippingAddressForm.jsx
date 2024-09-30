import React, { useState, useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { node } from 'prop-types';
import TextInput from '../../common/Form/TextInput';
import { __ } from '../../../i18n';
import useShippingAddressFormikContext from '../hooks/useShippingAddressFormikContext';
import NovaPoshtaCitySelect from './novaPoshta/NovaPoshtaCitySelect';
import NovaPoshtaStreetSelect from './novaPoshta/NovaPoshtaStreetSelect';
import NovaPoshtaWarehouseSelect from './novaPoshta/NovaPoshtaWarehouseSelect';
import NovaPoshtaAddressFieldSet from './novaPoshta/NovaPoshtaAddressFieldSet';
import TextInputPhoneMask from '../../common/Form/TextnputPhoneMask';
import useShippingAddressAppContext from '../hooks/useShippingAddressAppContext';
import useShippingAddressCartContext from '../hooks/useShippingAddressCartContext';
import useAddressSaveOnFieldChangeStatus from '../hooks/useAddressSaveOnFieldChangeStatus';
import InPostGeoWidgetForm from './inPost/InPostGeoWidgetForm';
import RootElement from '../../../utils/rootElement';
import InPostAddressFieldSet from './inPost/InPostAddressFieldSet';

function ShippingAddressForm({ children }) {
  const { fields, formikData, handleKeyDown } =
    useShippingAddressFormikContext();
  const {
    setAddressNeedToUpdate,
    isAddressNeedToUpdate,
    cartSelectedShippingMethod,
  } = useShippingAddressCartContext();

  const { isLoggedIn } = useShippingAddressAppContext();
  const { values, validateForm } = useFormikContext();
  const changeFieldStatusHandler = useAddressSaveOnFieldChangeStatus();

  let addressToSave = values?.shipping_address;
  addressToSave = { ...addressToSave, billingSameAsShipping: true };
  const emailForGuestCart = values?.login?.email;
  const newCustomerEmailValue = values?.shipping_address?.new_customer_email;
  if (isLoggedIn && emailForGuestCart && !newCustomerEmailValue) {
    addressToSave = { ...addressToSave, new_customer_email: emailForGuestCart };
  }

  const handleAddressFieldOnBlur = () => {
    setAddressNeedToUpdate(true);
  };

  const handleAddressFieldOnFocus = () => {
    setAddressNeedToUpdate(false);
  };

  const [addressFormSubmited, setAddressFormSubmited] = useState(false);

  useEffect(() => {
    if (!addressFormSubmited && values?.shipping_address?.phone && isLoggedIn) {
      setAddressNeedToUpdate(true);
      setAddressFormSubmited(true);
    }
    validateForm();
  }, [values]);

  const selectedShippingMethodMethodCode = useMemo(
    () => cartSelectedShippingMethod?.methodCode,
    [cartSelectedShippingMethod]
  );
  const selectedShippingMethodCarrierCode = useMemo(
    () => cartSelectedShippingMethod?.carrierCode,
    [cartSelectedShippingMethod]
  );

  useEffect(() => {
    if (isAddressNeedToUpdate) {
      changeFieldStatusHandler(addressToSave, 'blur');
    } else {
      changeFieldStatusHandler(addressToSave, 'focus');
    }
  }, [isAddressNeedToUpdate]);

  /*  =======================================================================================  */
  const [selectedCityId, setSelectedCityId] = useState('');
  const handleChangeCityId = (id) => {
    setSelectedCityId(id);
  };
  const customSelectStyles = {
    option: (provided, { isDisabled, isSelected }) => ({
      ...provided,
      fontSize: '13px',
      lineHeight: '13px',
      color: isDisabled ? '#000' : '',
      backgroundColor: isSelected ? 'rgb(222 235 255)' : 'rgb(255,255,255)',
      '&:hover': {
        backgroundColor: 'rgb(222 235 255)',
        cursor: 'pointer',
      },
    }),
    control: (provided) => ({
      ...provided,
      borderRadius: '5px',
      height: '22px',
      minHeight: 'none',
      boxShadow: '0px 0px 4px 0px #ccc inset',
    }),
    container: (provided) => ({
      ...provided,
      height: '22px',
      minHeight: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '24px',
      minHeight: 'none',
      borderLeft: 'none',
      marginTop: '-2px',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '20px',
      minHeight: 'none',
      padding: '0 0px',
      alignSelf: 'center',
      marginTop: '-4px',
    }),
    input: (provided) => ({
      ...provided,
      height: '20px',
      fontSize: '13px',
      lineHeight: '13px',
      outline: 'none',
      margin: '0',
      padding: '0',
      gridTemplateColumns: '0 auto',
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      return {
        ...provided,
        opacity,
        transition,
        height: '20px',
        fontSize: '13px',
        lineHeight: '20px',
        alighSelf: 'center',
        padding: '0',
      };
    },
    MenuList: (provided) => ({
      ...provided,
      overscrollBehavior: 'none',
    }),
  };

  return (
    <>
      <div className="">
        <TextInput
          name={fields.firstname}
          formikData={formikData}
          label={__('Name')}
          required={
            RootElement.getNameFieldsValidationRules()?.isFirstNameRequired
          }
          onKeyDown={handleKeyDown}
          onBlur={handleAddressFieldOnBlur}
          onFocus={handleAddressFieldOnFocus}
        />
        <TextInput
          name={fields.lastname}
          label={__('Lastname')}
          required={
            RootElement.getNameFieldsValidationRules()?.isLastNameRequired
          }
          formikData={formikData}
          onKeyDown={handleKeyDown}
          onBlur={handleAddressFieldOnBlur}
          onFocus={handleAddressFieldOnFocus}
        />
        <TextInputPhoneMask
          id="shipping_address.phone"
          required
          label={__('Phone (required)')}
          autoComplete="new-password"
          name={fields.phone}
          formikData={formikData}
          onKeyDown={handleKeyDown}
          onBlur={handleAddressFieldOnBlur}
          onFocus={handleAddressFieldOnFocus}
          type="tel"
        />
        <p className="text-gray-extralighter text-base mt-1">
          {__(
            'Our managers will call you back to clarify the details of the order'
          )}
        </p>
        {/* ADDITIONAL EMAIL FIELD FOR LOGGED IN CUSTOMERS  */}
        {isLoggedIn && (
          <div>
            <TextInput
              type="email"
              label={__('Email')}
              name={fields.new_customer_email}
              formikData={formikData}
              onKeyDown={handleKeyDown}
              onBlur={handleAddressFieldOnBlur}
              onFocus={handleAddressFieldOnFocus}
            />
            <p className="text-gray-extralighter text-base mt-1">
              {__('Here we will send all documents confirming the purchase')}
            </p>
          </div>
        )}
        {children}
        {/* TODO: refactoring hardcoded shippingMethod checks */}
        {/* Nova poshta fieldsets */}
        {selectedShippingMethodCarrierCode === 'novaposhta' && (
          <NovaPoshtaCitySelect
            formikData={formikData}
            name={fields.city}
            cityRefField={fields.city_ref}
            handleChangeCityId={handleChangeCityId}
            customStyles={customSelectStyles}
            onBlur={handleAddressFieldOnBlur}
            onFocus={handleAddressFieldOnFocus}
          />
        )}
        {selectedShippingMethodMethodCode === 'novaposhta_to_warehouse' && (
          <div className="pb-4">
            <NovaPoshtaWarehouseSelect
              selectedCityId={selectedCityId}
              formikData={formikData}
              name={`${fields.street}[0]`}
              postRefField={fields.warehouse_ref}
              customStyles={customSelectStyles}
              streetIdField={fields.street_ref}
              onBlur={handleAddressFieldOnBlur}
              onFocus={handleAddressFieldOnFocus}
            />
          </div>
        )}
        {selectedShippingMethodMethodCode === 'novaposhta_to_door' && (
          <div>
            <NovaPoshtaAddressFieldSet
              formikData={formikData}
              selectedCityId={selectedCityId}
              onBlur={handleAddressFieldOnBlur}
              onFocus={handleAddressFieldOnFocus}
            >
              <NovaPoshtaStreetSelect
                formikData={formikData}
                name={`${fields.street}[0]`}
                customStyles={customSelectStyles}
                cityId={selectedCityId}
                streetRefField={fields.street_ref}
                onBlur={handleAddressFieldOnBlur}
                onFocus={handleAddressFieldOnFocus}
              />
            </NovaPoshtaAddressFieldSet>
          </div>
        )}
        {/* ======================================================= */}

        {/* InPost fieldsets */}
        {selectedShippingMethodCarrierCode === 'inpostlocker' && (
          <InPostGeoWidgetForm
            formikData={formikData}
            updateAddressAction={handleAddressFieldOnBlur}
          />
        )}
        {selectedShippingMethodCarrierCode === 'inpostcourier' && (
          <div>
            <InPostAddressFieldSet
              formikData={formikData}
              onBlur={handleAddressFieldOnBlur}
              onFocus={handleAddressFieldOnFocus}
            />
          </div>
        )}
        {/* ======================================================= */}
      </div>
    </>
  );
}
ShippingAddressForm.propTypes = {
  children: node.isRequired,
};

export default ShippingAddressForm;
