/* eslint-disable react/forbid-prop-types, react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';

const Input = (props) => {
  const {
    name,
    placeHolder,
    label,
    type,
    ref,
    onChange,
    onBlur,
    errors,
  } = props;

  const TypeText = () => (
    <div data-test="input-text" className="group flex flex-col gap-1 relative m-2">
      <label
        className="absolute bg-white -inset-y-2 left-7 px-1 h-3
          text-gray-500 text-xs group-focus:text-blue-500"
        data-test="label-container"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className="py-1 pt-1 px-9 w-full focus:outline-none
        text-lg text-gray-600 focus:ring-1 focus:ring-blue-400 ring-offset-3 border
        border-gray-400 rounded-full"
        type="text"
        id={name}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeHolder}
        name={name}
        ref={ref}
      />
      {
        errors
        && (
        <span
          className="ml-5 text-xs text-red-400"
          data-test="error-container"
        >
          {errors.message}
        </span>
        )
      }

    </div>
  );

  const TypeInput = () => {
    switch (type) {
      default:
        return <TypeText />;
    }
  };

  return (
    <>
      <TypeInput />
    </>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  placeHolder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  ref: PropTypes.any,
  errors: PropTypes.object,
};

Input.defaultProps = {
  ref: null,
  errors: null,
};

export default Input;
