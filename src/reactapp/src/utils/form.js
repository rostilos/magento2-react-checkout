import _get from 'lodash.get';

import { __ } from '../i18n';
import { _isArray, _keys, _ucFirst } from './index';

export function scrollToElement(elementId) {
  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function focusOnFormErrorElement(formId, formSectionErrors) {
  const firstErrorKey = _get(_keys(formSectionErrors), '0');
  const firstErrorElementId = `${formId}.${firstErrorKey}`;
  const element = document.getElementById(firstErrorElementId);

  if (element) {
    element.focus();
    element.classList.add('border-dashed', 'border-red-500');
    scrollToElement(formId);
  }
}

export function focusOnPhoneErrorElement() {
  const element = document.getElementById('shipping_address.phone');
  if (element) {
    element.focus();
    element.classList.add('border-dashed', 'border-red-500');
    scrollToElement(element);
  }
}

export function prepareFormSectionErrorMessage(
  formId,
  formSectionErrors,
  setFieldTouched
) {
  // errors list can contain inner arrays; for example streets field
  return _keys(formSectionErrors)
    .reduce((errorMessages, field) => {
      if (_isArray(formSectionErrors[field])) {
        _keys(formSectionErrors[field]).forEach((innerField) => {
          errorMessages.push(
            formSectionErrors[field][innerField].replace(
              '%1',
              __(_ucFirst(field))
            )
          );
          setFieldTouched(`${formId}.${field}.${innerField}`, true);
        });
      } else {
        errorMessages.push(
          formSectionErrors[field].replace('%1', __(_ucFirst(field)))
        );
        setFieldTouched(`${formId}.${field}`, true);
      }

      return errorMessages;
    }, [])
    .join('; ');
}
