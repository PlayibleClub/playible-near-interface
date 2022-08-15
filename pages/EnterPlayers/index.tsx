// import Image from 'next/image';
import React, { useState } from 'react';
import Main from '../../components/Main';
import { useRouter } from 'next/router';
import Container from '../../components/containers/Container';
import 'regenerator-runtime/runtime';

export default function EnterPlayers(props) {
  const { query } = useRouter();
  const [selectedPlayer, setPlayer] = useState('');
  const PlayerPosition = query.pos;

  const router = useRouter();

  async function createGameData() {
    if (!router.query.id) {
      return;
    }

    const response = await fetch('/api/team/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId: router.query.id }),
    });
    const res = await response.json();
  }

  return (
    <>
      <Container activeName="PLAY">
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white"></Main>
        </div>
      </Container>
    </>
  );
}
