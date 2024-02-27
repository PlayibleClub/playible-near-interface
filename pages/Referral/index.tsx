import React, { useEffect } from 'react';
import Main from '../../components/Main';
import Container from '../../components/containers/Container';
import Modal from 'components/modals/Modal';

const Referral = () => {
  return (
    <Container activeName="REFERRAL">
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Main color="indigo-white">
          <Modal title={'Referral'} visible={true} onClose={() => console.log('test')}></Modal>
        </Main>
      </div>
    </Container>
  );
};

export default Referral;
