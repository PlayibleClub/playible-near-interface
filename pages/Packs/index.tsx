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
import PlayComponent from '../Play/components/PlayComponent';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getRPCProvider, getContract } from 'utils/near';
import { PACK } from '../../data/constants/nearContracts';
import PackContainer from './components/PackContainer';
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
  const [currentPacks, setCurrentPacks] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [packOffset, setPackOffset] = useState(0);

  function query_nft_tokens_for_owner() {
    const query = JSON.stringify({ account_id: accountId, limit: 15 });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(PACK),
        from_index: 2,
        method_name: 'nft_tokens_for_owner',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then((data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        // Save minter config into state
        setPacks(result);
      });
  }

  useEffect(() => {
    query_nft_tokens_for_owner();
  }, []);

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

  //ShowPacks includes pagination
  //Function to show all packs is in PackContainer 
  function ShowPacks({ packsPerPage }) {

    const [currentPacks, setCurrentPacks] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [packOffset, setPackOffset] = useState(0);

    useEffect(() => {
      const endOffset = packOffset + packsPerPage;
      console.log(`ShowPacks: Loading items from ${packOffset} to ${endOffset}`);
      setCurrentPacks(packs.slice(packOffset, endOffset));
      setPageCount(Math.ceil(packs.length / packsPerPage));
    }, [packOffset, packsPerPage]);

    const handlePageClick = (event) => {
      const newOffset = (event.selected * packsPerPage) % packs.length;
      console.log(`ShowPacks: Requested page number ${event.selected}, which is offset ${newOffset}`);
      setPackOffset(newOffset);
    }

    if(pageCount == 1) {
      return (
        <>
        <PortfolioContainer textcolor="indigo-black" title="PACKS">
          <div className="flex flex-col">
          <PackContainer accountPacks={currentPacks}></PackContainer>
          </div>
        </PortfolioContainer>
      </>
      )}
    else 
    return (
      <>
        <PortfolioContainer textcolor="indigo-black" title="PACKS">
          <div className="flex flex-col">
          <PackContainer accountPacks={currentPacks}></PackContainer>
          </div>
        </PortfolioContainer>
        <div className="absolute bottom-10 right-10">
          <ReactPaginate 
            className="p-2 bg-indigo-buttonblue text-indigo-white flex flex-row space-x-4 select-none ml-7"
            pageClassName="hover:font-bold"
            activeClassName="rounded-lg bg-indigo-white text-indigo-black pr-1 pl-1 font-bold"
            pageLinkClassName="rounded-lg hover:font-bold hover:bg-indigo-white hover:text-indigo-black pr-1 pl-1"
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< prev"
            renderOnZeroPageCount={null}
          />
        </div>
      </>
    )};

    const packCounter = (packAmount) => {
      let packCount = 0;

      // if(packAmount > 30) {
      //   return packCount = 15;
      // }
      // else {
      //   return packCount = 30;
      // }
      if(packAmount > 10) {
        return packCount = 5;
      }
      else {
        return packCount = 30;
      }
    }

    return (
      <Container activeName="SQUAD">
        <div className="flex flex-col w-full overflow-y-auto h-screen pb-12 mb-12">
          <Main color="indigo-white">
            <div className="md:ml-6">
              <ShowPacks packsPerPage={packCounter(packs.length)}></ShowPacks>
            </div>
          </Main>
        </div>
      </Container>
    )
};