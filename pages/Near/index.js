import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../components/containers/Container';
import Main from '../../components/Main';
import { getConnection } from '../../redux/reducers/external/playible/wallet';
import { initNear, signIn, signOut } from '../../utils/near';
import * as contracts from '../../data/constants/nearContracts';

const Index = () => {
  return (
    <Container contracts={[contracts.ATHLETE, contracts.GAME, contracts.CONTROLLER]}>
      <Main>
        {/* {!isLoggedIn ? (
          <button onClick={logIn}>Sign in</button>
        ) : (
          <button onClick={logOut}>Sign out</button>
        )} */}
      </Main>
    </Container>
  );
};

export default Index;
