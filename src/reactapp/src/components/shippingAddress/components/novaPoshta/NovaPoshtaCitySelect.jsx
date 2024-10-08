import React, { useState } from 'react';
import { func, string, object } from 'prop-types';
import Select, { components } from 'react-select';
import { formikDataShape } from '../../../../utils/propTypes';
import { __ } from '../../../../i18n';
import { config } from '../../../../config';

const options = [
  {
    value: 'void',
    label: __('Type city name...'),
    disabled: true,
  },
];
const Input = (props) => <components.Input {...props} isHidden={false} />;

function NovaPoshtaCitySelect({
  handleChangeCityId,
  formikData,
  name,
  customStyles,
  cityRefField,
  ...rest
}) {
  const [selectList, setSelectList] = useState(options);
  const { setFieldValue, setFieldTouched } = formikData;

  const [value, setValue] = useState();
  const [selectInputValue, setInputValue] = useState('');

  const { onBlur, onFocus } = rest;

  const changeCityOptions = (inputValue) => {
    let cityList = [];
    fetch(`${config.baseUrl}/rest/V1/novaposhta/cities?name=${inputValue}`)
      .then((response) => response.json())
      .then((data) =>
        Array.isArray(JSON.parse(data))
          ? JSON.parse(data).forEach((cityCode) => {
              const cityItem = {
                value: cityCode.id,
                label: cityCode.text,
                ref: cityCode.ref,
              };
              if (cityItem) {
                cityList.push(cityItem);
              }
            })
          : console.log(JSON.parse(data))
      )
      .then(() => {
        if (cityList.length > 0) {
          setSelectList(cityList);
        } else {
          setSelectList(options);
        }
        cityList = [];
      });
  };
  const handleFormChange = (e) => {
    const newValue = e.label;
    const cityRef = e.ref;

    setFieldTouched(name, newValue);
    setFieldValue(name, newValue);
    setFieldValue(cityRefField, cityRef);
    handleChangeCityId(e.value);
    setValue(e);
    setInputValue(e ? e.label : '1');
  };
  const handleInputChange = (inputValue, { action }) => {
    if (inputValue.length > 2) {
      changeCityOptions(inputValue);
    }
    if (action === 'input-change') {
      setInputValue(inputValue);
    }
  };
  const onFocusHandler = () => {
    onFocus();
  };

  return (
    <div className="react-select pt-5 pb-3">
      <p className="text-base text-gray mb-0.5">{__('City')}</p>
      <Select
        options={selectList}
        onInputChange={(inputValue, action) =>
          handleInputChange(inputValue, action)
        }
        onChange={(e) => handleFormChange(e)}
        inputId="city"
        placeholder=""
        styles={{
          ...customStyles,
          singleValue: () => ({
            display: 'none',
          }),
        }}
        value={value}
        inputValue={selectInputValue}
        filterOption={(selectOptions) => selectOptions}
        onFocus={onFocusHandler}
        components={{
          Input,
        }}
        isOptionDisabled={(option) => option.disabled}
        noOptionsMessage={() => __('No options')}
        onBlur={onBlur}
      />
    </div>
  );
}

NovaPoshtaCitySelect.propTypes = {
  handleChangeCityId: func.isRequired,
  formikData: formikDataShape.isRequired,
  name: string.isRequired,
  customStyles: object,
  cityRefField: string,
};

NovaPoshtaCitySelect.defaultProps = {
  customStyles: {},
  cityRefField: 'shipping_address.city_ref',
};

export default NovaPoshtaCitySelect;
