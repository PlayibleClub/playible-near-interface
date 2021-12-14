import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Container from '../../components/containers/Container';
import HeaderBase from '../../components/headers/HeaderBase';
import Navbar from '../../components/navbars/Navbar';
import HorizontalScrollContainer from '../../components/containers/HorizontalScrollContainer'
import TokenComponent from '../../components/TokenComponent';
import Main from '../../components/Main';

const sampleList = [0,1,2,3,4,5]

const TokenDrawPage = () => {
    const dispatch = useDispatch();

    const [isClosed, setClosed] = useState(true)
    const [loading, setLoading] = useState(false)

    const { drawList: tokenList, status } = useSelector((state) => state.contract.pack);

    const [assets, setassets] = useState([false,false,false,false,false])

    const [packs, setpacks] = useState(true)

    function changecard(position){
        if (assets[position] == false){

            var newassets = []
            newassets = assets

            console.log(newassets)

            newassets[position] = true
            setassets(newassets.concat())

            console.log(assets[position])
            console.log(assets)
            
        }
        else {

            var newassets = []
            newassets = assets

            console.log(newassets)

            newassets[position] = false
            setassets(newassets.concat())

            console.log(assets[position])
            console.log(assets)

        }
        return 
    };


    return (
        <>
            <Container>                    
                    {loading ? (
                        <LoadingPageDark/>
            ) : (
                <div className="" style={{
                        backgroundImage: `url('../images/BackgroundMarket.PNG')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize:'100% auto',
                        //backgroundPosition: 'center',
                        width: '100%',
                        height: '100%',
                }}>
                        <div className="flex flex-col pb-24">
                                <div className="flex justify-center self-center w-10/12 mt-24" style={{backgroundColor:'white'}}>
                                    <div className="flex flex-row w-4/5 flex-wrap justify-center">
                                        {
                                            assets.map(function (i,key) 
                                                {
                                                    return (
                                                        <div className="flex px-10 py-10">
                                                        <div className="px-10 py-10" onClick={() => {
                                                            changecard(key)}}>
                                                                
                                                            <TokenComponent
                                                            playerID={sampleList[key+1]}
                                                            isopen={i}
                                                            />
                                                        </div>
                                                        </div>
                                                    )
                                                }
                                            )
                                        }
                                    </div>
                                </div>
                        </div>     
                </div>
            )}
            </Container>
        </>
    )
}

export default TokenDrawPage