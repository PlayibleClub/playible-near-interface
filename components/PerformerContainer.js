import PropTypes from 'prop-types';
import Image from 'next/image'

const PerformerContainer = (props) => {
  const { children, color, imagesrc, AthleteName, TeamName, CoinValue, AvgScore, id } = props;
  const picLink = "/../public/images/tokens/"+id+".png"

  return (
    <div data-test="PerformerContainer" className={`bg-${color} sx-${TeamName} justify-center flex flex-col w-full h-full`}>
      <div className="flex justify-center h-2/3">
        <Image
          src={picLink}
          width={120}
          height={160}
        />

      </div>
      {children}
      <div className="h-1/2 flex justify-center mb-4">
        <div className="flex flex-col mt-4">
          <div className="text-sm font-thin">#{id}/25000</div>
          <div className="text-xs font-med">{AthleteName}</div>
          <div className="mt-3 text-xs font-thin">AVERAGE SCORE</div>
          <div className="text-xs font-bold">
            {AvgScore}
          </div>
        </div>
      </div>
    </div>
  );
};

PerformerContainer.propTypes = {
  color: PropTypes.string,
  AthleteName: PropTypes.string,
  TeamName: PropTypes.string,
  CoinValue: PropTypes.string,
  imagesrc: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

PerformerContainer.defaultProps = {
  color: 'sds',
  imagesrc: 'images/tokens/0.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default PerformerContainer;
