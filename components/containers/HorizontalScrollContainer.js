import PropTypes from 'prop-types';

const HorizontalScrollContainer = (props) => {
  const { children, color } = props;

  return (
    <div class="flex overflow-x-auto">
      <div class="flex flex-nowrap">
        {children}
      </div>


    </div>
  );
};

HorizontalScrollContainer.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

HorizontalScrollContainer.defaultProps = {
  color: 'pink',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default HorizontalScrollContainer;
