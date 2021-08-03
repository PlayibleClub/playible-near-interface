import PropTypes from 'prop-types';

const RowContainer = (props) => {
  const { children, color } = props;

  return (
    <div data-test="RowContainer" className={`bg-${color} overflow-x-scroll flex flex-row w-full h-64 `}>
      {children}
    </div>
  );
};

RowContainer.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

RowContainer.defaultProps = {
  color: 'pink',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default RowContainer;
