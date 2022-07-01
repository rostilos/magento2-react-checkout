import React, { useEffect, useState } from 'react';

import Login from '../login';
import Totals from '../totals';
import CartItemsForm from '../items';
import PlaceOrder from '../placeOrder';
import PageLoader from '../common/Loader';
import { AddressWrapper } from '../address';
import PaymentMethod from '../paymentMethod';
import ShippingAddress from '../shippingAddress';
import ShippingMethodsForm from '../shippingMethod';
import StickyRightSidebar from '../StickyRightSidebar';
import CheckoutAgreements from '../checkoutAgreements';
import CheckoutFormWrapper from './CheckoutFormWrapper';
import CustomerNotes from '../shippingAddress/components/customerNotes/CustomerNotes';
import { aggregatedQueryRequest, fetchCmsPagesRequest } from '../../api';
import useCheckoutFormAppContext from './hooks/useCheckoutFormAppContext';
import useCheckoutFormCartContext from './hooks/useCheckoutFormCartContext';
import { __ } from '../../i18n';
import LiqPayWidget from '../LiqPayWidget/LiqPayWidget';
import CmsContent from '../cmsPages/CmsContent';

function CheckoutForm() {
  const [initialData, setInitialData] = useState(false);
  const [cmsPagesContent, setCmsPagesContent] = useState(null);
  const { pageLoader, appDispatch, setPageLoader, storeAggregatedAppStates } =
    useCheckoutFormAppContext();

  const { orderId, storeAggregatedCartStates } = useCheckoutFormCartContext();

  const cmsPagesIds = [
    'pravyj-sajdbar-chekauta',
    'kontent-popapa-oplata',
    'kontent-popapa-dostavka',
  ];
  /**
   * Collect App, Cart data when the page loads.
   */
  useEffect(() => {
    (async () => {
      try {
        setPageLoader(true);
        const data = await aggregatedQueryRequest(appDispatch);
        const loadedCmsPagesContent = await fetchCmsPagesRequest(cmsPagesIds);
        setCmsPagesContent(loadedCmsPagesContent);
        await storeAggregatedCartStates(data);
        await storeAggregatedAppStates(data);
        setInitialData(data);
        setPageLoader(false);
      } catch (error) {
        setPageLoader(false);
      }
    })();
  }, [
    appDispatch,
    setPageLoader,
    storeAggregatedAppStates,
    storeAggregatedCartStates,
  ]);

  return (
    <CheckoutFormWrapper initialData={initialData}>
      <div className="flex justify-center">
        <div className="container w-full mx-auto py-0 sm:py-2 md:py-5 px-0">
          <div className="hidden md:grid grid-cols-2 gap-x-6 checkout-wrapper">
            <p className="text-xxlg ">
              {__('Checkout')}
              <p className="text-xxs text-red-500 mt-0.5">
                {__('Required fields are marked with an asterisk *')}
              </p>
            </p>
            <p className="text-xxlg md:ml-2 lg:ml-4">{__('Your order')}</p>
          </div>

          <div className="flex flex-col my-3 space-y-2 md:flex-row md:space-y-0 px-0 sm:px-4 md:px-0 ">
            <div className="checkout-wrapper order-1 md:hidden ">
              <p className="text-xxlg ">{__('Your order')}</p>
            </div>

            <div className="checkout-wrapper mt-8 md:mt-0 w-full md:order-2 order-4 md:w-1/2 grow-0 md:mr-4 lg:mr-8">
              <div className="w-full xl:max-w-full border border-container py-3.5">
                <AddressWrapper>
                  <ShippingAddress>
                    <Login />
                    <ShippingMethodsForm
                      cmsHtmlContent={cmsPagesContent?.cmsDeliveryPopup}
                    />
                  </ShippingAddress>

                  <PaymentMethod
                    cmsHtmlContent={cmsPagesContent?.cmsPaymentPopup}
                  />
                  <CustomerNotes />
                  <PlaceOrder />
                </AddressWrapper>
              </div>
            </div>

            <div className="checkout-wrapper order-3">
              <p className="text-xxlg  md:hidden mt-5">
                {__('Checkout')}
                <p className="text-xxs text-red-500 mt-0.5">
                  {__('Required fields are marked with an asterisk *')}
                </p>
              </p>
            </div>

            <StickyRightSidebar>
              <div className="border border-container checkout-wrapper">
                <CartItemsForm />
                <Totals />
                <CheckoutAgreements />
              </div>
              <CmsContent cmsHtmlContent={cmsPagesContent?.cmsRightSidebar} />
            </StickyRightSidebar>
          </div>
          {pageLoader && <PageLoader />}
        </div>
      </div>
      <LiqPayWidget orderId={orderId} />
    </CheckoutFormWrapper>
  );
}

export default CheckoutForm;
