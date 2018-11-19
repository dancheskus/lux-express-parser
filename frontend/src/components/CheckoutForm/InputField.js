import React from 'react';

export default ({ value, placeholder, fieldName, type, handleChange }) => (
  <div className="custom-row">
    <label htmlFor={`example1-${fieldName}`} data-tid={`elements_examples.form.${fieldName}_label`}>
      {fieldName[0].toUpperCase() + fieldName.slice(1)}
    </label>
    <input
      id={`example1-${fieldName}`}
      data-tid={`elements_examples.form.${fieldName}_placeholder`}
      type={type}
      placeholder={placeholder}
      required=""
      autoComplete={fieldName}
      name={`${fieldName}`}
      value={value}
      onChange={handleChange}
    />
  </div>
);
