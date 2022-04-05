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
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { executeContract, queryContract, retrieveTxInfo } from '../../utils/terra';
import { OPENPACK, PACK, ATHLETE } from '../../data/constants/contracts';
import { axiosInstance } from '../../utils/playible';
import 'regenerator-runtime/runtime';

const sampleList = [0,1,2,3,4,5]

const TokenDrawPage = (props) => {
    const { queryObj, newAthletes, error } = props;

    const dispatch = useDispatch();
    const lcd = useLCDClient()
    const connectedWallet = useConnectedWallet()

    const [isClosed, setClosed] = useState(true)
    const [loading, setLoading] = useState(false)

    const { drawList: tokenList, status } = useSelector((state) => state.contract.pack);

    const [assets, setassets] = useState([...newAthletes])
    const [athletes, setAthletes] = useState([])

    const [packs, setpacks] = useState(true)

    const changecard = (position) => {
        if (athletes[position].isOpen === false){
            let updatedList = [...athletes]
            let updatedAthlete = {
                ...athletes[position],
                isOpen: true
            }
            updatedList.splice(position,1,updatedAthlete)
            setAthletes(updatedList)
        } 
    };

    const prepareNewAthletes = async () => {
        if (assets.length > 0) {
            assets.forEach((id,i) => { 
                getAthleteInfo(id)
            })
        }
    }

    const getAthleteInfo = async (id) => {
        const res = await lcd.wasm.contractQuery(ATHLETE, {
            all_nft_info: {
                token_id: id
            }
        })


        if (!res.error) {
            const details = await axiosInstance.get(`/fantasy/athlete/${res.info.extension.athlete_id+1}/stats/`)
            const imgRes = await axiosInstance.get(`/fantasy/athlete/${parseInt(res.info.extension.athlete_id)}/`)
            let stats = null
            let img = imgRes.status === 200 ? imgRes.data.nft_image : null

            if (details.status === 200) {
                stats = details.data.athlete_stat
            }

            const newAthlete = {
                ...res.info.extension,
                ...stats,
                isOpen: false,
                img
            }
            setAthletes(prevState => [...prevState, newAthlete])
        }
    }

    useEffect(() => {
        if (connectedWallet) {
            prepareNewAthletes()
        }
    }, [connectedWallet])



    return (
      <>
        <Container>
          {loading ? (
            <LoadingPageDark />
          ) : (
            <div className="">
              <div
                className="flex justify-center self-center w-10/12 mt-4"
                style={{ backgroundColor: 'white' }}
              >
                {error ? (
                  <p>{error}</p>
                ) : (
                  <div className="flex flex-row w-4/5 flex-wrap justify-center">
                    {athletes.length > 0
                      ? athletes.map((data, key) => (
                          <div className="flex px-14 py-10" key={key}>
                            <div
                              className="px-10 py-10"
                              onClick={() => {
                                changecard(key);
                              }}
                            >
                              <TokenComponent
                                athlete_id={data.athlete_id}
                                position={data.position}
                                rarity={data.rarity}
                                release={data.release}
                                team={data.team}
                                usage={data.useage}
                                isOpen={data.isOpen}
                                name={data.name}
                                fantasy_score={data.fantasy_score}
                                img={data.img}
                              />
                            </div>
                          </div>
                        ))
                      : ''}
                  </div>
                )}
              </div>
              <div className="flex h-full pt-8">
                <div className="bg-indigo-black w-full justify-end flex opacity-5"></div>
                <button className="bg-indigo-buttonblue text-indigo-white w-5/6 md:w-80 h-14 text-center font-bold text-md">
                  GO TO MY SQUAD
                </button>
              </div>
            </div>
          )}
        </Container>
      </>
    );
}

export default TokenDrawPage

export async function getServerSideProps(ctx) {
    const { query } = ctx
    let queryObj = null
    let newAthletes=[]
    let error = null

    if (query.txHash) {
      queryObj = query
      if (query.txHash) {
        const response = await retrieveTxInfo(query.txHash)

        if (response && response.logs) {
            const tokenList = response.logs[1].eventsByType.wasm.token_id
            if (tokenList && tokenList.length > 0) {
                tokenList.forEach((id, i) => {
                    if (i !== 0) {
                        newAthletes.push(id)
                    }
                })
            }
        } else {
            error = 'An error occurred. Please refresh the page'
        }
      }
    } else {
        return {
            redirect: {
                destination: "/Portfolio",
                permanent: false,
            },
        }
    }

    return {
      props: { queryObj, newAthletes, error }
    }
  }