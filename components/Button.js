const Button = (props) => {
  const { children, color, saturation } = props;

  return (
    <button data-test="regular-button" className={`bg-${color}-${saturation}`}>
      {children}
    </button>
  );
};

export default Button;
