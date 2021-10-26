import PropTypes from 'prop-types';
import Link from 'next/link'
import Image from 'next/image'

const PackContainer = (props) => {
const { imagesrc, packName, releaseValue, link } = props;

    return (
        <Link href="/Purchase">
            <div data-test="PackContainer" className={`w-full h-full overflow-hidden flex flex-col w-full h-full justify-center`}>
                <div className="flex">
                    <Image
                    src={imagesrc}
                    width={100}
                    height={130}
                    />
                </div>
                <div className="flex flex-col mt-3">
                    <div className="text-sm font-bold">{packName}</div>
                    <div className="mt-1 text-xs font-thin">RELEASE {releaseValue}</div>
                </div>
                <div className="mt-6">
                    <Link href={`/PackDetails?id=${link}`}>
                        <button className="bg-indigo-buttonblue w-2/3 h-12 text-center text-sm font-bold mt-2">
                            <div className="">
                                OPEN PACK
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
        </Link>
    );
};

PackContainer.propTypes = {
  PackName: PropTypes.string.isRequired,
  releaseValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  key: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

PackContainer.defaultProps = {
  imagesrc: 'images/packimages/packs1.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default PackContainer;
