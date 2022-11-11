import React, { useEffect, useState} from 'react';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { getRPCProvider, getContract } from 'utils/near';
import BackFunction from "components/buttons/BackFunction";
import Container from "components/containers/Container";
import PortfolioContainer from "components/containers/PortfolioContainer";
import router from "next/router";
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { convertNftToAthlete, getAthleteInfoById } from 'utils/athlete/helper';
import { ATHLETE } from 'data/constants/nearContracts';
import AthleteSelectContainer from 'components/containers/AthleteSelectContainer';
import Link from 'next/link';

const AthleteSelect = (props) => {
    const { query } = props;

    const position = query.position;
    
    const [athletes, setAthletes] = useState([]);
    const [athleteOffset, setAthleteOffset] = useState(0);
    const [athleteLimit, setAthleteLimit] = useState(10);
    const [totalAthletes, setTotalAthletes] = useState(0);
    const [radioSelected, setRadioSelected] = useState<number>(null);
    const [team, setTeam] = useState("allTeams");
    const [name, setName] = useState("allNames");

    const { accountId } = useWalletSelector();

    const provider = new providers.JsonRpcProvider({
        url: getRPCProvider(),
    });

    function query_nft_tokens_for_owner(position, team, name){
        const query = JSON.stringify({
            account_id: accountId,
            from_index: athleteOffset.toString(),
            limit: athleteLimit,
            position: position,
            team: team,
            name: name,
        });

        provider
        .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(ATHLETE),
        method_name: 'filter_tokens_for_owner',
        args_base64: Buffer.from(query).toString('base64'),
        })
        .then(async (data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        const result_two = await Promise.all(
            result.map(convertNftToAthlete).map(getAthleteInfoById)
        );

        // const sortedResult = sortByKey(result_two, 'fantasy_score');
        setAthletes(result_two);
        });
    }

    useEffect(() => {
        if(!isNaN(athleteOffset)){
            query_nft_tokens_for_owner(position, team, name);
        }
    }, []);

    return (
    <>{console.log(position)}
     <Container activeName="PLAY">
        <BackFunction prev={`/CreateTeam`} />
        <PortfolioContainer
            title="SELECT YOUR ATHLETE"
            textcolor="text-indigo-black"
        >
            <div className="flex flex-col">
                <div className="grid grid-cols-4 mt-1 md:grid-cols-4 md:ml-7 md:mt-2">
                    {athletes.map((item, i) => {
                        const accountAthleteIndex = athletes.indexOf(item, 0);
                        return(
                            <div className="w-4/5 h-5/6 border-transparent focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:border-transparent">
                                <input className="justify-self-end" type="radio" name="athletePick" value={i} onChange={(e) => setRadioSelected(parseInt(e.target.value))}></input>
                                <AthleteSelectContainer
                                    key={item.athlete_id}
                                    athleteName={item.name}
                                    avgScore={item.fantasy_score.toFixed(2)}
                                    id={item.athlete_id}
                                    uri={item.image}
                                    index={accountAthleteIndex}
                                />
                                
                            </div>
                        )
                    })}
                </div>
                <div className="flex  bg-opacity-5 w-full justify-end">
                    
                        <button className="bg-indigo-buttonblue text-indigo-white w-full mr-10 md:w-80 h-14 text-center font-bold text-md">PROCEED</button>
                    
                    
                </div>  
            </div>
        
        </PortfolioContainer>
    </Container>
    </>
    
 )
}
export default AthleteSelect;

export async function getServerSideProps(ctx) {
    const { query } = ctx;
  
    if (query.id != query.id) {
      return {
        desination: query.origin || '/CreateTeam',
      };
    }
  
    return {
      props: { query },
    };
  }
  