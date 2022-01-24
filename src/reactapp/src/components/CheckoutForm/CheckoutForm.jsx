import React, { useEffect, useState } from 'react';

import Login from '../login';
import Totals from '../totals';
import CartItemsForm from '../items';
import PlaceOrder from '../placeOrder';
// import CouponCode from '../couponCode';
import Message from '../common/Message';
import PageLoader from '../common/Loader';
import { AddressWrapper } from '../address';
import PaymentMethod from '../paymentMethod';
import BillingAddress from '../billingAddress';
import ShippingAddress from '../shippingAddress';
import ShippingMethodsForm from '../shippingMethod';
import StickyRightSidebar from '../StickyRightSidebar';
import CheckoutAgreements from '../checkoutAgreements';
import CheckoutFormWrapper from './CheckoutFormWrapper';
import OrderAdditionals from '../additionals/OrderAdditionals';
import { config } from '../../config';
import { aggregatedQueryRequest } from '../../api';
import useCheckoutFormAppContext from './hooks/useCheckoutFormAppContext';
import useCheckoutFormCartContext from './hooks/useCheckoutFormCartContext';

function CheckoutForm() {
  const [initialData, setInitialData] = useState(false);
  const { pageLoader, appDispatch, setPageLoader, storeAggregatedAppStates } =
    useCheckoutFormAppContext();
  // const { orderId, isVirtualCart, storeAggregatedCartStates } =
  const { orderId, storeAggregatedCartStates } = useCheckoutFormCartContext();

  /**
   * Collect App, Cart data when the page loads.
   */
  useEffect(() => {
    (async () => {
      try {
        setPageLoader(true);
        const data = await aggregatedQueryRequest(appDispatch);
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

  if (orderId && config.isDevelopmentMode) {
    return (
      <div className="flex flex-col items-center justify-center mx-10 my-10">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="flex flex-col items-center justify-center mt-4 space-y-3">
          <div>Your order is placed.</div>
          <div>{`Order Number: #${orderId}`}</div>
        </div>
      </div>
    );
  }

  return (
    <CheckoutFormWrapper initialData={initialData}>
      <Message />
      <div className="flex justify-center">
        <div className="container w-full mx-auto py-2 md:py-5 md:px-6">
          <div className="flex flex-col my-6 space-y-2 md:flex-row md:space-y-0 ">
            <div className="w-full lg:w-1/2 md:mr-6 border border-container py-5">
              <div className="w-full xl:max-w-full">
                <AddressWrapper>
                  {/* {!isVirtualCart && (
                    <> */}
                  <ShippingAddress>
                    <Login />
                    <ShippingMethodsForm />
                  </ShippingAddress>
                  {/* </>
                  )} */}
                  <BillingAddress />
                  <PaymentMethod />
                  {/* <CouponCode /> */}
                  <OrderAdditionals />
                  <PlaceOrder />
                </AddressWrapper>
              </div>
            </div>

            <StickyRightSidebar>
              <CartItemsForm />
              <Totals />
              <CheckoutAgreements />
            </StickyRightSidebar>
          </div>
          {pageLoader && <PageLoader />}
        </div>
      </div>
    </CheckoutFormWrapper>
  );
}

export default CheckoutForm;
