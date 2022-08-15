import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';

import React, { Component, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from './Header';
import DesktopHeaderBase from './DesktopHeaderBase';
import DesktopHeader from './DesktopHeader';

import Button from './Button';
import Container from './Container';
import DesktopNavbar from './DesktopNavbar';
import Main from './Main';
import TitledContainer from './TitledContainer';
import RoundedContainer from './RoundedContainer';
import TokenGridCol2 from './TokenGridCol2';
// import Roundedinput from '../components/Roundedinput';
import AthleteContainer from './AthleteContainer';
import PerformerContainer from './PerformerContainer';
import GameResultContainer from './GameResultContainer';
import GameresultsComponent from './GameresultsComponent';

import RowContainer from './RowContainer';
import HorizontalScrollContainer from './HorizontalScrollContainer';
import HorizontalContainer from './HorizontalContainer';
import LargePackContainer from './LargePackContainer';
import filterIcon from '../public/images/filter.png';
import searchIcon from '../public/images/search.png';

import AthleteTokenContainer from './AthleteTokenContainer';

export default function Home() {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();

  const interactWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      disconnect();
    } else {
      connect(availableConnectTypes[1]);
    }
  };

  const [filterInfo, handleFilter] = React.useState(false);

  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [isClosed, setClosed] = React.useState(true);
  const [filterMode, setMode] = React.useState(false);
  const [showFilter, setFilter] = React.useState(false);

  const onSubmit = (data) => {
    if (data.search) setResult(data.search);
    else setResult('');

    if (data.teamName) setTeamFilter(data.teamName);
    else setTeamFilter('');

    if (data.positions) setPosFilter(data.positions);
    else setPosFilter('');
  };
  const key1 = 'team';

  return <></>;
}
