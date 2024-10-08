import { useCallback, useEffect, useState } from 'react';

import {
  isCartAddressValid,
  billingSameAsShippingField,
  prepareFormAddressFromCartAddress,
} from '../../../utils/address';
import LocalStorage from '../../../utils/localStorage';
import useAddressWrapper from '../../address/hooks/useAddressWrapper';
import { _emptyFunc, _isObjEmpty, _makePromise } from '../../../utils';
import { BILLING_ADDR_FORM, SHIPPING_ADDR_FORM } from '../../../config';
import useShippingAddressAppContext from './useShippingAddressAppContext';
import useShippingAddressCartContext from './useShippingAddressCartContext';

/**
 * Saving default billing/shipping addresses into the quote if the quote
 * does not posses the address info when customer login
 */
export default function useFillDefaultAddresses(shippingContext) {
  const [isDefaultAddressSaved, setIsDefaultAddressSaved] = useState(false);
  const {
    setFieldValue,
    isBillingSame,
    setSelectedAddress,
    setCustomerAddressSelected,
  } = shippingContext;
  const {
    cartBillingAddress,
    cartShippingAddress,
    setCustomerAddressAsBillingAddress,
    setCustomerAddressAsShippingAddress,
  } = useShippingAddressCartContext();
  const {
    isLoggedIn,
    setPageLoader,
    customerAddressList,
    defaultBillingAddress,
    defaultShippingAddress,
  } = useShippingAddressAppContext();
  const { setBillingSelected, setIsBillingCustomerAddress } =
    useAddressWrapper();
  const cartHasBillingAddress = isCartAddressValid(cartBillingAddress);
  const cartHasShippingAddress = isCartAddressValid(cartShippingAddress);

  const setDefaultAddressesOnQuote = useCallback(async () => {
    let saveBillingPromise = _emptyFunc();
    let saveShippingPromise = _emptyFunc();
    let isShippingGoingToSave = false;
    let isBillingGoingToSave = false;
    const sameStatus =
      defaultShippingAddress && defaultBillingAddress
        ? defaultShippingAddress === defaultBillingAddress
        : isBillingSame;

    if (defaultShippingAddress) {
      if (!cartHasShippingAddress) {
        isShippingGoingToSave = true;
        saveShippingPromise = _makePromise(
          setCustomerAddressAsShippingAddress,
          defaultShippingAddress,
          sameStatus
        );
      }

      if (sameStatus && !cartHasBillingAddress) {
        isBillingGoingToSave = defaultBillingAddress;
        saveBillingPromise = _makePromise(
          setCustomerAddressAsBillingAddress,
          defaultShippingAddress,
          sameStatus
        );
      }
    }

    if (defaultBillingAddress && !cartHasBillingAddress) {
      isBillingGoingToSave = defaultBillingAddress;
      saveBillingPromise = _makePromise(
        setCustomerAddressAsBillingAddress,
        defaultBillingAddress,
        sameStatus
      );
    }

    try {
      setPageLoader(true);
      await saveBillingPromise();
      await saveShippingPromise();

      if (isBillingGoingToSave) {
        const formAddressToFill = prepareFormAddressFromCartAddress(
          customerAddressList[isBillingGoingToSave]
        );
        setFieldValue(BILLING_ADDR_FORM, formAddressToFill);
        setIsBillingCustomerAddress(true);
        setBillingSelected(isBillingGoingToSave);
        LocalStorage.saveCustomerBillingAddressId(isBillingGoingToSave);
      }
      if (isShippingGoingToSave) {
        const formAddressToFill = prepareFormAddressFromCartAddress(
          customerAddressList[defaultShippingAddress]
        );
        setFieldValue(SHIPPING_ADDR_FORM, formAddressToFill);
        setCustomerAddressSelected(true);
        setSelectedAddress(defaultShippingAddress);
        LocalStorage.saveCustomerShippingAddressId(defaultShippingAddress);
      }

      setFieldValue(billingSameAsShippingField, sameStatus);
      LocalStorage.saveBillingSameAsShipping(sameStatus);

      setPageLoader(false);
    } catch (error) {
      console.error(error);
      setPageLoader(false);
    }
  }, [
    setPageLoader,
    setFieldValue,
    isBillingSame,
    setBillingSelected,
    setSelectedAddress,
    customerAddressList,
    defaultBillingAddress,
    cartHasBillingAddress,
    defaultShippingAddress,
    setCustomerAddressSelected,
    setIsBillingCustomerAddress,
    setCustomerAddressAsBillingAddress,
    setCustomerAddressAsShippingAddress,
  ]);

  /**
   * Side effect that sets default billing/shipping address to the quote on the load if the address
   * are empty
   */
  useEffect(() => {
    if (
      !isLoggedIn ||
      isDefaultAddressSaved ||
      _isObjEmpty(customerAddressList)
    ) {
      return;
    }

    if (!defaultBillingAddress && !defaultShippingAddress) {
      return;
    }

    if (cartHasBillingAddress && cartHasShippingAddress) {
      return;
    }
    setIsDefaultAddressSaved(true);
    setDefaultAddressesOnQuote();
  }, [
    isLoggedIn,
    customerAddressList,
    cartShippingAddress,
    defaultBillingAddress,
    isDefaultAddressSaved,
    cartHasBillingAddress,
    cartHasShippingAddress,
    defaultShippingAddress,
    setDefaultAddressesOnQuote,
  ]);
}
