import React, { useState, useEffect } from 'react';
import { string, object } from 'prop-types';
import Select from 'react-select';
import { formikDataShape } from '../../../../utils/propTypes';
import { __ } from '../../../../i18n';
import { config } from '../../../../config';

const options = [{ value: 'void', label: __('Введите улицу...') }];

function NovaPoshtaStreetSelect({ formikData, name, customStyles, cityId }) {
  const [selectList, setSelectList] = useState(options);
  const { setFieldValue, setFieldTouched } = formikData;

  const handleFormChange = (e) => {
    const newValue = e.label;
    setFieldTouched(name, newValue);
    setFieldValue(name, newValue);
  };
  const changeStreetOptions = (inputValue) => {
    const streetsList = [];
    if (cityId) {
      fetch(
        `${config.baseUrl}/rest/V1/novaposhta/streets?cityRef=${cityId}&text=${inputValue}`
      )
        .then((response) => response.json())
        .then((data) =>
          Array.isArray(JSON.parse(data))
            ? JSON.parse(data).forEach((streetCode) => {
                const streetItem = {
                  value: streetCode.id,
                  label: streetCode.text,
                };
                if (streetItem) {
                  streetsList.push(streetItem);
                }
              })
            : console.log(JSON.parse(data))
        )
        .then(() => {
          if (streetsList.length > 0) {
            setSelectList(streetsList);
          } else {
            setSelectList(options);
          }
        });
    }
  };
  useEffect(() => {
    changeStreetOptions('');
  }, [cityId]);
  return (
    <div className="react-select">
      <p className="text-base text-gray mb-0.5">{__('Улица')}</p>
      <Select
        options={selectList}
        onInputChange={(inputValue) => changeStreetOptions(inputValue)}
        onChange={(e) => handleFormChange(e)}
        inputId="city"
        placeholder=""
        styles={customStyles}
        noOptionsMessage={() => __('Нет вариантов')}
      />
    </div>
  );
}

NovaPoshtaStreetSelect.propTypes = {
  formikData: formikDataShape.isRequired,
  name: string.isRequired,
  customStyles: object,
  cityId: string,
};

NovaPoshtaStreetSelect.defaultProps = {
  customStyles: {},
  cityId: '',
};

export default NovaPoshtaStreetSelect;
