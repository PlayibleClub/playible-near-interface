import PropTypes from 'prop-types';

const TokenGridCol2 = (props) => {
  const { children, color } = props;

  return (
    <div data-test="TokenGridCol2" className={`bg-${color} grid items-center  gap-x-1 gap-y-2 grid-cols-2 w-11/12 h-full `}>
      {children}
    </div>
  );
};

TokenGridCol2.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

TokenGridCol2.defaultProps = {
  color: 'pink',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default TokenGridCol2;
