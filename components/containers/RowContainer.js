import PropTypes from 'prop-types';

const RowContainer = (props) => {
  const { children, color } = props;

  return (
    <div data-test="RowContainer" className={`bg-${color} flex overflow-x-scroll pb-10 hide-scroll-bar w-full h-64 `}>

      <div
        class="flex flex-nowrap lg:ml-40 md:ml-20 ml-10 "
      >
        {children}
      </div>


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
