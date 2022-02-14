import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React, { Component, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import LargePackContainer from '../../components/containers/LargePackContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import Main from '../../components/Main'

import Modal from "../../components/Modal.js"

export default function Packs() {

const [openModal, setopenModal] = useState(false)


    return (
        <Container>
            <div className="flex flex-col w-full overflow-y-auto h-screen md:pb-12">
                <Main color="indigo-white">
                    <div className="md:ml-6">
                    <PortfolioContainer textcolor="indigo-black" title="Modal Playground">
                        <div className="mt-20 flex justify-center">
                            <div>
                                <button className='text-lg border-4 border-opacity-25 border-indigo-purple rounded p-8' onClick={() => { setopenModal(true);}}>Open Modal</button>
                                {openModal && <Modal closeModal={setopenModal}/>}
                            </div>
                        </div>
                    </PortfolioContainer>
                    </div>
                </Main>
            </div>
        </Container>
    )
}
