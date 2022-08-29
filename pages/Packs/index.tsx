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
import PackComponent from './components/PackComponent';
import PlayComponent from '../Play/components/PlayComponent';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getRPCProvider, getContract } from 'utils/near';
import { PACK } from '../../data/constants/nearContracts';

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

  function query_nft_tokens_for_owner() {
    const query = JSON.stringify({ account_id: accountId, limit: 15 });

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
  return (
    <Container activeName="SQUAD">
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-12 mb-12">
        <Main color="indigo-white">
          <div className="md:ml-6">
            <PortfolioContainer textcolor="indigo-black" title="PACKS">
              <div className="flex flex-col">
                <div className="grid grid-cols-4 gap-y-8 mt-4 md:grid-cols-4 md:ml-7 md:mt-12">
                  {packs.map(({ metadata, token_id }) => (
                    <PackComponent image={metadata.media} id={token_id}></PackComponent>
                  ))}
                </div>
              </div>
            </PortfolioContainer>
          </div>
        </Main>
      </div>
    </Container>
  );
}
