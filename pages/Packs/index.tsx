import React, { Component, useState, useEffect } from 'react';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { useForm } from 'react-hook-form';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import LargePackContainer from '../../components/containers/LargePackContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import Main from '../../components/Main';
import 'regenerator-runtime/runtime';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PackComponent from './components/PackComponent';
import PlayComponent from '../Play/components/PlayComponent';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getRPCProvider, getContract } from 'utils/near';
import { OPENPACK_PROMO_NFL, PACK_NFL, PACK_PROMO_NFL } from '../../data/constants/nearContracts';
import ReactPaginate from 'react-paginate';
import BigNumber from 'bignumber.js';
import { DEFAULT_MAX_FEES, MINT_STORAGE_COST } from 'data/constants/gasFees';
import {
  execute_claim_soulbound_pack,
  query_claim_status,
  query_nft_supply_for_owner,
  query_nft_tokens_for_owner,
} from 'utils/near/helper';
import Modal from 'components/modals/Modal';
import { SPORT_TYPES, getSportType } from 'data/constants/sportConstants';
export default function Packs() {
  const { selector, modal, accounts, accountId } = useWalletSelector();

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
  const router = useRouter();
  const [filterInfo, handleFilter] = useState(false);
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [isClosed, setClosed] = useState(true);
  const [filterMode, setMode] = useState(false);
  const [showFilter, setFilter] = useState(false);
  const [packs, setPacks] = useState([]);
  const [soulboundPacks, setSoulboundPacks] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [packOffset, setPackOffset] = useState(0);
  const [packLimit, setPackLimit] = useState(30);
  const [soulboundPackLimit, setSoulboundPackLimit] = useState(30);
  const [totalPacks, setTotalPacks] = useState(0);
  const [isClaimed, setIsClaimed] = useState(false);
  const [totalSoulboundPacks, setTotalSoulboundPacks] = useState(0);
  const [activeCategory, setCategory] = useState('NEW');
  const [currentTotal, setCurrentTotal] = useState(0);
  const [categoryList, setcategoryList] = useState([
    {
      name: 'STARTER',
      isActive: true,
    },
    {
      name: 'SOULBOUND',
      isActive: false,
    },
  ]);
  const sportObj = SPORT_TYPES.map((x) => ({ ...x, isActive: false }));
  sportObj[0].isActive = true;
  const [sportList, setSportList] = useState([...sportObj]);
  const [currentSport, setCurrentSport] = useState(sportObj[0].sport);
  const [remountComponent, setRemountComponent] = useState(0);
  const changecategoryList = (name) => {
    const tabList = [...categoryList];
    setPackOffset(0);
    setPackLimit(10);
    setRemountComponent(Math.random() + 1);
    switch (name) {
      case 'STARTER':
        setCurrentTotal(packs.length);
        break;
      case 'SOULBOUND':
        setCurrentTotal(soulboundPacks.length);
        break;
    }

    tabList.forEach((item) => {
      if (item.name === name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });

    setcategoryList([...tabList]);
  };
  const changeSportList = (name) => {
    const sports = [...sportList];
    sports.forEach((item) => {
      if (item.sport === name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });
    setSportList(sports);
    setCurrentSport(name);
  };
  async function get_nft_pack_supply_for_owner(accountId) {
    setTotalPacks(
      await query_nft_supply_for_owner(accountId, getSportType(currentSport).packContract)
    );
  }

  async function get_nft_sb_supply_for_owner(accountId) {
    setTotalSoulboundPacks(
      await query_nft_supply_for_owner(accountId, getSportType(currentSport).packPromoContract)
    );
  }

  function getPackLimit() {
    try {
      if (totalPacks > 30) {
        const _packLimit = 15;
        console.log('Reloading packs');
        setPackLimit(_packLimit);
      }
    } catch (e) {
      setPackLimit(30);
    }
  }

  const handlePageClick = (event) => {
    const newOffset = (event.selected * packLimit) % totalPacks;
    setPackOffset(newOffset);
  };

  async function get_nft_pack_tokens_for_owner(accountId, packOffset, packLimit) {
    //@ts-ignore:next-line

    query_nft_tokens_for_owner(
      accountId,
      packOffset,
      packLimit,
      getSportType(currentSport).packContract
    ).then(async (data) => {
      //@ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());
      setPacks(result);
    });
  }

  async function get_claim_status(accountId) {
    setIsClaimed(await query_claim_status(accountId));
  }

  async function get_nft_sb_pack_tokens_for_owner(accountId, packOffset, soulboundPackLimit) {
    query_nft_tokens_for_owner(
      accountId,
      packOffset,
      packLimit,
      getSportType(currentSport).packPromoContract
    ).then(async (data) => {
      //@ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());
      setSoulboundPacks(result);
    });
  }

  async function get_soulbound_pack(selector) {
    execute_claim_soulbound_pack(selector);
  }

  const onSubmit = (data) => {
    if (data.search) setResult(data.search);
    else setResult('');

    if (data.teamName) setTeamFilter(data.teamName);
    else setTeamFilter('');

    if (data.positions) setPosFilter(data.positions);
    else setPosFilter('');
  };
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  const handleButtonClick = (e) => {
    e.preventDefault();
    get_soulbound_pack(selector);
  };

  useEffect(() => {
    get_nft_pack_supply_for_owner(accountId);
    getPackLimit();
    setPageCount(Math.ceil(totalPacks / packLimit));
    const endOffset = packOffset + packLimit;
    console.log(`Loading packs from ${packOffset} to ${endOffset}`);
    get_nft_pack_tokens_for_owner(accountId, packOffset, packLimit);
  }, [totalPacks, packLimit, packOffset, currentSport]);

  useEffect(() => {
    get_nft_sb_supply_for_owner(accountId);
    get_nft_sb_pack_tokens_for_owner(accountId, 0, 30);
  }, [currentSport]);

  useEffect(() => {
    if (remountComponent !== 0) {
    }
  }, [remountComponent]);

  useEffect(() => {
    if (router.asPath.indexOf('transactionHashes') > -1) {
      setEditModal(true);
    }
    // router.pathname === router.asPath ? setEditModal(false) : setEditModal(true);
  }, []);

  useEffect(() => {
    get_claim_status(accountId);
  }, []);

  // useEffect(() => {
  //     // set initial value
  //     const mediaWatcher = window.matchMedia("(max-width: 500px)")

  //     //watch for updates
  //     function updateIsNarrowScreen(e) {
  //       setIsNarrowScreen(e.matches);
  //     }
  //     mediaWatcher.addEventListener('change', updateIsNarrowScreen)

  //     // clean up after ourselves
  //     return function cleanup() {
  //       mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
  //     }
  //   })

  // if (isNarrowScreen) {

  return (
    <Container activeName="SQUAD">
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Main color="indigo-white">
          <div className="iphone5:mt-20 md:ml-6 md:mt-8">
            <PortfolioContainer textcolor="indigo-black" title="PACKS">
              <div className="">
                {isClaimed ? (
                  <button
                    className={`bg-indigo-gray bg-opacity-40 text-indigo-white w-5/6 md:w-80 h-10 pointer-events-none 
            text-center font-bold text-xs self-center justify-center float-right md:-mt-12 iphone5:mr-9 iphone5:mt-4`}
                    onClick={(e) => handleButtonClick(e)}
                  >
                    CLAIM SOULBOUND PACK
                  </button>
                ) : (
                  <button
                    className={`bg-indigo-buttonblue text-indigo-white w-5/6 md:w-80 h-10 
           text-center font-bold text-xs self-center justify-center float-right md:-mt-12 iphone5:mr-9 iphone5:mt-4`}
                    onClick={(e) => handleButtonClick(e)}
                  >
                    CLAIM SOULBOUND PACK
                  </button>
                )}
                <div className="flex flex-col mt-6">
                  <div className="flex font-bold md:ml-7 iphone5:mt-14 iphone5:ml-7 md:mt-0 font-monument">
                    {categoryList.map(({ name, isActive }) => (
                      <div
                        className={`cursor-pointer mr-6 ${
                          isActive ? 'border-b-8 border-indigo-buttonblue' : ''
                        }`}
                        onClick={() => {
                          changecategoryList(name);
                          setCategory(name);
                        }}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <hr className="opacity-10 -ml-6" />
                <div className="flex flex-row first:md:ml-10">
                  {sportList.map((x, index) => {
                    return (
                      <button
                        className={`rounded-lg border mt-4 px-8 p-1 text-xs md:font-medium font-monument ${
                          index === 0 ? `md:ml-7` : 'md:ml-4'
                        } ${
                          x.isActive
                            ? 'bg-indigo-buttonblue text-indigo-white border-indigo-buttonblue'
                            : ''
                        }`}
                        onClick={() => {
                          changeSportList(x.sport);
                        }}
                      >
                        {x.sport}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-4 gap-y-8 mt-4 md:grid-cols-4 iphone5:mt-8 iphone5:ml-2 md:ml-7 md:mt-9 ">
                  {(categoryList[0].isActive ? packs : soulboundPacks).length > 0 &&
                    (categoryList[0].isActive ? packs : soulboundPacks)
                      .filter((data, i) => i >= packOffset && i < packOffset + packLimit)
                      .map(({ metadata, token_id }) => (
                        <PackComponent
                          key={token_id}
                          image={metadata.media}
                          id={token_id}
                          sport={currentSport}
                        ></PackComponent>
                      ))}
                </div>
              </div>
            </PortfolioContainer>
            <div className="absolute bottom-10 right-10">
              <div key={remountComponent}>
                <ReactPaginate
                  className="p-2 bg-indigo-buttonblue text-indigo-white flex flex-row space-x-4 select-none ml-7"
                  pageClassName="hover:font-bold"
                  activeClassName="rounded-lg bg-indigo-white text-indigo-black pr-1 pl-1 font-bold"
                  pageLinkClassName="rounded-lg hover:font-bold hover:bg-indigo-white hover:text-indigo-black pr-1 pl-1"
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
            <Modal
              title={'CONGRATULATIONS'}
              visible={editModal}
              onClose={() => {
                setEditModal(false);
              }}
            >
              Your pack has been minted successfully!
              <div className="flex flex-wrap flex-col mt-10 mb-5 bg-opacity-70 z-50 w-full">
                <div className="ml-20 mb-12">
                  <img width={240} height={340} src="/images/packimages/NFL-SB-Pack.png"></img>
                </div>
                <Link href={router.pathname}>
                  <button
                    className="bg-indigo-buttonblue text-indigo-white w-full h-14 text-center tracking-widest text-md font-monument"
                    onClick={() => {
                      setEditModal(false);
                    }}
                  >
                    CONFIRM
                  </button>
                </Link>
              </div>
            </Modal>
          </div>
        </Main>
      </div>
    </Container>
  );
}
