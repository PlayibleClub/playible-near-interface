import PropTypes from 'prop-types';

const HorizontalScrollContainer = (props) => {
  const { children, color } = props;

  return (
    <div class="flex overflow-x-scroll pb-10 hide-scroll-bar">
      <div class="flex flex-nowrap lg:ml-40 md:ml-20 ml-1 ">
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
