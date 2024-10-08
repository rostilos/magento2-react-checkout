import _get from 'lodash.get';
import { isEmpty } from 'lodash';

import {
  modifyShippingMethods,
  modifyShippingAddressList,
  modifySelectedShippingMethod,
} from '../setShippingAddress/modifier';
import { _isArrayEmpty } from '../../../utils';
import { formatPrice } from '../../../utils/price';
import { modifyBillingAddressData } from '../setBillingAddress/modifier';

/* eslint-disable */
function modifyCartItemsData(cartItems) {
  return cartItems.reduce((accumulator, item) => {
    const { id, quantity, prices, product, configurable_options } = item;
    const priceAmount = _get(prices, 'price_including_tax.value');
    const price = formatPrice(priceAmount);
    const basePriceAmount = _get(prices, 'base_price.value');
    const basePrice = formatPrice(basePriceAmount);
    const rowTotalAmount = _get(prices, 'row_total_including_tax.value');
    const rowTotal = formatPrice(rowTotalAmount);
    const discount = _get(prices, 'discounts');
    const productId = _get(product, 'id');
    const productSku = _get(product, 'sku');
    const productName = _get(product, 'name');
    const productUrl = _get(product, 'url_key');
    const canonicalUrl = _get(product, 'canonical_url');
    const productSmallImgUrl = _get(product, 'small_image.url');
    const productSmallWebpImgUrl = _get(product, 'small_image.url_webp');
    const productBrand = _get(product,'brand_name');
    const productCategories = _get(product, 'categories');
    const productConfigurableOptions = configurable_options;
    const isOnSale = priceAmount < basePriceAmount;

    let lastProductCategory;
    if(!isEmpty(productCategories)){
      lastProductCategory = productCategories[productCategories.length - 1]?.name;
    }

    console.log(lastProductCategory, productBrand);

    accumulator[id] = {
      id,
      quantity,
      priceAmount,
      price,
      discount,
      basePrice,
      isOnSale,
      rowTotal,
      rowTotalAmount,
      productId,
      productSku,
      productName,
      productUrl,
      canonicalUrl,
      productSmallImgUrl,
      productConfigurableOptions,
      productSmallWebpImgUrl,
      lastProductCategory,
      productBrand
    };

    return accumulator;
  }, {});
}

function modifyCartPricesData(cartPrices) {
  const grandTotal = _get(cartPrices, 'grand_total', {});
  const subTotal = _get(cartPrices, 'subtotal_including_tax', {});
  const subTotalWoTax = _get(cartPrices, 'subtotal_excluding_tax', {});
  const discountPrices = _get(cartPrices, 'discounts', []) || [];
  const taxApplied = _get(cartPrices,'applied_taxes', {});
  const discounts = discountPrices.map((discount) => ({
    label: discount.label,
    price: formatPrice(-discount.amount.value, true),
    amount: discount.amount.value,
  }));
  const grandTotalAmount = _get(grandTotal, 'value');
  const subTotalAmount = _get(subTotal, 'value');
  const subTotalAmountWoTax = _get(subTotalWoTax, 'value');

  return {
    discounts,
    taxApplied,
    hasDiscounts: !_isArrayEmpty(discountPrices),
    subTotalAmountWoTax,
    subTotal: formatPrice(subTotalAmount),
    subTotalAmount,
    grandTotal: formatPrice(grandTotalAmount),
    grandTotalAmount,
  };
}

function modifyPaymentMethodsData(paymentMethods) {
  return paymentMethods.reduce((accumulator, method) => {
    accumulator[method.code] = method;
    return accumulator;
  }, {});
}

export default function fetchGuestCartModifier(result, dataMethod) {
  const cartData = _get(result, `data.${dataMethod || 'cart'}`) || {};
  const shippingAddresses = _get(cartData, 'shipping_addresses', []);
  const billingAddress = _get(cartData, 'billing_address', {}) || {};
  const cartItems = _get(cartData, 'items', []);
  const cartPrices = _get(cartData, 'prices', {});
  const paymentMethods = _get(cartData, 'available_payment_methods', []);
  const selectedPaymentMethod = _get(cartData, 'selected_payment_method', {});
  const appliedCoupon = _get(cartData, 'applied_coupons[0].code') || '';

  return {
    id: cartData.id,
    email: cartData.email,
    phone: cartData.pml_otp_phone,
    isVirtualCart: cartData.is_virtual,
    appliedCoupon,
    items: modifyCartItemsData(cartItems),
    billing_address: modifyBillingAddressData(billingAddress),
    shipping_address: modifyShippingAddressList(shippingAddresses),
    shipping_methods: modifyShippingMethods(shippingAddresses),
    selected_shipping_method: modifySelectedShippingMethod(shippingAddresses),
    prices: modifyCartPricesData(cartPrices),
    available_payment_methods: modifyPaymentMethodsData(paymentMethods),
    selected_payment_method: selectedPaymentMethod,
  };
}
