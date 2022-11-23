import React, { Component, useState, useEffect } from 'react';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { useForm } from 'react-hook-form';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import LargePackContainer from '../../components/containers/LargePackContainer';
import Container from '../../components/containers/Container';
import Head from 'next/dist/next-server/lib/head';
import BackFunction from '../../components/buttons/BackFunction';
import Main from '../../components/Main';
import 'regenerator-runtime/runtime';
import Link from 'next/link';
import PackComponent from './components/PackComponent';
import PlayComponent from '../Play/components/PlayComponent';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getRPCProvider, getContract } from 'utils/near';
import { PACK } from '../../data/constants/nearContracts';
import ReactPaginate from 'react-paginate';

export default function Packs() {
  const { selector, modal, accounts, accountId } = useWalletSelector();

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  const [filterInfo, handleFilter] = useState(false);
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [isClosed, setClosed] = useState(true);
  const [filterMode, setMode] = useState(false);
  const [showFilter, setFilter] = useState(false);
  const [packs, setPacks] = useState([]);

  const [pageCount, setPageCount] = useState(0);
  const [packOffset, setPackOffset] = useState(0);
  const [packLimit, setPackLimit] = useState(30);
  const [totalPacks, setTotalPacks] = useState(0);

  function query_nft_supply_for_owner() {
    const query = JSON.stringify({ account_id: accountId });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(PACK),
        method_name: 'nft_supply_for_owner',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then((data) => {
        // @ts-ignore:next-line
        const totalPacks = JSON.parse(Buffer.from(data.result));

        setTotalPacks(totalPacks);
      });
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

  useEffect(() => {
    query_nft_supply_for_owner();
    getPackLimit();
    setPageCount(Math.ceil(totalPacks / packLimit));
    const endOffset = packOffset + packLimit;
    console.log(`Loading packs from ${packOffset} to ${endOffset}`);
    query_nft_tokens_for_owner();
  }, [totalPacks, packLimit, packOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * packLimit) % totalPacks;
    setPackOffset(newOffset);
  };

  function query_nft_tokens_for_owner() {
    const query = JSON.stringify({
      account_id: accountId,
      from_index: packOffset.toString(),
      limit: packLimit,
    });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(PACK),
        method_name: 'nft_tokens_for_owner',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then((data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());

        console.log(result);
        setPacks(result);
      });
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
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-12 mb-12">
        <Main color="indigo-white">
          <div className="md:ml-6 md:mt-8">
            <PortfolioContainer textcolor="indigo-black" title="PACKS">
              <div className="flex flex-col">
                <div className="grid grid-cols-4 gap-y-8 mt-4 md:grid-cols-4 md:ml-7 md:mt-12">
                  {packs.map(({ metadata, token_id }) => (
                    <PackComponent
                      key={token_id}
                      image={metadata.media}
                      id={token_id}
                    ></PackComponent>
                  ))}
                </div>
              </div>
            </PortfolioContainer>
            <div className="absolute bottom-10 right-10">
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
        </Main>
      </div>
    </Container>
  );
}
