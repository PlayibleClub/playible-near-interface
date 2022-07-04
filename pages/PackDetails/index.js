import React, { useState } from 'react';
import Main from '../../components/Main';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Container from '../../components/containers/Container';
import TransactionModal from '../../components/modals/TransactionModal';
import { useRouter } from 'next/router';
import Image from 'next/image';
import 'regenerator-runtime/runtime';
import * as statusCode from '../../data/constants/status';
import { useDispatch, useSelector } from 'react-redux';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import BackFunction from '../../components/buttons/BackFunction';
import claimreward from '../../public/images/claimreward.png';

export default function PackDetails(props) {
  const { queryObj } = props;

  const [msg, setMsg] = useState({
    title: '',
    success: '',
  });

  const [msgModal, setMsgModal] = useState(false);
  const [txLoading, setTxLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [displayModal, setModal] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalStatus, setModalStatus] = useState(statusCode.IDLE);
  const [data, setData] = useState(null);

  return (
    <>
      {msgModal && (
        <>
          <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 py-10 bg-indigo-white w-11/12 md:w-min h-10/12 md:h-auto m-auto flex-col flex">
              <button
                className="absolute top-0 right-0 mt-6 mr-6 h-4 w-4"
                onClick={() => {
                  txLoading ? undefined : msg.title === 'Success' ? undefined : setMsgModal(false);
                }}
              >
                <img className="h-4 w-4 " src={'/images/x.png'} />
              </button>
              <img src={claimreward} className="h-20 w-20 mt-5" />
              <div className="mt-4 bg-indigo-yellow w-max p-2 px-3 text-center text-lg font-monument mr-16">
                {msg.title === 'Success' ? 'SUCCESS' : 'FAILED TRANSACTION'}
              </div>
              <div className="mt-4 p-2 text-xs">
                {txLoading
                  ? 'Loading...'
                  : msg.content ||
                    "We're sorry, unfortunately we've experienced a problem loading your request."}
                {msg.title !== 'Success' && (
                  <>
                    <br />
                    Please try again.
                  </>
                )}
              </div>
              {data && (
                <>
                  <div className="mt-8 md:ml-7 flex flex-row md:flex-row">
                    <div className="mt-7 justify-center md:self-left md:mr-16">
                      <Image
                        src={
                          data.info.extension.attributes.filter(
                            (item) => item.trait_type === 'pack_type'
                          )[0].value === 'booster'
                            ? '/images/packimages/BoosterPack1.png'
                            : '/images/packimages/StarterPack1.png'
                        }
                        width={125}
                        height={160}
                      />
                    </div>
                    <div className="flex flex-col">
                      <PortfolioContainer
                        textcolor="indigo-black"
                        title={`${
                          data.info.extension.attributes.filter(
                            (item) => item.trait_type === 'sport'
                          )[0].value
                        } ${data.info.extension.attributes
                          .filter((item) => item.trait_type === 'pack_type')[0]
                          .value.toUpperCase()} Pack`}
                      />
                      <div className="ml-12 md:ml-0 mt-4 md:mt-0">
                        <div className="ml-7 mt-7 font-bold text-base">{`${
                          data.info.extension.attributes.filter(
                            (item) => item.trait_type === 'sport'
                          )[0].value
                        } ${data.info.extension.attributes
                          .filter((item) => item.trait_type === 'pack_type')[0]
                          .value.toUpperCase()} Pack`}</div>
                        <div className="ml-7 mb-6">
                          {data.info.extension.attributes
                            .filter((item) => item.trait_type === 'release')[0]
                            .value.toUpperCase()}
                        </div>
                      </div>
                      <button
                        className="bg-indigo-lightblue text-indigo-buttonblue ml-7 w-5/6 md:w-80 text-center font-bold text-sm mt-4 p-2 cursor-not-allowed"
                      >
                        Pack openings are currently paused while we update our player list to include newly added athletes. Pack opening will resume shortly, apologies for the inconvenience.
                      </button>
                    </div>
                  </div>
                  <div className="mt-8">
                    <PortfolioContainer textcolor="indigo-black" title="PACK DETAILS" />
                  </div>
                  <div className="ml-7 mt-5 font-normal pr-16">
                    {data.info.extension.description}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      <Container activeName="SQUAD">
        {displayModal && (
          <TransactionModal
            title={modalHeader}
            visible={displayModal}
            modalData={modalData}
            modalStatus={modalStatus}
            onClose={() => {
              setModal(false);
            }}
          />
        )}
        {loading ? (
          <LoadingPageDark message={loadingMessage} />
        ) : (
          <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
            <Main color="indigo-white">
              <div className="md:ml-6">
                <div className="mt-8">
                  <BackFunction prev={queryObj.origin ? `/${queryObj.origin}` : '/Portfolio'} />
                </div>
                {data && (
                  <>
                    <div className="mt-8 md:ml-7 flex flex-row md:flex-row">
                      <div className="mt-7 justify-center md:self-left md:mr-16">
                        <Image
                          src={
                            data.info.extension.attributes.filter(
                              (item) => item.trait_type === 'pack_type'
                            )[0].value === 'booster'
                              ? '/images/packimages/BoosterPack1.png'
                              : '/images/packimages/StarterPack1.png'
                          }
                          width={125}
                          height={160}
                        />
                      </div>
                      <div className="flex flex-col">
                        <PortfolioContainer
                          textcolor="indigo-black"
                          title={`${
                            data.info.extension.attributes.filter(
                              (item) => item.trait_type === 'sport'
                            )[0].value
                          } ${data.info.extension.attributes
                            .filter((item) => item.trait_type === 'pack_type')[0]
                            .value.toUpperCase()} Pack`}
                        />
                        <div className="ml-12 md:ml-0 mt-4 md:mt-0">
                          <div className="ml-7 mt-7 font-bold text-base">{`${
                            data.info.extension.attributes.filter(
                              (item) => item.trait_type === 'sport'
                            )[0].value
                          } ${data.info.extension.attributes
                            .filter((item) => item.trait_type === 'pack_type')[0]
                            .value.toUpperCase()} Pack`}</div>
                          <div className="ml-7 mb-6">
                            {data.info.extension.attributes
                              .filter((item) => item.trait_type === 'release')[0]
                              .value.toUpperCase()}
                          </div>
                        </div>
                        <button
                          className="bg-indigo-buttonblue ml-7 text-indigo-white w-5/6 md:w-80 h-10 text-center font-bold text-sm mt-4"
                          onClick={() => console.log('OPEN PACK CALL')}
                        >
                          OPEN PACK
                        </button>
                      </div>
                    </div>
                    <div className="mt-8">
                      <PortfolioContainer textcolor="indigo-black" title="PACK DETAILS" />
                    </div>
                    <div className="ml-7 mt-5 font-normal pr-16">
                      {data.info.extension.description}
                    </div>
                  </>
                )}
              </div>
            </Main>
          </div>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  let queryObj = null;

  if (query) {
    if (query.token_id) {
      queryObj = query;
    } else {
      return {
        redirect: {
          destination: query.origin || '/Portfolio',
          permanent: false,
        },
      };
    }
  }

  return {
    props: { queryObj },
  };
}
