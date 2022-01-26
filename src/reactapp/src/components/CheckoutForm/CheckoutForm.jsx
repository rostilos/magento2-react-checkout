import React, { useEffect, useState, useContext } from 'react';

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
import { __ } from '../../i18n';
import LiqPayWidget from '../LiqPayWidget/LiqPayWidget';
import CheckoutFormContext from '../../context/Form/CheckoutFormContext';
import ContactUs from '../InfoPopups/ContactUs';

function CheckoutForm() {
  const [initialData, setInitialData] = useState(false);
  const { pageLoader, appDispatch, setPageLoader, storeAggregatedAppStates } =
    useCheckoutFormAppContext();
  const { isLiqPaySuccess } = useContext(CheckoutFormContext);

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
  console.log(useCheckoutFormCartContext());
  if (orderId && config.isDevelopmentMode && isLiqPaySuccess) {
    return (
      <div className="flex flex-col items-center justify-center mx-10 my-10">
        <h1 className="text-2xl font-bold">{__('Информация о заказе')}</h1>
        <div className="flex flex-col items-center justify-center mt-4 space-y-3">
          <div>{__('Заказ размещён, оплата прошла успешно!')}</div>
          <div>{`${__('Номер заказа :')} #${orderId}`}</div>
        </div>
      </div>
    );
  }

  return (
    <CheckoutFormWrapper initialData={initialData}>
      <Message />
      <div className="flex justify-center">
        <div className="container w-full mx-auto py-2 md:py-5 md:px-3">
          <div className="hidden md:grid grid-cols-2 gap-x-6">
            <p className="text-xxlg ">
              {__('Оформление заказа')}
              <p className="text-xxs text-red-500 mt-0.5">
                {__('Обязательные поля отмечены звездочкой *')}
              </p>
            </p>
            <p className="text-xxlg ">{__('Ваш заказ')}</p>
          </div>

          <div className="flex flex-col my-3 space-y-2 md:flex-row md:space-y-0 px-2 sm:px-4 md:px-0">
            <p className="text-xxlg  md:hidden order-1">{__('Ваш заказ')}</p>

            <div className="mt-8 md:mt-0 w-full md:order-1 order-4 lg:w-1/2 md:mr-8 border border-container py-3.5">
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

            <p className="text-xxlg  md:hidden order-3">
              {__('Оформление заказа')}
              <p className="text-xxs text-red-500 mt-0.5">
                {__('Обязательные поля отмечены звездочкой *')}
              </p>
            </p>

            <StickyRightSidebar>
              <div className="border border-container">
                <CartItemsForm />
                <Totals />
                <CheckoutAgreements />
              </div>
              <ContactUs />
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
