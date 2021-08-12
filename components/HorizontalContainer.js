import PropTypes from 'prop-types';

const HorizontalContainer = (props) => {
  const { children, color, imagesrc, AthleteName, TeamName, CoinValue } = props;

  return (
    <div class="inline-block px-3">
      <div class="w-48 h-64 max-w-xs overflow-hidden  shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

HorizontalContainer.propTypes = {
  color: PropTypes.string,
  AthleteName: PropTypes.string.isRequired,
  TeamName: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

HorizontalContainer.defaultProps = {
  color: 'sds',
  imagesrc: 'https://picsum.photos/200/200',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default HorizontalContainer;
